package com.linkedin.linkedin.features.notifications.controller;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.notifications.model.Notification;
import com.linkedin.linkedin.features.notifications.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<?> getUserNotifications(@RequestAttribute("authenticatedUser")AuthenticationUser user){
        List<Notification> notifications = notificationService.getUserNotifications(user);
        return ResponseEntity.ok().body(notifications);
    }

    @PutMapping("/{notificationId}")
    public Notification markNotificationAsRead(@PathVariable(name = "notificationId") Long id ){
        return notificationService.markNotificationAsRead(id);
    }

}
