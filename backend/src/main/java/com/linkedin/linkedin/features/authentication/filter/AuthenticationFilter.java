package com.linkedin.linkedin.features.authentication.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.service.AuthenticationService;
import com.linkedin.linkedin.features.authentication.utils.ErrorResponse;
import com.linkedin.linkedin.features.authentication.utils.JsonWebToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class AuthenticationFilter extends HttpFilter {

    private final List<String> unsecuredEndpoints = Arrays.asList(
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/send-password-reset-token",
            "/api/v1/auth/reset-password"
    );

    private final JsonWebToken jsonWebToken;
    private final AuthenticationService authenticationService;

    public AuthenticationFilter(JsonWebToken jsonWebToken, AuthenticationService authenticationService){
        this.jsonWebToken = jsonWebToken;
        this.authenticationService = authenticationService;
    }

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        String path = request.getRequestURI();
        if(unsecuredEndpoints.contains(path)){
            chain.doFilter(request, response);
            return;
        }

        try{
            String authorization = request.getHeader("Authorization");
            if(authorization == null || !authorization.startsWith("Bearer")){
                throw new ServletException("Token is missing");
            }

            String token = authorization.substring(7);
            DecodedJWT decodedJWT = jsonWebToken.validateToken(token);

            String email = jsonWebToken.getEmailFromToken(decodedJWT);
            AuthenticationUser user = authenticationService.getUser(email);

            if(!user.getEmailVerified()){
                throw new ServletException("Acción no permitida, usuario no verificado");
            }

            request.setAttribute("authenticatedUser", user);
            chain.doFilter(request, response);

        }catch(Exception e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");

            ObjectMapper objectMapper = new ObjectMapper();
            ErrorResponse errorResponse = new ErrorResponse(e.getMessage());
            String jsonResponse = objectMapper.writeValueAsString(errorResponse);

            response.getWriter().write(jsonResponse);
        }

    }

}
