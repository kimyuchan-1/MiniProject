package com.kdt03.ped_accident.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuthProvider {
	
    GOOGLE("google"),
    NAVER("naver"),
    KAKAO("kakao");
    
    private final String registrationId;
}