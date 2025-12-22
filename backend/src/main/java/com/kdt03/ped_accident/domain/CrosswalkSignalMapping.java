package com.kdt03.ped_accident.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "crosswalk_signal_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CrosswalkSignalMapping {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    @Column(name = "cw_uid")
	    private String cwUid;
	    
	    @Column(name = "sg_uid")
	    private String sgUid;
	    
	    @Column(name = "distance_m", precision = 8, scale = 3)
	    private BigDecimal distanceM;
	    
	    @Column(precision = 6, scale = 6)
	    private BigDecimal confidence;
	    
	    private String sido;
	    private String sigungu;
	    
	    @CreationTimestamp
	    @Column(name = "created_at")
	    private LocalDateTime createdAt;
}
