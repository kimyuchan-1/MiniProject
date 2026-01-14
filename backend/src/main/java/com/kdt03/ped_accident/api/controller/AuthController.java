package com.kdt03.ped_accident.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.request.LoginRequest;
import com.kdt03.ped_accident.api.dto.request.RegisterRequest;
import com.kdt03.ped_accident.api.dto.response.ApiResponse;
import com.kdt03.ped_accident.api.dto.response.UserSessionDto;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.CustomUserPrincipal;
import com.kdt03.ped_accident.domain.user.service.UserService;
import com.kdt03.ped_accident.global.config.auth.JwtTokenProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<ApiResponse<UserSessionDto>> login(
            @RequestBody @Valid LoginRequest request,
            HttpServletResponse response
    ) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();

        String accessToken = jwtTokenProvider.createAccessToken(authentication);

        response.addCookie(createHttpOnlyCookie(
            "accessToken", accessToken, 60 * 60   // 1시간
        ));

        return ResponseEntity.ok(
            ApiResponse.success("로그인 성공", UserSessionDto.from(user))
        );
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSessionDto>> register(@RequestBody @Valid RegisterRequest request) {
        User user = userService.signUp(request);
        
        UserSessionDto userSession = UserSessionDto.from(user);
        
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
        
        UserSessionDto userSession = UserSessionDto.from(user);
        
        return ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", userSession));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            Authentication authentication,
            HttpServletResponse response
    ) {
        if (authentication != null && authentication.isAuthenticated()) {
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        }

        response.addCookie(createHttpOnlyCookie("accessToken", null, 0));

        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공", null));
    }
    
    private Cookie createHttpOnlyCookie(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // ✅ 로컬 개발: false / 운영(HTTPS): true
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);

        return cookie;
	}

	@GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkAuthStatus(Authentication authentication) {
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated();
        return ResponseEntity.ok(ApiResponse.success("인증 상태 확인", isAuthenticated));
    }
}