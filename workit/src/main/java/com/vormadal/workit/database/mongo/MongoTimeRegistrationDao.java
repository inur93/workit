package com.vormadal.workit.database.mongo;

import com.mongodb.AggregationOptions;
import com.mongodb.BasicDBObject;
import com.mongodb.Cursor;
import com.mongodb.DBCollection;
import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.dao.TimeRegistrationDao;
import com.vormadal.workit.database.models.TimeRegistration;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static java.util.Arrays.asList;

/**
 * Created: 05-09-2018
 * author: Runi
 */

public class
MongoTimeRegistrationDao extends MongoBaseDao<TimeRegistration> implements TimeRegistrationDao {

    public MongoTimeRegistrationDao(DbProvider provider) {
        super(provider, TimeRegistration.class);
    }

    @Override
    public List<TimeRegistration> getRegistrationsForUser(String userId, Date from, Date to) {
        DBCollection collection = ds().getDB().getCollection("TimeRegistration");

        Cursor results = collection.aggregate(asList(
                new BasicDBObject("$match",
                        new BasicDBObject()
                                .append("$and", asList(
                                        new BasicDBObject("user", userId),
                                        new BasicDBObject("date", new BasicDBObject("$gte", from)),
                                        new BasicDBObject("date", new BasicDBObject("$lt", to)))
                                )),
                new BasicDBObject("$project",
                        new BasicDBObject()
                                .append("simpleDate",
                                        new BasicDBObject("$dateToString",
                                                new BasicDBObject()
                                                        .append("format", "%Y-%m-%d")
                                                        .append("date", "$date")))
                                .append("hours", true)
                                .append("caseId", true)
                                .append("projectId", true)),
                new BasicDBObject("$group",
                        new BasicDBObject()
                                .append("_id", new BasicDBObject()
                                        .append("date", "$simpleDate")
                                        .append("projectId", "$projectId")
                                        .append("caseId", "$caseId"))
                                .append("hours", new BasicDBObject()
                                        .append("$sum", "$hours"))),
                new BasicDBObject("$project",
                        new BasicDBObject()
                                .append("date", new BasicDBObject("$dateFromString", new BasicDBObject("dateString", "$_id.date")))
                                .append("caseId", "$_id.caseId")
                                .append("projectId", "$_id.projectId")
                                .append("hours", "$hours")
                )
                ),
                AggregationOptions.builder()
                        .outputMode(AggregationOptions.OutputMode.CURSOR) //this is important - query will fail otherwise!!
                        .build());
        List<TimeRegistration> timeRegistrations = new ArrayList<>();
        while (results.hasNext()) {
            BasicDBObject result = (BasicDBObject) results.next();
            System.out.println("date: " + result.get("date"));
            timeRegistrations.add(TimeRegistration.builder()
                    .projectId(result.getString("projectId"))
                    .caseId(result.getString("caseId"))
                    .date(result.getDate("date"))
                    .hours(result.getDouble("hours"))
                    .build());
        }
        return timeRegistrations;
    }

    @Override
    public TimeRegistration update(TimeRegistration registration) throws MorphiaException {
        return updateAll(registration);
    }
}
