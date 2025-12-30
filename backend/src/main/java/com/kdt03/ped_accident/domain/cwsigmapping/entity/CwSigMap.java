package com.kdt03.ped_accident.domain.cwsigmapping.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "crosswalk_signal_map")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CwSigMap  {

    @EmbeddedId
    private CwSigMapId id;

    @Column(name = "distance_m", precision = 8, scale = 3)
    private BigDecimal distanceM;

    @Column(precision = 6, scale = 6)
    private BigDecimal confidence;
}
