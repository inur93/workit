package com.vormadal.workit.database.dao;


import com.vormadal.workit.database.models.security.Resource;

/**
 * Created: 09-05-2018
 * author: Runi
 */
public interface ResourceDao extends BaseDao<Resource> {

    Resource getByResourceName(String resourceName);
}
