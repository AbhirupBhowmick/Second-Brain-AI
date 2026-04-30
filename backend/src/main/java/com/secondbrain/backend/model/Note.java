package com.secondbrain.backend.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Node
@Data
public class Note {

    @Id @GeneratedValue
    private Long id;

    private String title;
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();

    @Relationship(type = "HAS", direction = Relationship.Direction.OUTGOING)
    private List<Tag> tags = new ArrayList<>();

    @Relationship(type = "RELATES_TO", direction = Relationship.Direction.OUTGOING)
    private List<RelatesTo> relatedNotes = new ArrayList<>();

    @Relationship(type = "BELONGS_TO", direction = Relationship.Direction.OUTGOING)
    private Project project;
}
