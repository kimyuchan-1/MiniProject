package com.kdt03.ped_accident.domain.signal.repository;

import com.kdt03.ped_accident.domain.signal.entity.TrafficSignal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TrafficSignalRepository extends JpaRepository<TrafficSignal, String> {

    /**
     * 지정된 지리적 경계 내의 신호등 데이터를 조회합니다.
     *
     * @param minLat 최소 위도
     * @param maxLat 최대 위도
     * @param minLon 최소 경도
     * @param maxLon 최대 경도
     * @return 경계 내 신호등 데이터 목록
     */
    @Query("SELECT s FROM TrafficSignal s WHERE s.latitude BETWEEN :minLat AND :maxLat AND s.longitude BETWEEN :minLon AND :maxLon")
    List<TrafficSignal> findByBounds(@Param("minLat") BigDecimal minLat, @Param("maxLat") BigDecimal maxLat, @Param("minLon") BigDecimal minLon, @Param("maxLon") BigDecimal maxLon);
}

