package com.kdt03.ped_accident.domain.suggestion.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SuggestionStatus {
    PENDING("접수"),
    REVIEWING("검토중"),
    APPROVED("승인"),
    REJECTED("반려"),
    COMPLETED("완료");
    
    private final String description;
}