package com.vormadal.workit.database.mongo;

import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.dao.RoleDao;
import com.vormadal.workit.database.models.security.Role;

/**
 * Created: 31-08-2018
 * author: Runi
 */

public class MongoRoleDao extends MongoBaseDao<Role> implements RoleDao {
    public MongoRoleDao(DbProvider provider) {
        super(provider, Role.class);
    }

    @Override
    public Role getByName(String adminRoleName) {
        return query().field("name").equal(adminRoleName).get();
    }

    @Override
    public Role update(Role role) throws MorphiaException {
        return updateAll(role);
    }
}
