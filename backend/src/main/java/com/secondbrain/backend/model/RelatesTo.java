package com.secondbrain.backend.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
@Data
public class RelatesTo {

    @RelationshipId
    private Long id;

    private Double strength;

    @TargetNode
    private Note targetNote;
}
