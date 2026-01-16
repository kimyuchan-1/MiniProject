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

	// 전국 데이터 조회
	List<Accident> findAll();

	// 시도(2자리) 기준 조회
	@Query("SELECT a FROM Accident a WHERE a.sidoCode >= :gte AND a.sidoCode < :lt")
	List<Accident> findBySidoCodeRange(@Param("gte") String gte, @Param("lt") String lt);

	// 시군구(5자리) 기준 조회
	@Query("SELECT a FROM Accident a WHERE a.sigunguCode >= :gte AND a.sigunguCode < :lt")
	List<Accident> findBySigunguCodeRange(@Param("gte") String gte, @Param("lt") String lt);

	// 시군구(10자리) 정확히 일치 조회
	List<Accident> findBySigunguCode(String sigunguCode);
}
