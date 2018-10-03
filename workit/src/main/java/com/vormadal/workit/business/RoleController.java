package com.vormadal.workit.business;

import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.models.security.Role;

/**
 * Created: 15-09-2018
 * author: Runi
 */

public interface RoleController {

    Role createRole(Role role) throws Exception;

    Role getRole(String id) throws Exception;

    Role updateRole(String id, Role role) throws Exception;

    void deleteRole(String id, Role role) throws Exception;

    ListWithTotal<Role> getRoles(String query, int page, int size, String orderBy, String order, boolean includeUserRoles);
}
