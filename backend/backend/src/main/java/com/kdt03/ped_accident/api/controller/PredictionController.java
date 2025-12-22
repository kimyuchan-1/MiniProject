package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid; 

import com.kdt03.ped_accident.api.dto.request.SimulateSignalRequest;
import com.kdt03.ped_accident.api.dto.response.AccidentPrediction;
import com.kdt03.ped_accident.api.dto.response.PredictionAccuracy;
import com.kdt03.ped_accident.api.dto.response.RiskForecast;
import com.kdt03.ped_accident.api.dto.response.SignalInstallationEffect;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {
    
    @GetMapping("/accidents")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<List<AccidentPrediction>> predictAccidents(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu,
        @RequestParam(defaultValue = "3") int months) {
		return null;
	}
    
    @GetMapping("/risk-forecast")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<List<RiskForecast>> getRiskForecast(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu) {
        return null; 
    }
    
    @PostMapping("/simulate-signal")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<SignalInstallationEffect> simulateSignalInstallation(
        @RequestBody @Valid SimulateSignalRequest request) {
		return null;
	}
    
    @GetMapping("/accuracy")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PredictionAccuracy> getPredictionAccuracy(
        @RequestParam String sido,
        @RequestParam String sigungu,
        @RequestParam int year,
        @RequestParam int month) {
		return null;
	}
}