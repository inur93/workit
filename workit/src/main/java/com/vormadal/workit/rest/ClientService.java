package com.vormadal.workit.rest;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.business.ControllerRegistry;
import com.vormadal.workit.database.models.Client;
import com.vormadal.workit.database.models.ListWithTotal;
import com.vormadal.workit.database.models.Project;
import com.vormadal.workit.database.models.UserRef;
import com.vormadal.workit.exceptions.ValidException;
import dk.agenia.permissionmanagement.annotations.Secured;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;

import static com.vormadal.workit.business.ControllerRegistry.getClientController;
import static com.vormadal.workit.business.ControllerRegistry.getProjectController;

/**
 * Created: 03-09-2018
 * author: Runi
 */
@Secured
@Path("/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientService {

    public static class Paths {
        public static final String CLIENTS = "clients";
        public static final String CLIENTS_ID = "clients/{id}";
        public static final String CLIENTS_ID_PROJECTS = "clients/{id}/projects";
        public static final String CLIENTS_ID_USERS = "clients/{id}/users";

    }

    @POST
    public Client create(Client client) throws MorphiaException {
        return getClientController().create(client);
    }

    @GET
    @Path("{id}")
    public Client get(@PathParam("id") String id) throws MorphiaException {
        return getClientController().get(id);
    }

    @PUT
    @Path("{id}")
    public Client update(@PathParam("id") String id, Client client) throws MorphiaException {
        if (id.equals(client.getId()))
            return getClientController().update(client);
        throw new ValidException("Resource and element does not match");
    }

    @GET
    @Path("{id}/users")
    public Map<String, List<UserRef>> getUsersForClient(@PathParam("id") String id,
                                                        @QueryParam("query") String query,
                                                        @QueryParam("group") @DefaultValue("all") String group) {
        return getClientController().getUsersForClient(id, query, group);
    }

    @GET
    public ListWithTotal<Client> get(@QueryParam("page") @DefaultValue("0") int page,
                                     @QueryParam("size") @DefaultValue("10") int size,
                                     @QueryParam("order") @DefaultValue("ASC") String order,
                                     @QueryParam("orderBy") @DefaultValue("_id") String orderBy) {
        return new ListWithTotal<>(getClientController().getAll(page, size, orderBy, order));
    }


    @GET
    @Path("{id}/projects")
    public ListWithTotal<Project> getProjects(@PathParam("id") String clientId,
                                              @QueryParam("page") @DefaultValue("0") int page,
                                              @QueryParam("size") @DefaultValue("10") int size,
                                              @QueryParam("order") @DefaultValue("_id") String order,
                                              @QueryParam("orderBy") @DefaultValue("ASC") String orderBy) {
        return new ListWithTotal<>(
                ControllerRegistry.getProjectController().getByClientId(clientId, page, size, order, orderBy));
    }

    @POST
    @Path("{id}/projects")
    public Project createProject(@PathParam("id") String id, Project project) throws MorphiaException {
        if(project != null) project.setClientId(id);
        return getProjectController().create(project);
    }
}
