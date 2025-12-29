package com.kdt03.ped_accident.global.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.RegionalStatistics;
import com.kdt03.ped_accident.domain.accident.entity.AccidentHotspot;
import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;
import com.kdt03.ped_accident.domain.signal.entity.TrafficSignal;

@Service
public class MapService {
    public List<AccidentHotspot> getAccidentHeatmapData(Long districtCode) {
		return null;
	}
    public List<Crosswalk> getCrosswalksByRegion(Long districtCode) {
		return null;
	}
    public List<TrafficSignal> getSignalsByRegion(Long districtCode) {
		return null;
	}
    public RegionalStatistics getRegionalStatistics(Long districtCode) {
		return null;
	}
}