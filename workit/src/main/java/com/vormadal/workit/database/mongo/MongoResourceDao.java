package com.vormadal.workit.database.mongo;

import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.dao.ResourceDao;
import com.vormadal.workit.database.models.security.Resource;

/**
 * Created: 31-08-2018
 * author: Runi
 */

public class MongoResourceDao extends MongoBaseDao<Resource> implements ResourceDao {
    public MongoResourceDao(DbProvider provider) {
        super(provider, Resource.class);
    }

    @Override
    public Resource getByResourceName(String resourceName) {
        return query().field("name").equal(resourceName).get();
    }

    @Override
    public Resource update(Resource resource) throws MorphiaException {
        return updateAll(resource);
    }
}
