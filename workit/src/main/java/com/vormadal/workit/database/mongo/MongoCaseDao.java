package com.vormadal.workit.database.mongo;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.vormadal.mongodb.DbProvider;
import com.vormadal.mongodb.MongoBaseDao;
import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.dao.CaseDao;
import com.vormadal.workit.database.models.Case;
import com.vormadal.workit.database.models.Comment;
import com.vormadal.workit.database.models.Filter;
import com.vormadal.workit.database.models.SortOrder;
import com.vormadal.workit.exceptions.PersistenceException;
import org.mongodb.morphia.query.Criteria;
import org.mongodb.morphia.query.FindOptions;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;

import java.util.List;

import static java.util.Arrays.asList;

/**
 * Created: 04-09-2018
 * author: Runi
 */

public class MongoCaseDao extends MongoBaseDao<Case> implements CaseDao {
    public MongoCaseDao(DbProvider provider) {
        super(provider, Case.class);
    }

    @Override
    public Case update(Case e) throws PersistenceException, MorphiaException {
        return updateFields(asList("modified",
                "modifiedBy",
                "title",
                "description",
                "priority",
                "status",
                "estimate",
                "timeSpent",
                "responsible"), e);
    }

    @Override
    public boolean addComment(String caseId, Comment comment){
        Query<Case> query = query().field("_id").equal(caseId);
        UpdateOperations<Case> operations = updateOperation().push("comments", comment);
        return ds().update(query, operations).getUpdatedCount() > 0;
    }

    @Override
    public ListWithTotal<Case> getPageSorted(String projectId, int page, int size, String order, String orderBy) {
        Query<Case> query = ds().createQuery(type);
        long count = query.field("projectId").equal(projectId).count();
        return new ListWithTotal<>(query.order((order.equalsIgnoreCase("desc") ? "-" : "") + orderBy)
                .asList(new FindOptions().limit(size).skip(page * size)), count);
    }

    @Override
    public ListWithTotal<Case> getCasesForUser(String userId, int page, int size, List<Filter> filters, List<SortOrder> sortOrders) {
        Query<Case> query = query();
        Criteria[] userCriterias = new Criteria[2];
        userCriterias[0] = query.criteria("createdBy.id").equal(userId);
        userCriterias[1] = query.criteria("responsible.id").equal(userId);

        Criteria[] additionalCriterias = new Criteria[filters.size()];
        for (int i = 0; i < filters.size(); i++) {
            Filter filter = filters.get(i);
            additionalCriterias[i] = query.criteria(filter.getField()).equal(filter.getValue());
        }


        query.or(userCriterias);
        if (additionalCriterias.length > 0)
            query.and(query.or(additionalCriterias));

        for (SortOrder sort : sortOrders) {
            query.order((sort.isDescending() ? "-" : "") + sort.getField());
        }
        List<Case> list = query.asList(new FindOptions().skip(page * size).limit(size));
        return new ListWithTotal<>(list, query.count());
    }

    @Override
    public void audit(Case aCase) {
        DBCollection collection = ds().getDB().getCollection("CaseAudit");
        collection.insert(new BasicDBObject("_id", aCase.getId() + "-" + aCase.getV())
                .append("status", aCase.getStatus())
                .append("priority", aCase.getPriority())
                .append("description", aCase.getDescription())
                .append("estimate", aCase.getEstimate())
                .append("modified", aCase.getModified())
                .append("modifiedBy", aCase.getModifiedBy()));
    }

    @Override
    public boolean registerTime(String caseId, double hours) {
        Query<Case> query = query().field("_id").equal(caseId);
        UpdateOperations<Case> operations = updateOperation().inc("timeSpent", hours);
        return ds().update(query, operations).getUpdatedCount() > 0;
    }
}
