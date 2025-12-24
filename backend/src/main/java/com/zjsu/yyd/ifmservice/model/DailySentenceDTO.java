package com.zjsu.yyd.ifmservice.model;

/**
 * 每日一句 DTO
 */
public class DailySentenceDTO {

    private String english;
    private String chinese;
    private String author;

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }

    public String getChinese() {
        return chinese;
    }

    public void setChinese(String chinese) {
        this.chinese = chinese;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
