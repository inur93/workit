package com.vormadal.workit.database.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created: 30-08-2018
 * author: Runi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRef {
    private String id;
    private String name;
    private String email;

    public UserRef(User user){
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
    }
}
