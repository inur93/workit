package com.vormadal.workit.business;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.models.security.Policy;

import java.util.List;
import java.util.Set;

/**
 * Created: 15-09-2018
 * author: Runi
 */

public interface PolicyController {

    Policy updatePolicy(String policyId, Policy policy) throws Exception;

    void deletePolicy(String id, Policy policy) throws Exception;

    Policy createPolicyForRole(String id, Policy policy) throws MorphiaException;

    List<Policy> getPoliciesForRole(String roleId);

    boolean hasAccess(String resourceRegex, Set<String> roles, Set<String> permissions);
}
