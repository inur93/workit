package com.vormadal.workit.business.impl;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.business.TimeRegistrationController;
import com.vormadal.workit.database.models.TimeRegistration;
import com.vormadal.workit.database.models.UserRef;

import java.util.Date;
import java.util.List;

import static com.vormadal.workit.database.DaoRegistry.getCaseDao;
import static com.vormadal.workit.database.DaoRegistry.getTimeRegistrationDao;

/**
 * Created: 05-09-2018
 * author: Runi
 */

public class TimeRegistrationControllerImpl implements TimeRegistrationController {
    @Override
    public TimeRegistration create(String projectId, String caseId, TimeRegistration registration, String userId) throws MorphiaException {
        registration.setProjectId(projectId);
        registration.setCaseId(caseId);
        registration.setUser(userId);
        registration.setCreated(new Date());
        TimeRegistration created = getTimeRegistrationDao().create(registration);
        getCaseDao().registerTime(caseId, registration.getHours());
        return created;
    }

    @Override
    public List<TimeRegistration> getTimeRegistrationsForUser(String userId, Date from, Date to) {
        return getTimeRegistrationDao().getRegistrationsForUser(userId, from, to);
    }


}
