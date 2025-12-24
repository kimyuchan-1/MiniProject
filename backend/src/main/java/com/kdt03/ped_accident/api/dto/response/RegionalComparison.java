package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionalComparison {
    private String regionName;              // 지역명
    private double safetyIndex;             // 안전 지수
    private int safetyIndexRank;            // 안전 지수 순위
    private int accidentCount;              // 사고 건수
    private int accidentCountRank;          // 사고 건수 순위
    private double signalInstallationRate;  // 신호등 설치율
    private int signalInstallationRateRank; // 신호등 설치율 순위
}

