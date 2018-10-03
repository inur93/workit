package com.vormadal.workit.database.models;

import lombok.*;
import org.mongodb.morphia.annotations.Field;
import org.mongodb.morphia.annotations.Index;
import org.mongodb.morphia.annotations.Indexes;
import org.mongodb.morphia.utils.IndexType;

import java.util.List;
import java.util.Set;

/**
 * Created: 30-08-2018
 * author: Runi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
@Indexes({
        @Index(fields = {
                @Field(value = "_id", type = IndexType.ASC),
                @Field(value = "name", type = IndexType.ASC)
        })
})
public class Project extends BaseDto {

    private String clientId;
    private String name;
    private Set<String> users; //when project is created these users will be granted access to this project // clients who can view cases
    private Set<String> editors; // clients who can create cases
    private Set<String> developers; //when project is created these users will be granted the required permissions to register time etc.

    private ProjectConfiguration configuration;

    public static class ProjectConfiguration {
        public List<String> statusValues;
        public List<String> priorityValues;
        public List<String> defaultViewFields;
    }
}
