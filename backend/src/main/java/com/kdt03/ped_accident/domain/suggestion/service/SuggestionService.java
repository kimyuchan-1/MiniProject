package com.kdt03.ped_accident.domain.suggestion.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;

@Service
public class SuggestionService {
    public Page<Suggestion> getSuggestions(Pageable pageable, SuggestionStatus status, Long districtCode) {
		return null;
	}
    public Suggestion createSuggestion(CreateSuggestionRequest request, Long userId) {
		return null;
	}
    public Suggestion updateSuggestionStatus(Long suggestionId, SuggestionStatus status, String adminResponse, Long adminId) {
		return null;
	}
    public List<SuggestionComment> getComments(Long suggestionId) {
		return null;
	}
    public SuggestionComment addComment(Long suggestionId, String content, Long userId, Long parentId) {
		return null;
	}
    public SuggestionStatistics getSuggestionStatistics() {
		return null;
	}
}