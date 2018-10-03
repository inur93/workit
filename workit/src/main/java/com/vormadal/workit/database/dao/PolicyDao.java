package com.vormadal.workit.database.dao;


import com.vormadal.workit.database.models.security.Policy;

import java.util.List;
import java.util.Set;

/**
 * Created: 09-05-2018
 * author: Runi
 */
public interface PolicyDao extends BaseDao<Policy>{

    void deleteByRoleId(String id);

    List<Policy> getByRoleId(String roleId);

    List<Policy> getByRoleIds(Set<String> roles);

    List<Policy> getAccess(Set<String> roles);

    boolean hasAccess(String resourceRegex, Set<String> roles, Set<String> permissions);
}
