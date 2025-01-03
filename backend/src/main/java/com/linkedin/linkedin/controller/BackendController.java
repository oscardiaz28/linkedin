package com.linkedin.linkedin.controller;

import com.linkedin.linkedin.exception.JWTException;
import com.linkedin.linkedin.exception.LinkedinException;
import com.linkedin.linkedin.exception.UserNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class BackendController {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException e){
        return ResponseEntity.badRequest().body(Map.of("message", "Required request body is missing"));
    }

    @ExceptionHandler(JWTException.class)
    public ResponseEntity<Map<String, String>> handleJWTException(JWTException e){
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException e){
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(LinkedinException.class)
    public ResponseEntity<Map<String, String>> handleLinkedinException(LinkedinException e){
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

}
