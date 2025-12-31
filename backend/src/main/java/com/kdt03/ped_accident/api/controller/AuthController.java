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

import com.kdt03.ped_accident.api.dto.request.SignUpRequest;
import com.kdt03.ped_accident.api.dto.response.ApiResponse;
import com.kdt03.ped_accident.api.dto.response.UserSessionDto;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSessionDto>> register(@RequestBody @Valid SignUpRequest request) {
        User user = userService.signUp(request);
        
        UserSessionDto userSession = UserSessionDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().getKey())
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("회원가입 성공", userSession));
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