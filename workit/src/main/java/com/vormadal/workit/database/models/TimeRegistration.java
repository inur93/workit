package com.vormadal.workit.database.models;

import lombok.*;

import java.util.Date;

/**
 * Created: 30-08-2018
 * author: Runi
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TimeRegistration extends BaseDto {

    private Date date;
    private double hours;
    //private String clientId; //removed for now - client object is only used as metadata container and is not directly part of the permission/data/access hierarchy
    private String projectId;
    private String caseId;
    private String user;
}
