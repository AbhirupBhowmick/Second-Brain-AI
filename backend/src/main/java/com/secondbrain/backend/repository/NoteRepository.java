package com.secondbrain.backend.repository;

import com.secondbrain.backend.model.Note;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import org.springframework.data.neo4j.repository.query.Query;

public interface NoteRepository extends Neo4jRepository<Note, Long> {
    @Query("MATCH ()-[r]->() RETURN count(r)")
    long countAllRelationships();

    @Query("MATCH (n:Note) RETURN n ORDER BY n.createdAt DESC LIMIT 5")
    java.util.List<Note> findRecentNotes();
}
