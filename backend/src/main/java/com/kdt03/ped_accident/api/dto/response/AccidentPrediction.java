package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccidentPrediction {
    private String sido;
    private String sigungu;
    private int predictionYear;
    private int predictionMonth;
    private double predictedAccidentCount;
    private double confidenceIntervalLower;
    private double confidenceIntervalUpper;
}
