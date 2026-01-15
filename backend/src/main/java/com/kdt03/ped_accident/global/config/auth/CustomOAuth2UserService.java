package com.kdt03.ped_accident.global.config.auth;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.user.entity.AuthProvider;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;

// ... 나머지 import 생략

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());

        String providerId = null;
        String email = null;
        String name = null;

        if (provider == AuthProvider.NAVER) {
            Map<String, Object> response = oAuth2User.getAttribute("response");
            providerId = response != null ? (String) response.get("id") : null;
            email = response != null ? (String) response.get("email") : null;
            name = response != null ? (String) response.get("name") : null;
        } else if (provider == AuthProvider.GITHUB) {
            Object idObj = oAuth2User.getAttribute("id");
            providerId = idObj != null ? String.valueOf(idObj) : null;
            Object emailObj = oAuth2User.getAttribute("email");
            email = emailObj != null ? String.valueOf(emailObj) : null;
            Object nameObj = oAuth2User.getAttribute("name");
            name = nameObj != null ? String.valueOf(nameObj) : null;
        } else { // GOOGLE
            providerId = oAuth2User.getAttribute("sub");
            email = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name");
        }

        if (email == null || email.isEmpty()) {
            email = provider + "_" + providerId + "@example.com";
        }

        if (name == null || name.isEmpty()) {
            name = "User_" + providerId;
        }

        User user = userService.findOrCreateOAuthUser(provider, providerId, email);

        Map<String, Object> mappedAttributes = new HashMap<>(oAuth2User.getAttributes());
        mappedAttributes.put("email", email);
        mappedAttributes.put("name", name);

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                mappedAttributes,
                "email"
        );
    }
}
