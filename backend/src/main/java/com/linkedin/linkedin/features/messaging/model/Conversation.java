package com.linkedin.linkedin.features.messaging.model;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private AuthenticationUser author;
    @ManyToOne(optional = false)
    private AuthenticationUser recipient;
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    public Conversation(Long id, AuthenticationUser author, AuthenticationUser recipient, List<Message> messages) {
        this.id = id;
        this.author = author;
        this.recipient = recipient;
        this.messages = messages;
    }

    public Conversation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AuthenticationUser getAuthor() {
        return author;
    }

    public void setAuthor(AuthenticationUser author) {
        this.author = author;
    }

    public AuthenticationUser getRecipient() {
        return recipient;
    }

    public void setRecipient(AuthenticationUser recipient) {
        this.recipient = recipient;
    }


    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}

