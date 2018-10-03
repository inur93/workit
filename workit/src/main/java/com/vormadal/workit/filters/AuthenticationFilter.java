package com.vormadal.workit.filters;

import com.vormadal.workit.database.models.User;
import com.vormadal.workit.exceptions.PersistenceException;
import com.vormadal.workit.exceptions.ValidException;
import com.vormadal.workit.util.UserUtil;
import dk.agenia.permissionmanagement.RestException;
import dk.agenia.permissionmanagement.filters.BaseAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.ext.Provider;
import java.util.Set;

import static com.vormadal.workit.business.ControllerRegistry.getPolicyController;
import static com.vormadal.workit.business.ControllerRegistry.getUserController;

/**
 * Created: 24-04-2018
 * author: Runi
 */
@Slf4j
@Priority(Priorities.AUTHENTICATION)
@Provider
public class AuthenticationFilter extends BaseAuthenticationFilter<User> {


    public AuthenticationFilter(){}

    @Override
    protected boolean hasAccess(String resourceRegex, Set<String> roles, Set<String> permissions) throws RestException {
        return getPolicyController().hasAccess(resourceRegex, roles, permissions);
    }


    @Override
    public User getUser(ContainerRequestContext requestContext) throws RestException {
        String userId = UserUtil.getUserIdFromContext(requestContext);
        if(userId == null) return null;
        try {
            return getUserController().getUser(userId);
        } catch (ValidException | PersistenceException e) {
            log.error("could not get user", e);
        }
        return null;
    }
}
