package com.kdt03.ped_accident.api.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrelationData {
    private List<RegionCorrelation> regionData;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionCorrelation {
        private String regionName;
        private double vulnerabilityRatio;    // 취약시설 비율
        private double accidentDensity;       // 사고다발지 밀도
        private long totalCrosswalks;
        private long totalAccidents;
    }
}