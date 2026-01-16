package com.kdt03.ped_accident.domain.suggestion.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suggestion_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"suggestion_id", "user_id"})
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuggestionLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "suggestion_id", nullable = false)
    private Long suggestionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
