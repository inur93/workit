package com.vormadal.workit.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vormadal.workit.database.models.User;
import dk.agenia.permissionmanagement.RestException;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;

/**
 * Created: 12-05-2018
 * author: Runi
 */

@Slf4j
public class JwtHandler {

    private static String defaultKeyBase64 = "5cEtEMIVgZfxTXTEZhuxLDRwUSY3aeEPhNGm6ANrXxwn9MzzxJx5sDWUV0GbYH20Mw4L9fIjNlkWVpRrk8hCEA==";
    private static JwtHandler handler;
    private byte[] secretKey;
    private SignatureAlgorithm alg;

    public static String generateSecret() {
        byte[] keyBytes = MacProvider.generateKey().getEncoded();

        return Base64.getEncoder().encodeToString(keyBytes);
    }

    public JwtHandler(String base64SecretString, SignatureAlgorithm alg) {
        setSecretKey(Base64.getDecoder().decode(base64SecretString));
        this.alg = alg;
    }

    public static JwtHandler getInstance() {
        if (handler == null) {handler = new JwtHandler();}
        return handler;

    }

    private JwtHandler() {
        this(defaultKeyBase64, SignatureAlgorithm.HS512);
    }

    /**
     * @param user      is added to token
     * @param loginDuration in seconds
     * @return test
     */
    public String createJWT(User user, Long loginDuration) {
        JwtBuilder builder = Jwts.builder();
        builder.claim("user", user.claims());
        builder.setIssuedAt(new Date());
        builder.setExpiration(new Date(System.currentTimeMillis() + 1000*loginDuration));
        builder.signWith(alg, getSecretKey());
        String token = builder.compact();
        return token;
    }


    public User decodeUser(String jwtString) throws JsonProcessingException, RestException {
        //Get claims object from JWT-token - throws exceptions if expired or permission denied
        Object claim = Jwts
                .parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(jwtString)
                .getBody()
                .get("user");
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(mapper.writeValueAsString(claim), User.class);
        } catch (IOException e) {
            throw new RestException("Cannot parse user from token", Response.Status.BAD_REQUEST);
        }
    }

    public byte[] getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(byte[] secretKey) {
        this.secretKey = secretKey;
    }

}

