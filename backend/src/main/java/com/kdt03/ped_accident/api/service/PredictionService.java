package com.kdt03.ped_accident.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class PredictionService {
	public List<AccidentPrediction> predictAccidents(String sido, String sigungu, int months);

	public AccidentPrediction getMonthlyPrediction(String sido, String sigungu, int year, int month);

	public PredictionAccuracy validatePredictions(String sido, String sigungu, int year, int month);

	public List<RiskForecast> generateRiskForecast(String sido, String sigungu);

	public SignalInstallationEffect simulateSignalInstallation(BigDecimal lat, BigDecimal lon);
}