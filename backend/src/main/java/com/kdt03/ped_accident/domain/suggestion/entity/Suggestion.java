package com.kdt03.ped_accident.domain.suggestion.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

	@Column(name = "location_lat", precision = 10, scale = 8)
	private BigDecimal locationLat;

	@Column(name = "location_lon", precision = 11, scale = 8)
	private BigDecimal locationLon;

	private String address;
	
	@Column(name = "district_code")
    private String districtCode;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "suggestion_type")
	private SuggestionType suggestionType;

	@Enumerated(EnumType.STRING)
	private SuggestionStatus status;
	
	@Column(name = "view_count")
    private Integer viewCount = 0;

	@Column(name = "admin_response", columnDefinition = "TEXT")
	private String adminResponse;

	@Column(name = "admin_id")
	private Long adminId;

	@Column(name = "processed_at")
	private LocalDateTime processedAt;

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "admin_id", insertable = false, updatable = false)
	private User admin;
}
