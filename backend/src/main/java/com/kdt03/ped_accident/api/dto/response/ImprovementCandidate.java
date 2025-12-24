package com.kdt03.ped_accident.api.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImprovementCandidate {
    private String cwUid;              // 횡단보도 ID
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private double facilityScore;      // 시설 취약 점수 (0-5점)
    private double riskScore;          // 위험 점수 (0-3점)
    private double totalScore;         // 최종 점수 = facilityScore * 0.4 + riskScore * 0.6
    private List<String> missingFeatures;
    private String recommendedImprovement;
    private double nearestAccidentDistance; // 가장 가까운 사고다발지까지 거리(m)
    
    // 시설 현황
    private boolean hasSignal;         // 보행자신호등
    private boolean hasButton;         // 보행자작동신호기
    private boolean hasSoundSignal;    // 음향신호기
    private boolean hasSpotlight;      // 집중조명
    private boolean hasBrailleBlock;   // 점자블록
}

