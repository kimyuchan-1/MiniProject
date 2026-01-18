package com.kdt03.ped_accident.domain.suggestion.dto;

import java.time.LocalDateTime;

import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionType;
import com.kdt03.ped_accident.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionDetailResponse {
    private Long id;
    private String title;
    private String content;
    private Double locationLat;
    private Double locationLon;
    private String address;
    private SuggestionType suggestionType;
    private SuggestionStatus status;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private Integer priorityScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private UserInfo user;
    private Boolean isLiked;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String name;
    }

    public static SuggestionDetailResponse from(Suggestion s, User user, boolean isLiked) {
        UserInfo userInfo = null;
        if (user != null) {
            userInfo = UserInfo.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .build();
        }

        return SuggestionDetailResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .content(s.getContent())
                .locationLat(s.getLocationLat())
                .locationLon(s.getLocationLon())
                .address(s.getAddress())
                .suggestionType(s.getSuggestionType())
                .status(s.getStatus())
                .viewCount(s.getViewCount() != null ? s.getViewCount() : 0)
                .likeCount(s.getLikeCount() != null ? s.getLikeCount() : 0)
                .commentCount(s.getCommentCount() != null ? s.getCommentCount() : 0)
                .priorityScore(s.getPriorityScore() != null ? s.getPriorityScore() : 0)
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .userId(s.getUserId())
                .user(userInfo)
                .isLiked(isLiked)
                .build();
    }
}
