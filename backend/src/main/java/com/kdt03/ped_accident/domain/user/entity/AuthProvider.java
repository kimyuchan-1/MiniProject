package com.kdt03.ped_accident.domain.user.entity;

import java.util.Arrays;

public enum AuthProvider {
	LOCAL("local"),
    GOOGLE("google"),
    NAVER("naver"),
    GITHUB("github");

    private final String registrationId;

    AuthProvider(String registrationId) {
        this.registrationId = registrationId;
    }

    public String getRegistrationId() {
        return registrationId;
    }

    public static AuthProvider from(String registrationId) {
        return Arrays.stream(values())
            .filter(p -> p.registrationId.equals(registrationId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown provider: " + registrationId));
    }
}
