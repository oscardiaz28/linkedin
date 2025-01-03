package com.linkedin.linkedin.features.authentication.service;

import com.linkedin.linkedin.exception.LinkedinException;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.model.NotificationEmail;
import com.linkedin.linkedin.features.authentication.repository.AuthenticationUserRepository;
import com.linkedin.linkedin.features.authentication.utils.Encoder;
import com.linkedin.linkedin.features.authentication.utils.Util;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final AuthenticationUserRepository authenticationUserRepository;
    private final Encoder encoder;
    private final int durationInMinutes = 5;

    public EmailService(JavaMailSender javaMailSender, AuthenticationUserRepository authenticationUserRepository,
                        Encoder encoder){
        this.javaMailSender = javaMailSender;
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
    }

    public void sendMail(NotificationEmail notificationEmail) {
        try{
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom("no-reply@linkedin.com");
            helper.setTo(notificationEmail.getRecipient());
            helper.setSubject(notificationEmail.getSubject());

            helper.setText(notificationEmail.getBody(), true);
            javaMailSender.send(mimeMessage);

        }catch (MessagingException e){
            throw new LinkedinException(e.getMessage());
        }
    }

    public void sendEmailVerificationToken(String email){
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);
        if( user.isPresent() ){
            String emailVerificationToken = Util.generateEmailVerificationToken();
            String hashedToken = encoder.encode(emailVerificationToken);
            user.get().setEmailVerificationToken(hashedToken);
            user.get().setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authenticationUserRepository.save(user.get());
            String subject = "Email Verification";
            String body = """
                    Only one step to take full advantage of Linkedin.
                    Enter this code to verify your email: %s
                    The code will expire in %s minutes
                    """.formatted(emailVerificationToken, durationInMinutes);
            NotificationEmail notificationEmail = new NotificationEmail(subject, email, body);
            this.sendMail(notificationEmail);
        }
    }



}
