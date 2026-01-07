//package com.kdt03.ped_accident.domain.auth.service;
//
//import org.springframework.security.core.Authentication;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.kdt03.ped_accident.api.dto.request.LoginRequest;
//import com.kdt03.ped_accident.api.dto.response.LoginResponse;
//import com.kdt03.ped_accident.domain.user.entity.User;
//import com.kdt03.ped_accident.domain.user.service.UserService;
//import com.kdt03.ped_accident.global.config.auth.JwtTokenProvider;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional(readOnly = true)
//public class JwtAuthService {
//
//    private final JwtTokenProvider jwtTokenProvider;
//    private final UserService userService;
//
//    @Transactional
//    public LoginResponse login(LoginRequest request, Authentication authentication) {
//        User user = userService.findByEmail(authentication.getName());
//
//        String accessToken = jwtTokenProvider.createAccessToken(authentication);
//        String refreshToken = jwtTokenProvider.createRefreshToken(authentication);
//
//        userService.updateRefreshToken(user.getId(), refreshToken);
//
//        return new LoginResponse(
//                accessToken,
//                refreshToken,
//                jwtTokenProvider.getAccessTokenExpireTime(),
//                jwtTokenProvider.getRefreshTokenExpireTime()
//        );
//    }
//
//    @Transactional
//    public LoginResponse reissue(String refreshToken) {
//        if (!jwtTokenProvider.validateToken(refreshToken))
//            throw new RuntimeException("RefreshToken이 유효하지 않습니다.");
//
//        Authentication auth = jwtTokenProvider.getAuthentication(refreshToken);
//        User user = userService.findByEmail(auth.getName());
//
//        if (!refreshToken.equals(user.getRefreshToken()))
//            throw new RuntimeException("RefreshToken 불일치");
//
//        String newAccessToken = jwtTokenProvider.createAccessToken(auth);
//        String newRefreshToken = jwtTokenProvider.createRefreshToken(auth);
//
//        userService.updateRefreshToken(user.getId(), newRefreshToken);
//
//        return new LoginResponse(
//                newAccessToken,
//                newRefreshToken,
//                jwtTokenProvider.getAccessTokenExpireTime(),
//                jwtTokenProvider.getRefreshTokenExpireTime()
//        );
//    }
//
//    @Transactional
//    public void logout(String refreshToken) {
//        if (!jwtTokenProvider.validateToken(refreshToken)) return;
//
//        Authentication auth = jwtTokenProvider.getAuthentication(refreshToken);
//        User user = userService.findByEmail(auth.getName());
//
//        userService.updateRefreshToken(user.getId(), null);
//    }
//}
