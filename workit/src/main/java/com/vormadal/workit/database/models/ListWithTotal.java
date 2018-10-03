package com.vormadal.workit.database.models;

import java.util.List;

/**
 * Created: 15-09-2018
 * author: Runi
 */

@SuppressWarnings("unchecked")
public class ListWithTotal<T> implements dk.agenia.permissionmanagement.models.ListWithTotal<T> {
    private List<T> list;
    private Long count;
    public ListWithTotal(com.vormadal.mongodb.models.ListWithTotal list){
        this.list = list.getList();
        this.count = list.getCount();
    }

    @Override
    public List<T> getList() {
        return this.list;
    }

    @Override
    public Long getCount() {
        return this.count;
    }
}
