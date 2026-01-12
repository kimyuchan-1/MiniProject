package com.kdt03.ped_accident.domain.crosswalk.repository;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;

import java.util.List;

public interface CrosswalkRepository extends JpaRepository<Crosswalk, String> {

  @Query("""
    SELECT DISTINCT c
    FROM Crosswalk c
    LEFT JOIN FETCH c.cwSg sg
    WHERE c.crosswalkLat >= :south
      AND c.crosswalkLat <= :north
      AND c.crosswalkLon >= :west
      AND c.crosswalkLon <= :east
  """)
  List<Crosswalk> findInBoundsWithSg(
      @Param("south") double south,
      @Param("north") double north,
      @Param("west") double west,
      @Param("east") double east,
      Pageable pageable
  );
}