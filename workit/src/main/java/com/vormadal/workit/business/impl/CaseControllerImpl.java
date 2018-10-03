package com.vormadal.workit.business.impl;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.business.CaseController;
import com.vormadal.workit.database.dao.CaseDao;
import com.vormadal.workit.database.models.*;
import com.vormadal.workit.exceptions.ValidException;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.vormadal.workit.database.DaoRegistry.*;
import static com.vormadal.workit.util.StringHelper.isNullOrEmpty;
import static java.util.Arrays.asList;

/**
 * Created: 04-09-2018
 * author: Runi
 */
@Slf4j
public class CaseControllerImpl implements CaseController {
    //TODO validation
    @Override
    public Case createCase(Case newCase, String userId) throws MorphiaException {
        int id = getCounterDao().getNext(newCase.getProjectId());
        if(isNullOrEmpty(newCase.getProjectId())) throw new ValidException("Missing project id");
        if(isNullOrEmpty(newCase.getTitle())) throw new ValidException("Missing title");
        if(isNullOrEmpty(newCase.getStatus())) throw new ValidException("Missing status");
        newCase.setTimeSpent(0);
        newCase.setId(newCase.getProjectId() + "-" + id);
        UserRef user = getUserDao().getUserRef(userId);
        Date now = new Date();
        newCase.setCreatedBy(user);
        newCase.setCreated(now);
        newCase.setModifiedBy(user);
        newCase.setModified(now);
        return getCaseDao().create(newCase);
    }

    @Override
    public ListWithTotal<Case> getCases(String projectId, int page, int size, String orderBy, String order) {
        return getCaseDao().getPageSorted(projectId, page, size, order, orderBy);
    }

    @SuppressWarnings("ArraysAsListWithZeroOrOneArgument")
    @Override
    public ListWithTotal<Case> getCasesForSelf(String userId, String query, int page, int size, String orderBy, String order) {
        List<Filter> filters = new ArrayList<>();
        if(!isNullOrEmpty(query)){
            filters.add(new Filter("title", query));
        }
        return getCaseDao().getCasesForUser(userId, page, size,
                filters,
                asList(new SortOrder(orderBy, "asc".equals(order))));
    }

    @Override
    public Case getCase(String projectId, String caseId) throws MorphiaException {
        return getCaseDao().get(caseId);
    }

    @Override
    public Case updateCase(String projectId, Case aCase, String userIdFromContext) throws MorphiaException {
        long start = System.currentTimeMillis();
        CaseDao dao = getCaseDao();
        User user = getUserDao().get(userIdFromContext);
        UserRef userRef = new UserRef(user);
        Case existing = dao.get(aCase.getId());
        try {
            dao.audit(existing);
        }catch(Exception e){
            log.warn("could not update audit for case: " + aCase.getId(), e);
            //this could happen if audit was successful but the update was not
            //then when another update attempt is made, the audit will fail.
        }
        aCase.setModified(new Date());
        aCase.setModifiedBy(userRef);
        if(aCase.getNewComment() != null) {
            if(!isNullOrEmpty(aCase.getNewComment().getText())){
                aCase.getNewComment().setCreated(new Date());
                aCase.getNewComment().setAuthor(userRef);
                getCaseDao().addComment(aCase.getId(), aCase.getNewComment());
            }
        }
        Case updated = getCaseDao().update(aCase);
        long duration = System.currentTimeMillis()-start;
        log.trace("update case duration: " + duration);
        return updated;
    }


}
