package com.vormadal.workit.business;

import com.vormadal.mongodb.exceptions.MorphiaException;
import com.vormadal.mongodb.models.ListWithTotal;
import com.vormadal.workit.database.models.Case;

/**
 * Created: 04-09-2018
 * author: Runi
 */

public interface CaseController {
    Case createCase(Case newCase, String userId) throws MorphiaException;

    ListWithTotal<Case> getCases(String projectId, int page, int size, String orderBy, String order);

    ListWithTotal<Case> getCasesForSelf(String userId, String query, int page, int size, String orderBy, String order);

    Case getCase(String projectId, String caseId) throws MorphiaException;

    Case updateCase(String projectId, Case aCase, String userId) throws MorphiaException;
}
