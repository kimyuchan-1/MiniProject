package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;

@RestController
@RequestMapping("/api/map")
public class MapController {
    
    @GetMapping("/crosswalks")
    public ResponseEntity<List<Crosswalk>> getCrosswalks(
        @RequestParam String bounds) {
		return null;
	}
    
//    @GetMapping("/crosswalks/{cwUid}")
//    public ResponseEntity<CrosswalkDetails> getCrosswalkDetails(
//        @PathVariable String cwUid) {
//		return null;
//	}
//    
//    @GetMapping("/accidents")
//    public ResponseEntity<List<AccidentData>> getAccidents(
//        @RequestParam String bounds) {
//		return null;
//	}
}