package com.secondbrain.backend.service;

import com.secondbrain.backend.model.Note;
import com.secondbrain.backend.repository.NoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @InjectMocks
    private AIService aiService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(aiService, "geminiApiKey", "test-api-key");
        ReflectionTestUtils.setField(aiService, "geminiModel", "gemini-3.1-flash-lite");
    }

    @Test
    @DisplayName("Should throw BAD_REQUEST 400 when GEMINI_API_KEY is missing or empty")
    void testMissingApiKeyThrowsBadRequest() {
        ReflectionTestUtils.setField(aiService, "geminiApiKey", "");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            aiService.getChatResponse("Hello AI");
        });

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertTrue(exception.getReason().contains("Gemini API Key is not configured"));
        assertNotNull(aiService.getLastAiError());
    }

    @Test
    @DisplayName("Should handle database failure gracefully and construct prompt without crashing")
    void testDatabaseFailureDoesNotCrashPromptConstruction() {
        when(noteRepository.findRecentNotes()).thenThrow(new RuntimeException("Neo4j connection refused"));

        // Will attempt API call after building prompt with offline notice
        assertThrows(ResponseStatusException.class, () -> {
            aiService.getChatResponse("What are my notes?");
        });

        verify(noteRepository, times(1)).findRecentNotes();
    }

    @Test
    @DisplayName("Should load notes into context when database is online")
    void testLoadsNotesIntoContext() {
        Note note = new Note();
        note.setTitle("Architecture Note");
        note.setContent("Microservices and Spring Boot");
        when(noteRepository.findRecentNotes()).thenReturn(List.of(note));

        // Will attempt API call with recent notes attached
        assertThrows(ResponseStatusException.class, () -> {
            aiService.getChatResponse("Explain architecture");
        });

        verify(noteRepository, times(1)).findRecentNotes();
    }
}
