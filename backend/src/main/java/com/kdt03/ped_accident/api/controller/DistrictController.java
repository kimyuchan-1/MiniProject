package com.kdt03.ped_accident.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.domain.district.repository.DistrictCityDto;
import com.kdt03.ped_accident.domain.district.service.DistrictService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/district")
@RequiredArgsConstructor
public class DistrictController {
	
	private final DistrictService districtService;
	
	@GetMapping("/cities")
	public List<DistrictCityDto> cities(@RequestParam(name="province", required = false) String province) {
		return districtService.getCitiesByProvincePedAcc(province);
	}
	
	@GetMapping("/provinces")
	public List<Map<String, String>> provinces() {
		return districtService.getProvincesPedAcc();
	}
}
