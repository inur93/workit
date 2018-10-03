package com.vormadal.workit.business.impl;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.mongodb.models.Order;
import com.vormadal.workit.business.ProjectController;
import com.vormadal.workit.config.Config;
import com.vormadal.workit.config.PermissionExt;
import com.vormadal.workit.database.models.Project;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.database.models.UserRef;
import com.vormadal.workit.database.models.security.Policy;
import com.vormadal.workit.database.models.security.Resource;
import com.vormadal.workit.database.models.security.Role;
import com.vormadal.workit.exceptions.PermissionDeniedException;
import com.vormadal.workit.exceptions.ValidException;
import com.vormadal.workit.rest.ManagementService;
import com.vormadal.workit.rest.ProjectService;

import java.util.*;

import static com.vormadal.workit.config.PermissionExt.TIME_REGISTRATION;
import static com.vormadal.workit.database.DaoRegistry.*;
import static com.vormadal.workit.database.models.security.Resource.Param;
import static com.vormadal.workit.util.StringHelper.isNullOrEmpty;
import static dk.agenia.permissionmanagement.models.Permission.*;
import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;

/**
 * Created: 03-09-2018
 * author: Runi
 */

public class ProjectControllerImpl implements ProjectController {
    @Override
    public Project create(Project project) throws MorphiaException {
        if(isNullOrEmpty(project.getClientId())) throw new ValidException("This project is not attached to a client");
        if(isNullOrEmpty(project.getId())) throw new ValidException("The project id is empty");
        if(isNullOrEmpty(project.getName())) throw new ValidException("The project should have a name");
        String defStatusStr = Config.DEFAULT_STATUS;
        String defPriorityStr = Config.DEFAULT_PRIORITY;
        if (project.getConfiguration() == null) project.setConfiguration(new Project.ProjectConfiguration());
        if (defStatusStr != null) {
            project.getConfiguration().statusValues = asList(defStatusStr.split(";"));
        }
        if (defPriorityStr != null) {
            project.getConfiguration().priorityValues = asList(defPriorityStr.split(";"));
        }

        Project created = getProjectDao().create(project);

        String userRoleName = getProjectUserRoleName(project);
        String editorRoleName = getProjectEditorUserRoleName(project);
        String developerRoleName = getProjectDeveloperUserRoleName(project);

        Role userRole = getRoleDao().getByName(userRoleName);
        Role editorRole = getRoleDao().getByName(editorRoleName);
        Role developerRole = getRoleDao().getByName(developerRoleName);

        createDefaultRolesAndPolicies(created, userRole, editorRole, developerRole);

        return created;
    }

    @Override
    public Project get(String id) throws MorphiaException {
        return getProjectDao().get(id);
    }

    @Override
    public ListWithTotal<Project> getAll(int page, int size, String orderBy, String order) {
        return getProjectDao().getAllWithTotal(page, size, orderBy, Order.valueOf(order));
    }

    @Override
    public Project update(Project project) throws MorphiaException {
        Project current = getProjectDao().get(project.getId());
        if (isValid(project, current)) {
            String defStatusStr = Config.DEFAULT_STATUS;
            String defPriorityStr = Config.DEFAULT_PRIORITY;
            if (project.getConfiguration() == null) {
                project.setConfiguration(new Project.ProjectConfiguration());
                if (defStatusStr != null) {
                    project.getConfiguration().statusValues = asList(defStatusStr.split(";"));
                }
                if (defPriorityStr != null) {
                    project.getConfiguration().priorityValues = asList(defPriorityStr.split(";"));
                }
            }

            String userRoleName = getProjectUserRoleName(project);
            String editorRoleName = getProjectEditorUserRoleName(project);
            String developerRoleName = getProjectDeveloperUserRoleName(project);

            Role userRole = getRoleDao().getByName(userRoleName);
            Role editorRole = getRoleDao().getByName(editorRoleName);
            Role developerRole = getRoleDao().getByName(developerRoleName);

            createDefaultRolesAndPolicies(project, userRole, editorRole, developerRole);

            //compute which users to remove roles from
            Set<String> usersToRemove = current.getUsers();
            if (usersToRemove != null)
                usersToRemove.removeAll(project.getUsers());

            Set<String> editorsToRemove = current.getEditors();
            if (editorsToRemove != null)
                editorsToRemove.removeAll(project.getEditors());

            Set<String> developersToRemove = current.getDevelopers();
            if(developersToRemove != null)
                developersToRemove.removeAll(project.getDevelopers());



            //update user roles - new users get roles added in the createDefaultRolesAndPolicies
            if (usersToRemove != null && usersToRemove.size() > 0)
                getUserDao().removeRoleFromUsers(userRole.getRolePath(), usersToRemove);
            if (editorsToRemove != null && editorsToRemove.size() > 0)
                getUserDao().removeRoleFromUsers(editorRole.getRolePath(), editorsToRemove);
            if(developersToRemove != null && developersToRemove.size() > 0)
                getUserDao().removeRoleFromUsers(developerRole.getRolePath(), developersToRemove);

            return getProjectDao().update(project);
        }
        throw new ValidException("Invalid data provided");
    }

