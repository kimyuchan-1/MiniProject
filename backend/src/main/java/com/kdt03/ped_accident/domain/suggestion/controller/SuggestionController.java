package com.kdt03.ped_accident.domain.suggestion.controller;

import com.kdt03.ped_accident.domain.suggestion.dto.AddCommentRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.CreateSuggestionRequest;
import com.kdt03.ped_accident.domain.suggestion.dto.SuggestionStatistics;
import com.kdt03.ped_accident.domain.suggestion.dto.UpdateSuggestionStatusRequest;
import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;
import com.kdt03.ped_accident.domain.suggestion.service.SuggestionService;
import com.kdt03.ped_accident.global.config.auth.CustomUserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
@RequiredArgsConstructor
public class SuggestionController {

    private final SuggestionService suggestionService;

    @GetMapping
    public ResponseEntity<Page<Suggestion>> getSuggestions(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) SuggestionStatus status,
            @RequestParam(required = false) String region) {
        Page<Suggestion> suggestions = suggestionService.getSuggestions(pageable, status, region);
        return ResponseEntity.ok(suggestions);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Suggestion> createSuggestion(
            @RequestBody @Valid CreateSuggestionRequest request,
            Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();
        Suggestion suggestion = suggestionService.createSuggestion(request, userId);
        return ResponseEntity.ok(suggestion);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Suggestion> getSuggestion(@PathVariable Long id) {
        Suggestion suggestion = suggestionService.getSuggestion(id);
        return ResponseEntity.ok(suggestion);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Suggestion> updateSuggestionStatus(
            @PathVariable Long id,
            @RequestBody @Valid UpdateSuggestionStatusRequest request,
            Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long adminId = principal.getUser().getId();
        Suggestion suggestion = suggestionService.updateSuggestionStatus(id, request.getStatus(), request.getAdminResponse(), adminId);
        return ResponseEntity.ok(suggestion);
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> likeSuggestion(
            @PathVariable Long id,
            Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();
        suggestionService.likeSuggestion(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unlikeSuggestion(
            @PathVariable Long id,
            Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();
        suggestionService.unlikeSuggestion(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<SuggestionComment>> getComments(@PathVariable Long id) {
        List<SuggestionComment> comments = suggestionService.getComments(id);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SuggestionComment> addComment(
            @PathVariable Long id,
            @RequestBody @Valid AddCommentRequest request,
            Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUser().getId();
        SuggestionComment comment = suggestionService.addComment(id, request.getContent(), userId, request.getParentId());
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuggestionStatistics> getSuggestionStatistics() {
        SuggestionStatistics statistics = suggestionService.getSuggestionStatistics();
        return ResponseEntity.ok(statistics);
    }
}
