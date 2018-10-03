package com.vormadal.workit.database.dao;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.database.models.UserRef;
import com.vormadal.workit.exceptions.ElementNotFoundException;
import com.vormadal.workit.exceptions.PersistenceException;

import java.util.Collection;
import java.util.List;

public interface UserDao extends BaseDao<User> {


    User getByEmail(String email) throws PersistenceException, ElementNotFoundException;

    UserRef getUserRef(String id);

    List<UserRef> getUserRefs(Collection<String> userIds);
    List<UserRef> getUserRefs(Collection<String> userIds, String query);

    void addRoleToUsers(String name, Collection<String> collect);
    void removeRoleFromUsers(String clientUserRoleName, Collection<String> usersToRemove);

    List<UserRef> queryByPartialRole(String partialRole, String query, List<String> asList);
    String getHash(String id);
    boolean updatePassword(String userId, String hash);



}
