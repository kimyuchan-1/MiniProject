package com.kdt03.ped_accident.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CrosswalkDto {
	private String cw_uid;
    private Double crosswalk_lat;
    private Double crosswalk_lon;
    private String address;

    private Boolean hasSignal;
    private Boolean isHighland;
    private Boolean hasPedButton;
    private Boolean hasPedSound;
    private Boolean hasBump;
    private Boolean hasBrailleBlock;
    private Integer hasSpotlight;

    private String signalSource;
}