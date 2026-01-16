package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.response.AccidentDto;
import com.kdt03.ped_accident.domain.accidentHotSpot.service.AccidentHotSpotService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/accidents")
public class AccidentHotSpotController {

    private final AccidentHotSpotService service;

    @GetMapping
    public ResponseEntity<?> getAccidents(
            @RequestParam(name = "bounds") String bounds,
            @RequestParam(name = "limit", defaultValue = "1000") int limit
    ) {
        // bounds = "south,west,north,east"
        String[] parts = bounds.split(",");
        if (parts.length != 4) {
            return ResponseEntity.badRequest().body(new ErrorBody("Invalid bounds"));
        }

        Double south = parseDouble(parts[0]);
        Double west  = parseDouble(parts[1]);
        Double north = parseDouble(parts[2]);
        Double east  = parseDouble(parts[3]);

        if (south == null || west == null || north == null || east == null) {
            return ResponseEntity.badRequest().body(new ErrorBody("Invalid bounds"));
        }
        if (south > north || west > east) {
            return ResponseEntity.badRequest().body(new ErrorBody("Bounds order must be south<=north and west<=east"));
        }

        List<AccidentDto> out = service.getAccidentsByBounds(south, west, north, east, limit);
        return ResponseEntity.ok(out);
    }

    private Double parseDouble(String s) {
        try { return Double.parseDouble(s.trim()); }
        catch (Exception e) { return null; }
    }

    record ErrorBody(String error) {}
}