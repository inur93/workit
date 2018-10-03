package com.vormadal.workit.exceptions;

import com.vormadal.workit.database.models.JsonErrorMessage;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;

/**
 * Created: 29-05-2018
 * author: Runi
 */

public abstract class CustomException extends WebApplicationException implements ExceptionMapper<CustomException> {
    private Response.Status status;

    public CustomException(){
        System.out.println("meant for mapper only");
    }

    public CustomException(String s, Response.Status status) {
        super(s);
        this.status = status;
    }

    @Override
    public Response toResponse(CustomException exception) {
        Response.Status status = exception.status;
        if(status == null) status = Response.Status.INTERNAL_SERVER_ERROR;
        return Response
                .status(exception.status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new JsonErrorMessage(exception.getMessage(), status.getStatusCode()))
                .build();
    }

}
