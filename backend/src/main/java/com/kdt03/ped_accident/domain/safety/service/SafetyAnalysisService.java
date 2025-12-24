package com.kdt03.ped_accident.domain.safety.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.DashboardStats;
import com.kdt03.ped_accident.api.dto.response.ImprovementCandidate;
import com.kdt03.ped_accident.api.dto.response.RiskScore;
import com.kdt03.ped_accident.api.dto.response.SignalEffectAnalysis;
import com.kdt03.ped_accident.api.dto.response.VulnerabilityScore;
import com.kdt03.ped_accident.domain.crosswalk.entity.*;

@Service
public class SafetyAnalysisService {
	public DashboardStats getDashboardStats(String sido, String sigungu) {
		return null;
	}

	public List<ImprovementCandidate> getImprovementCandidates(String sido, String sigungu, int limit) {
		return null;
	}

	public VulnerabilityScore calculateVulnerabilityScore(Crosswalk crosswalk) {
		return null;
	}

	public RiskScore calculateRiskScore(Double lat, Double lng) {
		return null;
	}

	public SignalEffectAnalysis analyzeSignalEffect(String sido, String sigungu) {
		return null;
	}
}

