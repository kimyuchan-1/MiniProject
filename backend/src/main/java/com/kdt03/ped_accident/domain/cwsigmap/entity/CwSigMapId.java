package com.kdt03.ped_accident.domain.cwsigmap.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CwSigMapId implements Serializable {

	@Column(name = "cw_uid", length = 30)
    private String cwUid;

    @Column(name = "sg_uid", length = 30)
    private String sgUid;
}