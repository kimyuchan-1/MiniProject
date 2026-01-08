package com.kdt03.ped_accident.domain.crosswalk.repository;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CWRepository extends JpaRepository<CW, String> {

  @Query("""
    SELECT DISTINCT c
    FROM CW c
    LEFT JOIN FETCH c.cwSg sg
    WHERE c.crosswalkLat >= :south
      AND c.crosswalkLat <= :north
      AND c.crosswalkLon >= :west
      AND c.crosswalkLon <= :east
  """)
  List<CW> findInBoundsWithSg(
      @Param("south") double south,
      @Param("north") double north,
      @Param("west") double west,
      @Param("east") double east,
      Pageable pageable
  );
}