package com.kdt03.ped_accident.domain.suggestion.repository;

import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuggestionCommentRepository extends JpaRepository<SuggestionComment, Long> {

    /**
     * 특정 건의사항에 달린 모든 댓글을 생성일자 오름차순으로 조회합니다.
     *
     * @param suggestionId 건의사항 ID
     * @return 댓글 목록
     */
    List<SuggestionComment> findBySuggestionIdOrderByCreatedAtAsc(Long suggestionId);
    
    /**
     * 특정 댓글의 대댓글 개수를 조회합니다.
     *
     * @param parentId 부모 댓글 ID
     * @return 대댓글 개수
     */
    long countByParentId(Long parentId);
}

