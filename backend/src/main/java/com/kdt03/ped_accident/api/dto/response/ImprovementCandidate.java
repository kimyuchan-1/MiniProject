package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImprovementCandidate {
    private String cwUid;              // 횡단보도 ID
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private double facilityScore;      // 시설 취약 점수
    private double riskScore;          // 위험 점수
    private double totalScore;         // 최종 점수
    private List<String> missingFeatures;
    private String recommendedImprovement;
    private double nearestAccidentDistance;
    
    // 시설 보유 여부 등 추가 필드가 필요할 수 있습니다.
}
