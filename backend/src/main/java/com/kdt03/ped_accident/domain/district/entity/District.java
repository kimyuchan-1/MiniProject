package com.kdt03.ped_accident.domain.district.entity;


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
	@Column(name = "district_id")
	private String districtId;
	
	@Column(name = "district_name")
	private String districtName;
	
	@Column(name = "district_code")
	private String districtCode;
	
	@Column(name = "district_short_name")
	private String districtShortName;

}
