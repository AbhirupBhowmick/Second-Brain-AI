package com.secondbrain.backend.controller;

import com.secondbrain.backend.model.Project;
import com.secondbrain.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Map<String, String> request) {
        Project project = new Project();
        project.setName(request.get("name"));
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @GetMapping
    public ResponseEntity<java.util.List<Project>> listProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }
}
