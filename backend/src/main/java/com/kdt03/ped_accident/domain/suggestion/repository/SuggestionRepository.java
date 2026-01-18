package com.kdt03.ped_accident.domain.suggestion.repository;

import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {

    @Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user")
    Page<Suggestion> findAllWithUser(Pageable pageable);
    
    @Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user WHERE s.status = :status")
    Page<Suggestion> findByStatusWithUser(SuggestionStatus status, Pageable pageable);
 
    Page<Suggestion> findAllByOrderByCreatedAtDesc(Pageable pageable);

	Page<Suggestion> findByStatus(SuggestionStatus status, Pageable pageable);
	
	Page<Suggestion> findByUserId(Long userId, Pageable pageable);
	
	Page<Suggestion> findByUserIdAndStatus(Long userId, SuggestionStatus status, Pageable pageable);
}

