package com.kdt03.ped_accident.domain.district.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.district.entity.DistrictWithLatLon;

@Repository
public interface DistrictWithLatLonRepository extends JpaRepository<DistrictWithLatLon, Long> {

    @Query("SELECT d FROM DistrictWithLatLon d WHERE d.bjdNm LIKE :province%")
    List<DistrictWithLatLon> findByProvincePrefix(@Param("province") String province);

    @Query("SELECT d FROM DistrictWithLatLon d")
    List<DistrictWithLatLon> findAllDistricts();
}
