package com.kdt03.ped_accident.domain.cwaccmapping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.cwaccmapping.entity.CrosswalkAccidentMapping;

import java.util.List;

@Repository
public interface CrosswalkAccidentMappingRepository extends JpaRepository<CrosswalkAccidentMapping, Long> {

    /**
     * 특정 횡단보도 ID에 해당하는 모든 매핑 정보를 조회합니다.
     * @param cwUid 횡단보도 ID
     * @return 매핑 정보 목록
     */
    List<CrosswalkAccidentMapping> findByCwUid(String cwUid);
}