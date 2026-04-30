package com.secondbrain.backend.controller;

import com.secondbrain.backend.model.Note;
import com.secondbrain.backend.model.RelatesTo;
import com.secondbrain.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/graph")
@CrossOrigin(origins = "*")
public class GraphController {

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping
    public Map<String, Object> getGraphData() {
        List<Note> notes = noteRepository.findAll();
        List<Map<String, Object>> nodesList = new ArrayList<>();
        List<Map<String, Object>> linksList = new ArrayList<>();

        Set<String> stopWords = new HashSet<>(Arrays.asList("the", "is", "at", "which", "on", "a", "an", "and", "in", "to", "for", "with", "it", "i", "my", "this", "that"));

        for (Note note : notes) {
            Map<String, Object> nodeMap = new HashMap<>();
            nodeMap.put("id", note.getId());
            nodeMap.put("name", note.getTitle() != null && !note.getTitle().isEmpty() ? note.getTitle() : "Neural Node");
            nodeMap.put("content", note.getContent() != null ? note.getContent() : "");
            nodeMap.put("val", 5);
            nodesList.add(nodeMap);

            if (note.getRelatedNotes() != null) {
                for (RelatesTo relation : note.getRelatedNotes()) {
                    if (relation.getTargetNote() != null) {
                        Map<String, Object> linkMap = new HashMap<>();
                        linkMap.put("source", note.getId());
                        linkMap.put("target", relation.getTargetNote().getId());
                        linksList.add(linkMap);
                    }
                }
            }

            // Semantic Logic: Connect notes that share similar keywords in content
            String[] words = (note.getContent() != null ? note.getContent().toLowerCase() : "").split("\\W+");
            Set<String> keywords = new HashSet<>();
            for (String w : words) {
                if (w.length() > 3 && !stopWords.contains(w)) keywords.add(w);
            }

            for (Note otherNote : notes) {
                if (!otherNote.getId().equals(note.getId())) {
                    String[] otherWords = (otherNote.getContent() != null ? otherNote.getContent().toLowerCase() : "").split("\\W+");
                    boolean matchFound = false;
                    for (String ow : otherWords) {
                        if (keywords.contains(ow)) {
                            matchFound = true;
                            break;
                        }
                    }

                    if (matchFound) {
                        Map<String, Object> linkMap = new HashMap<>();
                        linkMap.put("source", note.getId());
                        linkMap.put("target", otherNote.getId());
                        linkMap.put("type", "semantic-synapse");
                        linksList.add(linkMap);
                    }
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("nodes", nodesList);
        result.put("links", linksList);
        return result;
    }
}
