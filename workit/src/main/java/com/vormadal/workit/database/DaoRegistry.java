package com.vormadal.workit.database;

import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MorphiaHandler;
import com.vormadal.mongodb.SetupHandler;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.options.DaoOptions;
import com.vormadal.mongodb.options.DbOptions;
import com.vormadal.workit.business.impl.ResourceControllerImpl;
import com.vormadal.workit.config.Config;
import com.vormadal.workit.config.PermissionExt;
import com.vormadal.workit.database.dao.*;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.database.models.security.Policy;
import com.vormadal.workit.database.models.security.Resource;
import com.vormadal.workit.database.models.security.Role;
import com.vormadal.workit.database.mongo.*;
import com.vormadal.workit.exceptions.PersistenceException;
import com.vormadal.workit.rest.AppConfig;
import com.vormadal.workit.util.Mailer;
import com.vormadal.workit.util.UserUtil;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.*;

import static com.vormadal.workit.config.Config.*;

/**
 * Created: 31-08-2018
 * author: Runi
 */
@Slf4j
public class DaoRegistry implements DbProvider, SetupHandler {

    private static DaoRegistry instance;
    private MorphiaHandler morphiaHandler;

    static {
        instance = new DaoRegistry();
    }
    public static DaoRegistry getInstance() {
        if(instance == null) {
            instance = new DaoRegistry();
        }
        return instance;
    }

    private DaoRegistry() {
        try {
            morphiaHandler = new MorphiaHandler(this, new DbOptions()
                    .database("workit")
                    .modelsPackages("com.vormadal.restservice.database.models"));
        } catch (MorphiaException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSetup(MorphiaHandler morphiaHandler) {
        this.morphiaHandler = morphiaHandler;
        String superUserEmail = PORTAL_SUPER_USER_EMAIL;
        if (superUserEmail==null){
            log.debug("No superuseremail set: ");
        }

        try {
            this.createAdminRoleAndPolicyPolicy("admin");
        } catch (MorphiaException e) {
            log.error("could not create admin policies and role");
        }

        if(superUserEmail != null) {
            User user = new MongoUserDao(this).getByEmail(superUserEmail);

            if (user == null) {
                log.warn("MorphiaHandle found no SuperUser - creating one");
                String randompass = UserUtil.generatePassword(Config.PASSWORD_LENGTH);
                String passhash = UserUtil.generateSaltedHash(randompass);
                User superUser = User.builder().email(superUserEmail)
                        .hash(passhash)
                        .build();
                try {
                    new MongoUserDao(this).create(superUser);
                } catch (MorphiaException e) {
                    log.error("could not create super user", e);
                    return;
                }
                Map<String, Object> variables = new HashMap<>();
                variables.put("username", superUserEmail);
                variables.put("password", randompass);
                try {
                    Mailer.getInstance().sendTemplateMail(superUserEmail, NEW_USER__EMAIL_SUBJECT, NEW_USER_EMAIL_TEMPLATE, variables);
                } catch (IOException e) {
                    log.error("Failed reading template:", e);
                    throw new PersistenceException(e.getMessage());
                }
            }
        }
    }

    private void createAdminRoleAndPolicyPolicy(String adminRoleName) throws MorphiaException {

        RoleDao roleDao = new MongoRoleDao(this);
        PolicyDao policyDao = new MongoPolicyDao(this);
        List<Resource> resources = createResources();

        if(roleDao.getByName(adminRoleName) == null) {
            Role adminRole = new Role();
            adminRole.setName(adminRoleName);
            roleDao.create(adminRole);
        }

        if(policyDao.getByRoleId(adminRoleName).size() == 0) {
            Policy admin = new Policy();
            admin.setPermissions(new HashSet<>(PermissionExt.getAllPermissions()));
            admin.setRoleId(adminRoleName);
            admin.setResources(new ArrayList<>());

            for (Resource resource : resources) {
                admin.getResources().add(resource.getNameWithWildcardParams());
            }

            policyDao.create(admin);
        }
    }

    private List<Resource> createResources() throws MorphiaException {
        ResourceDao resourceDao = new MongoResourceDao(this);
        List<Resource> all = resourceDao.getAll();
        if(all == null || all.size() == 0) {
            Set<Resource> resources = new ResourceControllerImpl().generateResources(new AppConfig().getClasses().toArray(new Class[0]), null);
            all = resourceDao.createMultiple(new ArrayList<>(resources));
        }
        return all;
    }


    @Override
    public MorphiaHandler getDb() {
        return this.morphiaHandler;
    }

    @Override
    public DaoOptions getDaoOptions() {
        return null;
    }

    private static PolicyDao policyDao;
    private static ResourceDao resourceDao;
    private static RoleDao roleDao;
    private static UserDao userDao;
    private static ClientDao clientDao;
    private static ProjectDao projectDao;
    private static CaseDao caseDao;
    private static MongoCounterDao counterDao;
    private static TimeRegistrationDao timeRegistrationDao;

    public static PolicyDao getPolicyDao() {
        if (policyDao == null) policyDao = new MongoPolicyDao(getInstance());
        return policyDao;
    }

    public static ResourceDao getResourceDao() {
        if (resourceDao == null) resourceDao = new MongoResourceDao(getInstance());
        return resourceDao;
    }

    public static RoleDao getRoleDao() {
        if (roleDao == null) roleDao = new MongoRoleDao(getInstance());
        return roleDao;
    }

    public static UserDao getUserDao() {
        if (userDao == null) userDao = new MongoUserDao(getInstance());
        return userDao;
    }

    public static ClientDao getClientDao() {
        if (clientDao == null) clientDao = new MongoClientDao(getInstance());
        return clientDao;
    }

    public static ProjectDao getProjectDao() {
        if (projectDao == null) projectDao = new MongoProjectDao(getInstance());
        return projectDao;
    }

    public static CaseDao getCaseDao() {
        if (caseDao == null) caseDao = new MongoCaseDao(getInstance());
        return caseDao;
    }

    public static MongoCounterDao getCounterDao() {
        if (counterDao == null) counterDao = new MongoCounterDao(getInstance());
        return counterDao;
    }

    public static TimeRegistrationDao getTimeRegistrationDao() {
        if (timeRegistrationDao == null) timeRegistrationDao = new MongoTimeRegistrationDao(getInstance());
        return timeRegistrationDao;
    }
}
