package com.kdt03.ped_accident.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.api.dto.response.ApiResponse;
import com.kdt03.ped_accident.domain.suggestion.dto.AddCommentRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.CommentResponse;
import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.PagedItems;
import com.kdt03.ped_accident.domain.suggestion.dto.SuggestionDetailResponse;
import com.kdt03.ped_accident.domain.suggestion.dto.SuggestionStatistics;
import com.kdt03.ped_accident.domain.suggestion.dto.UpdateSuggestionStatusRequest;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionType;
import com.kdt03.ped_accident.domain.suggestion.service.SuggestionService;
import com.kdt03.ped_accident.domain.user.service.CustomUserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private final SuggestionService suggestionService;

    public SuggestionController(SuggestionService suggestionService) {
        this.suggestionService = suggestionService;
    }

    @GetMapping
    public ResponseEntity<Page<Suggestion>> getSuggestions(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) SuggestionStatus status,
            @RequestParam(required = false) SuggestionType type,
            @RequestParam(required = false) String region) {

        Page<Suggestion> suggestions = suggestionService.findAll(pageable, status, type, region);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSuggestion(@PathVariable Long id, Authentication authentication) {
        Long userId = null;
        if (authentication != null && authentication.isAuthenticated() 
                && authentication.getPrincipal() instanceof CustomUserPrincipal) {
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            userId = principal.getUser().getId();
        }

        SuggestionDetailResponse suggestion = suggestionService.findByIdWithLikeStatus(id, userId);
        if (suggestion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(suggestion);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createSuggestion(
            @RequestBody @Valid CreateSuggestionRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();

        try {
            Suggestion created = suggestionService.createSuggestion(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateSuggestion(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();

        String title = (String) request.get("title");
        String content = (String) request.get("content");
        String suggestionTypeStr = (String) request.get("suggestion_type");
        Object locationLatObj = request.get("location_lat");
        Object locationLonObj = request.get("location_lon");
        String address = (String) request.get("address");

        if (title == null || title.isBlank() || content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "제목과 내용은 필수입니다."));
        }

        try {
            SuggestionType suggestionType = suggestionTypeStr != null ? 
                    SuggestionType.valueOf(suggestionTypeStr) : null;
            
            Double locationLat = locationLatObj != null ? 
                    ((Number) locationLatObj).doubleValue() : null;
            Double locationLon = locationLonObj != null ? 
                    ((Number) locationLonObj).doubleValue() : null;
            
            Suggestion updated = suggestionService.updateSuggestion(
                    id, title, content, suggestionType, locationLat, locationLon, address, userId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteSuggestion(
            @PathVariable Long id,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();

        try {
            suggestionService.deleteSuggestion(id, userId);
            return ResponseEntity.ok(Map.of("message", "건의사항이 삭제되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSuggestionStatus(
            @PathVariable Long id,
            @RequestBody @Valid UpdateSuggestionStatusRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long adminId = principal.getUser().getId();

        try {
            Suggestion updated = suggestionService.updateSuggestionStatus(
                    id, request.getStatus(), request.getAdminResponse(), adminId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        List<CommentResponse> comments = suggestionService.getComments(id);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @RequestBody @Valid AddCommentRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();

        try {
            CommentResponse comment = suggestionService.addComment(
                    id, request.getContent(), userId, request.getParentId());
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{suggestionId}/comments/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateComment(
            @PathVariable Long suggestionId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();
        String content = request.get("content");

        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "댓글 내용은 필수입니다."));
        }

        try {
            CommentResponse comment = suggestionService.updateComment(commentId, content, userId);
            return ResponseEntity.ok(comment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{suggestionId}/comments/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long suggestionId,
            @PathVariable Long commentId,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        try {
            suggestionService.deleteComment(commentId, userId, isAdmin);
            return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long id,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "인증이 필요합니다."));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();

        try {
            boolean liked = suggestionService.toggleLike(id, userId);
            String message = liked ? "좋아요를 추가했습니다." : "좋아요를 취소했습니다.";
            return ResponseEntity.ok(Map.of("liked", liked, "message", message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuggestionStatistics> getSuggestionStatistics() {
        SuggestionStatistics stats = suggestionService.getSuggestionStatistics();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/regions")
    public ResponseEntity<List<String>> getAvailableRegions() {
        List<String> regions = suggestionService.getAvailableRegions();
        return ResponseEntity.ok(regions);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedItems<Suggestion>>> mySuggestions(
            Authentication authentication,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "ALL") String status) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자"));
        }

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();

        try {
            PagedItems<Suggestion> payload = suggestionService.getMySuggestions(userId, page, pageSize, status);
            return ResponseEntity.ok(ApiResponse.success("내 게시글 조회 성공", payload));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("status 값이 올바르지 않습니다"));
        }
    }
}
