package com.kdt03.ped_accident.domain.kpi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.KPIDashboard;
import com.kdt03.ped_accident.api.dto.response.KPITrend;
import com.kdt03.ped_accident.api.dto.response.RegionalComparison;
import com.kdt03.ped_accident.api.dto.response.SafetyIndex;

@Service
public class KPIService {
	public KPIDashboard getKPIDashboard(Long districtCode) {
		return null;
	}

	public List<KPITrend> getKPITrends(Long districtCode, int months) {
		return null;
	}

	public SafetyIndex calculateSafetyIndex(Long districtCode) {
		return null;
	}

	public List<RegionalComparison> compareRegionalKPIs() {
		return null;
	}

	public String getKPIJson() {
		return null;
	}
}
