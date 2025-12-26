package com.kdt03.ped_accident.global.config.auth;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdt03.ped_accident.api.dto.response.ApiResponse;
import com.kdt03.ped_accident.api.dto.response.UserSessionDto;
import com.kdt03.ped_accident.api.dto.response.UserSessionDto.UserSessionDtoBuilder;
import com.kdt03.ped_accident.domain.user.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    
    private final ObjectMapper objectMapper;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                      Authentication authentication) throws IOException {
        
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();
        
        UserSessionDto userSession = ((UserSessionDtoBuilder) UserSessionDto.builder())
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().getKey())
                .picture(user.getPicture())
                .build();
        
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(objectMapper.writeValueAsString(
                ApiResponse.success("로그인 성공", userSession)
        ));
    }
}