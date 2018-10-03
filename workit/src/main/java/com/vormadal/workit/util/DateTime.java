package com.vormadal.workit.util;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created: 16-01-2018
 * Owner: Runi
 */

public class DateTime {

    private final GregorianCalendar date;

    public DateTime(){
        this.date = new GregorianCalendar();
    }

    public DateTime(Date date){
        this();
        this.date.setTime(date);
    }

    public DateTime(int year, int month, int day){
        this();
        this.date.set(year, month-1, day);
    }

    public DateTime(int year) {
        this(year, 1, 1);
    }


    public int year() {
        return date.get(Calendar.YEAR);
    }
    public DateTime setYear(int year) {this.date.set(Calendar.YEAR, year); return this;}
    public DateTime addYear(int year) {this.date.add(Calendar.YEAR, year); return this;}

    public int month(){
        return date.get(Calendar.MONTH)+1;
    }
    public DateTime setMonth(int month) {this.date.set(Calendar.MONTH, month-1); return this;}
    public DateTime addMonth(int month) {this.date.add(Calendar.MONTH, month); return this;}

    public int day(){
        return date.get(Calendar.DAY_OF_MONTH);
    }
    public DateTime setDay(int day) {this.date.set(Calendar.DAY_OF_MONTH, day); return this;}

    public Date getDate(){
        return this.date.getTime();
    }

    public String toString(){
        return this.date.getTime().toString();
    }

    public int compareTo(DateTime time){
        return this.date.compareTo(time.date);
    }

    public boolean equal(DateTime time){
        return this.date.compareTo(time.date) == 0;
    }
    /*
    ###############################
    static
    ###############################
     */
    public static DateTime now(){
        return new DateTime();
    }

    public static DateTime get(int year) {
        return get(year, 1);
    }

    public static DateTime get(int year, int month) {
        return get(year, month, 1);
    }

    public static DateTime get(int year, int month, int day) {
        DateTime date = new DateTime(year, month, day);
        return date;
    }

    public static DateTime get(Date date){
        return new DateTime(date);
    }

    public static int compare(DateTime val1, DateTime val2){
        return val1.compareTo(val2);
    }

    public static void main(String[] args){
        DateTime.now();
        DateTime d = DateTime.now();
        d.day();
        d.month();
        d.year();

    }
}
