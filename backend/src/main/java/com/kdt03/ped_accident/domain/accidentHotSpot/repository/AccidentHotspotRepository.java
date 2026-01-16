package com.kdt03.ped_accident.domain.accidentHotSpot.repository;


import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.accidentHotSpot.entity.AccidentHotspot;

@Repository
public interface AccidentHotspotRepository extends JpaRepository<AccidentHotspot, Long> {

	@Query("""
			SELECT ahs
			FROM AccidentHotspot ahs
			WHERE ahs.accidentLat BETWEEN :south AND :north
			  AND ahs.accidentLon BETWEEN :west AND :east
			""")
	List<AccidentHotspot> findByBounds(@Param("south") Double south, @Param("west") Double west,
			@Param("north") Double north, @Param("east") Double east, Pageable pageable);

	List<AccidentHotspot> findByDistrictCode(String districtCode);
}
