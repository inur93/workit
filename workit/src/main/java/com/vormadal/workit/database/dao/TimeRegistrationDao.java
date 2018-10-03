package com.vormadal.workit.database.dao;

import com.vormadal.workit.database.models.TimeRegistration;

import java.util.Date;
import java.util.List;

/**
 * Created: 05-09-2018
 * author: Runi
 */

public interface TimeRegistrationDao extends BaseDao<TimeRegistration> {
    List<TimeRegistration> getRegistrationsForUser(String userId, Date from, Date to);
}
