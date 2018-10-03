package com.vormadal.workit.database.models;

import com.vormadal.mongodb.models.BaseDto;
import lombok.Data;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Indexed;
import org.mongodb.morphia.annotations.PrePersist;

/**
 * Created: 06-07-2018
 * author: Runi
 */
@Data
public class SimpleField implements BaseDto {
    @Id
    private String id;

    @Indexed
    private String name;
    @Indexed
    private String language;
    private String value;

    @PrePersist
    public void defaultLanguage(){
        if(language == null) language = "en";
        id = language + "#" + name;
    }
}
