package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KPIDashboard {
    private long totalAccidents;
    private long totalFatalities;
    private double safetyScore;
    private String trendDirection; // UP, DOWN, STABLE
}
