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
public class DashboardStats {
    private long totalCrosswalks;
    private double pedestrianSignalRatio;
    private double audioSignalMissingRatio;
    private double remainingTimeDisplayMissingRatio;
    private long accidentHotspotCount;
    private List<RegionStats> topRiskyRegions;
}