    @Override
    public ListWithTotal<Project> getByClientId(String clientId, int page, int size, String orderBy, String order) {
        return getProjectDao().getByClientId(clientId, page, size, orderBy, order);
    }

    @Override
    public ListWithTotal<Project> getByUser(String userId) throws MorphiaException {
        if (userId == null) throw new PermissionDeniedException("Try to login again and try again");
        User user = getUserDao().get(userId);
        if (user == null)
            throw new PermissionDeniedException("The user does not longer exist. Try to log out and in again");
        Set<String> roles = user.getRolesFormatted();
        Set<String> potentialProjectIds = new HashSet<>();
        if (roles != null && roles.size() > 0) {
            for (String role : roles) {
                String id = role.split(" ")[0];
                potentialProjectIds.add(id);
            }
        } else {
            return new ListWithTotal<>(new ArrayList<>(), 0L);
        }

        List<Project> projects = getProjectDao().multiGet(potentialProjectIds);
        return new ListWithTotal<>(projects, (long) projects.size());
    }

    @Override
    public Map<String, List<UserRef>> getUsers(String projectId, String query, String group) throws MorphiaException {
        Project project = getProjectDao().getUsersOnly(projectId);
        Map<String, List<UserRef>> users = new HashMap<>();
        Set<String> userList = project.getUsers();
        Set<String> editorList = project.getEditors();
        Set<String> developerList = project.getDevelopers();

        boolean getUsers = false;
        boolean getEditors = false;
        boolean getDevelopers = false;
        switch (group) {
            case "users":
                getUsers = true;
                break;
            case "editors":
                getEditors = true;
                break;
            case "developers":
                getDevelopers = true;
                break;
            default:
                getUsers = true;
                getEditors = true;
                getDevelopers = true;
        }

        if (getUsers && userList != null && userList.size() > 0)
            users.put("users", getUserDao().getUserRefs(userList, query));
        if (getEditors && editorList != null && editorList.size() > 0)
            users.put("editors", getUserDao().getUserRefs(editorList, query));
        if (getDevelopers && developerList != null && developerList.size() > 0)
            users.put("developers", getUserDao().getUserRefs(developerList, query));
        return users;
    }

    @Override
    public Project.ProjectConfiguration updateConfiguration(String id, Project.ProjectConfiguration configuration) {
        return getProjectDao().updateConfiguration(id, configuration);
    }

    private boolean isValid(Project project, Project existing) {

        //TODO validate configurations
        return true;
    }

