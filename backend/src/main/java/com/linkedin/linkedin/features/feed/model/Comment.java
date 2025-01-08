package com.linkedin.linkedin.features.feed.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnore
    private Post post;
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private AuthenticationUser author;
    private String content;
    @CreationTimestamp
    private LocalDateTime creationDate;
    private LocalDateTime updatedDate;

    @PreUpdate
    public void preUpdate(){
        this.updatedDate = LocalDateTime.now();
    }

    public Comment(Long id, Post post, AuthenticationUser author, String content, LocalDateTime creationDate,
                   LocalDateTime updatedDate) {
        this.id = id;
        this.post = post;
        this.author = author;
        this.content = content;
        this.creationDate = creationDate;
        this.updatedDate = updatedDate;
    }

    public Comment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public AuthenticationUser getAuthor() {
        return author;
    }

    public void setAuthor(AuthenticationUser author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }
}
