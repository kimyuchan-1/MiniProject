package com.kdt03.ped_accident.domain.kpi.repository;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.StoredProcedureQuery;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class KPIRepository {
  private final EntityManager em;

  public String callKpiProc() {
    StoredProcedureQuery q = em.createStoredProcedureQuery("get_kpi_summary");
    @SuppressWarnings("unchecked")
    var rows = q.getResultList();              // 보통 1행
    if (rows == null || rows.isEmpty()) return "{}";

    Object row = rows.get(0);

    // 드라이버에 따라 row가 String이거나 Object[]일 수 있음
    if (row instanceof Object[] arr) return String.valueOf(arr[0]);
    return String.valueOf(row);
  }
}