package com.vormadal.workit.business;


import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.models.security.Resource;

import java.util.Set;

/**
 * Created: 15-09-2018
 * author: Runi
 */

public interface ResourceController {
    Set<Resource> getResources() throws MorphiaException;
}
