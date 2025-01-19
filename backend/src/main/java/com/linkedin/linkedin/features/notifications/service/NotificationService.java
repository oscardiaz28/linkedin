package com.linkedin.linkedin.features.notifications.service;

import com.linkedin.linkedin.exception.LinkedinException;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.feed.model.Comment;
import com.linkedin.linkedin.features.messaging.model.Conversation;
import com.linkedin.linkedin.features.messaging.model.Message;
import com.linkedin.linkedin.features.notifications.model.Notification;
import com.linkedin.linkedin.features.notifications.model.NotificationType;
import com.linkedin.linkedin.features.notifications.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Notification> getUserNotifications(AuthenticationUser user) {
        return notificationRepository.findByRecipientOrderByCreationDateDesc(user);
    }

    public Notification markNotificationAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow( () -> new LinkedinException("Notification no encontrada"));
        notification.setRead(true);
        messagingTemplate.convertAndSend("/topic/users/" + notification.getRecipient().getId() + "/notifications", notification);
        return notificationRepository.save(notification);
    }

    public void sendLikeNotification(AuthenticationUser author, AuthenticationUser recipient, Long resourceId) {
        if(author.getId().equals(recipient.getId())){
            return;
        }
        Notification notification = new Notification();
        notification.setActor(author);
        notification.setRecipient(recipient);
        notification.setType(NotificationType.LIKE);
        notification.setResourceId(resourceId);
        Notification notificationSaved = notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/users/"+recipient.getId()+"/notifications", notificationSaved);
    }

    public void sendCommentNotification(AuthenticationUser author, AuthenticationUser recipient, Long id) {
        if(author.getId().equals(recipient.getId())){
            return;
        }
        Notification notification = new Notification();
        notification.setActor(author);
        notification.setRecipient(recipient);
        notification.setResourceId(id);
        notification.setType(NotificationType.COMMENT);
        Notification notificationSaved = notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/users/"+recipient.getId()+"/notifications", notificationSaved);
    }

    public void sendLikeToPost(Long postId, Set<AuthenticationUser> likes) {
        messagingTemplate.convertAndSend("/topic/likes/"+postId, likes);
    }

    public void sendCommentToPost(Long postId, Comment comment){
        messagingTemplate.convertAndSend("/topic/comments/"+postId, comment);
    }

    public void sendConversationToUsers(Long senderId, Long receiverId, Conversation conversation) {
        messagingTemplate.convertAndSend("/topic/users/"+senderId+"/conversations", conversation);
        messagingTemplate.convertAndSend("/topic/users/"+receiverId+"/conversations", conversation);
    }

    public void sendMessageToConversation(Long conversationId, Message message) {
        messagingTemplate.convertAndSend("/topic/conversations/"+conversationId+"/messages", message);
    }

}
