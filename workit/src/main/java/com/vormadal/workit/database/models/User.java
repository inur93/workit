package com.vormadal.workit.database.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vormadal.mongodb.models.BaseDto;
import com.vormadal.workit.database.models.security.Policy;
import dk.agenia.permissionmanagement.models.PolicyUser;
import lombok.*;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by Christian on 01-11-2017.
 */
@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Indexes({
        @Index(fields = {@Field(value = "email")}, options = @IndexOptions(unique = true))
})
public class User extends PolicyUser implements BaseDto {

    //overrides the PolicyUser id - otherwise Mongo does not recognise the id field
    @Id
    @Builder.Default
    private String id = new ObjectId().toString();
    @Version
    private Long v;

    private String email;
    private transient String password;
    private transient String newPassword;
    @JsonIgnore
    private String hash; //of password

    //TODO
    private transient List<Policy> policies;

    @JsonIgnore
    private transient String token;

    @Builder.Default
    private UserStatus status = UserStatus.created;
    private transient boolean firstTimeLogin; //used to offer the user the option to update password if password has been autogenerated.
    private Date lastLogin;
    private int failedLoginAttempts;
    private Date lastFailedLogin;
    private Date passphraseUpdated;
    private Date updated;
    private Date created;
    private String createdBy;

    private String name;

    //Resourcename, set of permission names
    private transient Map<String, Set<String>> access;

    public enum UserStatus {
        created, active, disabled
    }
}