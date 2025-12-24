package com.kdt03.ped_accident.api.dto.response;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalEffectAnalysis {
    private Map<String, Double> accidentReductionRateByFeature; // 기능별 사고 감소율
    private Map<String, Double> installationRateByFeature; // 기능별 설치율
    private double overallAccidentReductionRate; // 전체 사고 감소율
}

