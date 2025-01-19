package com.linkedin.linkedin.features.messaging.service;

import com.linkedin.linkedin.exception.LinkedinException;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.service.AuthenticationService;
import com.linkedin.linkedin.features.messaging.model.Conversation;
import com.linkedin.linkedin.features.messaging.model.Message;
import com.linkedin.linkedin.features.messaging.repository.ConversationRepository;
import com.linkedin.linkedin.features.messaging.repository.MessageRepository;
import com.linkedin.linkedin.features.notifications.service.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagingService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final AuthenticationService authenticationService;
    private final NotificationService notificationService;

    public MessagingService(MessageRepository messageRepository, ConversationRepository conversationRepository, AuthenticationService authenticationService, NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.authenticationService = authenticationService;
        this.notificationService = notificationService;
    }

    public List<Conversation> getConversationsOfUser(AuthenticationUser user) {
        return conversationRepository.findByAuthorOrRecipient(user, user);
    }


    public Conversation getConversation(AuthenticationUser user, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow( () -> new LinkedinException("Conversation no encontrada"));
        if( !conversation.getAuthor().getId().equals(user.getId()) && !conversation.getRecipient().getId().equals(user.getId()) ){
            throw new LinkedinException("Usuario no autorizado para ver la conversacion");
        }
        return conversation;
    }

    @Transactional
    public Conversation createConversationAndAddMessage(AuthenticationUser sender, Long receiverId, String content) {
        AuthenticationUser receiver = authenticationService.getUserById(receiverId);
        conversationRepository.findByAuthorAndRecipient(sender, receiver).ifPresentOrElse(
                conversation -> {
                    throw new LinkedinException("Conversation already exits, use the conversation id to send messages");
                },
                () -> {}
        );
        conversationRepository.findByAuthorAndRecipient(receiver, sender).ifPresentOrElse(
                conversation -> {
                    throw new LinkedinException("Conversation already exits, use the conversation id to send messages");
                },
                () -> {}
        );
        Conversation conversation = new Conversation();
        conversation.setAuthor(sender);
        conversation.setRecipient(receiver);
        conversationRepository.save(conversation);

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setConversation(conversation);
        message.setContent(content);
        messageRepository.save(message);

        conversation.getMessages().add(message);
        notificationService.sendConversationToUsers(sender.getId(), receiver.getId(), conversation);
        return conversation;
    }


    public Message addMessageToConversation(Long conversationId, AuthenticationUser sender, Long receiverId, String content) {
        AuthenticationUser receiver = authenticationService.getUserById(receiverId);
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow( () -> new LinkedinException("Conversacion no encontrada") );

        if(!conversation.getAuthor().getId().equals(sender.getId()) &&
            !conversation.getRecipient().getId().equals(sender.getId())){
            throw new LinkedinException("User no autorizado para enviar mensajes en esta conversacion");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setConversation(conversation);
        message.setContent(content);
        messageRepository.save(message);
        conversation.getMessages().add(message);

        notificationService.sendMessageToConversation(conversation.getId(), message);
        notificationService.sendConversationToUsers(sender.getId(), receiver.getId(), conversation);
        return message;
    }


    public void markMessageAsRead(AuthenticationUser user, Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow( () -> new LinkedinException("Message not found"));
        if(!message.getReceiver().getId().equals(user.getId())){
            throw new LinkedinException("Usuario no autorizado para marcar como leido el mensaje");
        }
        message.setRead(true);
        messageRepository.save(message);
    }
}
