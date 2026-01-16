package com.kdt03.ped_accident.domain.accident.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kdt03.ped_accident.domain.accident.entity.Accident;
import com.kdt03.ped_accident.domain.district.repository.DistrictCityProjection;

public interface AccidentRepository extends JpaRepository<Accident, Long>{
	
	@Query(value = """
	        SELECT
	            SUBSTRING(a.sigungu_code, 1, 5) AS code,
	            COALESCE(NULLIF(TRIM(d.district_short_name), ''), NULLIF(TRIM(d.district_name), ''), SUBSTRING(a.sigungu_code, 1, 5)) AS name
	        FROM accidents a
	        LEFT JOIN districts d
	          ON d.district_code = SUBSTRING(a.sigungu_code, 1, 5)
	        WHERE a.sido_code >= :gte
	          AND a.sido_code <  :lt
	        GROUP BY code, name
	        ORDER BY code
	        """, nativeQuery = true)
	    List<DistrictCityProjection> findDistrictCities(@Param("gte") String gte, @Param("lt") String lt);
}
