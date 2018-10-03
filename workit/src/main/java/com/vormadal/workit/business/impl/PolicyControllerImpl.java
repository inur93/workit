package com.vormadal.workit.business.impl;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.business.PolicyController;
import com.vormadal.workit.database.models.security.Policy;
import com.vormadal.workit.database.models.security.Role;
import com.vormadal.workit.exceptions.ElementNotFoundException;
import com.vormadal.workit.exceptions.PermissionDeniedException;
import com.vormadal.workit.exceptions.ValidException;

import java.util.List;
import java.util.Set;

import static com.vormadal.workit.database.DaoRegistry.getPolicyDao;
import static com.vormadal.workit.database.DaoRegistry.getRoleDao;

/**
 * Created: 15-09-2018
 * author: Runi
 */

public class PolicyControllerImpl implements PolicyController {


    @Override
    public Policy updatePolicy(String policyId, Policy policy) throws Exception {
        validatePolicy(policy);
        if(!policyId.equals(policy.getId())) throw new ValidException("Provided policy ids do not match");
        return getPolicyDao().update(policy);
    }

    @Override
    public void deletePolicy(String id, Policy policy) throws Exception {
        getPolicyDao().delete(id);
    }

    @Override
    public Policy createPolicyForRole(String roleId, Policy policy) throws MorphiaException {

            validatePolicy(policy);
            Role role = getRoleDao().get(roleId);
            if(role == null) throw new ElementNotFoundException("Role with id " + roleId + " no longer exists");

            policy.setRoleId(roleId);

        return getPolicyDao().create(policy);

    }

    @Override
    public List<Policy> getPoliciesForRole(String roleId) {
        return getPolicyDao().getByRoleId(roleId);
    }

    @Override
    public boolean hasAccess(String resourceRegex, Set<String> roles, Set<String> permissions) {
        if(getPolicyDao().hasAccess(resourceRegex, roles, permissions)){
            return true;
        }else{
            throw new PermissionDeniedException("Permission denied. Contact administrators for access");
        }
    }

    private void validatePolicy(Policy policy) throws ValidException{
        if(policy == null) throw new ValidException("The provided policy is empty");
        if(policy.getResources() == null || policy.getResources().size() == 0) throw new ValidException("The policy has no resource");
    }

}
