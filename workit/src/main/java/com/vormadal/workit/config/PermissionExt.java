package com.vormadal.workit.config;

import dk.agenia.permissionmanagement.models.Permission;

import java.util.Arrays;
import java.util.List;

/**
 * Created: 14-09-2018
 * author: Runi
 */

public class PermissionExt {
    public static final String TIME_REGISTRATION = "timeRegistration";
    public static List<String> getAllPermissions() {
        return Arrays.asList(
                Permission.CREATE,
                Permission.READ,
                Permission.UPDATE,
                Permission.DELETE,
                Permission.ADMIN,
                PermissionExt.TIME_REGISTRATION);
    }
}
