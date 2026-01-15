package com.kdt03.ped_accident.global.config.auth;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException {
    	
    	exception.printStackTrace();

        String errorMessage = URLEncoder.encode(
            exception.getMessage(), StandardCharsets.UTF_8
        );

        response.sendRedirect(
            "http://10.125.121.181:3000/signin?error=" + errorMessage
        );
    }
}
