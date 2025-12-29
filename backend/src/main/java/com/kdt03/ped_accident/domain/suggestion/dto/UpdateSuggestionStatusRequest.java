package com.kdt03.ped_accident.domain.suggestion.dto;

import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSuggestionStatusRequest {
    @NotNull(message = "상태는 필수입니다.")
    private SuggestionStatus status;
    private String adminResponse;
}
