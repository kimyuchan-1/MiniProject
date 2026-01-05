package com.kdt03.ped_accident.domain.user.entity;

import org.springframework.security.core.GrantedAuthority;

public enum Role {
    ADMIN("ROLE_ADMIN", "관리자"),
    USER("ROLE_USER", "일반사용자");

    private final String key;
    private final String title;

    Role(String key, String title) {
        this.key = key;
        this.title = title;
    }

    public GrantedAuthority toAuthority() {
        return () -> key;
    }
}
