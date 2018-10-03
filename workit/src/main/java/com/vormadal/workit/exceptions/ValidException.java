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
public class ValidException extends CustomException {

    private InvalidType type;

    public ValidException(String msg, InvalidType type){
        super(msg, Response.Status.BAD_REQUEST);
        this.type = type;
    }
    public ValidException(String msg){
        this(msg, InvalidType.UNSPECIFIED);
    }

    public InvalidType getType() {
        return type;
    }

    public enum InvalidType{
        ISBN, UNNAMED, WRONG_EXTENSION, NOT_A_FILE, UNSPECIFIED
    }

}

