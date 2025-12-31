package com.kdt03.ped_accident.domain.signal.entity;

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
@Table(name = "signals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficSignal {
	@Id
	@Column(name = "sg_uid")
	private String sgUid;
	
	@Column(name = "sido_code")
    private String sideCode;
	
	@Column(name = "sigungu_code")
    private String sigunguCode;
	
	@Column(name = "road_type")
	private String roadType;
	
	@Column(name =" road_shape")
	private String roadShape;
	
	private String address;
	
	@Column(name =" signal_lat", precision = 10, scale = 8)
	private BigDecimal signalLat;
	
	@Column(name = "signal_lon", precision = 11, scale = 8)
	private BigDecimal signalLon;
	
	@Column(name = "is_main_road")
	private Boolean isMainRoad;
	
	@Column(name = "signal_type")
	private String signalType;
	
	@Column(name = "has_ped_button")
	private Boolean hasPedButton;
	
	@Column(name = "has_time_show")
	private Boolean hasTimeShow;
	
	@Column(name = "has_sound_signal")
	private Boolean hasSoundSignal;
}
