package com.kdt03.ped_accident.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateMeRequest {

    @NotBlank(message = "회원명은 필수입니다")
    @Size(min = 2, max = 20, message = "회원명은 2~20자여야 합니다")
    private String name;
}