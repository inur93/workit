package com.vormadal.workit.database.models;

import lombok.*;
import org.mongodb.morphia.annotations.Field;
import org.mongodb.morphia.annotations.Index;
import org.mongodb.morphia.annotations.Indexes;
import org.mongodb.morphia.utils.IndexType;

import java.util.List;

/**
 * Created: 30-08-2018
 * author: Runi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
@Indexes({
        @Index(fields = {
                @Field(value = "title", type = IndexType.TEXT),
                @Field(value = "priority"),
                @Field(value = "status"),
                @Field(value = "estimate"),
                @Field(value = "timeSpent"),
                @Field(value = "responsible"),
                @Field(value = "_id"),
        })
})
public class Case extends BaseDto {

    private String projectId;
    private String title;
    private String description;
    private String priority;
    private String status;

    private List<Comment> comments;
    private transient Comment newComment;

    private UserRef responsible;

    private double estimate;
    private double timeSpent;


}
