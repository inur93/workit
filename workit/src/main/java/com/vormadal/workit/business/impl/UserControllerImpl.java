package com.vormadal.workit.business.impl;

import com.mongodb.DuplicateKeyException;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.mongodb.models.Order;
import com.vormadal.workit.business.UserController;
import com.vormadal.workit.config.Config;
import com.vormadal.workit.database.dao.UserDao;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.exceptions.*;
import com.vormadal.workit.util.Mailer;
import com.vormadal.workit.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static com.vormadal.workit.config.Config.NEW_USER_EMAIL_TEMPLATE;
import static com.vormadal.workit.config.Config.NEW_USER__EMAIL_SUBJECT;
import static com.vormadal.workit.database.DaoRegistry.getPolicyDao;
import static com.vormadal.workit.database.DaoRegistry.getUserDao;
import static com.vormadal.workit.util.IdHelper.isValidUUID;
import static com.vormadal.workit.util.UserUtil.generateSaltedHash;
import static com.vormadal.workit.util.UserUtil.verifyPassword;

@Slf4j
public class UserControllerImpl implements UserController {
    private UserDao userDao;

    public UserControllerImpl() {
        this(getUserDao());
    }

    //for testing purposes injecting dummy dao
    protected UserControllerImpl(UserDao dao) {
        userDao = dao;
    }

    @Override
    public User getUser(String id) throws ValidException, PersistenceException {
        try {
            User user = userDao.get(id);
            return user;
        } catch (Exception e) {
            log.error("could not get user.", e);
            throw new PersistenceException("could not get user");
        }
    }

    public User getUser(ObjectId id) throws ValidException, PersistenceException {

        try {
            User user = userDao.get(id);

            return user;
        } catch (MorphiaException e) {
            log.error("could not get user.", e);
            throw new PersistenceException("could not get user");
        }
    }

  /*  public static void main(String[] args) {
        new UserControllerImpl().createUser(User.builder().username("rev").password("rev").email("rev@mail.com").build(), false);
    }*/

    @Override
    public User createUser(User user, boolean generatePassword) throws PersistenceException, ValidException, ElementNotFoundException {

        if (user.getEmail() == null || Objects.equals(user.getEmail(), "") || !user.getEmail().contains("@")) {
            throw new ValidException("Email not valid");
        }

        try {
            if (generatePassword) {
                user = resetUserPasswordAndSendMail(user);
            } else {
                if (user.getPassword() == null || "".equalsIgnoreCase(user.getPassword())) {
                    throw new ValidException("Password can not be empty");
                }
                user.setHash(generateSaltedHash(user.getPassword())); // generate the hash of password
            }
            return userDao.create(user);
        } catch (MorphiaException e) {
            log.error("could not create user", e);
            throw new PersistenceException("could not create user");
        } catch (DuplicateKeyException e) {

            log.debug("Email already exists: " + user.getEmail(), e);
            throw new ValidException("En bruger med samme email eller brugernavn eksisterer allerede");
        }
    }

