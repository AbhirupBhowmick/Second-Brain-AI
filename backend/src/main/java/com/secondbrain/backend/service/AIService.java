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

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    @Value("${spring.neo4j.uri:}")
    private String neo4jUri;

    @Autowired
    private NoteRepository noteRepository;

    private static String lastSuccessfulAiRequestTime = null;

    public String getLastSuccessfulAiRequestTime() {
        return lastSuccessfulAiRequestTime;
    }

    public String getChatResponse(String prompt) {
        List<Note> recentNotes = new ArrayList<>();
        boolean dbOnline = true;
        try {
            recentNotes = noteRepository.findRecentNotes();
        } catch (Exception e) {
            dbOnline = false;
            logger.warn("Neo4j database offline for findRecentNotes: {}", e.getMessage());
        }

        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            logger.warn("GEMINI_API_KEY is not configured.");
            return generateLocalFallback(prompt, recentNotes, dbOnline, 
                "[System Notice]: Gemini API Key is not configured. Set GEMINI_API_KEY environment variable to enable AI generation.");
        }

        String maskedKey = geminiApiKey.length() > 8 
            ? geminiApiKey.substring(0, 4) + "..." + geminiApiKey.substring(geminiApiKey.length() - 4)
            : "[CONFIGURED]";

        logger.info("Executing Gemini API request with key: {} and model: {}", maskedKey, geminiModel);

        StringBuilder contextBuilder = new StringBuilder(
            "System Context: You are the 'Second Brain AI' Assistant. Ground your answer in the user's personal knowledge substrate below:\n\nKNOWLEDGE SUBSTRATE:\n"
        );

        for (Note note : recentNotes) {
            contextBuilder.append("- Title: ").append(note.getTitle() != null ? note.getTitle() : "Untitled")
                          .append(" | Content: ").append(note.getContent() != null ? note.getContent() : "").append("\n");
        }

        contextBuilder.append("\nUSER QUESTION: ").append(prompt);
        String finalPrompt = contextBuilder.toString();

        // Target primary configured model (gemini-2.5-flash) with failover to gemini-flash-latest
        String[] modelCandidates = new String[] { geminiModel, "gemini-flash-latest" };

        for (String currentModel : modelCandidates) {
            try {
                logger.info("Attempting Gemini request using model candidate: {}", currentModel);
                String result = executeGeminiRequest(finalPrompt, currentModel);
                if (result != null && !result.trim().isEmpty()) {
                    lastSuccessfulAiRequestTime = Instant.now().toString();
                    logger.info("Successfully received Gemini response using model: {}", currentModel);
                    return "[Gemini AI]\n\n" + result;
                }
            } catch (HttpClientErrorException.TooManyRequests e) {
                logger.warn("Gemini 429 Quota Exceeded for model {}: {}", currentModel, e.getResponseBodyAsString());
                if (!"gemini-flash-latest".equals(currentModel)) {
                    continue; // Try failover candidate
                }
                return generateLocalFallback(prompt, recentNotes, dbOnline, 
                    "[System Notice]: Gemini AI is temporarily unavailable because the API quota for this project has been exceeded. Please try again later or update the configured API key.");
            } catch (HttpClientErrorException.NotFound e) {
                logger.warn("Gemini Model Not Found for model {}: {}", currentModel, e.getResponseBodyAsString());
                if (!"gemini-flash-latest".equals(currentModel)) {
                    continue; // Try failover candidate
                }
                return generateLocalFallback(prompt, recentNotes, dbOnline, 
                    "[System Notice]: Configured Gemini model ('" + geminiModel + "') is unavailable.");
            } catch (HttpClientErrorException.Forbidden | HttpClientErrorException.Unauthorized e) {
                logger.error("Gemini Auth Error for model {}: {}", currentModel, e.getResponseBodyAsString());
                return generateLocalFallback(prompt, recentNotes, dbOnline, 
                    "[System Notice]: Invalid Gemini API Key or permission denied in Google AI Studio.");
            } catch (HttpClientErrorException e) {
                logger.error("Gemini API Client Error (Status {}): {}", e.getStatusCode(), e.getResponseBodyAsString());
                return generateLocalFallback(prompt, recentNotes, dbOnline, 
                    "[System Notice]: Gemini AI request failed (" + e.getStatusCode().value() + ").");
            } catch (ResourceAccessException | HttpServerErrorException e) {
                logger.warn("Transient Gemini network error for model {}: {}", currentModel, e.getMessage());
            } catch (Exception e) {
                logger.error("Unexpected error calling Gemini API: {}", e.getMessage(), e);
                return generateLocalFallback(prompt, recentNotes, dbOnline, 
                    "[System Notice]: Backend exception: " + e.getMessage());
            }
        }

        return generateLocalFallback(prompt, recentNotes, dbOnline, "[System Notice]: Gemini API service unavailable.");
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

        logger.info("Sending HTTP POST to Gemini endpoint: {}", baseUrl);

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
                        logger.info("Received response from Gemini API (Length: {} chars)", reply != null ? reply.length() : 0);
                        return reply;
                    }
                }
            }
        }
        return null;
    }

    private String generateLocalFallback(String prompt, List<Note> recentNotes, boolean dbOnline, String notice) {
        if (!dbOnline) {
            return notice + "\n\n[Knowledge Substrate]: Database offline.";
        }
        if (recentNotes != null && !recentNotes.isEmpty()) {
            Note topNote = recentNotes.get(0);
            return notice + "\n\n[Knowledge Substrate]: Grounded in stored note ('" + topNote.getTitle() + "'):\n\"" 
                + (topNote.getContent() != null ? topNote.getContent().substring(0, Math.min(220, topNote.getContent().length())) : "") 
                + "...\"";
        }
        return notice;
    }
}
