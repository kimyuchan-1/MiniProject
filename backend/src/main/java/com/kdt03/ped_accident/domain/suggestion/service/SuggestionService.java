package com.kdt03.ped_accident.domain.suggestion.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.PagedItems;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionLike;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionCommentRepository;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionLikeRepository;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SuggestionService {

    private final SuggestionRepository suggestionRepository;
    private final SuggestionCommentRepository commentRepository;
    private final SuggestionLikeRepository likeRepository;

    // 전체 조회
    public Page<Suggestion> findAll(Pageable pageable, SuggestionStatus status, String region) {
        if (status != null) {
            return suggestionRepository.findByStatus(status, pageable);
        }
        return suggestionRepository.findAll(pageable);
    }

    // 단건 조회 (조회수 증가)
    @Transactional
    public Suggestion findById(Long id) {
        Optional<Suggestion> opt = suggestionRepository.findById(id);
        if (opt.isEmpty()) return null;
        
        Suggestion suggestion = opt.get();
        suggestion.setViewCount(suggestion.getViewCount() + 1);
        return suggestionRepository.save(suggestion);
    }

    // 건의사항 생성
    @Transactional
    public Suggestion createSuggestion(CreateSuggestionRequest request, Long userId) {
        Suggestion suggestion = Suggestion.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .locationLat(request.getLocationLat().doubleValue())
                .locationLon(request.getLocationLon().doubleValue())
                .address(request.getAddress())
                .suggestionType(request.getSuggestionType())
                .status(SuggestionStatus.PENDING)
                .viewCount(0)
                .likeCount(0)
                .commentCount(0)
                .build();

        return suggestionRepository.save(suggestion);
    }

    // 건의사항 수정
    @Transactional
    public Suggestion updateSuggestion(Long suggestionId, String title, String content, Long userId) {
        Suggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        // 본인 글만 수정 가능
        if (!suggestion.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 글만 수정할 수 있습니다.");
        }

        // PENDING 상태만 수정 가능
        if (suggestion.getStatus() != SuggestionStatus.PENDING) {
            throw new IllegalArgumentException("접수 상태의 건의사항만 수정할 수 있습니다.");
        }

        suggestion.setTitle(title);
        suggestion.setContent(content);
        return suggestionRepository.save(suggestion);
    }

    // 건의사항 삭제
    @Transactional
    public void deleteSuggestion(Long suggestionId, Long userId) {
        Suggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        // 본인 글만 삭제 가능
        if (!suggestion.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 글만 삭제할 수 있습니다.");
        }

        // PENDING 상태만 삭제 가능
        if (suggestion.getStatus() != SuggestionStatus.PENDING) {
            throw new IllegalArgumentException("접수 상태의 건의사항만 삭제할 수 있습니다.");
        }

        suggestionRepository.delete(suggestion);
    }

    // 상태 변경 (관리자)
    @Transactional
    public Suggestion updateSuggestionStatus(Long suggestionId, SuggestionStatus status, String adminResponse, Long adminId) {
        Suggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        suggestion.setStatus(status);
        return suggestionRepository.save(suggestion);
    }

    // 댓글 목록 조회
    public List<SuggestionComment> getComments(Long suggestionId) {
        return commentRepository.findBySuggestionIdOrderByCreatedAtAsc(suggestionId);
    }

    // 댓글 작성
    @Transactional
    public SuggestionComment addComment(Long suggestionId, String content, Long userId, Long parentId) {
        // 건의사항 존재 확인
        Suggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        // 대댓글인 경우 부모 댓글 검증
        if (parentId != null) {
            SuggestionComment parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException("원댓글을 찾을 수 없습니다."));
            if (!parent.getSuggestionId().equals(suggestionId)) {
                throw new IllegalArgumentException("다른 게시글의 댓글에는 답글을 달 수 없습니다.");
            }
        }

        SuggestionComment comment = SuggestionComment.builder()
                .suggestionId(suggestionId)
                .userId(userId)
                .content(content)
                .parentId(parentId)
                .build();

        SuggestionComment saved = commentRepository.save(comment);

        // 댓글 수 증가
        suggestion.setCommentCount(suggestion.getCommentCount() + 1);
        suggestionRepository.save(suggestion);

        return saved;
    }

    // 좋아요 토글
    @Transactional
    public boolean toggleLike(Long suggestionId, Long userId) {
        Suggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        Optional<SuggestionLike> existingLike = likeRepository.findBySuggestionIdAndUserId(suggestionId, userId);

        if (existingLike.isPresent()) {
            // 좋아요 취소
            likeRepository.delete(existingLike.get());
            suggestion.setLikeCount(Math.max(0, suggestion.getLikeCount() - 1));
            suggestionRepository.save(suggestion);
            return false;
        } else {
            // 좋아요 추가
            SuggestionLike like = SuggestionLike.builder()
                    .suggestionId(suggestionId)
                    .userId(userId)
                    .build();
            likeRepository.save(like);
            suggestion.setLikeCount(suggestion.getLikeCount() + 1);
            suggestionRepository.save(suggestion);
            return true;
        }
    }

    // 좋아요 여부 확인
    public boolean isLikedByUser(Long suggestionId, Long userId) {
        return likeRepository.existsBySuggestionIdAndUserId(suggestionId, userId);
    }

    // 통계
    public SuggestionStatistics getSuggestionStatistics() {
        // TODO: 통계 구현
        return null;
    }

    // 내 건의사항 목록
    public PagedItems<Suggestion> getMySuggestions(Long userId, int page, int pageSize, String statusRaw) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(pageSize, 1), 50);

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
