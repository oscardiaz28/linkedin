package com.linkedin.linkedin.features.authentication.controller;

import com.linkedin.linkedin.exception.LinkedinException;
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
    public ResponseEntity<?> sendEmailVerificationToken(@RequestAttribute("authenticatedUser") AuthenticationUser user ){
        emailService.sendEmailVerificationToken(user.getEmail());
        return ResponseBuilder.create()
                .message("Email verification token sent successfully")
                .status(HttpStatus.OK)
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginPage(@RequestBody AuthenticationRequestBody loginRequest ){
        return authenticationService.login(loginRequest);
    }

    @PutMapping("/profile/{id}")
    public AuthenticationUser updateUserProfile(@PathVariable Long id,
           @RequestAttribute("authenticatedUser") AuthenticationUser user,
           @RequestParam(required = false, name = "firstname") String firstName,
           @RequestParam(required = false, name = "lastname") String lastName,
           @RequestParam(required = false, name = "company") String company,
           @RequestParam(required = false, name = "position") String position,
           @RequestParam(required = false, name = "location") String location
    ){
        if(!user.getId().equals(id)){
            throw new LinkedinException("No tienes permisos para actualizar este perfil");
        }
        return authenticationService.updateUserProfile(id, firstName, lastName, company, position, location);
    }
}
