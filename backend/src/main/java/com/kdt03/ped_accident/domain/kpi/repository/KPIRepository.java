package com.kdt03.ped_accident.domain.kpi.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.kpi.KpiEntity;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class KPIRepository {

  public interface KpiSummaryRepo extends Repository<KpiEntity, Long> {

	  @Query(value = "SELECT data FROM v_kpi_summary_json LIMIT 1", nativeQuery = true)
	  String fetchKpiSummaryJson();
	}
}