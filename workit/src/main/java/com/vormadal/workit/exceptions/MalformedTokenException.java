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
public class MalformedTokenException extends CustomException {
	public MalformedTokenException(String s) {
		super(s, Response.Status.FORBIDDEN);
	}
	private static final long serialVersionUID = -3138351511796759759L;
}
