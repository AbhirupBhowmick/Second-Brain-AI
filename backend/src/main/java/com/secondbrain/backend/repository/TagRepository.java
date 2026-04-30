package com.secondbrain.backend.repository;

import com.secondbrain.backend.model.Tag;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface TagRepository extends Neo4jRepository<Tag, String> {
}
