package com.kdt03.ped_accident.domain.mapping.repository;

import com.kdt03.ped_accident.domain.mapping.entity.CrosswalkSignalMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 횡단보도와 신호등의 매핑 정보(CrosswalkSignalMapping)에 접근하기 위한 Spring Data JPA 리포지토리입니다.
 */
@Repository
public interface CrosswalkSignalMappingRepository extends JpaRepository<CrosswalkSignalMapping, Long> {

    /**
     * 특정 횡단보도 ID에 해당하는 모든 매핑 정보를 조회합니다.
     *
     * @param crosswalkId 횡단보도 ID
     * @return 매핑 정보 목록
     */
    List<CrosswalkSignalMapping> findByCrosswalkId(Long crosswalkId);
}

