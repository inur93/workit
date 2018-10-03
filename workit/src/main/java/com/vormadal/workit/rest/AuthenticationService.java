package com.vormadal.workit.rest;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.exceptions.BadloginException;
import com.vormadal.workit.exceptions.ElementNotFoundException;
import com.vormadal.workit.exceptions.PersistenceException;
import com.vormadal.workit.util.JwtHandler;
import com.vormadal.workit.viewmodels.ViewLoginData;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import static com.vormadal.workit.business.ControllerRegistry.getUserController;

/**
 * Created: 12-05-2018
 * author: Runi
 */
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("authentication")
@Slf4j
public class AuthenticationService {

    @Context
    HttpServletResponse response;

    @POST
    @Path("login")
    public User login(ViewLoginData loginData) throws BadloginException, PersistenceException, MorphiaException {
        User user = getUserController().loginUser(loginData.getUsername(), loginData.getPassword());
        JwtHandler jwtHandler = JwtHandler.getInstance();
        String jwtToken = jwtHandler.createJWT(user, 10000000l);
        response.setHeader("Authorization", "Bearer " + jwtToken);
        return user;
    }

    @POST
    @Path("resetpassword")
    public void resetPassword(String email) throws ElementNotFoundException, PersistenceException, MorphiaException {
        getUserController().resetPassword(email);
    }
}
