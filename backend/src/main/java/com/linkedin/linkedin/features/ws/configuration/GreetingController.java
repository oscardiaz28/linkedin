package com.linkedin.linkedin.features.ws.configuration;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GreetingController {
    @MessageMapping("/hello")  // -> /app/hello
    @SendTo("/topic/greetings")
    public String greet(String message){
        return "Hello I have received a greeting message: " + message;
    }

}
