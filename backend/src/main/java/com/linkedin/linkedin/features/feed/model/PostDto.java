package com.linkedin.linkedin.features.feed.model;

import jakarta.validation.constraints.NotEmpty;

public class PostDto {
    @NotEmpty(message = "El contenido del post es obligatorio")
    private String content;
    private String picture;

    public PostDto(String content, String picture) {
        this.content = content;
        this.picture = picture;
    }

    public PostDto() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}

