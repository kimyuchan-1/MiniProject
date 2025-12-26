package com.kdt03.ped_accident.domain.crosswalk.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
@Table(name = " crosswalks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Crosswalk {
	@Id
	@Column(name = "cw_uid")
	private String cwUid;
	
	@Column(name = "district_code")
    private Long districtCode;
	
	private String address;
	
	@Column(name = " crosswalk_type")
	private Integer crosswalkType;
	
	private Integer highland;
	
	@Column(name = "crosswalk_lat", precision = 10, scale = 8)
	private BigDecimal crosswalkLat;
	
	private Integer laneCount;
	
	@Column(name = "crosswalk_width", precision = 5, scale = 2)
	private BigDecimal crosswalkWidth;
	
	@Column(name = "crosswalk_length", precision = 5, scale = 2)
	private BigDecimal crosswalkLength;
	
	private Integer hasSignal;
	private Integer hasButton;
	
	@Column(name = "sound_signal")
	private Integer hasSoundSignal;
	
	private Integer hasBump;
	
	@Column(name = "braille_block")
	private Integer hasBrailleBlock;
	
	private Integer hasSpotlight;
	
	@Column(name = "org_code")
	private Integer orgCode;
	
	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
}
