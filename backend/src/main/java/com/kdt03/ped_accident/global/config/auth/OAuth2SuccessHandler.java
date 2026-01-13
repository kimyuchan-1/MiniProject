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

        // ✅ 핵심: email이 아니라 providerId 기준
        String providerId;
        String email = null;

        if (provider == AuthProvider.NAVER) {
            // 네이버는 response 안에 실제 데이터 있음
            Map<String, Object> responseMap =
                    oAuth2User.getAttribute("response");

            providerId = (String) responseMap.get("id");   // 필수
            email = (String) responseMap.get("email");     // 선택

        } else if (provider == AuthProvider.GITHUB) {
            // GitHub는 email이 null인 경우 많음
            providerId = String.valueOf(oAuth2User.getAttribute("id"));
            email = oAuth2User.getAttribute("email"); // nullable

        } else { // GOOGLE
            providerId = oAuth2User.getAttribute("sub");
            email = oAuth2User.getAttribute("email"); // 거의 항상 존재
        }

        // ✅ provider + providerId 기준으로 사용자 처리
        User user = userService.findOrCreateOAuthUser(
                provider,
                providerId,
                email
        );

        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(authentication);

        // 쿠키 저장
        response.addCookie(createCookie(
                "accessToken",
                accessToken,
                60 * 60        // 1시간
        ));

        response.addCookie(createCookie(
                "refreshToken",
                refreshToken,
                60 * 60 * 24 * 7   // 7일
        ));

        // 프론트로 이동
        response.sendRedirect("http://localhost:3000");
    }

    private Cookie createCookie(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 로컬 개발용 (운영은 true)
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        return cookie;
    }
}
