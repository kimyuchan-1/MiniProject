package com.kdt03.ped_accident.api.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.request.CreateInvestmentPlanRequest;
import com.kdt03.ped_accident.api.dto.response.InvestmentPriority;
import com.kdt03.ped_accident.api.dto.response.InvestmentROI;
import com.kdt03.ped_accident.api.dto.response.InvestmentReport;
import com.kdt03.ped_accident.domain.investment.entity.InvestmentItem;
import com.kdt03.ped_accident.domain.investment.entity.InvestmentPlan;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {
    
    @PostMapping("/plans")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<InvestmentPlan> createInvestmentPlan(
        @RequestBody @Valid CreateInvestmentPlanRequest request,
        Authentication authentication) {
        return null;
    }
    
    @GetMapping("/plans/{id}/optimize")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<InvestmentItem>> optimizeInvestmentPlan(
        @PathVariable Long id,
        @RequestParam BigDecimal budget) {
        return null;
    }
    
    @GetMapping("/priorities")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<InvestmentPriority>> getInvestmentPriorities(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu,
        @RequestParam BigDecimal budget) {
        return null;
    }
    
    @GetMapping("/plans/{id}/roi")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<InvestmentROI> calculateROI(@PathVariable Long id) {
        return null;
    }
    
    @GetMapping("/plans/{id}/report")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<InvestmentReport> generateReport(@PathVariable Long id) {
        return null;
    }
}
