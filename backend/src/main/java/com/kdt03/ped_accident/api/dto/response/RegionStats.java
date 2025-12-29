package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionStats {
    private String sido;
    private String sigungu;
    private long crosswalkCount;
    private long accidentCount;
    private double riskScore;
}