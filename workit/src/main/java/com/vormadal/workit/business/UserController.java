package com.vormadal.workit.business;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.exceptions.*;

public interface UserController {
    User getUser(String id) throws ValidException, PersistenceException;

    User createUser(User user, boolean generatePassword) throws PersistenceException, ValidException, ElementNotFoundException;

    User loginUser(String Password, String username) throws PersistenceException, BadloginException, MorphiaException;

    void resetPassword(String email) throws ElementNotFoundException, PersistenceException, MorphiaException;

    boolean deleteUser(String userid) throws ValidException, PersistenceException, MorphiaException;

    User updateUser(User user) throws ValidException, PersistenceException, MorphiaException;

    com.vormadal.mongodb.models.ListWithTotal<User> getAllUsers(String query, int page, int size, String orderBy, String order) throws MorphiaException;

    User updateSelf(User user, String viewUserFromRequestContext) throws ValidException, PersistenceException, PermissionDeniedException, MorphiaException;

    User getSelf(String viewUserFromContext) throws ValidException, PersistenceException, ElementNotFoundException, MorphiaException;

    User updateSelfPassword(User user) throws MorphiaException;
}
