package com.kdt03.ped_accident.domain.suggestion.service;

import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionCommentRepository;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuggestionStatistics {

    private final SuggestionRepository suggestionRepository;
    private final SuggestionCommentRepository suggestionCommentRepository;

    /**
     * 건의사항 관련 전체 통계를 조회합니다.
     * @return 건의사항 통계 DTO
     */
    public SuggestionStatsResponse getSuggestionStatistics() {
        long totalSuggestions = suggestionRepository.count();
        long totalComments = suggestionCommentRepository.count();
        return new SuggestionStatsResponse(totalSuggestions, totalComments);
    }

    /**
     * 건의사항 통계 정보를 담는 DTO 입니다.
     * @param totalSuggestions 총 건의사항 수
     * @param totalComments 총 댓글 수
     */
    public record SuggestionStatsResponse(long totalSuggestions, long totalComments) {}
}

