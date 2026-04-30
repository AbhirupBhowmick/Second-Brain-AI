package com.secondbrain.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import com.secondbrain.backend.model.Note;
import com.secondbrain.backend.repository.NoteRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private NoteRepository noteRepository;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    public String getChatResponse(String prompt) {
        List<Note> recentNotes = noteRepository.findRecentNotes();
        
        StringBuilder contextBuilder = new StringBuilder("System Context: You are the 'Second Brain' AI Assistant. Below is a subset of the user's personal knowledge graph. Use this to answer their questions.\n\nKNOWLEDGE SUBSTRATE:\n");
        
        for (Note note : recentNotes) {
            contextBuilder.append("- ").append(note.getContent()).append("\n");
        }
        
        contextBuilder.append("\nUSER QUESTION: ").append(prompt);
        String finalPrompt = contextBuilder.toString();

        RestTemplate restTemplate = new RestTemplate();
        String url = GEMINI_API_URL + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> parts = new HashMap<>();
        parts.put("text", finalPrompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(parts));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            System.out.println("Sending request to Gemini API: " + url);
            System.out.println("Request Body: " + requestBody);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            System.out.println("Response from Gemini API: " + responseBody);
            
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentRes = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> resParts = (List<Map<String, Object>>) contentRes.get("parts");
                    if (!resParts.isEmpty()) {
                        return (String) resParts.get(0).get("text");
                    }
                }
            }
            return "Neural Nexus returned an empty substrate. Please try again.";
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("Gemini API Error: " + e.getResponseBodyAsString());
            return "Neural transmission interrupted: " + e.getStatusText();
        } catch (Exception e) {
            System.err.println("General Error in AIService: " + e.getMessage());
            e.printStackTrace();
            return "Neural transmission interrupted. Please check your connectivity or API substrate.";
        }
    }
}
