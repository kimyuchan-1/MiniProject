package com.kdt03.ped_accident.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.investment.entity.InvestmentPlan;

@Service
public class InvestmentService {
	public InvestmentPlan createInvestmentPlan(CreateInvestmentPlanRequest request, Long userId);

	public List<InvestmentItem> optimizeInvestmentPlan(Long planId, BigDecimal budget);

	public InvestmentROI calculateROI(Long planId);

	public List<InvestmentPriority> getInvestmentPriorities(String sido, String sigungu, BigDecimal budget);

	public InvestmentReport generateInvestmentReport(Long planId);
}