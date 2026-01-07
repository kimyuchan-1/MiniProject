package com.kdt03.ped_accident.global.config.auth;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException {

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;

            String email = oAuth2Token.getPrincipal().getAttributes().get("email").toString();
            String role = userService.findByEmail(email).getRole().getKey();

            String accessToken = jwtTokenProvider.createAccessToken(email, role);
            String refreshToken = jwtTokenProvider.createRefreshToken(email);

            // Refresh token을 데이터베이스에 저장
            User user = userService.findByEmail(email);
            userService.updateRefreshToken(user.getId(), refreshToken);

            String redirectUrl = determineTargetUrl(request, response, accessToken, refreshToken);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, String accessToken, String refreshToken) {
        String targetUrl = "http://localhost:3000/oauth2/redirect" +
                "?accessToken=" + accessToken +
                "&refreshToken=" + refreshToken;
        return targetUrl;
    }
}
