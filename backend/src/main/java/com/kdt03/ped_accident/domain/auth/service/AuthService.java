//package com.kdt03.ped_accident.domain.auth.service;
//
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//import com.kdt03.ped_accident.api.dto.request.LoginRequest;
//import com.kdt03.ped_accident.api.dto.request.SignUpRequest;
//import com.kdt03.ped_accident.api.dto.response.JwtTokenDto;
//import com.kdt03.ped_accident.api.dto.response.LoginResponse;
//import com.kdt03.ped_accident.api.dto.response.UserSessionDto;
//import com.kdt03.ped_accident.domain.user.entity.User;
//import com.kdt03.ped_accident.domain.user.service.UserService;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class AuthService {
//
//    private final AuthenticationManager authenticationManager;
//    private final JwtAuthService jwtAuthService;
//    private final UserService userService;
//
//    public JwtTokenDto login(LoginRequest request) {
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.getEmail(), request.getPassword()
//                )
//        );
//
//        LoginResponse response = jwtAuthService.login(request, authentication);
//
//        return new JwtTokenDto(response.getAccessToken(), response.getRefreshToken());
//    }
//
//    public UserSessionDto register(SignUpRequest request) {
//        User user = userService.signUp(request);
//        return new UserSessionDto(user.getId(), user.getEmail(), user.getName(), user.getRole().name());
//    }
//
//    public JwtTokenDto refresh(String refreshToken) {
//        LoginResponse response = jwtAuthService.reissue(refreshToken);
//        return new JwtTokenDto(response.getAccessToken(), response.getRefreshToken());
//    }
//
//    public void logout(String refreshToken) {
//        jwtAuthService.logout(refreshToken);
//    }
//
//    public UserSessionDto getCurrentUser(Authentication authentication) {
//        UserDetails user = (UserDetails) authentication.getPrincipal();
//        User u = userService.findByEmail(user.getUsername());
//        return new UserSessionDto(u.getId(), u.getEmail(), u.getName(), u.getRole().name());
//    }
//}
//
//
