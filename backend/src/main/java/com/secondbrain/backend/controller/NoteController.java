package com.secondbrain.backend.controller;

import com.secondbrain.backend.model.Note;
import com.secondbrain.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteRepository noteRepository;

    @Autowired
    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        return ResponseEntity.ok(noteRepository.findAll());
    }

    @Autowired
    private com.secondbrain.backend.repository.ProjectRepository projectRepository;

    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody java.util.Map<String, Object> request) {
        Note note = new Note();
        note.setTitle((String) request.getOrDefault("title", "Untitled Note"));
        note.setContent((String) request.get("content"));

        if (request.containsKey("projectId") && request.get("projectId") != null) {
            Long projectId = Long.valueOf(request.get("projectId").toString());
            java.util.Optional<com.secondbrain.backend.model.Project> projectOpt = projectRepository.findById(projectId);
            projectOpt.ifPresent(note::setProject);
        }

        return ResponseEntity.ok(noteRepository.save(note));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        return noteRepository.findById(id)
                .map(note -> {
                    note.setTitle(noteDetails.getTitle());
                    note.setContent(noteDetails.getContent());
                    return ResponseEntity.ok(noteRepository.save(note));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        return noteRepository.findById(id)
                .map(note -> {
                    noteRepository.delete(note);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
