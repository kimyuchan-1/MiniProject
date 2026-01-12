package com.kdt03.ped_accident.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.kdt03.ped_accident.domain.kpi.service.KPIService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard/kpi")
public class KPIController {
  private final KPIService kpiService;

  @GetMapping
  public ResponseEntity<JsonNode> getKpi() {
      return ResponseEntity.ok(kpiService.getKpiSummary());
  }
}
