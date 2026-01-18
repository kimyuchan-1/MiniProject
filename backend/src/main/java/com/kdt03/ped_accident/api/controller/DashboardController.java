package com.kdt03.ped_accident.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.response.CityDto;
import com.kdt03.ped_accident.api.dto.response.ProvinceDto;
import com.kdt03.ped_accident.domain.district.service.DistrictService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {
	
	private final DistrictService districtService;
	
	@GetMapping("/info")
	public Map<String, Object> getInfo(@AuthenticationPrincipal UserDetails userDetails) {
		return Map.of(
				"email", userDetails.getUsername(),
				"authorities", userDetails.getAuthorities()
		);
	}

	@GetMapping("/provinces")
	public ResponseEntity<List<ProvinceDto>> getProvinces() {
		return ResponseEntity.ok(districtService.getProvinces());
	}

	@GetMapping("/cities")
	public ResponseEntity<List<CityDto>> getCities(@RequestParam String province) {
		if (province == null || province.trim().isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(districtService.getCitiesByProvince(province.trim()));
	}
}