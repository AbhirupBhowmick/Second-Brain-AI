package com.secondbrain.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import com.secondbrain.backend.model.Note;
import com.secondbrain.backend.repository.NoteRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Autowired
    private NoteRepository noteRepository;

    public String getChatResponse(String prompt) {
        List<Note> recentNotes = new ArrayList<>();
        try {
            recentNotes = noteRepository.findRecentNotes();
        } catch (Exception e) {
            logger.warn("Neo4j offline for findRecentNotes ({}), continuing with empty note context", e.getMessage());
        }

        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            logger.warn("GEMINI_API_KEY is not configured in environment or properties.");
            return generateLocalFallback(prompt, recentNotes, "Gemini API Key is not configured. Please set GEMINI_API_KEY in your environment variables or application.properties.");
        }

        String maskedKey = geminiApiKey.length() > 8 
            ? geminiApiKey.substring(0, 4) + "..." + geminiApiKey.substring(geminiApiKey.length() - 4)
            : "[CONFIGURED]";

        logger.info("Initiating Gemini AI request with key: {} and model: {}", maskedKey, geminiModel);

        StringBuilder contextBuilder = new StringBuilder(
            "System Context: You are the 'Second Brain AI' Assistant. Below is a subset of the user's personal knowledge substrate.\n\nKNOWLEDGE SUBSTRATE:\n"
        );

        for (Note note : recentNotes) {
            contextBuilder.append("- Title: ").append(note.getTitle() != null ? note.getTitle() : "Untitled")
                          .append(" | Content: ").append(note.getContent() != null ? note.getContent() : "").append("\n");
        }

        contextBuilder.append("\nUSER QUESTION: ").append(prompt);
        String finalPrompt = contextBuilder.toString();

        // Attempt request with retry logic (up to 2 attempts)
        for (int attempt = 1; attempt <= 2; attempt++) {
            try {
                String result = executeGeminiRequest(finalPrompt, geminiModel);
                if (result != null && !result.trim().isEmpty()) {
                    return result;
                }
            } catch (HttpClientErrorException.Forbidden | HttpClientErrorException.Unauthorized e) {
                logger.error("Gemini Authentication Error (Attempt {}): {}", attempt, e.getMessage());
                return generateLocalFallback(prompt, recentNotes, "Invalid Gemini API Key or permission denied. Please verify your GEMINI_API_KEY in Google AI Studio.");
            } catch (HttpClientErrorException.TooManyRequests e) {
                logger.error("Gemini Rate Limit Exceeded (Attempt {}): {}", attempt, e.getMessage());
                return generateLocalFallback(prompt, recentNotes, "Gemini API quota rate limit exceeded. Please try again shortly.");
            } catch (HttpClientErrorException.NotFound e) {
                logger.error("Gemini Model Not Found (Attempt {}): {}", attempt, e.getMessage());
                if (!"gemini-1.5-flash".equals(geminiModel)) {
                    logger.info("Falling back to standard gemini-1.5-flash model...");
                    try {
                        return executeGeminiRequest(finalPrompt, "gemini-1.5-flash");
                    } catch (Exception ex) {
                        logger.error("Fallback model execution failed: {}", ex.getMessage());
                    }
                }
                return generateLocalFallback(prompt, recentNotes, "Gemini model ('" + geminiModel + "') unavailable.");
            } catch (ResourceAccessException | HttpServerErrorException e) {
                logger.warn("Transient error on attempt {}/2: {}", attempt, e.getMessage());
                if (attempt == 2) {
                    return generateLocalFallback(prompt, recentNotes, "Network timeout connecting to Gemini API.");
                }
            } catch (Exception e) {
                logger.error("Unexpected error calling Gemini API: {}", e.getMessage(), e);
                return generateLocalFallback(prompt, recentNotes, "Unexpected server exception: " + e.getMessage());
            }
        }

        return generateLocalFallback(prompt, recentNotes, "Gemini API unavailable after retry.");
    }

    private String executeGeminiRequest(String promptText, String modelName) {
        String baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent";
        String url = baseUrl + "?key=" + geminiApiKey;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", promptText);

        Map<String, Object> contentObj = new HashMap<>();
        contentObj.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(contentObj));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        logger.info("Sending HTTP POST to Gemini endpoint: {} (Model: {})", baseUrl, modelName);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
        Map<String, Object> responseBody = response.getBody();

        if (responseBody != null && responseBody.containsKey("candidates")) {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                Map<String, Object> contentRes = (Map<String, Object>) candidate.get("content");
                if (contentRes != null && contentRes.containsKey("parts")) {
                    List<Map<String, Object>> resParts = (List<Map<String, Object>>) contentRes.get("parts");
                    if (resParts != null && !resParts.isEmpty()) {
                        String reply = (String) resParts.get(0).get("text");
                        logger.info("Successfully received response from Gemini API (Length: {} chars)", reply != null ? reply.length() : 0);
                        return reply;
                    }
                }
            }
        }
        return null;
    }

    private String generateLocalFallback(String prompt, List<Note> recentNotes, String notice) {
        logger.info("Generating grounded context response fallback. Notice: {}", notice);
        if (recentNotes != null && !recentNotes.isEmpty()) {
            Note topNote = recentNotes.get(0);
            return "[Substrate Synthesis]: " + notice + "\n\nBased on your stored note ('" + topNote.getTitle() + "'):\n\"" 
                + (topNote.getContent() != null ? topNote.getContent().substring(0, Math.min(220, topNote.getContent().length())) : "") 
                + "...\"";
        }
        try {
            List<Note> allNotes = noteRepository.findAll();
            if (allNotes != null && !allNotes.isEmpty()) {
                Note topNote = allNotes.get(0);
                return "[Substrate Synthesis]: " + notice + "\n\nBased on your stored note ('" + topNote.getTitle() + "'):\n\"" 
                    + (topNote.getContent() != null ? topNote.getContent().substring(0, Math.min(220, topNote.getContent().length())) : "") 
                    + "...\"";
            }
        } catch (Exception e) {
            logger.warn("Neo4j offline in generateLocalFallback ({})", e.getMessage());
        }
        return "[Substrate Synthesis]: " + notice + "\n\nYour Second Brain AI currently contains 0 indexed note nodes. Add notes to allow AI knowledge graph reasoning.";
    }
}
