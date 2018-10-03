package com.vormadal.workit.rest;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.models.*;
import com.vormadal.workit.exceptions.ValidException;
import dk.agenia.permissionmanagement.annotations.Secured;

import javax.ws.rs.*;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;

import static com.vormadal.workit.business.ControllerRegistry.*;
import static com.vormadal.workit.util.UserUtil.getUserIdFromContext;

/**
 * Created: 03-09-2018
 * author: Runi
 */
@Secured
@Path("/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProjectService {

    public static class Paths {
        public static final String PROJECTS = "projects";
        public static final String PROJECTS_ID = "projects/{id}";
        public static final String PROJECTS_ID_CASES = "projects/{id}/cases";
        public static final String PROJECTS_ID_CASES_CID = "projects/{id}/cases/{cid}";
        public static final String PROJECTS_ID_CASES_CID_TIMEREGISTRATION = "projects/{id}/cases/{cid}/timeregistration";
        public static final String PROJECTS_ID_USERS = "projects/{id}/users";
    }
    @Context
    private ContainerRequestContext context;

    @POST
    @Path("{id}/cases")
    public Case createCase(@PathParam("id") String projectId, Case aCase) throws MorphiaException {
        aCase.setProjectId(projectId); //prevent creating case for project that is not accessible
        return getCaseController().createCase(aCase, getUserIdFromContext(context));
    }

    @POST
    @Path("{id}/cases/{cid}/timeregistration")
    @Secured(requires = "timeRegistration")
    public TimeRegistration registerTime(@PathParam("id") String projectId,
                                         @PathParam("cid") String caseId, TimeRegistration registration) throws MorphiaException {
        registration.setCaseId(caseId);
        registration.setProjectId(projectId);

        return getTimeRegistrationController().create(projectId, caseId, registration, getUserIdFromContext(context));
        //return ControllerRegistry.getTimeRegistrationController().create(projectId, caseId, registration);
    }

    @GET
    public ListWithTotal<Project> get(@QueryParam("page") int page,
                                      @QueryParam("size") int size,
                                      @QueryParam("order") String order,
                                      @QueryParam("orderBy") String orderBy) {
        com.vormadal.mongodb.models.ListWithTotal<Project> all = getProjectController().getAll(page, size, orderBy, order);
        return new ListWithTotal<>(all);
    }

    @GET
    @Path("{id}")
    public Project get(@PathParam("id") String id) throws MorphiaException {
        return getProjectController().get(id);
    }

    @GET
    @Path("{id}/cases")
    public ListWithTotal<Case> getCases(@PathParam("id") String projectId,
                               @QueryParam("page") int page,
                               @QueryParam("size") int size,
                               @QueryParam("order") String order,
                               @QueryParam("orderBy") String orderBy){
        return new ListWithTotal<>(getCaseController().getCases(projectId, page, size, orderBy, order));
    }

    @GET
    @Path("{id}/users")
    public Map<String, List<UserRef>> getUsers(@PathParam("id") String id,
                                               @QueryParam("query") String query,
                                               @QueryParam("group") @DefaultValue("all") String group) throws MorphiaException {
        return getProjectController().getUsers(id, query, group);
    }

    @GET
    @Path("{id}/cases/{cid}")
    public Case getCase(@PathParam("id") String projectId, @PathParam("cid") String caseId) throws MorphiaException {
        return getCaseController().getCase(projectId, caseId);
    }

    @PUT
    @Path("{id}")
    public Project update(@PathParam("id") String id, Project project) throws MorphiaException {
        if (!id.equals(project.getId()) && !id.equals(project.getId()))
            throw new ValidException("Resource does not match the project to be saved");
        return getProjectController().update(project);
    }

    @PUT
    @Path("{id}/configuration")
    public Project.ProjectConfiguration updateConfiguration(@PathParam("id") String id, Project.ProjectConfiguration configuration){
        return getProjectController().updateConfiguration(id, configuration);
    }

    @PUT
    @Path("{id}/cases/{cid}")
    public Case updateCase(@PathParam("id") String projectId, @PathParam("cid") String caseId, Case aCase) throws MorphiaException {
        return getCaseController().updateCase(projectId, aCase, getUserIdFromContext(context));
    }
}
