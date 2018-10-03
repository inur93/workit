package com.vormadal.workit.database.models.security;

import com.vormadal.mongodb.models.BaseDto;
import org.mongodb.morphia.annotations.Field;
import org.mongodb.morphia.annotations.Index;
import org.mongodb.morphia.annotations.IndexOptions;
import org.mongodb.morphia.annotations.Indexes;

import javax.xml.bind.annotation.XmlType;

/**
 * Created: 21-09-2018
 * author: Runi
 */
@Indexes({
        @Index( fields = @Field( value = "name"), options = @IndexOptions(unique = true))
})
@XmlType(name = "workitRole")
public class Role extends dk.agenia.permissionmanagement.models.Role implements BaseDto {
    @Override
    public String getId() {
        return this.getName();
    }

    public String getRolePath(){
        StringBuilder value = new StringBuilder("," + this.getName() + ",");
        if(getAncestors() != null) {
            for (String r : this.getAncestors()) {
                value.append(r).append(",");
            }
        }
        return value.toString();
    }
}
