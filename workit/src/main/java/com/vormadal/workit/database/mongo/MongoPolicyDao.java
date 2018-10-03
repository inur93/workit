package com.vormadal.workit.database.mongo;

import com.mongodb.AggregationOptions;
import com.mongodb.BasicDBObject;
import com.mongodb.Cursor;
import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.dao.PolicyDao;
import com.vormadal.workit.database.models.security.Policy;

import java.util.*;

import static java.util.Arrays.asList;

/**
 * Created: 31-08-2018
 * author: Runi
 */

public class MongoPolicyDao extends MongoBaseDao<Policy> implements PolicyDao {
    public MongoPolicyDao(DbProvider provider) {
        super(provider, Policy.class);
    }

    @Override
    public void deleteByRoleId(String id) {
        ds().delete(query().field("roleId").equal(id));
    }

    @Override
    public List<Policy> getByRoleId(String roleId) {
        return query().field("roleId").equal(roleId).asList();
    }

    @Override
    public List<Policy> getByRoleIds(Set<String> roles) {
        return query().field("roleId").in(roles).asList();
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Policy> getAccess(Set<String> roles) {

        Cursor results = ds().getDB().getCollection("Policy")
                .aggregate(asList(
                        Doc("$match", Doc("roleId", Doc("$in", roles))),
                        Doc("$unwind", "$resources"),
                        Doc("$unwind", "$permissions"),
                        Doc("$group",
                                Doc("_id",
                                        Doc()
                                                .append("resources", "$resources")
                                                .append("params", "$params"))
                                        .append("permissions", Doc("$addToSet", "$permissions"))),
                        Doc("$project",
                                Doc()
                                        .append("_id", 0)
                                        .append("resources", "$_id.resources")
                                        .append("params", "$_id.params")
                                        .append("permissions", "$permissions"))
                        ),
                        AggregationOptions.builder()
                                .outputMode(AggregationOptions.OutputMode.CURSOR)
                                .build());

        /*Iterator<Policy> out = aggregation()
                .match(query().field("roleId").in(roles))
                .unwind("resources")
                .unwind("permissions")
                .group(Group.grouping("_id",
                        Projection.projection("resources"),
                        Projection.projection("params")),
                        Group.grouping("permissions",
                                Accumulator.accumulator("$addToSet", "permissions")))
                .project(Projection.projection("resources", "_id.resources"),
                        Projection.projection("params", "_id.params"),
                        Projection.projection("permissions", "permissions"))
                .out(type,
                        AggregationOptions
                                .builder()
                                .outputMode(AggregationOptions.OutputMode.CURSOR)
                                .build());*/
        /*
        while (out.hasNext()) policies.add(out.next());*/

        List<Policy> policies = new ArrayList<>();

        while (results.hasNext()) {
            BasicDBObject next = (BasicDBObject) results.next();
            Policy p = new Policy();
            p.setParams((Map<String, String>) next.get("params"));
            p.setResources(asList(next.getString("resources")));
            p.setPermissions(new HashSet<>((List<String>) next.get("permissions")));
            policies.add(p);

        }

        return policies;
    }

    @Override
    public boolean hasAccess(String resourceRegex, Set<String> roles, Set<String> permissions) {
        Cursor results = ds().getDB().getCollection("Policy")
                .aggregate(asList(
                        Doc("$match",
                                Doc("roleId", Doc("$in", roles))
                                        .append("resources", Doc("$regex", resourceRegex))),
                        Doc("$unwind", "$permissions"),
                        Doc("$group",
                                Doc("_id", "all_permissions")
                                        .append("permissions", Doc("$addToSet", "$permissions"))),
                        Doc("$match",
                                Doc("permissions", Doc("$all", permissions)))
                        ),
                        AggregationOptions.builder()
                                .outputMode(AggregationOptions.OutputMode.CURSOR)
                                .build());
        return results.hasNext();
    }

    private BasicDBObject Doc() {
        return new BasicDBObject();
    }

    private BasicDBObject Doc(String key, Object value) {
        return new BasicDBObject(key, value);
    }

    @Override
    public Policy update(Policy policy) throws MorphiaException {
        return updateAll(policy);
    }
}
