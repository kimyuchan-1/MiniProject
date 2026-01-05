package com.kdt03.ped_accident.global.config.auth;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        // 여기서 JWT 발급 후 response에 담아줌 (예: 헤더)
        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        response.addHeader("Authorization", "Bearer " + accessToken);
        response.sendRedirect("/oauth2/success"); // 프론트 리디렉션
    }
}
