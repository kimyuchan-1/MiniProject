package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.response.DashboardStats;
import com.kdt03.ped_accident.api.dto.response.ImprovementCandidate; 
import com.kdt03.ped_accident.api.dto.response.SignalEffectAnalysis; 
import com.kdt03.ped_accident.domain.accident.entity.AccidentHotspot;
import com.kdt03.ped_accident.domain.facility.entity.Crosswalk;
import com.kdt03.ped_accident.domain.facility.entity.TrafficSignal;

@RestController
@RequestMapping("/api")
public class DashboardController {

	@GetMapping("/dashboard/stats")
	public ResponseEntity<DashboardStats> getDashboardStats(@RequestParam(required = false) String sido,
			@RequestParam(required = false) String sigungu) {
		return null;
	}

	@GetMapping("/map/heatmap")
	public ResponseEntity<List<AccidentHotspot>> getAccidentHeatmap(@RequestParam(required = false) String sido,
			@RequestParam(required = false) String sigungu) {
		return null;
	}

	@GetMapping("/map/crosswalks")
	public ResponseEntity<List<Crosswalk>> getCrosswalks(@RequestParam(required = false) String sido,
			@RequestParam(required = false) String sigungu) {
		return null;
	}

	@GetMapping("/map/signals")
	public ResponseEntity<List<TrafficSignal>> getSignals(@RequestParam(required = false) String sido,
			@RequestParam(required = false) String sigungu) {
		return null;
	}

	@GetMapping("/analysis/signal-effect")
	public ResponseEntity<SignalEffectAnalysis> getSignalEffectAnalysis(@RequestParam(required = false) String sido,
			@RequestParam(required = false) String sigungu) {
		return null;
	}

	@GetMapping("/analysis/improvement-candidates")
	public ResponseEntity<List<ImprovementCandidate>> getImprovementCandidates(
			@RequestParam(required = false) String sido, @RequestParam(required = false) String sigungu,
			@RequestParam(defaultValue = "20") int limit) {
		return null;
	}
}
