package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalInstallationEffect {
    private double expectedAccidentReduction; // 예상 사고 감소량
    private double safetyScoreImprovement;    // 안전 점수 개선도
    private String simulationResultSummary;
}