package com.vormadal.workit.database.mongo;

import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.workit.database.dao.UserDao;
import com.vormadal.workit.database.models.User;
import com.vormadal.workit.database.models.UserRef;
import com.vormadal.workit.exceptions.ElementNotFoundException;
import com.vormadal.workit.exceptions.PersistenceException;
import com.vormadal.workit.exceptions.ValidException;
import lombok.extern.slf4j.Slf4j;
import org.mongodb.morphia.query.Criteria;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;
import org.mongodb.morphia.query.UpdateResults;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.asList;

@Slf4j
public class MongoUserDao extends MongoBaseDao<User> implements UserDao {
    public MongoUserDao(DbProvider provider) {
        super(provider, User.class);
    }

    @Override
    public User update(User element) throws MorphiaException {
        element.setUpdated(new Date());
        return updateFields(asList("name", "updated"), element);
    }

    @Override
    public User getByEmail(String email) throws PersistenceException, ElementNotFoundException {
        User user = query().field("email").equal(email).get();
        if (user == null) throw new ElementNotFoundException("No such element");
        return user;
    }

    @Override
    public UserRef getUserRef(String id) {
        Query<User> query = query();
        return new UserRef(query.field("_id").equal(id)
                .project("email", true)
                .project("name", true)
                .get());
    }

    @Override
    public List<UserRef> getUserRefs(Collection<String> userIds) {
        return query().field("_id").in(userIds)
                .project("email", true)
                .project("name", true)
                .asList()
                .stream()
                .map(UserRef::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserRef> getUserRefs(Collection<String> userIds, String query) {
        Query<User> q = query().field("_id").in(userIds);
        q.or(query().criteria("email").contains(query),
                query().criteria("name").contains(query));
        return q.project("email", true)
                .project("name", true)
                .asList()
                .stream()
                .map(UserRef::new)
                .collect(Collectors.toList());
    }

    @Override
    public void addRoleToUsers(String role, Collection<String> userIds) {
        Query<User> query = query();
        query.field("_id").in(userIds);
        UpdateOperations<User> update = updateOperation();
        update.addToSet("roles", role);
        UpdateResults results = ds().update(query, update);
    }

    @Override
    public void removeRoleFromUsers(String role, Collection<String> userIds) {
        Query<User> query = query().field("_id").in(userIds);
        UpdateOperations<User> updateOperations = updateOperation()
                .removeAll("roles", role);
        ds().update(query, updateOperations);
    }

    @Override
    public List<UserRef> queryByPartialRole(String partialRole, String query, List<String> fields) {
        Query<User> q = query();
        q.field("roles").contains(partialRole);
        List<Criteria> criteriaList = new ArrayList<>();
        for (String field : fields) {
            criteriaList.add(q.criteria(field).contains(query));
        }
        if (criteriaList.size() > 0) q.or(criteriaList.toArray(new Criteria[0]));
        return q.project("name", true)
                .project("email", true)
                .asList().stream().map(UserRef::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getHash(String id) {
        User user = query().field("_id").equal(id).project("hash", true).get();
        if(user == null) throw new ValidException("User does not exist");
        return user.getHash();
    }

    @Override
    public boolean updatePassword(String userId, String hash) {
        Query<User> query = query().field("_id").equal(userId);
        UpdateOperations<User> operations = updateOperation()
                .set("hash", hash)
                .set("passphraseUpdated", new Date());
        return ds().update(query, operations).getUpdatedCount() > 0;
    }
}
