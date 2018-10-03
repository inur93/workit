package com.vormadal.workit.database.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Created: 30-08-2018
 * author: Runi
 */
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Comment{

    private Date created;
    private UserRef author;
    private String text;
}
