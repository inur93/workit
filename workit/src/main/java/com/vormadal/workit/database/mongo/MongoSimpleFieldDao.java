package com.vormadal.workit.database.mongo;

import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.dao.BaseDao;
import com.vormadal.workit.database.models.SimpleField;
import lombok.extern.slf4j.Slf4j;

import java.util.List;


/**
 * Created by Christian on 01-11-2017.
 */
@Slf4j
public class MongoSimpleFieldDao extends MongoBaseDao<SimpleField> implements BaseDao<SimpleField> {


    public MongoSimpleFieldDao(DbProvider provider) {
        super(provider, SimpleField.class);
    }

    public SimpleField createOrUpdate(SimpleField field){
        ds().save(field);
        return field;
    }

    public List<String> getLanguages(){
        List language = ds().getCollection(SimpleField.class).distinct("language");
        return language;
    }

    public List<SimpleField> getByLang(String lang){
        return query().field("language").equal(lang).asList();
    }

    @Override
    public SimpleField update(SimpleField simpleField) throws MorphiaException {
        return updateAll(simpleField);
    }
}
