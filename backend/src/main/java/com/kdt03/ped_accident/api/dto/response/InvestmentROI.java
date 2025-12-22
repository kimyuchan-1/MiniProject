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
public class InvestmentROI {
    private Long planId;
    private BigDecimal totalCost;
    private BigDecimal expectedBenefit;
    private BigDecimal roiPercentage;
}
