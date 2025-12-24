package com.kdt03.ped_accident.api.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.domain.suggestion.entity.Suggestion;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionComment;
import com.kdt03.ped_accident.domain.suggestion.entity.SuggestionStatus;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {
    
    @GetMapping
    public ResponseEntity<Page<Suggestion>> getSuggestions(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
        @RequestParam(required = false) SuggestionStatus status,
        @RequestParam(required = false) String region);
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Suggestion> createSuggestion(
        @RequestBody @Valid CreateSuggestionRequest request,
        Authentication authentication);
    
    @GetMapping("/{id}")
    public ResponseEntity<Suggestion> getSuggestion(@PathVariable Long id);
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Suggestion> updateSuggestionStatus(
        @PathVariable Long id,
        @RequestBody @Valid UpdateSuggestionStatusRequest request,
        Authentication authentication);
    
    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> likeSuggestion(
        @PathVariable Long id,
        Authentication authentication);
    
    @DeleteMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unlikeSuggestion(
        @PathVariable Long id,
        Authentication authentication);
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<SuggestionComment>> getComments(@PathVariable Long id);
    
    @PostMapping("/{id}/comments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SuggestionComment> addComment(
        @PathVariable Long id,
        @RequestBody @Valid AddCommentRequest request,
        Authentication authentication);
    
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuggestionStatistics> getSuggestionStatistics();
}