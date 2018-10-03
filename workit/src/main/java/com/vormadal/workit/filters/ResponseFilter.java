package com.vormadal.workit.filters;

import com.vormadal.workit.database.models.User;
import dk.agenia.permissionmanagement.RestException;
import dk.agenia.permissionmanagement.controllers.ResourceController;
import dk.agenia.permissionmanagement.filters.BaseOwnerAccessFilter;
import dk.agenia.permissionmanagement.models.Role;
import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.container.ContainerRequestContext;
import java.util.Set;

import static com.vormadal.workit.util.UserUtil.getUserFromContext;

/**
 * Created: 16-05-2018
 * author: Runi
 */
@Slf4j
public class ResponseFilter extends BaseOwnerAccessFilter<User, Role> {



    @Override
    public ResourceController getResourceController() {
        return null;
    }

    @Override
    public Role getUserRole(ContainerRequestContext requestContext) throws RestException {
        User user = getUserFromContext(requestContext);
        return Role.builder()
                .name(user.getUsername())
                .build();
    }

    @Override
    public void grantAccess(Role userRole, String genericResource, String targetResource, Set allowedPermissions) throws Exception {
        //TODO implement if using OwnerAccess
    }


}
