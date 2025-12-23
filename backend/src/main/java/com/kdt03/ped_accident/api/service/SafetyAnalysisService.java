package com.kdt03.ped_accident.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.DashboardStats;
import com.kdt03.ped_accident.domain.facility.entity.Crosswalk;

@Service
public class SafetyAnalysisService {
	public DashboardStats getDashboardStats(String sido, String sigungu) {
		return null;
	}
	public List<CrosswalkWithScore> getImporvementCandidates(String sido, String sigungu, int limit);
	public VulneranilityScore calculateVulnerabilityScore(Crosswalk crosswalk);
	public RiskScore calculateRisckScore(Double lat, Double lng);
	public SignalEffectAnalysis anayzeSignalEffect(String sido, String sigungu);
}
