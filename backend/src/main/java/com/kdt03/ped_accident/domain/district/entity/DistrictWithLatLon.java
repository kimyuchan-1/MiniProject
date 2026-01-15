package com.kdt03.ped_accident.domain.district.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "district_with_lat_lon")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistrictWithLatLon {
    @Id
    @Column(name = "bjd_cd")
    private String bjdCd;

    @Column(name = "bjd_nm")
    private String bjdNm;

    @Column(name = "center_lati", precision = 10, scale = 8)
    private BigDecimal centerLati;

    @Column(name = "center_long", precision = 11, scale = 8)
    private BigDecimal centerLong;
}
