package com.linkedin.linkedin.features.ws.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

//Confgura el soporte para websocket en la aplicacion utilizando STOMP como protocolo de mensajeria.
@Configuration
@EnableWebSocketMessageBroker // Habilita WebSocket con soporte de broker de mensajes
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");// Configura el broker para el destino / server to client
        config.setApplicationDestinationPrefixes("/app"); // -> client to server
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173")
                .withSockJS(); // Configura el punto de conexión STOMP
    }
}
