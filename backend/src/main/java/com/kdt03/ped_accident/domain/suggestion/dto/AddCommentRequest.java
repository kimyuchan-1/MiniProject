package com.kdt03.ped_accident.domain.suggestion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddCommentRequest {
    @NotBlank(message = "내용은 필수입니다.")
    private String content;
    private Long parentId;
}
