package com.kdt03.ped_accident.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdt03.ped_accident.domain.kpi.service.KPIService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/kpi")
public class KPIController {
  private final KPIService kpiService;
  private final ObjectMapper objectMapper;

  @GetMapping
  public ResponseEntity<JsonNode> getKpi() throws Exception {
    String json = kpiService.getKPIJson();
    JsonNode node = objectMapper.readTree(json);
    return ResponseEntity.ok(node);
  }
}
