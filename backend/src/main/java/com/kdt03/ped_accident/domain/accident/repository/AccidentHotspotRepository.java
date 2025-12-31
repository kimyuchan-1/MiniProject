package com.kdt03.ped_accident.domain.accident.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.accident.entity.AccidentHotspot;

@Repository
public interface AccidentHotspotRepository extends JpaRepository<AccidentHotspot, Long> {

	@Query("""
			SELECT ahs
			FROM AccidentHotspot ahs
			WHERE ahs.accidentLat BETWEEN :minLat AND :maxLat
			  AND ahs.accidentLon BETWEEN :minLon AND :maxLon
			""")
	List<AccidentHotspot> findByBounds(@Param("minLat") BigDecimal minLat, @Param("maxLat") BigDecimal maxLat,
			@Param("minLon") BigDecimal minLon, @Param("maxLon") BigDecimal maxLon);

	List<AccidentHotspot> findByDistrictCode(String districtCode);
}
