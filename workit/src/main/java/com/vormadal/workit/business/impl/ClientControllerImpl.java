package com.vormadal.workit.business.impl;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.mongodb.models.Order;
import com.vormadal.workit.business.ClientController;
import com.vormadal.workit.database.models.Client;
import com.vormadal.workit.database.models.UserRef;
import com.vormadal.workit.database.models.security.Policy;
import com.vormadal.workit.database.models.security.Resource;
import com.vormadal.workit.database.models.security.Role;
import com.vormadal.workit.rest.ClientService;

import java.util.*;

import static com.vormadal.workit.database.DaoRegistry.*;
import static com.vormadal.workit.database.models.security.Resource.Param;
import static com.vormadal.workit.util.StringHelper.isNullOrEmpty;
import static dk.agenia.permissionmanagement.models.Permission.*;
import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;

/**
 * Created: 03-09-2018
 * author: Runi
 */

public class ClientControllerImpl implements ClientController {
    @Override
    public Client create(Client client) throws MorphiaException {
        Client created = getClientDao().create(client);

        String userRoleName = getClientUserRoleName(client);
        String adminRoleName = getClientAdminRoleName(client);

        Role userRole = getRoleDao().getByName(userRoleName);
        Role adminRole = getRoleDao().getByName(adminRoleName);

        createDefaultRolesAndPolicies(created, userRole, adminRole);
        return created;
    }

    @Override
    public Client get(String clientId) throws MorphiaException {
        return getClientDao().get(clientId);
    }

    @Override
    public ListWithTotal<Client> getAll(int page, int size, String orderBy, String order) {
        Order o;
        try {
            o = Order.valueOf(order);
        } catch (IllegalArgumentException e) {
            o = Order.ASC;
        }
        return getClientDao().getAllWithTotal(page, size, orderBy, o);
    }

    @Override
    public Client update(Client client) throws MorphiaException {
        Client current = getClientDao().getUsersOnly(client.getId());

        String userRoleName = getClientUserRoleName(client);
        String adminRoleName = getClientAdminRoleName(client);

        Role userRole = getRoleDao().getByName(userRoleName);
        Role adminRole = getRoleDao().getByName(adminRoleName);

        createDefaultRolesAndPolicies(client, userRole, adminRole);

        //compute which users to remove roles from
        Set<String> usersToRemove = current.getUsers();
        if (usersToRemove != null)
            usersToRemove.removeAll(client.getUsers());

        Set<String> adminsToRemove = current.getAdmins();
        if (adminsToRemove != null)
            adminsToRemove.removeAll(client.getAdmins());

        //update user roles
        if (usersToRemove != null && usersToRemove.size() > 0)
            getUserDao().removeRoleFromUsers(userRole.getRolePath(), usersToRemove);
        if (adminsToRemove != null && adminsToRemove.size() > 0)
            getUserDao().removeRoleFromUsers(adminRole.getRolePath(), adminsToRemove);

        return getClientDao().update(client);
    }

    @Override
    public Map<String, List<UserRef>> getUsersForClient(String id, String query, String group) {
        Client client = getClientDao().getUsersOnly(id);
        Map<String, List<UserRef>> users = new HashMap<>();
        Set<String> userList = client.getUsers();
        Set<String> adminList = client.getAdmins();
        boolean getUsers = false;
        boolean getAdmins = false;
        switch (group) {
            case "users":
                getUsers = true;
                break;
            case "admins":
                getAdmins = true;
                break;
            default:
                getAdmins = true;
                getUsers = true;
        }
        boolean useQuery = !isNullOrEmpty(query);
        if (getUsers && userList != null && userList.size() > 0) {
            List<UserRef> list;
            if (useQuery) {
                list = getUserDao().getUserRefs(userList, query);
            } else {
                list = getUserDao().getUserRefs(userList);
            }
            users.put("users", list);
        }
        if (getAdmins && adminList != null && adminList.size() > 0) {
            List<UserRef> list;
            if (useQuery) {
                list = getUserDao().getUserRefs(adminList, query);
            } else {
                list = getUserDao().getUserRefs(adminList);
            }
            users.put("admins", list);
        }
        return users;
    }

    @Override
    public String getClientUserRoleName(Client client) {
        return client.getId() + " user";
    }

    @Override
    public String getClientAdminRoleName(Client client) {
        return client.getId() + " admin";
    }

    private void createDefaultRolesAndPolicies(Client client, Role userRole, Role adminRole) throws MorphiaException {
        Resource clientResource = getResourceDao().getByResourceName(ClientService.Paths.CLIENTS_ID);

        List<Role> roles = new ArrayList<>();
        String userRoleName = getClientUserRoleName(client);

        if (userRole == null) {
            userRole = new Role();
            userRole.setName(userRoleName);
            roles.add(userRole);
        }

        String adminRoleName = getClientAdminRoleName(client);
        if (adminRole == null) {
            adminRole = new Role();
            adminRole.setName(getClientAdminRoleName(client));
            adminRole.setAncestors(asList(userRoleName));
            adminRole.setParentId(userRoleName);
            roles.add(adminRole);
        }
        if (roles.size() > 0) getRoleDao().createMultiple(roles);

        List<Policy> policies = new ArrayList<>();
        List<Policy> clientUserPolicy = getPolicyDao().getByRoleId(userRoleName);
        if (clientUserPolicy.size() == 0) {
            Policy policy = new Policy();
            policy.setRoleId(userRoleName);
            policy.setTargetResource(clientResource.getName());
            policy.setResources(clientResource.getSelfAndDescendantsWithParams(new Param("id", client.getId())));
            policy.setPermissions(new HashSet<>(singletonList(READ)));
            policies.add(policy);
        }

        List<Policy> clientAdminPolicy = getPolicyDao().getByRoleId(adminRoleName);
        if (clientAdminPolicy.size() == 0) {
            Policy policy = new Policy();
            policy.setRoleId(adminRoleName);
            policy.setTargetResource(clientResource.getName());
            policy.setResources(clientResource.getSelfAndDescendantsWithParams(new Param("id", client.getId())));
            policy.setPermissions(new HashSet<>(asList(CREATE, UPDATE)));
            policies.add(policy);
        }
        //create the policies
        if (policies.size() > 0) getPolicyDao().createMultiple(policies);
        // otherwise this is most likely an update and might contain removing roles for some users - thus let caller add and remove roles.
        Set<String> users = client.getUsers();
        Set<String> admins = client.getAdmins();

        if (users != null && users.size() > 0)
            getUserDao().addRoleToUsers(userRole.getRolePath(), new ArrayList<>(users));
        if (admins != null && admins.size() > 0)
            getUserDao().addRoleToUsers(adminRole.getRolePath(), new ArrayList<>(admins));

    }
}
