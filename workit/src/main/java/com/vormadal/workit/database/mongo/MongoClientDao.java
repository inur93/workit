package com.vormadal.workit.database.mongo;

import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.dao.ClientDao;
import com.vormadal.workit.database.models.Client;

import java.util.ArrayList;
import java.util.List;


/**
 * Created: 03-09-2018
 * author: Runi
 */

public class MongoClientDao extends MongoBaseDao<Client> implements ClientDao {

    public MongoClientDao(DbProvider provider) {
        super(provider, Client.class);
    }

    @Override
    public List<String> getClientUsers(String clientId) {
        Client client = query().field("_id").equal(clientId)
                .project("users", true)
                .project("admins", true)
                .get();
        List<String> users = new ArrayList<>();
        if (client.getUsers() != null) users.addAll(client.getUsers());
        if (client.getAdmins() != null) users.addAll(client.getAdmins());
        return users;
    }

    public Client getUsersOnly(String clientId) {
        return query().field("_id").equal(clientId)
                .project("users", true)
                .project("admins", true)
                .get();
    }

    @Override
    public Client update(Client client) throws MorphiaException {
        return updateAll(client);
    }
}
