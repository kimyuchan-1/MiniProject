package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.response.CrosswalkDto;
import com.kdt03.ped_accident.domain.crosswalk.service.CrosswalkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CrosswalkController {

    private final CrosswalkService crosswalkService;

    // 예: /api/crosswalks?bounds=37.1,126.7,37.6,127.2&limit=5000
    @GetMapping("/crosswalks")
    public ResponseEntity<?> getCrosswalks(
            @RequestParam(name = "bounds") String bounds,
            @RequestParam(name = "limit", defaultValue = "5000") int limit
    ) {
        double[] b = parseBounds(bounds);
        if (b == null) {
            return ResponseEntity.badRequest().body(new ErrorRes("Invalid bounds"));
        }
        double south = b[0], west = b[1], north = b[2], east = b[3];
        if (south > north || west > east) {
            return ResponseEntity.badRequest().body(new ErrorRes("Invalid bounds"));
        }

        List<CrosswalkDto> out = crosswalkService.getCrosswalks(south, west, north, east, limit);
        return ResponseEntity.ok(out);
    }

    private double[] parseBounds(String s) {
        try {
            String[] parts = s.split(",");
            if (parts.length != 4) return null;
            double south = Double.parseDouble(parts[0]);
            double west  = Double.parseDouble(parts[1]);
            double north = Double.parseDouble(parts[2]);
            double east  = Double.parseDouble(parts[3]);
            return new double[]{south, west, north, east};
        } catch (Exception e) {
            return null;
        }
    }

    record ErrorRes(String error) {}
}