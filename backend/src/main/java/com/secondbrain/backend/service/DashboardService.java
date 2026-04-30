package com.secondbrain.backend.service;

import com.secondbrain.backend.dto.DashboardStatsDTO;
import com.secondbrain.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        
        // Mocking storage used
        String storageUsed = "1.2 MB";

        return new DashboardStatsDTO(totalNotes, totalConnections, storageUsed);
    }
}
