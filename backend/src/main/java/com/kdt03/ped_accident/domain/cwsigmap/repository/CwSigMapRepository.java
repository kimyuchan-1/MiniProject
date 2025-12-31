package com.kdt03.ped_accident.domain.cwsigmap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.cwsigmap.entity.CwSigMap;
import com.kdt03.ped_accident.domain.cwsigmap.entity.CwSigMapId;

import java.util.List;
import java.util.Optional;

/**
 * 횡단보도와 신호등의 매핑 정보(CrosswalkSignalMapping)에 접근하기 위한 Spring Data JPA 리포지토리입니다.
 */
@Repository
public interface CwSigMapRepository
        extends JpaRepository<CwSigMap, CwSigMapId> {

    List<CwSigMap> findByIdCwUid(String cwUid);

    Optional<CwSigMap> findByIdCwUidAndIdSgUid(
        String cwUid,
        String sgUid
    );
}