package com.kdt03.ped_accident.domain.suggestion.dto;

import java.time.LocalDateTime;

import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private Long suggestionId;
    private String content;
    private Long parentId;
    private LocalDateTime createdAt;
    private UserInfo user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String name;
        private String picture;
    }

    public static CommentResponse from(SuggestionComment comment, User user) {
        UserInfo userInfo = null;
        if (user != null) {
            userInfo = UserInfo.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .picture(null) // User 엔티티에 picture 필드 없음
                    .build();
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .suggestionId(comment.getSuggestionId())
                .content(comment.getContent())
                .parentId(comment.getParentId())
                .createdAt(comment.getCreatedAt())
                .user(userInfo)
                .build();
    }
}
