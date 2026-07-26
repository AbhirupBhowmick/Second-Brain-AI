package com.secondbrain.backend.controller;

import com.secondbrain.backend.model.Project;
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
@RequestMapping("/api/projects")
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectRepository projectRepository;
    private final Map<Long, Project> inMemoryProjects = new ConcurrentHashMap<>();
    private final AtomicLong idGen = new AtomicLong(100);

    @Autowired
    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Map<String, String> request) {
        Project project = new Project();
        project.setName(request.get("name"));
        try {
            return ResponseEntity.ok(projectRepository.save(project));
        } catch (Exception e) {
            logger.warn("Neo4j offline for createProject ({}), caching in memory", e.getMessage());
            long newId = idGen.incrementAndGet();
            project.setId(newId);
            inMemoryProjects.put(newId, project);
            return ResponseEntity.ok(project);
        }
    }

    @GetMapping
    public ResponseEntity<List<Project>> listProjects() {
        try {
            return ResponseEntity.ok(projectRepository.findAll());
        } catch (Exception e) {
            logger.warn("Neo4j offline for listProjects ({}), returning in-memory projects", e.getMessage());
            return ResponseEntity.ok(new ArrayList<>(inMemoryProjects.values()));
        }
    }
}
