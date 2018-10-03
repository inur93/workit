package com.vormadal.workit.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Created: 16-01-2018
 * Owner: Runi
 */

public class NumberUtil {



    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = new BigDecimal(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

    public static boolean isNumber(String value){
        try{
            Long.parseLong(value);
            return true;
        }catch (NumberFormatException e){
            return false;
        }
    }
}
