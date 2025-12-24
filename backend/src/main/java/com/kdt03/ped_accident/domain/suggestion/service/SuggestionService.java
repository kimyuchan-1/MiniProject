package com.kdt03.ped_accident.domain.suggestion.service;

import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.SuggestionStatistics;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SuggestionService {
    Page<Suggestion> getSuggestions(Pageable pageable, SuggestionStatus status, String region);
    Suggestion createSuggestion(CreateSuggestionRequest request, Long userId);
    Suggestion getSuggestion(Long id);
    Suggestion updateSuggestionStatus(Long suggestionId, SuggestionStatus status, String adminResponse, Long adminId);
    void likeSuggestion(Long suggestionId, Long userId);
    void unlikeSuggestion(Long suggestionId, Long userId);
    List<SuggestionComment> getComments(Long suggestionId);
    SuggestionComment addComment(Long suggestionId, String content, Long userId, Long parentId);
    SuggestionStatistics getSuggestionStatistics();
}
