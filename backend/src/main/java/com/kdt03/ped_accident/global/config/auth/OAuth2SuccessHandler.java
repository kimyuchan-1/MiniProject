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

        String providerId;
        String email = null;

        if (provider == AuthProvider.NAVER) {
            Map<String, Object> responseMap =
                    oAuth2User.getAttribute("response");
            providerId = (String) responseMap.get("id");
            email = (String) responseMap.get("email");

        } else if (provider == AuthProvider.GITHUB) {
            providerId = String.valueOf(oAuth2User.getAttribute("id"));
            email = oAuth2User.getAttribute("email");

        } else { // GOOGLE
            providerId = oAuth2User.getAttribute("sub");
            email = oAuth2User.getAttribute("email");
        }

        // ✅ 우리 시스템 User
        User user = userService.findOrCreateOAuthUser(
                provider,
                providerId,
                email
        );

        // ✅ 우리 시스템 기준 Authentication 생성
        Authentication userAuth =
                jwtTokenProvider.getAuthenticationByEmail(user.getEmail());

        // ✅ JWT 생성
        String accessToken =
                jwtTokenProvider.createAccessToken(userAuth);


        // 크로스 도메인 쿠키 문제 해결: 쿼리 파라미터로 토큰 전달
        String redirectUrl = "http://localhost:3000/api/oauth2/callback?token=" + accessToken;
        response.sendRedirect(redirectUrl);
    }
}
