package com.kdt03.ped_accident.domain.cwaccmap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.cwaccmap.entity.CwAccMap;
import com.kdt03.ped_accident.domain.cwaccmap.entity.CwAccMapId;

import java.util.List;

@Repository
public interface CwAccMapRepository extends JpaRepository<CwAccMap, CwAccMapId> {

    /**
     * 특정 횡단보도 ID에 해당하는 모든 매핑 정보를 조회합니다.
     * @param cwUid 횡단보도 ID
     * @return 매핑 정보 목록
     */
    List<CwAccMap> findByIdCwUid(String cwUid);
}