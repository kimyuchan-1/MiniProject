package com.kdt03.ped_accident.domain.auth.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kdt03.ped_accident.api.dto.request.LoginRequest;
import com.kdt03.ped_accident.api.dto.response.LoginResponse;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;
import com.kdt03.ped_accident.global.config.auth.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JwtAuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    // ✅ OAuth2 및 Controller에서 인증 후 호출
    @Transactional
    public LoginResponse issue(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());

        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(authentication);

        userService.updateRefreshToken(user.getId(), refreshToken);

        return new LoginResponse(accessToken, refreshToken);
    }

    // ✅ 일반 로그인용 (Controller에서 AuthenticationManager로 인증 후 호출)
    @Transactional
    public LoginResponse login(LoginRequest request, Authentication authentication) {
        User user = userService.findByEmail(request.getEmail());

        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(authentication);

        userService.updateRefreshToken(user.getId(), refreshToken);

        return new LoginResponse(accessToken, refreshToken);
    }

    // ✅ RefreshToken 재발급
    @Transactional
    public LoginResponse reissue(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("RefreshToken이 유효하지 않습니다.");
        }

        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);
        User user = userService.findByEmail(authentication.getName());

        String newAccessToken = jwtTokenProvider.createAccessToken(authentication);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(authentication);

        userService.updateRefreshToken(user.getId(), newRefreshToken);

        return new LoginResponse(newAccessToken, newRefreshToken);
    }

    // ✅ 로그아웃: refreshToken 제거
    @Transactional
    public void logout(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) return;

        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);
        User user = userService.findByEmail(authentication.getName());

        userService.updateRefreshToken(user.getId(), null);
    }
}
