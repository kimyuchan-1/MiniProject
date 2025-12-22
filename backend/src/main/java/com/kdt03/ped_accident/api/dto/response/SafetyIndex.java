package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SafetyIndex {
    private String region;
    private double score; // 0-100
    private String grade; // A, B, C, D, E
}
