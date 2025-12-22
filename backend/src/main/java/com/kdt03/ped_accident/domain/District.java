package com.kdt03.ped_accident.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "districts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class District {
	@Id
	@Column(name = "district_code")
	private Long districtCode;

	@Column(name = "district_name")
	private String districtName;

	private Integer available;

	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;
}
