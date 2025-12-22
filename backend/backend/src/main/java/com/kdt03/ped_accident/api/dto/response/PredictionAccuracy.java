package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionAccuracy {
    private double accuracyRate; // 정확도 (%)
    private double meanAbsoluteError; // 평균 절대 오차
    private String modelVersion;
}