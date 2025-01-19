package com.linkedin.linkedin.features.messaging.service;

import com.linkedin.linkedin.features.messaging.repository.ConversationRepository;
import com.linkedin.linkedin.features.messaging.repository.MessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public ConversationService(ConversationRepository conversationRepository, MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }


}
