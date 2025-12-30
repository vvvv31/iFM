package com.zjsu.yyd.ifmservice.model;

import jakarta.persistence.Embeddable;
import java.util.Date;

@Embeddable
public class Comment {
    private String author;
    private String text;
    private Date createdAt;

    public Comment() {
        this.createdAt = new Date();
    }

    // Getters and setters
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
