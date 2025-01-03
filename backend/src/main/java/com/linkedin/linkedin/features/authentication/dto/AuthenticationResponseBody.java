package com.linkedin.linkedin.features.authentication.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

public class AuthenticationResponseBody<T> {
    private final String token;
    private final String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    public AuthenticationResponseBody(String token, String message){
        this.token = token;
        this.message = message;
    }

    public AuthenticationResponseBody(String token, String message, T data){
        this.token = token;
        this.message = message;
        this.data = data;
    }

    public String getToken() {
        return token;
    }
    public String getMessage() {
        return message;
    }
    public T getData(){
        return this.data;
    }
}
