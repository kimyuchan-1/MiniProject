package com.kdt03.ped_accident.api.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.request.LoginRequest;
import com.kdt03.ped_accident.api.dto.request.SignUpRequest;
import com.kdt03.ped_accident.api.dto.response.LoginResponse;
import com.kdt03.ped_accident.domain.auth.service.JwtAuthService;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager; // SecurityConfig에서 주입
    private final JwtAuthService jwtAuthService;
    private final UserService userService;

    // ---------------- 회원가입 ----------------
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpRequest request) {
        User user = userService.signUp(request);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "회원가입 성공",
            "data", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole()
            )
        ));
    }

    // ---------------- 로그인 ----------------
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        // AuthenticationManager를 이용해 인증
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 인증 후 JwtAuthService로 JWT 발급 + refreshToken DB 저장
        LoginResponse response = jwtAuthService.login(request, authentication);

        return ResponseEntity.ok(response);
    }

    // ---------------- RefreshToken 재발급 ----------------
    @PostMapping("/reissue")
    public ResponseEntity<LoginResponse> reissue(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        LoginResponse response = jwtAuthService.reissue(refreshToken);
        return ResponseEntity.ok(response);
    }

    // ---------------- 로그아웃 ----------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        jwtAuthService.logout(refreshToken);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "로그아웃 완료"
        ));
    }
}
