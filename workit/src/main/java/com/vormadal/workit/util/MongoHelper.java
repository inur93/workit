package com.vormadal.workit.util;

import com.mongodb.BasicDBObject;

/**
 * Created: 18-09-2018
 * author: Runi
 */

public class MongoHelper {

    public static BasicDBObject match(Object value){
        return new BasicDBObject("$match", value);
    }

    public static BasicDBObject and(Object value){
        return new BasicDBObject("$and", value);
    }
    public static BasicDBObject gt(Object value){
        return new BasicDBObject("$gt", value);
    }
    public static BasicDBObject gte(Object value){
        return new BasicDBObject("$gte", value);
    }
    public static BasicDBObject lt(Object value){
        return new BasicDBObject("$lt", value);
    }
    public static BasicDBObject lte(Object value){
        return new BasicDBObject("$lte", value);
    }
    public static BasicDBObject project(Object value){
        return new BasicDBObject("$project", value);
    }
}
