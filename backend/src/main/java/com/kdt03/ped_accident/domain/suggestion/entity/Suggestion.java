package com.kdt03.ped_accident.domain.suggestion.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kdt03.ped_accident.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "suggestions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Suggestion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "user_id")
	private Long userId;

	private String title;

	@Column(columnDefinition = "TEXT")
	private String content;

	@Column(name = "location_lat")
	private Double locationLat;

	@Column(name = "location_lon")
	private Double locationLon;

	private String address;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "suggestion_type")
	private SuggestionType suggestionType;

	@Enumerated(EnumType.STRING)
	private SuggestionStatus status;
	
	@Column(name = "view_count")
    private Integer viewCount = 0;

	@Column(name = "like_count")
    private Integer likeCount = 0;

	@Column(name = "comment_count")
    private Integer commentCount = 0;
    
    @Column(name = "priority_score")
    private Integer priorityScore = 0;

	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	// 연관관계
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", insertable = false, updatable = false)
	private User user;
	
	// 우선순위 점수 계산 (좋아요 * 3 + 댓글 * 2 + 조회수 * 0.1)
	public void calculatePriorityScore() {
		int likes = this.likeCount != null ? this.likeCount : 0;
		int comments = this.commentCount != null ? this.commentCount : 0;
		int views = this.viewCount != null ? this.viewCount : 0;
		this.priorityScore = (likes * 3) + (comments * 2) + (int)(views * 0.1);
	}
	
	public static Suggestion from(Suggestion s) {
        return Suggestion.builder()
                .id(s.getId())
                .title(s.getTitle())
                .status(s.getStatus())
                .suggestionType(s.getSuggestionType())
                .createdAt(s.getCreatedAt())
                .viewCount(s.getViewCount())
                .build();
    }
}
