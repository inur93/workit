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
public class TokenValidationException extends CustomException{

	private static final long serialVersionUID = -8047657265110750231L;

	public TokenValidationException(String errorString) {
		super(errorString, Response.Status.UNAUTHORIZED);
	}

}
