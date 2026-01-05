package com.kdt03.ped_accident.api.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
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

    private final JwtAuthService jwtAuthService;
    private final UserService userService;

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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(jwtAuthService.login(request));
    }

    @PostMapping("/reissue")
    public ResponseEntity<LoginResponse> reissue(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(jwtAuthService.reissue(body.get("refreshToken")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        jwtAuthService.logout(body.get("refreshToken"));
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "로그아웃 완료"
        ));
    }
}

