package com.kdt03.ped_accident.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.request.RegisterRequest;
import com.kdt03.ped_accident.api.dto.response.ApiResponse;
import com.kdt03.ped_accident.api.dto.response.UserSessionDto;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;
import com.kdt03.ped_accident.global.config.auth.CustomUserPrincipal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSessionDto>> register(@RequestBody @Valid RegisterRequest request) {
        User user = userService.createUser(request);
        
        UserSessionDto userSession = UserSessionDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().getKey())
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("회원가입 성공", userSession));
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSessionDto>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자"));
        }
        
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();
        
        UserSessionDto userSession = UserSessionDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().getKey())
                .picture(user.getPicture())
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", userSession));
    }
    
    @PostMapping("/logout/success")
    public ResponseEntity<ApiResponse<Void>> logoutSuccess() {
        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공", null));
    }
    
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkAuthStatus(Authentication authentication) {
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated();
        return ResponseEntity.ok(ApiResponse.success("인증 상태 확인", isAuthenticated));
    }
}