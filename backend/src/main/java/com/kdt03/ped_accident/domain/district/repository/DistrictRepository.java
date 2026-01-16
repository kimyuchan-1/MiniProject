package com.kdt03.ped_accident.domain.district.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.district.entity.District;

@Repository
public interface DistrictRepository extends JpaRepository<District, String> {

    /**
     * 시도 코드와 시군구 코드로 특정 지역을 조회합니다.
     *
     * @param sidoCode   시도 코드
     * @param sigunguCode 시군구 코드
     * @return Optional<District>
     */
    Optional<District> findByDistrictCode(String districtCode);
    
    @Query(value = """
            SELECT DISTINCT
                LEFT(a.sido_code, 2) AS code,
                d.district_name       AS name
            FROM accidents a
            JOIN districts d
              ON d.district_id COLLATE utf8mb4_unicode_ci = CONCAT(LEFT(a.sido_code, 2), '00000000') COLLATE utf8mb4_unicode_ci
            ORDER BY name
            """, nativeQuery = true)
        List<ProvinceProjection> findProvinces();
}

