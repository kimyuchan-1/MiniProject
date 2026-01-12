package com.kdt03.ped_accident.global.config.auth;

import java.io.IOException;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.kdt03.ped_accident.domain.user.entity.AuthProvider;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2AuthenticationToken oauthToken =
            (OAuth2AuthenticationToken) authentication;

        OAuth2User oAuth2User = oauthToken.getPrincipal();

        String registrationId =
            oauthToken.getAuthorizedClientRegistrationId();

        AuthProvider provider = AuthProvider.from(registrationId);

        String email;

        if (provider == AuthProvider.NAVER) {
            Map<String, Object> responseMap = oAuth2User.getAttribute("response");
            email = (String) responseMap.get("email");
        } else {
            email = oAuth2User.getAttribute("email");
        }

        User user = userService.findOrCreateOAuthUser(email, provider);

        String accessToken =
            jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().getKey());
        String refreshToken =
            jwtTokenProvider.createRefreshToken(user.getEmail());

        userService.updateRefreshToken(user.getId(), refreshToken);

        response.addCookie(createCookie("accessToken", accessToken, 60 * 60));
        response.addCookie(createCookie("refreshToken", refreshToken, 60 * 60 * 24 * 7));

        response.sendRedirect("http://localhost:3000");
    }

    private Cookie createCookie(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        return cookie;
    }
}
