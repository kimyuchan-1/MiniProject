package com.kdt03.ped_accident.domain.user.entity;

import org.springframework.security.core.GrantedAuthority;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN("ROLE_ADMIN", "관리자"),
    USER("ROLE_USER", "일반사용자");
    
    private final String key;
    private final String title;
    public GrantedAuthority toAuthority() {
		// TODO Auto-generated method stub
		return null;
	}
}