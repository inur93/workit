package com.vormadal.workit.exceptions;

import lombok.NoArgsConstructor;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

/**
 * author: Runi,
 * Created: 2018-05-29
 */
@Provider
@NoArgsConstructor
public class MalformedAuthorizationHeaderException extends CustomException{
    public MalformedAuthorizationHeaderException(String s) {
        super(s, Response.Status.FORBIDDEN);
    }
}
