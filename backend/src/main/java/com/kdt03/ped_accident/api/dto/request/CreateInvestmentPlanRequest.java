package com.kdt03.ped_accident.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateInvestmentPlanRequest {
    @NotBlank
    private String planName;

    @NotBlank
    private String sido;

    private String sigungu;

    @NotNull
    private BigDecimal totalBudget;

    @NotNull
    private Integer planYear;
}
