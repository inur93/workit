package com.vormadal.workit.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.vormadal.workit.config.Config;
import com.vormadal.workit.database.models.User;
import dk.agenia.permissionmanagement.RestException;
import lombok.extern.slf4j.Slf4j;
import org.mindrot.jbcrypt.BCrypt;

import javax.ws.rs.container.ContainerRequestContext;
import java.util.Random;

@Slf4j
public class UserUtil {


    public static String generatePassword(int length) {
        String password = "";
        Random r = new Random();
        for (int i = 0; i < length; i++) {
            password += (char) ((byte) r.nextInt(26) + 65);
        }
        return password;
    }

    public static String generateSaltedHash(String passWord) {
        return BCrypt.hashpw(passWord, BCrypt.gensalt());
    }

    public static boolean verifyPassword(String password, String hash) {
        if(password == null || hash == null) return false;
        return BCrypt.checkpw(password, hash);
    }

    public static User getUserFromContext(ContainerRequestContext rq){
        Object property = rq.getProperty(Config.CONTEXT_USER_KEY);
        if (property instanceof User) {
            User user = (User) property;
            return user;
        } else {
            String bearer = rq.getHeaderString("authorization");
            if (bearer == null || bearer.length() < 2) return null;
            String token = bearer.split(" ")[1];
            try {
                User user = JwtHandler.getInstance().decodeUser(token);
                if (user != null)
                    return user;
            } catch (RestException | JsonProcessingException e) {
                log.warn("could not decode user", e);
            }
            return null;
        }
    }
    public static String getUserIdFromContext(ContainerRequestContext rq) {
        User user = getUserFromContext(rq);
        if(user == null) return null;
        return user.getId();
    }
}
