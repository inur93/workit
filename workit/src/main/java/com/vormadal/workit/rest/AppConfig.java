package com.vormadal.workit.rest;

import com.vormadal.workit.config.CustomObjectMapper;
import com.vormadal.workit.database.DaoRegistry;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("rest/v1")
public class AppConfig extends ResourceConfig{

    public AppConfig(){
        packages("com/vormadal/workit/rest", "com/vormadal/workit/filters", "com/vormadal/workit/exceptions");
       /* register(MultiPartFeature.class);*/
        register(CustomObjectMapper.class);
        /*register(ResponseFilter.class);*/
        property(ServerProperties.OUTBOUND_CONTENT_LENGTH_BUFFER, 0);
        DaoRegistry.getInstance(); //initialize database
    }
}
