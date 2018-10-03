package com.vormadal.workit.config;

import static dk.agenia.configservice.Configuration.get;
import static dk.agenia.configservice.Configuration.getBool;

/** Global configuration
 * Created by Christian on 28-04-2017.
 */
public class Config {



    //service paths
    public static final int PASSWORD_LENGTH = 16;

    //Authentication
    public static final String CONTEXT_USER_KEY = "user";


    public static final Long loginDuration = 60L *300L; //60 * 300 = 1*300 = 5 hours

    //general
    public static final String PORTAL_SUPER_USER_EMAIL = get("super_user_email");
    public static final String DUMMY_PASS = get("dummy_password"); //for dev environment



    //email
    public static final boolean SEND_MAIL = getBool("mail.send_mail", false);
    public static final String SYSTEM_MAIL_SENDER = get("mail.mail_sender");
    public static final String MAIL_USER = get("mail.user");
    public static final String MAIL_PASSWORD = get("email.password");
    public static final String SMTP_SERVER = get("email.smtp_server", "localhost");
    public static final String SMTP_PORT = get("email.smtp_port", "8080");

    public static final String NEW_USER__EMAIL_SUBJECT = get("new_user_subject", "Ny bruger oprettet");
    public static final String NEW_USER_EMAIL_TEMPLATE = get("new_user_email_template", "newUser.mustache");



    //mongo
    public static final String DATA_DB_DTO = "com.vormadal.restservice.database.models";//Package for Morphia DTO's
    public static final String MONGODB_URI = get("mongodb_uri");

    //projects
    public static final String DEFAULT_STATUS = get("projects.default_status");
    public static final String DEFAULT_PRIORITY = get("projects.default_priority");

}
