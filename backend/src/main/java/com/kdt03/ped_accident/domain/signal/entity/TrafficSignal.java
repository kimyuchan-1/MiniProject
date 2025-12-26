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
@Table(name = "traffic_signals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficSignal {
	@Id
	@Column(name = "sg_uid")
	private String sgUid;
	
	private String sido;
	private String sigungu;
	
	@Column(name = "road_direction")
	private Integer roadDirection;
	
	private String address;
	
	@Column(name =" signal_lat", precision = 10, scale = 8)
	private BigDecimal signalLat;
	
	@Column(name =" signal_lon", precision = 10, scale = 8)
	private BigDecimal sognalLon;
	
	@Column(name =" road_shape")
	private Integer roadShape;
	
	@Column(name = "main_road")
	private Integer mainRoad;
	
	@Column(name = "signal_type")
	private Integer signalType;
	
	private Integer button;
	
	@Column(name = "remain_time")
	private Integer remainTime;
	
	@Column(name = "sound_signal")
	private Integer soundSignal;
	
	@Column(name = "org_code")
	private Integer orgCode;
	
	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
	
}
