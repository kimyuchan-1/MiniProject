package com.kdt03.ped_accident.api.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccidentSummaryDto {
    private String region;
    private String regionType;
    private List<YearlyAccident> yearly;
    private List<MonthlyAccident> monthly;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YearlyAccident {
        private Integer year;
        private Long accidentCount;
        private Long casualtyCount;
        private Long fatalityCount;
        private Long seriousInjuryCount;
        private Long minorInjuryCount;
        private Long reportedInjuryCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyAccident {
        private Integer year;
        private Integer month;
        private Long accidentCount;
        private Long casualtyCount;
        private Long fatalityCount;
        private Long seriousInjuryCount;
        private Long minorInjuryCount;
        private Long reportedInjuryCount;
    }
}
