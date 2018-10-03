package com.vormadal.workit.database.mongo;

import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.dao.ProjectDao;
import com.vormadal.workit.database.models.Project;
import org.mongodb.morphia.query.FindOptions;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;

import java.util.HashSet;

import static java.util.Arrays.asList;

/**
 * Created: 03-09-2018
 * author: Runi
 */

public class MongoProjectDao extends MongoBaseDao<Project> implements ProjectDao {
    public MongoProjectDao(DbProvider provider) {
        super(provider, Project.class);
    }

    @Override
    public Project update(Project element) throws MorphiaException {
       return updateFields(asList("name", "users", "editors", "developers"), element);
    }

    @SuppressWarnings("unchecked")
    @Override
    public ListWithTotal<Project> getByClientId(String clientId, int page, int size, String orderBy, String order) {
        Query<Project> query = ds().createQuery(type);
        long count = query.field("clientId").equal(clientId).count();
        return new ListWithTotal(query.order(
                (order.equalsIgnoreCase("desc") ? "-" : "") + orderBy)
                .asList(new FindOptions().limit(size).skip(page * size)), count);
    }

    @Override
    public Project getUsersOnly(String projectId) {
        return query().field("_id").equal(projectId)
                .project("users", true)
                .project("editors", true)
                .project("developers", true)
                .get();
    }

    @Override
    public Project.ProjectConfiguration updateConfiguration(String id, Project.ProjectConfiguration configuration) {
        Query<Project> q = query().field("_id").equal(id);

        UpdateOperations<Project> update = updateOperation()
                .set("configuration", configuration);
        ds().update(q, update);
        return configuration;
    }

   /* @Override
    public List<UserRef> getUsers(String projectId, List<String> fieldsToMatch, String query) {*/
       /* DBCollection collection = ds().getCollection(type);
        collection.aggregate(asList(
                new BasicDBObject("$match", new BasicDBObject("_id", projectId)),
                new BasicDBObject("$unwind", "$users"),
                new BasicDBObject("$match", new BasicDBObject("$or",
                        new BasicDBObject("users.name",
                                new BasicDBObject("$regex", query).append("$option", "i")))
                        .append("users.email",
                                new BasicDBObject("$regex", query).append("$option", "i"))),
                new BasicDBObject("$group",
                        new BasicDBObject("_id", "$_id")
                                .append("users", new BasicDBObject("$addToSet", "$users")))
        )).*/
     /*   Query<Project> q = query().field("_id").equal(projectId);
        return null;
    }*/
}
