package com.kdt03.ped_accident.global.config.auth;

import java.util.List;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.request.SignUpRequest;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;
import com.kdt03.ped_accident.global.exception.custom.DataNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user;
        try {
            user = userService.findByEmail(email);
        } catch (DataNotFoundException e) {
            user = userService.signUp(new SignUpRequest(email, UUID.randomUUID().toString(), name));
        }

        // JWT 발급
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority(user.getRole().name()))
            );

        String accessToken = jwtTokenProvider.createAccessToken(authToken);
        String refreshToken = jwtTokenProvider.createRefreshToken(authToken);
        userService.updateRefreshToken(user.getId(), refreshToken);

        // Spring Security User 객체 반환
        return new DefaultOAuth2User(
            List.of(new SimpleGrantedAuthority(user.getRole().name())),
            oAuth2User.getAttributes(),
            "email"
        );
    }
}
