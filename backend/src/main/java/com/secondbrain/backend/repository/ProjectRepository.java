package com.secondbrain.backend.repository;

import com.secondbrain.backend.model.Project;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface ProjectRepository extends Neo4jRepository<Project, Long> {
}
