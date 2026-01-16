package com.kdt03.ped_accident.domain.crosswalk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;

public interface CrosswalkRepository extends JpaRepository<Crosswalk, String> {

	@Query(value = """
	        SELECT
	          c.cw_uid AS cwUid,
	          c.crosswalk_lat AS crosswalkLat,
	          c.crosswalk_lon AS crosswalkLon,
	          c.address AS address,
	          c.is_highland AS isHighland,
	          c.has_ped_button AS hasPedButton,
	          c.has_ped_sound AS hasPedSound,
	          c.has_bump AS hasBump,
	          c.has_braille_block AS hasBrailleBlock,
	          c.has_spotlight AS hasSpotlight,

	          CASE
	            WHEN c.has_ped_signal = 1 THEN 1
	            WHEN EXISTS (SELECT 1 FROM crosswalk_signal_map s WHERE s.cw_uid = c.cw_uid) THEN 1
	            ELSE 0
	          END AS hasSignal,

	          CASE
	            WHEN c.has_ped_signal = 1 THEN 'direct'
	            WHEN EXISTS (SELECT 1 FROM crosswalk_signal_map s WHERE s.cw_uid = c.cw_uid) THEN 'mapped'
	            ELSE 'none'
	          END AS signalSource

	        FROM crosswalks c
	        WHERE c.crosswalk_lat BETWEEN :south AND :north
	          AND c.crosswalk_lon BETWEEN :west AND :east
	        LIMIT 5000
	        """, nativeQuery = true)
	    List<CrosswalkProjection> findInBounds(
	            @Param("south") double south,
	            @Param("west") double west,
	            @Param("north") double north,
	            @Param("east") double east,
	            @Param("limit") int limit
	    );
}