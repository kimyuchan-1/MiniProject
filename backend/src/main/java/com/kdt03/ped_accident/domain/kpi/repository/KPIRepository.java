package com.kdt03.ped_accident.domain.kpi.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class KPIRepository {

    @PersistenceContext
    private EntityManager em;

    public String fetchKpiSummaryJson() {
        return (String) em
            .createNativeQuery("SELECT data FROM v_kpi_summary_json LIMIT 1")
            .getSingleResult();
    }
}
