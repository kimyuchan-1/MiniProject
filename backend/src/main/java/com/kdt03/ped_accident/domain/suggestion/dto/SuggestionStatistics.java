package com.kdt03.ped_accident.domain.suggestion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SuggestionStatistics {
    private long totalCount;
    private long pendingCount;
    private long reviewingCount;
    private long approvedCount;
    private long rejectedCount;
    private long completedCount;
}


