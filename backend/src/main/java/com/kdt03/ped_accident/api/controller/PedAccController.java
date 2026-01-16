package com.kdt03.ped_accident.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.response.AccidentSummaryDto;
import com.kdt03.ped_accident.domain.accident.service.AccidentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pedacc")
public class PedAccController {

    private final AccidentService accidentService;

    @GetMapping("/summary")
    public ResponseEntity<AccidentSummaryDto> getSummary(
            @RequestParam(required = false, defaultValue = "") String region) {
        
        String trimmedRegion = region.trim();
        
        // 유효성 검사
        if (!trimmedRegion.isEmpty() && !isValidRegion(trimmedRegion)) {
            return ResponseEntity.badRequest().build();
        }
        
        AccidentSummaryDto summary = accidentService.getSummary(trimmedRegion);
        return ResponseEntity.ok(summary);
    }

    private boolean isValidRegion(String region) {
        // 2자리(시도), 5자리(시군구), 10자리(상세) 허용
        return region.matches("^\\d{2}$") 
            || region.matches("^\\d{5}$") 
            || region.matches("^\\d{10}$");
    }
}
