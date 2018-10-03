package com.vormadal.workit.business.impl;

import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.business.RoleController;
import com.vormadal.workit.database.models.security.Role;
import com.vormadal.workit.exceptions.DBValidationException;
import com.vormadal.workit.exceptions.ElementNotFoundException;
import com.vormadal.workit.exceptions.PersistenceException;
import com.vormadal.workit.exceptions.ValidException;

import static com.vormadal.workit.database.DaoRegistry.getPolicyDao;
import static com.vormadal.workit.database.DaoRegistry.getRoleDao;

/**
 * Created: 15-09-2018
 * author: Runi
 */

public class RoleControllerImpl implements RoleController {

    @Override
    public Role createRole(Role role) throws Exception {
        validateRole(role);
        return getRoleDao().create(role);
    }

    @Override
    public Role getRole(String id) throws Exception {
        return getRoleDao().get(id);
    }

    @Override
    public ListWithTotal<Role> getRoles(String query, int page, int size, String orderBy, String order, boolean includeUserRoles) {
        return null;
    }

    @Override
    public Role updateRole(String id, Role role) throws Exception {
        validateRole(role);
        return getRoleDao().update(role);
    }

    @Override
    public void deleteRole(String id, Role role) throws Exception {
        Role existing = getRoleDao().get(id);
        if (existing == null) throw new ElementNotFoundException("Role with this id no longer exists");

        getPolicyDao().deleteByRoleId(id);
        try {
            getRoleDao().delete(id);
        } catch (PersistenceException e) {
            throw new DBValidationException("This role has already been assigned to a user or another role inherits from this. Delete all roles inheriting from this one and remove this role from all users");
        } catch (Exception e) {
            throw new PersistenceException("Unknown com.vormadal.restservice.database exception occurred. Please contact admin");
        }
    }




    private boolean validateRole(Role role) throws ValidException {
        if(role == null) throw new ValidException("No role provided");
        if(role.getName() == null || role.getName().length() <= 0) throw new ValidException("Role has no name");
        return true;
    }
}
