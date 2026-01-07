package com.kdt03.ped_accident.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.request.LoginRequest;
import com.kdt03.ped_accident.api.dto.request.RefreshTokenRequest;
import com.kdt03.ped_accident.api.dto.request.RegisterRequest;
import com.kdt03.ped_accident.api.dto.response.ApiResponse;
import com.kdt03.ped_accident.api.dto.response.JwtTokenDto;
import com.kdt03.ped_accident.api.dto.response.UserSessionDto;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.CustomUserPrincipal;
import com.kdt03.ped_accident.domain.user.service.UserService;
import com.kdt03.ped_accident.global.config.auth.JwtTokenProvider;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtTokenDto>> login(@RequestBody @Valid LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            User user = principal.getUser();
            
            String accessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().getKey());
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
            
            // Refresh token을 데이터베이스에 저장
            userService.updateRefreshToken(user.getId(), refreshToken);
            
            JwtTokenDto tokenDto = JwtTokenDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .user(UserSessionDto.from(user))
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success("로그인 성공", tokenDto));
            
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("로그인 실패: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSessionDto>> register(@RequestBody @Valid RegisterRequest request) {
        User user = userService.signUp(request);
        
        UserSessionDto userSession = UserSessionDto.from(user);
        
        return ResponseEntity.ok(ApiResponse.success("회원가입 성공", userSession));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtTokenDto>> refresh(@RequestBody @Valid RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();
            
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 리프레시 토큰"));
            }
            
            String email = jwtTokenProvider.getUsername(refreshToken);
            User user = userService.findByEmail(email);
            
            if (!refreshToken.equals(user.getRefreshToken())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("리프레시 토큰이 일치하지 않습니다"));
            }
            
            String newAccessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().getKey());
            String newRefreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
            
            userService.updateRefreshToken(user.getId(), newRefreshToken);
            
            JwtTokenDto tokenDto = JwtTokenDto.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .user(UserSessionDto.from(user))
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success("토큰 갱신 성공", tokenDto));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("토큰 갱신 실패: " + e.getMessage()));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSessionDto>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자"));
        }
        
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();
        
        UserSessionDto userSession = UserSessionDto.from(user);
        
        return ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", userSession));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            User user = principal.getUser();
            
            // 리프레시 토큰 무효화
            userService.updateRefreshToken(user.getId(), null);
        }
        
        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공", null));
    }
    
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkAuthStatus(Authentication authentication) {
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated();
        return ResponseEntity.ok(ApiResponse.success("인증 상태 확인", isAuthenticated));
    }
}