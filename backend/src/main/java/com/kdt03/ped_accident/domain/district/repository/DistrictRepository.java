package com.kdt03.ped_accident.domain.district.repository;

import com.kdt03.ped_accident.domain.district.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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
}

