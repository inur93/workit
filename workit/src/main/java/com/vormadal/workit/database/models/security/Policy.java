package com.vormadal.workit.database.models.security;

import com.vormadal.mongodb.models.BaseDto;
import lombok.EqualsAndHashCode;

import javax.xml.bind.annotation.XmlType;

/**
 * Created: 15-09-2018
 * author: Runi
 */
@EqualsAndHashCode(callSuper = true)
@XmlType(name = "workitPolicy")
public class Policy extends dk.agenia.permissionmanagement.models.Policy implements BaseDto {}
