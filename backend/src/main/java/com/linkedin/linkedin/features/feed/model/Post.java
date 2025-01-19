package com.linkedin.linkedin.features.feed.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private String picture;
    @ManyToOne
    @JoinColumn(name = "author_id")
    private AuthenticationUser author;

    @CreationTimestamp
    private LocalDateTime creationDate;

    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments;

    @ManyToMany
    @JoinTable(
            name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private Set<AuthenticationUser> likes;

    @PreUpdate
    public void preUpdate(){
        this.updatedDate = LocalDateTime.now();
    }

    public Post(String content, AuthenticationUser author){
        this.content = content;
        this.author = author;
    }

    public Post(Long id, String content, String picture, AuthenticationUser author) {
        this.id = id;
        this.content = content;
        this.picture = picture;
    }

    public Post(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public AuthenticationUser getAuthor() {
        return author;
    }

    public void setAuthor(AuthenticationUser author) {
        this.author = author;
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

    public Set<AuthenticationUser> getLikes() {
        return likes;
    }

    public void setLikes(Set<AuthenticationUser> likes) {
        this.likes = likes;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}
