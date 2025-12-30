package com.kdt03.ped_accident.domain.accident.repository;

import com.kdt03.ped_accident.domain.accident.entity.AccidentHotspot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 사고 데이터(`AccidentData`)에 접근하기 위한 Spring Data JPA 리포지토리입니다.
 */
@Repository
public interface AccidentHotspotRepository extends JpaRepository<AccidentHotspot, Long> {

    /**
     * 지정된 지리적 경계 내의 사고 데이터를 조회합니다.
     *
     * @param minLat 최소 위도
     * @param maxLat 최대 위도
     * @param minLon 최소 경도
     * @param maxLon 최대 경도
     * @return 경계 내 사고 데이터 목록
     */
    @Query("SELECT a FROM AccidentData a WHERE a.estimatedLat BETWEEN :minLat AND :maxLat AND a.estimatedLon BETWEEN :minLon AND :maxLon")
    List<AccidentHotspot> findByBounds(@Param("minLat") BigDecimal minLat, @Param("maxLat") BigDecimal maxLat, @Param("minLon") BigDecimal minLon, @Param("maxLon") BigDecimal maxLon);

    /**
     * 특정 지역(시도, 시군구)의 사고 데이터를 조회합니다.
     */
    List<AccidentHotspot> findBySidoCodeAndSigunguCode(String sidoCode, String sigunguCode);
}

