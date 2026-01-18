package com.kdt03.ped_accident.domain.suggestion.repository;

import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {

    @Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user")
    Page<Suggestion> findAllWithUser(Pageable pageable);
    
    @Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user WHERE s.status = :status")
    Page<Suggestion> findByStatusWithUser(@Param("status") SuggestionStatus status, Pageable pageable);
    
    @Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user WHERE s.suggestionType = :type")
    Page<Suggestion> findByTypeWithUser(@Param("type") SuggestionType type, Pageable pageable);
    
    @Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user WHERE s.address LIKE :region%")
    Page<Suggestion> findByRegionWithUser(@Param("region") String region, Pageable pageable);
    
    @Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user WHERE " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:type IS NULL OR s.suggestionType = :type) AND " +
           "(:region IS NULL OR s.address LIKE CONCAT(:region, '%'))")
    Page<Suggestion> findByFiltersWithUser(
        @Param("status") SuggestionStatus status,
        @Param("type") SuggestionType type,
        @Param("region") String region,
        Pageable pageable
    );
    
    // 실제 존재하는 지역(시/도) 목록 조회
    @Query("SELECT DISTINCT SUBSTRING(s.address, 1, LOCATE(' ', s.address) - 1) FROM Suggestion s " +
           "WHERE s.address IS NOT NULL AND s.address != '' " +
           "ORDER BY SUBSTRING(s.address, 1, LOCATE(' ', s.address) - 1)")
    List<String> findDistinctRegions();
 
    Page<Suggestion> findAllByOrderByCreatedAtDesc(Pageable pageable);

	Page<Suggestion> findByStatus(SuggestionStatus status, Pageable pageable);
	
	Page<Suggestion> findByUserId(Long userId, Pageable pageable);
	
	Page<Suggestion> findByUserIdAndStatus(Long userId, SuggestionStatus status, Pageable pageable);
}

