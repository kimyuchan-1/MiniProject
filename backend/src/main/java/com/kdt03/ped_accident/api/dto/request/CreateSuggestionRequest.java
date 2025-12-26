package com.kdt03.ped_accident.api.dto.request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateSuggestionRequest {
    private String title;
    private String content;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String location;
}