    private void createDefaultRolesAndPolicies(Project project, Role userRole, Role editorRole, Role developerRole) throws MorphiaException {
        Resource projectResource = getResourceDao().getByResourceName(ProjectService.Paths.PROJECTS_ID);
        Resource timeRegistrationResource = getResourceDao().getByResourceName(ProjectService.Paths.PROJECTS_ID_CASES_CID_TIMEREGISTRATION);
        Resource developerResource = getResourceDao().getByResourceName(ManagementService.Paths.MANAGEMENT_USERS_SELF_TIMEREGISTRATIONS);

        String userRoleName = getProjectUserRoleName(project);
        String editorRoleName = getProjectEditorUserRoleName(project);
        String developerRoleName = getProjectDeveloperUserRoleName(project);

        List<Role> roles = new ArrayList<>();

        if (userRole == null) {
            userRole = new Role();
            userRole.setName(getProjectUserRoleName(project));
            roles.add(userRole);
        }

        if (editorRole == null) {
            editorRole = new Role();
            editorRole.setName(editorRoleName);
            editorRole.setAncestors(asList(userRoleName));
            editorRole.setParentId(userRoleName);
            roles.add(editorRole);
        }

        if (developerRole == null) {
            developerRole = new Role();
            developerRole.setName(getProjectDeveloperUserRoleName(project));
            developerRole.setAncestors(asList(userRoleName, editorRoleName));
            developerRole.setParentId(editorRoleName);
            roles.add(developerRole);
        }
        //create the roles
        if (roles.size() > 0) getRoleDao().createMultiple(roles);

        List<Policy> policies = new ArrayList<>();
        List<Policy> userPolicies = getPolicyDao().getByRoleId(userRoleName);

        if (userPolicies.size() == 0) {
            //setup the policies
            List<String> userResources = projectResource.getSelfAndDescendantsWithParams(new Param("id", project.getId()));
            userResources.remove(timeRegistrationResource.getNameWithParams(new Param("id", project.getId())));
            Policy userPolicy = new Policy();
            userPolicy.setRoleId(userRole.getName());
            userPolicy.setTargetResource(projectResource.getName());
            userPolicy.setResources(userResources);
            userPolicy.setPermissions(new HashSet<>(singletonList(READ)));
            policies.add(userPolicy);
        }

        List<Policy> editorPolicies = getPolicyDao().getByRoleId(editorRoleName);

        if (editorPolicies.size() == 0) {
            List<String> userResources = projectResource.getSelfAndDescendantsWithParams(new Param("id", project.getId()));
            userResources.remove(timeRegistrationResource.getNameWithParams(new Param("id", project.getId())));
            Policy editorPolicy = new Policy();
            editorPolicy.setRoleId(editorRole.getName());
            editorPolicy.setTargetResource(projectResource.getName());
            editorPolicy.setResources(userResources);
            editorPolicy.setPermissions(new HashSet<>(asList(CREATE, UPDATE)));
            policies.add(editorPolicy);
        }

        List<Policy> developerPolicies = getPolicyDao().getByRoleId(developerRoleName);
        if (developerPolicies.size() == 0) {
            List<String> developerResources = projectResource.getSelfAndDescendantsWithParams(new Param("id", project.getId()));
            Policy developerPolicy = new Policy();
            developerPolicy.setRoleId(developerRole.getName());
            developerPolicy.setTargetResource(projectResource.getName());
            developerPolicy.setResources(developerResources);
            developerPolicy.setPermissions(new HashSet<>(asList(CREATE, READ, UPDATE, TIME_REGISTRATION)));
            policies.add(developerPolicy);
        }

        String devRoleName = getGlobalDeveloperRoleName();
        List<Policy> devPolicies = getPolicyDao().getByRoleId(devRoleName);
        if (devPolicies.size() == 0) {
            Policy developerPolicy = new Policy();
            developerPolicy.setRoleId(devRoleName);
            developerPolicy.setTargetResource(developerResource.getName());
            developerPolicy.setResources(developerResource.getSelfAndDescendantsWithParams(new Param("id", project.getId())));
            developerPolicy.setPermissions(new HashSet<>(asList(READ)));
            policies.add(developerPolicy);
        }
        //create the policies
        if (policies.size() > 0) getPolicyDao().createMultiple(policies);

        Set<String> users = project.getUsers();
        Set<String> editors = project.getEditors();
        Set<String> developers = project.getDevelopers();

        if (users != null && users.size() > 0)
            getUserDao().addRoleToUsers(userRole.getRolePath(), users);
        if (editors != null && editors.size() > 0)
            getUserDao().addRoleToUsers(editorRole.getRolePath(), editors);
        if (developers != null && developers.size() > 0){
            getUserDao().addRoleToUsers(developerRole.getRolePath(), developers);
            getUserDao().addRoleToUsers(devRoleName, developers);
        }


    }

    public String getProjectUserRoleName(Project project) {
        return project.getId() + " user";
    }

    public String getProjectEditorUserRoleName(Project project) {
        return project.getId() + " editor";
    }

    public String getProjectDeveloperUserRoleName(Project project) {
        return project.getId() + " developer";
    }

    public String getGlobalDeveloperRoleName(){
        return "developer";
    }
}
