package com.vormadal.workit.database.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created: 11-09-2018
 * author: Runi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Filter {
    private String field;
    private String value;
}
