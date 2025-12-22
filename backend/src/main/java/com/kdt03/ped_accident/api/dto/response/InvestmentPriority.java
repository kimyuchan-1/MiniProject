package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentPriority {
    private String locationName;
    private BigDecimal priorityScore;
    private BigDecimal estimatedCost;
    private String recommendedAction;
}
