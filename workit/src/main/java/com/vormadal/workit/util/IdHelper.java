package com.vormadal.workit.util;

import org.bson.types.ObjectId;

import java.util.UUID;

/**
 * Created: 29-08-2018
 * author: Runi
 */

public class IdHelper {

    public static boolean isValidUUID(String uuid) {
        if (uuid == null) return false;
        try {
            UUID.fromString(uuid);
            return true;
        } catch (IllegalArgumentException e) {
            try {
                return ObjectId.isValid(uuid);
            } catch (IllegalArgumentException e1) {
                return false;
            }
        }
    }
}
