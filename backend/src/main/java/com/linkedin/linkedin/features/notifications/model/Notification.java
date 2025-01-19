package com.linkedin.linkedin.features.notifications.model;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private AuthenticationUser recipient;
    @ManyToOne
    private AuthenticationUser actor;
    private boolean isRead = false;
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    private Long resourceId;
    @CreationTimestamp
    private LocalDateTime creationDate;

    public Notification(Long id, AuthenticationUser recipient, AuthenticationUser actor, boolean isRead,
                        NotificationType type, Long resourceId) {
        this.id = id;
        this.recipient = recipient;
        this.actor = actor;
        this.isRead = isRead;
        this.type = type;
        this.resourceId = resourceId;
    }

    public Notification() {
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public AuthenticationUser getActor() {
        return actor;
    }

    public void setActor(AuthenticationUser actor) {
        this.actor = actor;
    }

    public AuthenticationUser getRecipient() {
        return recipient;
    }

    public void setRecipient(AuthenticationUser recipient) {
        this.recipient = recipient;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }
}
