package com.linkedin.linkedin.features.authentication.controller;

import com.linkedin.linkedin.features.authentication.dto.AuthenticationRequestBody;
import com.linkedin.linkedin.features.authentication.dto.AuthenticationResponseBody;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.service.AuthenticationService;
import com.linkedin.linkedin.features.authentication.service.EmailService;
import com.linkedin.linkedin.features.authentication.utils.ResponseBuilder;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final EmailService emailService;

    public AuthenticationController(AuthenticationService authenticationService, EmailService emailService){
        this.authenticationService = authenticationService;
        this.emailService = emailService;
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestAttribute("authenticatedUser") AuthenticationUser authenticationUser){
        AuthenticationUser user = authenticationService.getUser(authenticationUser.getEmail());
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerPage(@RequestBody AuthenticationRequestBody registerRequestBody){
        return authenticationService.register(registerRequestBody);
    }

    @PutMapping("/validate-email-verification-token")
    public String verifyEmail(@RequestParam String token, @RequestAttribute("authenticatedUser") AuthenticationUser user ){
        authenticationService.validateEmailVerificationToken(token, user.getEmail());
        return "Email verified successfully";
    }

    @GetMapping("/send-email-verification-token")
    public String sendEmailVerificationToken(@RequestAttribute("authenticatedUser") AuthenticationUser user ){
        emailService.sendEmailVerificationToken(user.getEmail());
        return "Email verification token sent successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginPage(@RequestBody AuthenticationRequestBody loginRequest ){
        return authenticationService.login(loginRequest);
    }


}
