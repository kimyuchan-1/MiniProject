package com.kdt03.ped_accident.domain.suggestion.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.PagedItems;
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
    public PagedItems<Suggestion> getMySuggestions(Long userId, int page, int pageSize, String statusRaw) {
        int safePage = Math.max(page, 1);            // 프론트는 1-based로 쓰는 걸 권장
        int safeSize = Math.min(Math.max(pageSize, 1), 50); // 과도한 요청 방어

        Pageable pageable = PageRequest.of(
                safePage - 1,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Suggestion> result;
        if (statusRaw == null || statusRaw.equalsIgnoreCase("ALL") || statusRaw.isBlank()) {
            result = suggestionRepository.findByUserId(userId, pageable);
        } else {
            SuggestionStatus st = SuggestionStatus.valueOf(statusRaw.toUpperCase());
            result = suggestionRepository.findByUserIdAndStatus(userId, st, pageable);
        }

        List<Suggestion> items = result.getContent().stream()
                .map(Suggestion::from)
                .toList();

        return PagedItems.<Suggestion>builder()
                .items(items)
                .page(safePage)
                .pageSize(safeSize)
                .total(result.getTotalElements())
                .build();
    }
}