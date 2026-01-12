package com.kdt03.ped_accident.domain.kpi.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdt03.ped_accident.domain.kpi.repository.KPIRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KPIService {

    private final KPIRepository repository;
    private final ObjectMapper objectMapper;

    public JsonNode getKpiSummary() {
        try {
            String json = repository.fetchKpiSummaryJson();
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new IllegalStateException("KPI JSON 파싱 실패", e);
        }
    }
}
