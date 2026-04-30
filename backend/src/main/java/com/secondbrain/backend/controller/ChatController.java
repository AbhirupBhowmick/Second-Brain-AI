package com.secondbrain.backend.controller;

import com.secondbrain.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.secondbrain.backend.dto.ChatRequest;
import com.secondbrain.backend.dto.ChatResponse;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AIService aiService;

    @Autowired
    public ChatController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponse("Prompt cannot be empty"));
        }

        String response = aiService.getChatResponse(request.getPrompt());
        return ResponseEntity.ok(new ChatResponse(response));
    }
}
