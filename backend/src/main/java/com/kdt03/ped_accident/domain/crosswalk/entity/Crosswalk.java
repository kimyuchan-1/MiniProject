package com.kdt03.ped_accident.domain.crosswalk.entity;

import java.util.ArrayList;
import java.util.List;

import com.kdt03.ped_accident.domain.cwsigmap.entity.CwSigMap;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "crosswalks")
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
	
	@Column(name = "crosswalk_lat")
	private Double crosswalkLat;
	
	@Column(name = "crosswalk_lon")
	private Double crosswalkLon;
	
	@Column(name = "lane_count")
	private Integer laneCount;
	
	@Column(name = "crosswalk_width")
	private Double crosswalkWidth;
	
	@Column(name = "crosswalk_length")
	private Double crosswalkLength;
	
	@Column(name = "has_ped_signal")
	private Boolean hasPedSignal;
	
	@Column(name = "has_ped_button")
	private Boolean hasPedButton;
	
	@Column(name = "has_ped_sound")
	private Boolean hasPedSound;
	
	@Column(name = "has_bump")
	private Boolean hasBump;
	
	@Column(name = "has_braille_block")
	private Boolean hasBrailleBlock;
	
	@Column(name = "has_spotlight")
	private Integer hasSpotlight;
	
	@OneToMany(mappedBy = "cw", fetch = FetchType.LAZY)
	private List<CwSigMap> cwSg = new ArrayList<>();
}
