package com.vormadal.workit.database.models.security;

import com.vormadal.mongodb.models.BaseDto;
import lombok.EqualsAndHashCode;

import javax.xml.bind.annotation.XmlType;

/**
 * Created: 19-09-2018
 * author: Runi
 */
@EqualsAndHashCode(callSuper = true)
@XmlType(name = "workitResource")
public class Resource extends dk.agenia.permissionmanagement.models.Resource implements BaseDto {


    @Override
    public String getId() {
        return this.getName();
    }
}
