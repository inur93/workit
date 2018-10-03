package com.vormadal.workit.database.dao;


import com.vormadal.workit.database.models.security.Role;

/**
 * Created: 09-05-2018
 * author: Runi
 */
public interface RoleDao extends BaseDao<Role> {

    Role getByName(String adminRoleName);
}
