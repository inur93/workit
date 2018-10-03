package com.vormadal.workit.database.models;

import lombok.*;

import java.util.Set;

/**
 * Created: 30-08-2018
 * author: Runi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
public class Client extends BaseDto {

    private String name;
    private Set<String> users;
    private Set<String> admins;
}
