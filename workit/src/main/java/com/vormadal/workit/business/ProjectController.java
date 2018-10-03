package com.vormadal.workit.business;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.models.Project;
import com.vormadal.workit.database.models.UserRef;

import java.util.List;
import java.util.Map;

/**
 * Created: 03-09-2018
 * author: Runi
 */

public interface ProjectController {

    Project create(Project project) throws MorphiaException;

    Project get(String id) throws MorphiaException;

    ListWithTotal<Project> getAll(int page, int size, String orderBy, String order);

    Project update(Project project) throws MorphiaException;

    ListWithTotal<Project> getByClientId(String clientId, int page, int size, String orderBy, String order);

    ListWithTotal<Project> getByUser(String userIdFromContext) throws MorphiaException;

    Map<String, List<UserRef>> getUsers(String projectId, String query, String group) throws MorphiaException;

    Project.ProjectConfiguration updateConfiguration(String id, Project.ProjectConfiguration configuration);
}
