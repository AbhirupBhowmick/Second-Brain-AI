package com.secondbrain.backend.dto;

public class DashboardStatsDTO {
    private long totalNotes;
    private long totalConnections;
    private String storageUsed;

    public DashboardStatsDTO(long totalNotes, long totalConnections, String storageUsed) {
        this.totalNotes = totalNotes;
        this.totalConnections = totalConnections;
        this.storageUsed = storageUsed;
    }

    public long getTotalNotes() {
        return totalNotes;
    }

    public void setTotalNotes(long totalNotes) {
        this.totalNotes = totalNotes;
    }

    public long getTotalConnections() {
        return totalConnections;
    }

    public void setTotalConnections(long totalConnections) {
        this.totalConnections = totalConnections;
    }

    public String getStorageUsed() {
        return storageUsed;
    }

    public void setStorageUsed(String storageUsed) {
        this.storageUsed = storageUsed;
    }
}
