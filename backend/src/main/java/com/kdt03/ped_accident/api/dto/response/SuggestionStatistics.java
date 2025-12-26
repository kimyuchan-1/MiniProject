package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionStatistics {
    private long totalSuggestions;
    private long pendingSuggestions;
    private long inProgressSuggestions;
    private long resolvedSuggestions;
}

