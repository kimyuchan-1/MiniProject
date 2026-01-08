package com.kdt03.ped_accident.domain.kpi.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdt03.ped_accident.domain.kpi.repository.KPIRepository.KpiSummaryRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KpiSummaryService {
  private final KpiSummaryRepo repo;
  private final ObjectMapper objectMapper;

  public JsonNode getKpiSummary() {
    String json = repo.fetchKpiSummaryJson();
    if (json == null || json.isBlank()) return objectMapper.createObjectNode();
    try {
      return objectMapper.readTree(json);
    } catch (Exception e) {
      throw new IllegalStateException("Invalid JSON from view: " + json, e);
    }
  }
}