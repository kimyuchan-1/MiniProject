package com.kdt03.ped_accident.domain.suggestion.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SuggestionType {
    SIGNAL("신호등 설치"),
    CROSSWALK("횡단보도 설치"),
    FACILITY("기타 시설");
    
    private final String description;
}