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

    @Value("${gemini.model:gemini-2.0-flash}")
    private String geminiModel;

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
            return generateLocalFallback(prompt, recentNotes, dbOnline, "[System Notice]: Gemini API Key is not configured. Set GEMINI_API_KEY environment variable to enable AI generation.");
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

        for (int attempt = 1; attempt <= 2; attempt++) {
            try {
                String result = executeGeminiRequest(finalPrompt, geminiModel);
                if (result != null && !result.trim().isEmpty()) {
                    lastSuccessfulAiRequestTime = Instant.now().toString();
                    return "[Gemini AI]\n\n" + result;
                }
            } catch (HttpClientErrorException e) {
                logger.error("Gemini API Error (Status {}): {}", e.getStatusCode(), e.getResponseBodyAsString());
                String responseBody = e.getResponseBodyAsString();
                String detailedMsg = e.getStatusText();
                if (responseBody != null && responseBody.contains("\"message\":")) {
                    try {
                        int idx = responseBody.indexOf("\"message\":");
                        int start = responseBody.indexOf("\"", idx + 10) + 1;
                        int end = responseBody.indexOf("\"", start);
                        if (start > 0 && end > start) {
                            detailedMsg = responseBody.substring(start, end).replace("\\n", " ");
                        }
                    } catch (Exception ex) {
                        detailedMsg = e.getResponseBodyAsString();
                    }
                }
                return generateLocalFallback(prompt, recentNotes, dbOnline, "[System Notice]: Gemini API Error (" + e.getStatusCode().value() + "): " + detailedMsg);
            } catch (ResourceAccessException | HttpServerErrorException e) {
                logger.warn("Transient error on attempt {}/2: {}", attempt, e.getMessage());
                if (attempt == 2) {
                    return generateLocalFallback(prompt, recentNotes, dbOnline, "[System Notice]: Network timeout connecting to Gemini API endpoint.");
                }
            } catch (Exception e) {
                logger.error("Unexpected error calling Gemini API: {}", e.getMessage(), e);
                return generateLocalFallback(prompt, recentNotes, dbOnline, "[System Notice]: Backend error: " + e.getMessage());
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
            return notice + "\n\n[Database Status]: Knowledge Graph (Neo4j) is currently offline at bolt://localhost:7687.";
        }
        if (recentNotes != null && !recentNotes.isEmpty()) {
            Note topNote = recentNotes.get(0);
            return notice + "\n\n[Knowledge Substrate]: Retrieved stored note ('" + topNote.getTitle() + "'):\n\"" 
                + (topNote.getContent() != null ? topNote.getContent().substring(0, Math.min(220, topNote.getContent().length())) : "") 
                + "...\"";
        }
        return notice + "\n\n[Knowledge Substrate]: 0 note nodes stored in your knowledge base.";
    }
}
