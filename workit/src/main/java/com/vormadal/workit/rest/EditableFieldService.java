package com.vormadal.workit.rest;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.DaoRegistry;
import com.vormadal.workit.database.models.SimpleField;
import com.vormadal.workit.database.mongo.MongoSimpleFieldDao;
import dk.agenia.permissionmanagement.annotations.Secured;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import java.util.List;

/**
 * Created: 06-07-2018
 * author: Runi
 */

@Path("fields")
public class EditableFieldService {

    private MongoSimpleFieldDao fieldDao = new MongoSimpleFieldDao(DaoRegistry.getInstance());

    @GET
    public List<SimpleField> getAll(@QueryParam("lang") String lang) throws MorphiaException {
        if(lang != null && lang.length() > 0){
            return fieldDao.getByLang(lang);
        }else {
            return fieldDao.getAll();
        }
    }

    @Path("langs")
    @GET
    public List<String> getLanguages(){
        return fieldDao.getLanguages();
    }

    @Secured
    @PUT
    public SimpleField createOrUpdate(SimpleField field){
        return fieldDao.createOrUpdate(field);
    }
}
