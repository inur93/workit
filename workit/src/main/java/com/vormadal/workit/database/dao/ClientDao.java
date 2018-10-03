package com.vormadal.workit.database.dao;

import com.vormadal.workit.database.models.Client;

import java.util.List;

/**
 * Created: 03-09-2018
 * author: Runi
 */

public interface ClientDao extends BaseDao<Client>{

    List<String> getClientUsers(String clientId);
    Client getUsersOnly(String clientId);
}
