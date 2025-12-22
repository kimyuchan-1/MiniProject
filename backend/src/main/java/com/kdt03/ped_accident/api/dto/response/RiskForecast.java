package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskForecast {
    private String regionName;
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private String forecastMessage;
}
