package com.kdt03.ped_accident.domain.crosswalk.repository;

public interface CrosswalkProjection {
	String getCwUid();
    Double getCrosswalkLat();
    Double getCrosswalkLon();
    String getAddress();

    Boolean getIsHighland();
    Boolean getHasPedButton();
    Boolean getHasPedSound();
    Boolean getHasBump();
    Boolean getHasBrailleBlock();
    Integer getHasSpotlight();

    Long getHasSignal();     // 0/1
    String getSignalSource();
}
