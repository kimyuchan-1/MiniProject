package com.kdt03.ped_accident.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.accident.entity.AccidentHotspot;
import com.kdt03.ped_accident.domain.facility.entity.Crosswalk;
import com.kdt03.ped_accident.domain.facility.entity.TrafficSignal;

@Service
public class MapService {
	public List<AccidentHotspot> getAccidentHeatmapData(String sido, String sigungu) {
		return null;
	}

	public List<Crosswalk> getCrosswalksByRegion(String sido, String sigungu) {
		return null;
	}

	public List<TrafficSignal> getSignalsByRegion(String sido, String sigungu) {
		return null;
	}

	public RegionalStaticstics getRegionalStatistics(String sido, String sigungu);
}
