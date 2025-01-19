package com.linkedin.linkedin.features.messaging.controller;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.utils.ResponseBuilder;
import com.linkedin.linkedin.features.messaging.dto.MessageDto;
import com.linkedin.linkedin.features.messaging.model.Conversation;
import com.linkedin.linkedin.features.messaging.model.Message;
import com.linkedin.linkedin.features.messaging.service.MessagingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messaging")
public class MessagingController {

    private final MessagingService messagingService;

    public MessagingController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    @GetMapping("/conversations")
    public List<Conversation> getConversations(@RequestAttribute("authenticatedUser") AuthenticationUser user){
        return messagingService.getConversationsOfUser(user);
    }

    @GetMapping("/conversations/{conversationId}")
    public Conversation getConversation(@RequestAttribute("authenticatedUser") AuthenticationUser user,
                                        @PathVariable(name = "id") Long id ){
        return messagingService.getConversation(user, id);
    }

    @PostMapping("/conversations")
    public Conversation createConversationAndAddMessage(@RequestAttribute("authenticatedUser") AuthenticationUser sender,
                                                        @RequestBody MessageDto messageDto){
        return messagingService.createConversationAndAddMessage(sender, messageDto.receiverId(), messageDto.content());
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public Message addMessageToConversation(@RequestAttribute("authenticatedUser") AuthenticationUser sender,
                                            @RequestBody MessageDto messageDto,
                                            @PathVariable("conversationId") Long id){
        return messagingService.addMessageToConversation(id, sender, messageDto.receiverId(), messageDto.content());
    }
    
    @PutMapping("/conversations/messages/{messageId}")
    public ResponseEntity<?> markMessageAsRead(@RequestAttribute("authenticatedUser") AuthenticationUser user,
                                            @PathVariable("messageId") Long id){
        messagingService.markMessageAsRead(user, id);
        return ResponseBuilder.create()
                .status(HttpStatus.OK)
                .message("Mensaje marcado como leido")
                .build();
    }

}
