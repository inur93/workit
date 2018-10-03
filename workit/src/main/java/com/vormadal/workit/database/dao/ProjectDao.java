package com.vormadal.workit.database.dao;

import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.models.Project;

/**
 * Created: 03-09-2018
 * author: Runi
 */

public interface ProjectDao extends BaseDao<Project> {
    ListWithTotal<Project> getByClientId(String clientId, int page, int size, String orderBy, String order);

    Project getUsersOnly(String projectId);

    Project.ProjectConfiguration updateConfiguration(String id, Project.ProjectConfiguration configuration);
}
