package com.kdt03.ped_accident.domain.kpi;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KPISummaryDto  {
	private int totalCrosswalks;
	private int crosswalksWithSignals;
	private int directSignals;
	private int mappedSignals;
	private double signalInstallationRate;
	private double riskIndex;
	private double safetyIndex;
}
