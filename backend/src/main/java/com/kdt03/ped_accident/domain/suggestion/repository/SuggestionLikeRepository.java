package com.kdt03.ped_accident.domain.suggestion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionLike;

@Repository
public interface SuggestionLikeRepository extends JpaRepository<SuggestionLike, Long> {
    
    Optional<SuggestionLike> findBySuggestionIdAndUserId(Long suggestionId, Long userId);
    
    boolean existsBySuggestionIdAndUserId(Long suggestionId, Long userId);
    
    long countBySuggestionId(Long suggestionId);
    
    List<SuggestionLike> findBySuggestionId(Long suggestionId);
}
