package com.kdt03.ped_accident.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class KPIService {
	public KPIDashboard getKPIDashboard(String sido, String sigungu);

	public List<KPITrend> getKPITrends(String sido, String sigungu, int months) {
		return null;
	}

	public SafetyIndex calculateSafetyIndex(String sido, String sigungu);

	public List<RegionalComparison> compareRegionalKPIs();
}