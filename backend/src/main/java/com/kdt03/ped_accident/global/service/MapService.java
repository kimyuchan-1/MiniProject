package com.kdt03.ped_accident.global.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.RegionalStatistics;
import com.kdt03.ped_accident.domain.accident.entity.AccidentHotspot;
import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;
import com.kdt03.ped_accident.domain.signal.entity.TrafficSignal;

@Service
public class MapService {
	public List<AccidentHotspot> getAccidentHeatmapData(String sido, String sigungu) {
		// TODO: 사고 히트맵 데이터 조회 로직을 구현해야 합니다.
		return null;
	}

	public List<Crosswalk> getCrosswalksByRegion(String sido, String sigungu) {
		// TODO: 지역별 횡단보도 목록 조회 로직을 구현해야 합니다.
		return null;
	}

	public List<TrafficSignal> getSignalsByRegion(String sido, String sigungu) {
		// TODO: 지역별 신호등 목록 조회 로직을 구현해야 합니다.
		return null;
	}

	public RegionalStatistics getRegionalStatistics(String sido, String sigungu) {
		// TODO: 지역별 통계 조회 로직을 구현해야 합니다.
		return null;
	}
}

