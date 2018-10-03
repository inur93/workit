package com.vormadal.workit.business;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.models.Client;
import com.vormadal.workit.database.models.UserRef;

import java.util.List;
import java.util.Map;

/**
 * Created: 03-09-2018
 * author: Runi
 */

public interface ClientController {

    Client create(Client client) throws MorphiaException;
    Client get(String clientId) throws MorphiaException;

    ListWithTotal<Client> getAll(int page, int size, String order, String orderBy);

    Client update(Client client) throws MorphiaException;

    Map<String, List<UserRef>> getUsersForClient(String id, String query, String group);

    String getClientUserRoleName(Client client);
    String getClientAdminRoleName(Client client);
}
