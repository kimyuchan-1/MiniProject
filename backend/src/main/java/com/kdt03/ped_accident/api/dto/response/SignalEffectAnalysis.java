package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalEffectAnalysis {
    private double accidentReductionRate;  // 사고 감소율
    private double safetyIndexImprovement; // 안전지수 개선도
    private String analysisSummary;        // 분석 요약
}
