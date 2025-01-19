package com.linkedin.linkedin.features.authentication.service;

import com.linkedin.linkedin.exception.LinkedinException;
import com.linkedin.linkedin.exception.UserNotFoundException;
import com.linkedin.linkedin.features.authentication.dto.AuthenticationRequestBody;
import com.linkedin.linkedin.features.authentication.dto.AuthenticationResponseBody;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.model.NotificationEmail;
import com.linkedin.linkedin.features.authentication.repository.AuthenticationUserRepository;
import com.linkedin.linkedin.features.authentication.utils.Encoder;
import com.linkedin.linkedin.features.authentication.utils.JsonWebToken;
import com.linkedin.linkedin.features.authentication.utils.ResponseBuilder;
import com.linkedin.linkedin.features.authentication.utils.Util;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthenticationService {
    private final AuthenticationUserRepository authRepository;
    private final Encoder encoder;
    private final JsonWebToken jsonWebToken;
    private final EmailService emailService;
    private final int durationInMinutes = 5;

    public AuthenticationService(AuthenticationUserRepository authenticationUserRepository, Encoder encoder, JsonWebToken jsonWebToken, EmailService emailService) {
        this.authRepository = authenticationUserRepository;
        this.encoder = encoder;
        this.jsonWebToken = jsonWebToken;
        this.emailService = emailService;
    }

    public AuthenticationUser getUser(String email){
        return authRepository.findByEmail(email).orElseThrow( () -> new UserNotFoundException("Usuario no encontrado"));
    }

    @Transactional
    public ResponseEntity<?> register(AuthenticationRequestBody registerRequestBody) {

        String email = registerRequestBody.getEmail();
        String hashPassword = encoder.encode(registerRequestBody.getPassword());

        Optional<AuthenticationUser> existEmail = authRepository.findByEmail(email);
        if(existEmail.isPresent()){
            return ResponseBuilder.create()
                    .message("El email ya existe")
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }

        AuthenticationUser user = new AuthenticationUser(email, hashPassword);

        String emailVerificationToken = Util.generateEmailVerificationToken();
        String hashedToken = encoder.encode(emailVerificationToken);
        user.setEmailVerificationToken(hashedToken);
        user.setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
        authRepository.save(user);

        String subject = "Email Verification";
        String body = """
                    Only one step to take full advantage of Linkedin.
                    Enter this code to verify your email: %s
                    The code will expire in %s minutes
                    """.formatted(emailVerificationToken, durationInMinutes);
        NotificationEmail notificationEmail = new NotificationEmail(subject, email, body);

        emailService.sendMail(notificationEmail);
        String token = jsonWebToken.generateToken(email);
        AuthenticationResponseBody<?> responseBody = new AuthenticationResponseBody<>(token, "User registered successfully");
        return ResponseEntity.ok().body(responseBody);
    }

    public ResponseEntity<?> login(AuthenticationRequestBody loginRequest){
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        Optional<AuthenticationUser> userOptional = authRepository.findByEmail(email);
        if(userOptional.isEmpty()){
            return ResponseBuilder.create()
                    .message("Usuario no encontrado")
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
        AuthenticationUser user = userOptional.get();
        if(!encoder.matches(password, user.getPassword())){
            return ResponseBuilder.create()
                    .message("Password incorrecto")
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
        String token = jsonWebToken.generateToken(email);
        AuthenticationResponseBody<?> responseBody = new AuthenticationResponseBody<>(token, "Authentication successfully");
        return ResponseEntity.ok().body(responseBody);
    }


    public void validateEmailVerificationToken(String token, String email) {
        Optional<AuthenticationUser> user = authRepository.findByEmail(email);
        if(user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken())
            && !user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())
        ){
            AuthenticationUser userSaved = user.get();
            userSaved.setEmailVerified(true);
            userSaved.setEmailVerificationToken(null);
            userSaved.setEmailVerificationTokenExpiryDate(null);
            authRepository.save(userSaved);
        }else{
            throw new LinkedinException("Email verification token failed.");
        }
    }

    public AuthenticationUser updateUserProfile(Long id, String firstName, String lastName, String company,
                                                String position, String location) {
        AuthenticationUser user = authRepository.findById(id).
                orElseThrow( () -> new UserNotFoundException("Usuario no encontrado") );
        if(firstName != null) user.setFirstName(firstName);
        if(lastName != null ) user.setLastName(lastName);
        if(company != null ) user.setCompany(company);
        if( position != null ) user.setPosition(position);
        if( location != null ) user.setLocation(location);
        return authRepository.save(user);
    }

    public List<AuthenticationUser> getUsersWithoutAuth(AuthenticationUser user) {
        return authRepository.getUsersWithoutAuth(user.getId());
    }

    public AuthenticationUser getUserById(Long id){
        return authRepository.findById(id).orElseThrow( () -> new LinkedinException("Usuario no encontrado") );
    }

}
