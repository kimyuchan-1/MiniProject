package com.kdt03.ped_accident.domain.accidentHotSpot.entity;

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
@Table(name = "accident_hotspots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class AccidentHotspot {
	@Id
	@Column(name = "accident_id")
	private Long accidentId;

	private Integer year;

	@Column(name = "district_code")
	private String districtCode;

	private String detail;
	
	@Column(name = "accident_count")
	private Integer accidentCount;

	@Column(name = "casualty_count")
	private Integer casualtyCount;

	@Column(name = "fatality_count")
	private Integer fatalityCount;

	@Column(name = "serious_injury_count")
	private Integer seriousInjuryCount;

	@Column(name = "minor_injury_count")
	private Integer minorInjuryCount;

	@Column(name = "reported_injury_count")
	private Integer reportedInjuryCount;

	@Column(name = "accident_lon")
	private Double accidentLon;

	@Column(name = "accident_lat")
	private Double accidentLat;
}
