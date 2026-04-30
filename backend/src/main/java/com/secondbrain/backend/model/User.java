package com.secondbrain.backend.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Node
@Data
public class User {

    @Id
    private String id;

    private String email;
    private String password;

    @Relationship(type = "OWNS", direction = Relationship.Direction.OUTGOING)
    private List<Note> notes = new ArrayList<>();
}
