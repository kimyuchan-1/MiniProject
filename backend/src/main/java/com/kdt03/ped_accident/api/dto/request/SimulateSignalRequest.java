package com.kdt03.ped_accident.api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SimulateSignalRequest {
    @NotNull
    private BigDecimal latitude;
    
    @NotNull
    private BigDecimal longitude;
    
    private String signalType; // 설치할 신호등 타입
}
