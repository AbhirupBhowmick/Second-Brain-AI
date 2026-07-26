package com.secondbrain.backend.controller;

import com.secondbrain.backend.model.Note;
import com.secondbrain.backend.repository.NoteRepository;
import com.secondbrain.backend.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private static final Logger logger = LoggerFactory.getLogger(NoteController.class);

    private final NoteRepository noteRepository;
    private final ProjectRepository projectRepository;

    private final Map<Long, Note> inMemoryNotes = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1000);

    @Autowired
    public NoteController(NoteRepository noteRepository, ProjectRepository projectRepository) {
        this.noteRepository = noteRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        try {
            return ResponseEntity.ok(noteRepository.findAll());
        } catch (Exception e) {
            logger.warn("Neo4j offline for getAllNotes ({}), returning in-memory notes", e.getMessage());
            return ResponseEntity.ok(new ArrayList<>(inMemoryNotes.values()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody Map<String, Object> request) {
        Note note = new Note();
        note.setTitle((String) request.getOrDefault("title", "Untitled Note"));
        note.setContent((String) request.get("content"));

        try {
            if (request.containsKey("projectId") && request.get("projectId") != null) {
                Long projectId = Long.valueOf(request.get("projectId").toString());
                Optional<com.secondbrain.backend.model.Project> projectOpt = projectRepository.findById(projectId);
                projectOpt.ifPresent(note::setProject);
            }
            return ResponseEntity.ok(noteRepository.save(note));
        } catch (Exception e) {
            logger.warn("Neo4j offline for createNote ({}), caching in memory", e.getMessage());
            long newId = idGenerator.incrementAndGet();
            note.setId(newId);
            inMemoryNotes.put(newId, note);
            return ResponseEntity.ok(note);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        try {
            return noteRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> {
                        Note inMem = inMemoryNotes.get(id);
                        return inMem != null ? ResponseEntity.ok(inMem) : ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            Note inMem = inMemoryNotes.get(id);
            return inMem != null ? ResponseEntity.ok(inMem) : ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        try {
            return noteRepository.findById(id)
                    .map(note -> {
                        note.setTitle(noteDetails.getTitle());
                        note.setContent(noteDetails.getContent());
                        return ResponseEntity.ok(noteRepository.save(note));
                    })
                    .orElseGet(() -> {
                        Note inMem = inMemoryNotes.get(id);
                        if (inMem != null) {
                            inMem.setTitle(noteDetails.getTitle());
                            inMem.setContent(noteDetails.getContent());
                            return ResponseEntity.ok(inMem);
                        }
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            Note inMem = inMemoryNotes.get(id);
            if (inMem != null) {
                inMem.setTitle(noteDetails.getTitle());
                inMem.setContent(noteDetails.getContent());
                return ResponseEntity.ok(inMem);
            }
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        try {
            noteRepository.deleteById(id);
            inMemoryNotes.remove(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            inMemoryNotes.remove(id);
            return ResponseEntity.ok().build();
        }
    }
}
