package com.kdt03.ped_accident.domain.suggestion.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kdt03.ped_accident.domain.suggestion.dto.CommentResponse;
import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.PagedItems;
import com.kdt03.ped_accident.domain.suggestion.dto.SuggestionDetailResponse;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionLike;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionType;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionCommentRepository;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionLikeRepository;
import com.kdt03.ped_accident.domain.suggestion.repository.SuggestionRepository;
import com.kdt03.ped_accident.domain.user.entity.User;
import com.kdt03.ped_accident.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SuggestionService {

    private final SuggestionRepository suggestionRepository;
    private final SuggestionCommentRepository commentRepository;
    private final SuggestionLikeRepository likeRepository;
    private final UserRepository userRepository;

    // 전체 조회 (필터링 포함)
    public Page<Suggestion> findAll(Pageable pageable, SuggestionStatus status, SuggestionType type, String region, String search) {
        // 검색어 정리
        String searchFilter = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        
        // 지역 필터 정리
        String regionFilter = (region != null && !region.isEmpty() && !region.equals("ALL")) ? region : null;
        
        // 모든 필터가 null이면 전체 조회
        if (status == null && type == null && regionFilter == null && searchFilter == null) {
            return suggestionRepository.findAllWithUser(pageable);
        }
        
        // 필터 조합으로 조회
        return suggestionRepository.findByFiltersWithUser(status, type, regionFilter, searchFilter, pageable);
    }

    // 단건 조회 (조회수 증가)
    @Transactional
    public Suggestion findById(Long id) {
        Optional<Suggestion> opt = suggestionRepository.findById(id);
        if (opt.isEmpty()) return null;
        
        Suggestion suggestion = opt.get();
        // null 체크
        int currentViewCount = suggestion.getViewCount() != null ? suggestion.getViewCount() : 0;
        suggestion.setViewCount(currentViewCount + 1);
        // 우선순위 점수는 위험 지수로 고정되므로 재계산하지 않음
        return suggestionRepository.save(suggestion);
    }

    // 단건 조회 (상세 - 좋아요 여부 포함)
    @Transactional
    public SuggestionDetailResponse findByIdWithLikeStatus(Long id, Long userId) {
        Optional<Suggestion> opt = suggestionRepository.findById(id);
        if (opt.isEmpty()) return null;
        
        Suggestion suggestion = opt.get();
        // 조회수 증가
        int currentViewCount = suggestion.getViewCount() != null ? suggestion.getViewCount() : 0;
        suggestion.setViewCount(currentViewCount + 1);
        // 우선순위 점수는 위험 지수로 고정되므로 재계산하지 않음
        suggestionRepository.save(suggestion);

        // 작성자 정보 조회
        User author = null;
        if (suggestion.getUserId() != null) {
            author = userRepository.findById(suggestion.getUserId()).orElse(null);
        }

        // 좋아요 여부 확인
        boolean isLiked = false;
        if (userId != null) {
            isLiked = likeRepository.existsBySuggestionIdAndUserId(id, userId);
        }

        return SuggestionDetailResponse.from(suggestion, author, isLiked);
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
                .priorityScore(request.getPriorityScore() != null ? request.getPriorityScore() : 0.0)
                .build();

        return suggestionRepository.save(suggestion);
    }

    // 건의사항 수정
    @Transactional
    public Suggestion updateSuggestion(Long suggestionId, String title, String content, 
                                      SuggestionType suggestionType, Double locationLat, 
                                      Double locationLon, String address, Long userId) {
        Suggestion suggestion = suggestionRepository.findByIdWithUser(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        // 본인 글만 수정 가능
        if (!suggestion.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 글만 수정할 수 있습니다.");
        }

        // PENDING 상태만 수정 가능
        if (suggestion.getStatus() != SuggestionStatus.PENDING) {
            throw new IllegalArgumentException("접수 상태의 건의사항만 수정할 수 있습니다.");
        }

        // 필드 업데이트
        suggestion.setTitle(title);
        suggestion.setContent(content);
        
        if (suggestionType != null) {
            suggestion.setSuggestionType(suggestionType);
        }
        
        if (locationLat != null) {
            suggestion.setLocationLat(locationLat);
        }
        
        if (locationLon != null) {
            suggestion.setLocationLon(locationLon);
        }
        
        if (address != null && !address.isBlank()) {
            suggestion.setAddress(address);
        }
        
        return suggestionRepository.save(suggestion);
    }

    // 건의사항 삭제
    @Transactional
    public void deleteSuggestion(Long suggestionId, Long userId) {
        Suggestion suggestion = suggestionRepository.findByIdWithUser(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        // 본인 글만 삭제 가능
        if (!suggestion.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 글만 삭제할 수 있습니다.");
        }

        // PENDING 상태만 삭제 가능
        if (suggestion.getStatus() != SuggestionStatus.PENDING) {
            throw new IllegalArgumentException("접수 상태의 건의사항만 삭제할 수 있습니다.");
        }

        // 관련된 댓글 먼저 삭제
        List<SuggestionComment> comments = commentRepository.findBySuggestionIdOrderByCreatedAtAsc(suggestionId);
        if (!comments.isEmpty()) {
            commentRepository.deleteAll(comments);
        }
        
        // 관련된 좋아요 삭제
        List<SuggestionLike> likes = likeRepository.findBySuggestionId(suggestionId);
        if (!likes.isEmpty()) {
            likeRepository.deleteAll(likes);
        }

        // 건의사항 삭제
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
    public List<CommentResponse> getComments(Long suggestionId) {
        List<SuggestionComment> comments = commentRepository.findBySuggestionIdOrderByCreatedAtAsc(suggestionId);
        
        // 모든 userId 수집
        List<Long> userIds = comments.stream()
                .map(SuggestionComment::getUserId)
                .distinct()
                .collect(Collectors.toList());
        
        // 한 번에 User 조회
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));
        
        // DTO로 변환
        return comments.stream()
                .map(c -> CommentResponse.from(c, userMap.get(c.getUserId())))
                .collect(Collectors.toList());
    }

    // 댓글 작성
    @Transactional
    public CommentResponse addComment(Long suggestionId, String content, Long userId, Long parentId) {
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

        // 댓글 수 증가 (null 체크)
        int currentCommentCount = suggestion.getCommentCount() != null ? suggestion.getCommentCount() : 0;
        suggestion.setCommentCount(currentCommentCount + 1);
        
        // 우선순위 점수는 위험 지수로 고정되므로 재계산하지 않음
        suggestionRepository.save(suggestion);

        // User 조회해서 DTO로 반환
        User user = userRepository.findById(userId).orElse(null);
        return CommentResponse.from(saved, user);
    }
    
    // 댓글 수정
    @Transactional
    public CommentResponse updateComment(Long commentId, String content, Long userId) {
        SuggestionComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        
        // 본인 댓글만 수정 가능
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 댓글만 수정할 수 있습니다.");
        }
        
        comment.setContent(content);
        SuggestionComment updated = commentRepository.save(comment);
        
        // User 조회해서 DTO로 반환
        User user = userRepository.findById(userId).orElse(null);
        return CommentResponse.from(updated, user);
    }
    
    // 댓글 삭제
    @Transactional
    public void deleteComment(Long commentId, Long userId, boolean isAdmin) {
        SuggestionComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        
        // 본인 댓글이거나 관리자만 삭제 가능
        if (!comment.getUserId().equals(userId) && !isAdmin) {
            throw new IllegalArgumentException("본인의 댓글만 삭제할 수 있습니다.");
        }
        
        // 건의사항 조회
        Suggestion suggestion = suggestionRepository.findById(comment.getSuggestionId())
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));
        
        // 대댓글 개수 확인
        long replyCount = commentRepository.countByParentId(commentId);
        
        commentRepository.delete(comment);
        
        // 댓글 수 감소 (대댓글 포함)
        int currentCommentCount = suggestion.getCommentCount() != null ? suggestion.getCommentCount() : 0;
        suggestion.setCommentCount(Math.max(0, currentCommentCount - 1 - (int)replyCount));
        
        // 우선순위 점수는 위험 지수로 고정되므로 재계산하지 않음
        suggestionRepository.save(suggestion);
    }

    // 좋아요 토글
    @Transactional
    public boolean toggleLike(Long suggestionId, Long userId) {
        Suggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("건의사항을 찾을 수 없습니다."));

        Optional<SuggestionLike> existingLike = likeRepository.findBySuggestionIdAndUserId(suggestionId, userId);

        // null 체크
        int currentLikeCount = suggestion.getLikeCount() != null ? suggestion.getLikeCount() : 0;

        if (existingLike.isPresent()) {
            // 좋아요 취소
            likeRepository.delete(existingLike.get());
            suggestion.setLikeCount(Math.max(0, currentLikeCount - 1));
            // 우선순위 점수는 위험 지수로 고정되므로 재계산하지 않음
            suggestionRepository.save(suggestion);
            return false;
        } else {
            // 좋아요 추가
            SuggestionLike like = SuggestionLike.builder()
                    .suggestionId(suggestionId)
                    .userId(userId)
                    .build();
            likeRepository.save(like);
            suggestion.setLikeCount(currentLikeCount + 1);
            // 우선순위 점수는 위험 지수로 고정되므로 재계산하지 않음
            suggestionRepository.save(suggestion);
            return true;
        }
    }

    // 좋아요 여부 확인
    public boolean isLikedByUser(Long suggestionId, Long userId) {
        return likeRepository.existsBySuggestionIdAndUserId(suggestionId, userId);
    }
    
    // 실제 존재하는 지역 목록 조회
    public List<String> getAvailableRegions() {
        return suggestionRepository.findDistinctRegions();
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
