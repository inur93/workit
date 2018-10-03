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
public class PermissionExpiredException extends CustomException {

	private static final long serialVersionUID = -5166166631471672451L;

	public PermissionExpiredException(String msg) {
		super(msg, Response.Status.FORBIDDEN);
	}
}
