package com.kdt03.ped_accident.api.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccidentDto {
    private Long accidentId;
    private Integer year;
    private String detail;
    private Integer accidentCount;
    private Integer fatalityCount;
    private Integer seriousInjuryCount;
    private BigDecimal accidentLat;
    private BigDecimal accidentLon;
    private String hotspotPolygon;
}