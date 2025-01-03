package com.linkedin.linkedin.features.authentication.utils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseBuilder<T> {
    private String message;
    private HttpStatus status;
    private T data;

    public ResponseBuilder<T> message(String message){
        this.message = message;
        return this;
    }

    public ResponseBuilder<T> status(HttpStatus status){
        this.status = status;
        return this;
    }

    public ResponseBuilder<T> data(T data){
        this.data = data;
        return this;
    }

    public static <T> ResponseBuilder<T> create(){
        return new ResponseBuilder<>();
    }

    public ResponseEntity<Response<T>> build(){
        Response<T> response = new Response<>();
        response.setMessage(this.message);
        response.setData(this.data);
        return new ResponseEntity<>(response, this.status);
    }

    public static class Response<T>{
        private String message;
        @JsonInclude(JsonInclude.Include.NON_NULL)
        private T data;

        public void setMessage(String message){
            this.message = message;
        }
        public String getMessage(){
            return this.message;
        }
        public void setData(T data){
            this.data = data;
        }
        public T getData(){
            return this.data;
        }
    }

}
