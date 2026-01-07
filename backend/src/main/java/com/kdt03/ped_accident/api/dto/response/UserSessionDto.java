package com.kdt03.ped_accident.api.dto.response;

import com.kdt03.ped_accident.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSessionDto {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String picture;
    
    public static UserSessionDto from(User user) {
        return UserSessionDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().getKey())
                .build();
    }
}