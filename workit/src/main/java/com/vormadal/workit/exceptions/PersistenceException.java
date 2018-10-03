package com.vormadal.workit.exceptions;

import lombok.NoArgsConstructor;

import javax.ws.rs.ext.Provider;

import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

/**
 * author: Runi,
 * Created: 2018-05-29
 */
@Provider
@NoArgsConstructor
public class PersistenceException extends CustomException {
    public PersistenceException(String message) {
        super(message, INTERNAL_SERVER_ERROR);
    }
}
