package com.kdt03.ped_accident.domain.cwaccmap.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cw_acc_map")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CwAccMap {

    @EmbeddedId
    private CwAccMapId id;

    @Column(nullable = false)
    private Double distance;
}

