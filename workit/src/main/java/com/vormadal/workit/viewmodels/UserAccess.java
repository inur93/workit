package com.vormadal.workit.viewmodels;

import dk.agenia.permissionmanagement.models.Permission;
import dk.agenia.permissionmanagement.models.Resource;
import lombok.Builder;
import lombok.Data;

/**
 * Created: 03-06-2018
 * author: Runi
 */

@Data @Builder
public class UserAccess {
    private Resource resource;
    private Permission permission;
    private boolean hasAccess;
}
