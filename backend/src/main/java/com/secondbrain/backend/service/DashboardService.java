package com.secondbrain.backend.service;

import com.secondbrain.backend.dto.DashboardStatsDTO;
import com.secondbrain.backend.model.Note;
import com.secondbrain.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DashboardService {

    private final NoteRepository noteRepository;

    @Autowired
    public DashboardService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        long totalNotes = noteRepository.count();
        long totalConnections = noteRepository.countAllRelationships();
        
        List<Note> allNotes = noteRepository.findAll();
        long totalBytes = 0;
        for (Note n : allNotes) {
            if (n.getTitle() != null) totalBytes += n.getTitle().getBytes().length;
            if (n.getContent() != null) totalBytes += n.getContent().getBytes().length;
        }

        String storageUsed;
        if (totalBytes < 1024) {
            storageUsed = totalBytes + " B";
        } else if (totalBytes < 1024 * 1024) {
            storageUsed = String.format("%.1f KB", totalBytes / 1024.0);
        } else {
            storageUsed = String.format("%.2f MB", totalBytes / (1024.0 * 1024.0));
        }

        return new DashboardStatsDTO(totalNotes, totalConnections, storageUsed);
    }
}
