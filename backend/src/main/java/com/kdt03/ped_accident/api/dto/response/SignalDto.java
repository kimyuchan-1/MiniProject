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
public class SignalDto {
    private String sgUid;
    private String sido;
    private String sigungu;
    private String address;
    private BigDecimal signalLat;
    private BigDecimal signalLon;
    private Integer button;
    private Integer remainTime;
    private Integer soundSignal;
    private Integer signalType;
}