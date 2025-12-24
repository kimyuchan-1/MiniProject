package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KPITrend {
    private int year;
    private int month;
    private double signalInstallationRate; // 신호등 설치율
    private double accidentReductionRate;  // 사고 감소율
    private double safetyIndex;            // 안전 지수
    private double monthlyChangeRate;      // 월별 변화율
}

