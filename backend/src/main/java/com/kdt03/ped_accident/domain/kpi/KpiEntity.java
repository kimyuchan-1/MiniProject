package com.kdt03.ped_accident.domain.kpi;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class KpiEntity {
	private int total_crosswalks;
	private int crosswalks_with_signals;
	private int direct_signals;
	private int mapped_signals;
	
	private double signal_installation_rate;
	private double risk_index;
	private double safety_index;
}
