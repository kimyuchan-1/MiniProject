package com.kdt03.ped_accident.global.config.auth;

import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.user.entity.AuthProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService
        implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) {
	    OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

	    String registrationId =
	        userRequest.getClientRegistration().getRegistrationId();

	    AuthProvider provider =
	        AuthProvider.valueOf(registrationId.toUpperCase());

	    String email;

	    if (provider == AuthProvider.NAVER) {
	        Map<String, Object> response = oAuth2User.getAttribute("response");
	        email = (String) response.get("email");
	    } else {
	        email = oAuth2User.getAttribute("email");
	    }

	    User user = userService.findOrCreateOAuthUser(email, provider);

	    return new DefaultOAuth2User(
	        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
	        oAuth2User.getAttributes(),
	        "email"
	    );
	}

}
