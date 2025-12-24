package com.kdt03.ped_accident.domain.suggestion.dto;

import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateSuggestionRequest {
    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @NotNull(message = "위도는 필수입니다.")
    private BigDecimal locationLat;

    @NotNull(message = "경도는 필수입니다.")
    private BigDecimal locationLon;

    @NotBlank(message = "주소는 필수입니다.")
    private String address;

    @NotBlank(message = "시/도는 필수입니다.")
    private String sido;

    @NotBlank(message = "시/군/구는 필수입니다.")
    private String sigungu;

    @NotNull(message = "건의 유형은 필수입니다.")
    private SuggestionType suggestionType;
}
