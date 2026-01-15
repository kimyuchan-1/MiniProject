package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.PagedItems;
import com.kdt03.ped_accident.domain.suggestion.dto.SuggestionStatistics;
import com.kdt03.ped_accident.domain.suggestion.dto.UpdateSuggestionStatusRequest;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
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
            @RequestParam(required = false) String region) {

        Page<Suggestion> suggestions = suggestionService.findAll(pageable, status, region);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Suggestion> getSuggestion(@PathVariable Long id) {
        Suggestion suggestion = suggestionService.findById(id);
        if (suggestion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(suggestion);
    }

	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<Suggestion> createSuggestion(@RequestBody @Valid CreateSuggestionRequest request,
			Authentication authentication) {
		return null;
	}

	@PutMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Suggestion> updateSuggestionStatus(@PathVariable Long id,
			@RequestBody @Valid UpdateSuggestionStatusRequest request, Authentication authentication) {
		return null;
	}

	@GetMapping("/{id}/comments")
	public ResponseEntity<List<SuggestionComment>> getComments(@PathVariable Long id) {
		return null;
	}

	@PostMapping("/{id}/comments")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<SuggestionComment> addComment(@PathVariable Long id,
			@RequestBody @Valid AddCommentRequest request, Authentication authentication) {
		return null;
	}

	@GetMapping("/statistics")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SuggestionStatistics> getSuggestionStatistics() {
		return null;
	}
	
	@GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedItems<Suggestion>>> mySuggestions(
            Authentication authentication,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "ALL") String status
    ) {
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
            // status 값이 enum에 없을 때 valueOf에서 터짐
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("status 값이 올바르지 않습니다"));
        }
    }
}
