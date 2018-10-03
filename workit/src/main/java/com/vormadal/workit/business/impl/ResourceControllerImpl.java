package com.vormadal.workit.business.impl;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.business.ResourceController;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.database.models.security.Policy;
import com.vormadal.workit.database.models.security.Resource;
import com.vormadal.workit.database.models.security.Role;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import static com.vormadal.workit.database.DaoRegistry.getResourceDao;

/**
 * Created: 15-09-2018
 * author: Runi
 */

public class ResourceControllerImpl
        extends dk.agenia.permissionmanagement.controllers.ResourceController<User, Policy, Resource, Role>
        implements ResourceController  {

    public Set<Resource> getResources() throws MorphiaException {
        return new HashSet<>(getResourceDao().getAll());
    }

    @Override
    public Resource createResourceObject(String resource, Set<String> activePermissions) {
        Resource r = new Resource();
        r.setName(resource);
        r.setPermissions(activePermissions);
        r.setDescendants(new ArrayList<>());
        return r;
    }
}
