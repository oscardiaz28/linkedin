package com.linkedin.linkedin.features.messaging.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private AuthenticationUser sender;
    @ManyToOne(optional = false)
    private AuthenticationUser receiver;
    @JsonIgnore
    @ManyToOne(optional = false)
    private Conversation conversation;
    private String content;
    private boolean isRead;
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Message(Long id, AuthenticationUser sender, AuthenticationUser receiver,
                   Conversation conversation, String content, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.conversation = conversation;
        this.content = content;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }


    public Message() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AuthenticationUser getSender() {
        return sender;
    }

    public void setSender(AuthenticationUser sender) {
        this.sender = sender;
    }

    public AuthenticationUser getReceiver() {
        return receiver;
    }

    public void setReceiver(AuthenticationUser receiver) {
        this.receiver = receiver;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
