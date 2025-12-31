package com.kdt03.ped_accident.domain.cwaccmap.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CwAccMapId implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "cw_uid", length = 30)
    private String cwUid;

    @Column(name = "accident_id")
    private Long accidentId;
}
