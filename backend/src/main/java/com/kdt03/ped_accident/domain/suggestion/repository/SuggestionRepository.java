package com.kdt03.ped_accident.domain.suggestion.repository;

import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {

    /**
     * 모든 건의사항을 페이징 처리하여 최신순으로 조회합니다.
     *
     * @param pageable 페이징 정보
     * @return 페이징된 건의사항 목록
     */
    Page<Suggestion> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

