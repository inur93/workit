package com.vormadal.workit.rest;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.business.impl.ResourceControllerImpl;
import com.vormadal.workit.database.models.*;
import com.vormadal.workit.database.models.security.Policy;
import com.vormadal.workit.database.models.security.Resource;
import com.vormadal.workit.database.models.security.Role;
import com.vormadal.workit.exceptions.ElementNotFoundException;
import com.vormadal.workit.exceptions.PermissionDeniedException;
import com.vormadal.workit.exceptions.PersistenceException;
import com.vormadal.workit.exceptions.ValidException;
import dk.agenia.permissionmanagement.annotations.Secured;
import dk.agenia.permissionmanagement.services.PermissionManagementService;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Context;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static com.vormadal.workit.business.ControllerRegistry.*;
import static com.vormadal.workit.util.UserUtil.getUserIdFromContext;

/**
 * Created: 09-05-2018
 * author: Runi
 */
@SuppressWarnings("unchecked")
@Path("/management")
@Secured
public class ManagementService extends PermissionManagementService<User, Policy, Resource, Role> {

    public static class Paths {
        public static final String MANAGEMENT = "management";
        public static final String MANAGEMENT_PERMISSIONS = "management/permissions";
        public static final String MANAGEMENT_RESOURCES = "management/resources";
        public static final String MANAGEMENT_ROLES = "management/roles";
        public static final String MANAGEMENT_ROLES_ID = "management/roles/{id}";
        public static final String MANAGEMENT_ROLES_ID_POLICY = "management/roles/{id}/policies";
        public static final String MANAGEMENT_ROLES_ID_POLICY_PID = "management/roles/{id}/policies/{pid}";
        public static final String MANAGEMENT_USERS = "management/users";
        public static final String MANAGEMENT_USERS_SELF = "management/users/self";
        public static final String MANAGEMENT_USERS_SELF_PROJECTS = "management/users/self/projects";
        public static final String MANAGEMENT_USERS_SELF_CASES = "management/users/self/cases";
        public static final String MANAGEMENT_USERS_SELF_TIMEREGISTRATIONS = "management/users/self/timeregistrations";
        public static final String MANAGEMENT_USERS_ID = "management/users/{id}";
    }
    @Context
    Application application;

    @Context
    ContainerRequestContext context;

    @Override
    public Set<Resource> getResources(String update) throws Exception {
        Set<Resource> resources = new ResourceControllerImpl().generateResources(application.getClasses().toArray(new Class[0]), null);
        return getResourceController().getResources();
    }

    @Override
    public ListWithTotal<Role> getRoles(
            String query,
            int page,
            int size,
            String orderBy,
            String order,
            boolean includeUserRoles) throws Exception {
        com.vormadal.mongodb.models.ListWithTotal<Role> roles = getRoleController()
                .getRoles(query, page, size, orderBy, order, includeUserRoles);
        return new com.vormadal.workit.database.models.ListWithTotal<>(roles) ;
    }

    @Override
    public Role createRole(Role role) throws Exception {
        return getRoleController().createRole(role);
    }

    @Override
    public Role getRole(String id) throws Exception {
        return getRoleController().getRole(id);
    }

    @Override
    public Role updateRole(String id, Role role) throws Exception {
        return getRoleController().updateRole(id, role);
    }

    @Override
    public void deleteRole(String id, Role role) throws Exception {
        getRoleController().deleteRole(id, role);
    }

    @Override
    public Policy createPolicyForRole(String id, Policy policy) throws Exception {
        return getPolicyController().createPolicyForRole(id, policy);
    }

    @Override
    public List<Policy> getPoliciesForRole(String roleId) throws Exception {
        return getPolicyController().getPoliciesForRole(roleId);
    }

    @Override
    public Policy updatePolicy(String roleId, String policyId, Policy policy) throws Exception {
        return getPolicyController().updatePolicy(policyId, policy);
    }

    @Override
    public void deletePolicy(String roleId, String policyId, Policy policy) throws Exception {
        getPolicyController().deletePolicy(policyId, policy);
    }

    @Override
    public ListWithTotal<User> getUsers(String query, int page, int size, String orderBy, String order) throws Exception {
        return new ListWithTotal<>(getUserController().getAllUsers(query, page, size, orderBy, order));
    }

    @Override
    public User createUser(User user) throws Exception {
        return getUserController().createUser(user, user.getPassword() == null || "".equals(user.getPassword()));
    }

    @Override
    public User getUser(String id) throws Exception {
        return getUserController().getUser(id);
    }

    @Override
    public User updateUser(String id, User user) throws Exception {
        if(id != user.getId()){
            throw new ValidException("User ids do not match");
        }
        return getUserController().updateUser(user);
    }

    @Override
    public void deleteUser(String id, User user) throws Exception {
        getUserController().deleteUser(id);
    }

    @GET
    @Path("/users/self") @Secured(useDefault = false) //disable security - no permission required to get self
    public User getSelf() throws ValidException, PersistenceException, ElementNotFoundException, MorphiaException {
        return getUserController().getSelf(getUserIdFromContext(context));
    }


    @GET
    @Path("/users/self/projects") @Secured(useDefault = false)
    public ListWithTotal<Project> getUserProjects() throws MorphiaException {
        return new com.vormadal.workit.database.models.ListWithTotal<>(getProjectController().getByUser(getUserIdFromContext(context)));
    }

    @PUT
    @Path("/users/self") @Secured(useDefault = false)
    public User updateSelf(User user) throws ValidException, PersistenceException, PermissionDeniedException, MorphiaException {
        return getUserController().updateSelf(user, getUserIdFromContext(context));
    }

    @PUT
    @Path("/users/self/resetpassword") @Secured(useDefault = false)
    public User updatePassword(User user) throws MorphiaException {
        if(user == null) throw new ValidException("no content. Contact administrators");
        if(!user.getId().equals(getUserIdFromContext(context))) throw new ValidException("Invalid user");
        return getUserController().updateSelfPassword(user);
    }

    @GET
    @Path("/users/self/cases") @Secured(useDefault = false)
    public ListWithTotal<Case> getOwnCases(@QueryParam("query") String query,
                                           @QueryParam("page") int page,
                                           @QueryParam("size") int size,
                                           @QueryParam("orderBy") String orderBy,
                                           @QueryParam("order") String order){
        return new ListWithTotal<>(getCaseController().getCasesForSelf(getUserIdFromContext(context), query, page, size, orderBy, order));
    }

    @GET
    @Path("/users/self/timeregistrations")
    public List<TimeRegistration> getTimeRegistrations(@QueryParam("from") long from,
                                                       @QueryParam("to") long to){
        return getTimeRegistrationController().getTimeRegistrationsForUser(getUserIdFromContext(context), new Date(from), new Date(to));
    }
}
