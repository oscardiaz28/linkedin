package com.linkedin.linkedin.features.authentication.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.linkedin.linkedin.exception.JWTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JsonWebToken {

    @Value("${jwt.private.key}")
    private String jwtPrivateKey;

    @Value("${jwt.user.generator}")
    private String userGenerator;

    public String generateToken(String email){
        Algorithm algorithm = Algorithm.HMAC256(this.jwtPrivateKey);
        return JWT.create()
                .withIssuer(this.userGenerator)
                .withSubject(email)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .sign(algorithm);
    }

    public DecodedJWT validateToken(String token){
        try{
            Algorithm algorithm =Algorithm.HMAC256(this.jwtPrivateKey);
            JWTVerifier jwtVerifier = JWT.require(algorithm)
                    .withIssuer(this.userGenerator)
                    .build();
            return jwtVerifier.verify(token);
        }catch(Exception e){
            throw new JWTException("Token invalido o expirado");
        }
    }

    public String getEmailFromToken(DecodedJWT decodedJWT){
        return decodedJWT.getSubject();
    }

}
