package com.vormadal.workit.exceptions;

import lombok.NoArgsConstructor;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

@Provider
@NoArgsConstructor
public class BadloginException extends CustomException {
    public BadloginException(String msg) {
        super(msg, Response.Status.UNAUTHORIZED);
    }

}
