package com.kdt03.ped_accident.domain.suggestion.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionRepository;

@Service
public class SuggestionService {

    private final SuggestionRepository suggestionRepository;

    public SuggestionService(SuggestionRepository suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    // 전체 조회
    public Page<Suggestion> findAll(Pageable pageable, SuggestionStatus status, String region) {
        if (status != null) {
            return suggestionRepository.findByStatus(status, pageable);
        }
        return suggestionRepository.findAll(pageable);
    }

    // 단건 조회
    public Suggestion findById(Long id) {
        return suggestionRepository.findById(id).orElse(null);
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