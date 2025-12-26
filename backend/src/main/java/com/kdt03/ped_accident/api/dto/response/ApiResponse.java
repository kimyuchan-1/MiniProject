package com.kdt03.ped_accident.api.dto.response;

<<<<<<< HEAD:backend/src/main/java/com/kdt03/ped_accident/api/dto/response/CrosswalkDto.java
import java.math.BigDecimal;
=======
public class ApiResponse {
>>>>>>> backend:backend/src/main/java/com/kdt03/ped_accident/api/dto/response/ApiResponse.java

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrosswalkDto {
    private String cwUid;
    private String sido;
    private String sigungu;
    private String address;
    private BigDecimal crosswalkLat;
    private BigDecimal crosswalkLon;
    private Integer signal;
    private Integer button;
    private Integer soundSignal;
    private Integer spotlight;
    private Integer brailleBlock;
    private Double facilityScore;
    private Double riskScore;
}