    private User resetUserPasswordAndSendMail(User user) throws PersistenceException {
        String password = UserUtil.generatePassword(Config.PASSWORD_LENGTH);
        String hash = generateSaltedHash(password);
        user.setHash(hash);
        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("username", user.getEmail());
            variables.put("password", password);
            Mailer.getInstance().sendTemplateMail(user.getEmail(), NEW_USER__EMAIL_SUBJECT, NEW_USER_EMAIL_TEMPLATE, variables);
        } catch (IOException e) {
            throw new PersistenceException("Could not read template file: newUser.mustache");
        }
        return user;
    }

    @Override
    public User loginUser(String username, String password) throws PersistenceException, BadloginException, MorphiaException {
        User byUsername = null;
        //Fetch User

        try {
            byUsername = userDao.getByEmail(username);
        }catch(ElementNotFoundException e){
            throw new BadloginException("Brugernavn eller kode er forkert");
        }

        //Check user status and update if neccesary
        if (byUsername.getStatus() == User.UserStatus.created) {
            byUsername.setStatus(User.UserStatus.active);
            log.debug("Activating use: " + byUsername);
        } else if (byUsername.getStatus() == User.UserStatus.disabled) {
            throw new BadloginException("Bruger er deaktiveret");
        }
        //
        if (verifyPassword(password, byUsername.getHash())) {
            byUsername.setLastLogin(new Date());
            byUsername.setFailedLoginAttempts(0);
            return userDao.updateAll(byUsername);
        } else {
            byUsername.setLastFailedLogin(new Date());
            byUsername.setFailedLoginAttempts(byUsername.getFailedLoginAttempts()+1);
            userDao.updateAll(byUsername);
            throw new BadloginException("Brugernavn eller kode er forkert");
        }
    }

    @Override
    public void resetPassword(String email) throws ElementNotFoundException, PersistenceException, MorphiaException {
        email = email.replace("\"", "");
        User user = userDao.getByEmail(email);
        if (user == null) {
            log.warn("User trying resetting password: " + email);
            //fail silently - could be caused by someone trying figure out which emails are registered in the system
            return;
        }
        log.info("Resetting password for user with email: " + email);
        resetUserPasswordAndSendMail(user);
        userDao.updatePassword(user.getId(), user.getHash());
    }

    @Override
    public boolean deleteUser(String userid) throws ValidException, PersistenceException, MorphiaException {
        if(!isValidUUID(userid)){
            log.warn("Invalid userid: " + userid);
            throw new ValidException("Invalid userid: " + userid);
        }
        try {
            User user = userDao.get(userid);
            if(user == null) throw new ValidException("No user found with id: " + userid);
            if (user.getStatus() == User.UserStatus.created) {
                return userDao.delete(userid);
            } else {
                user.setStatus(User.UserStatus.disabled);
                userDao.updateAll(user);
                return true;
            }
        } catch (ValidException | PersistenceException e) {
            log.error("could not delete user", e);
            throw e;
        }
    }

    @Override
    public User updateUser(User user) throws ValidException, PersistenceException, MorphiaException {
        if(user == null) throw new ValidException("No content provided");
        try {
            userDao.update(user);
        } catch (PersistenceException e) {
            log.error("could not update user", e);
            throw new MorphiaException("User could not be updated");
        }
        return user;
    }

    @Override
    public ListWithTotal<User> getAllUsers(String query,
                                           int page,
                                           int size,
                                           String orderBy,
                                           String order) throws MorphiaException {
        Order orderVal;
        try {
            orderVal = Order.valueOf(order);
        }catch(Exception e){
            orderVal = Order.ASC;
        }
        if(query == null || "".equals(query)) {
            return getUserDao().getAllWithTotal(page, size, orderBy, orderVal);
        }
        Map<String, String> filter = new HashMap<>();
        filter.put("name", query);
        filter.put("email", query);
        return getUserDao().getByFieldsOr(
                filter,
                page,
                size,
                orderBy, orderVal, false);
    }


    @Override
    public User updateSelf(User user, String userId) throws ValidException, PersistenceException, PermissionDeniedException, MorphiaException {
        if (user == null || userId == null) throw new PermissionDeniedException("Permission denied");
        if (Objects.equals(userId, user.getId())) {
           return updateUser(user);
        } else {
            throw new ValidException("user in context does not match user to be updated");
        }
    }



    @Override
    public User getSelf(String userId) throws ValidException, PersistenceException, MorphiaException {
        if (userId == null) return null;
        User user = userDao.get(userId);
        if (user == null) throw new ValidException("User no longer exists");
        user.setPolicies(getPolicyDao().getAccess(user.getRolesFormatted()));
        return user;
    }

    @Override
    public User updateSelfPassword(User user) throws MorphiaException {
        String currentHash = userDao.getHash(user.getId());
        if(verifyPassword(user.getPassword(), currentHash)){
            if(userDao.updatePassword(user.getId(), generateSaltedHash(user.getNewPassword()))){
                return user;
            }
            throw new ValidException("Could not update password");
        }
        throw new ValidException("Current password is incorrect");
    }

}
