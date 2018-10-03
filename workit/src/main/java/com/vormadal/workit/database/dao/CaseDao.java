package com.vormadal.workit.database.dao;

import com.vormadal.mongodb.BaseDao;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.models.Case;
import com.vormadal.workit.database.models.Comment;
import com.vormadal.workit.database.models.Filter;
import com.vormadal.workit.database.models.SortOrder;

import java.util.List;

/**
 * Created: 04-09-2018
 * author: Runi
 */

public interface CaseDao extends BaseDao<Case> {
    boolean addComment(String caseId, Comment comment);

    ListWithTotal<Case> getPageSorted(String projectId, int page, int size, String order, String orderBy);
    ListWithTotal<Case> getCasesForUser(String userId, int page, int size, List<Filter> filters, List<SortOrder> sortOrders);
    void audit(Case aCase);

    boolean registerTime(String caseId, double hours);
}
