package com.vormadal.workit.business;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.models.TimeRegistration;

import java.util.Date;
import java.util.List;

/**
 * Created: 05-09-2018
 * author: Runi
 */

public interface TimeRegistrationController {
    TimeRegistration create(String projectId, String caseId, TimeRegistration registration, String userId) throws MorphiaException;

    List<TimeRegistration> getTimeRegistrationsForUser(String userId, Date from, Date to);
}
