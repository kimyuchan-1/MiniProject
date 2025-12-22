package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.response.KPIDashboard;
import com.kdt03.ped_accident.api.dto.response.KPITrend;
import com.kdt03.ped_accident.api.dto.response.RegionalComparison;
import com.kdt03.ped_accident.api.dto.response.SafetyIndex;

@RestController
@RequestMapping("/api/kpi")
public class KPIController {
    
    @GetMapping("/dashboard")
    public ResponseEntity<KPIDashboard> getKPIDashboard(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu) {
        return null;
    }
    
    @GetMapping("/trends")
    public ResponseEntity<List<KPITrend>> getKPITrends(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu,
        @RequestParam(defaultValue = "12") int months) {
        return null;
    }
    
    @GetMapping("/safety-index")
    public ResponseEntity<SafetyIndex> getSafetyIndex(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu) {
        return null;
    }
    
    @GetMapping("/regional-comparison")
    public ResponseEntity<List<RegionalComparison>> getRegionalComparison() {
        return null;
    }
}
