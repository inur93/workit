package com.vormadal.workit.database.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.PrePersist;
import org.mongodb.morphia.annotations.Version;

import java.util.Date;
import java.util.UUID;

/**
 * Created by Christian on 01-11-2017.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class BaseDto implements com.vormadal.mongodb.models.BaseDto {

    @SuppressWarnings("WeakerAccess")
    public BaseDto(){
        /*this.setId(UUID.randomUUID().toString());*/
    }

    @Id
    private String id = UUID.randomUUID().toString();

    @Version
    private long v;

    private Date created;
    private UserRef createdBy;

    private Date modified;
    private UserRef modifiedBy;

    @PrePersist
    public void prePersist(){
        modified = new Date();
        if(created == null) created = modified;
    }

}
