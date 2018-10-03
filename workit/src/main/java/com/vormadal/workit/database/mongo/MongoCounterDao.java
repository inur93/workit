package com.vormadal.workit.database.mongo;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.vormadal.mongodb.DbProvider;

/**
 * Created: 04-09-2018
 * author: Runi
 */

public class MongoCounterDao {

    private DbProvider provider;

    public MongoCounterDao(DbProvider provider){
        this.provider = provider;
    }

    public int getNext(String id){
        DBCollection collection = provider.getDb().getDatastore().getDB().getCollection("counter");
        DBObject dbObject = collection.findAndModify(new BasicDBObject("_id", id),
                        new BasicDBObject("$inc", new BasicDBObject("sequence", 1)));
        if(dbObject == null) {
            collection.insert(new BasicDBObject("_id", id).append("sequence", 2));
            return 1;
        };
        return Integer.valueOf(dbObject.get("sequence").toString());
    }
}
