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
    private String districtCode;
	
	private String address;
	
	@Column(name = "crosswalk_type")
	private Integer crosswalkType;
	
	@Column(name = "is_highland")
	private Boolean isHighland;
	
	@Column(name = "crosswalk_lat", precision = 10, scale = 8)
	private BigDecimal crosswalkLat;
	
	@Column(name = "crosswalk_lon", precision = 10, scale = 8)
	private BigDecimal crosswalkLon;
	
	private Integer laneCount;
	
	@Column(name = "crosswalk_width", precision = 5, scale = 2)
	private BigDecimal crosswalkWidth;
	
	@Column(name = "crosswalk_length", precision = 5, scale = 2)
	private BigDecimal crosswalkLength;
	
	private Boolean hasPedSignal;
	private Boolean hasPedButton;
	
	@Column(name = "has_ped_sound")
	private Boolean hasPedSound;
	
	private Integer hasBump;
	
	@Column(name = "has_braille_block")
	private Boolean hasBrailleBlock;
	
	private Integer hasSpotlight;
	
}
