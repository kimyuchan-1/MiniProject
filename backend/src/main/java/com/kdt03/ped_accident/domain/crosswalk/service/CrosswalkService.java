package com.kdt03.ped_accident.domain.crosswalk.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.CrosswalkDto;
import com.kdt03.ped_accident.domain.crosswalk.repository.CrosswalkRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CrosswalkService {

    private final CrosswalkRepository crosswalkRepository;

    public List<CrosswalkDto> getCrosswalks(double south, double west, double north, double east, int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 5000));
        
        

        return crosswalkRepository.findInBounds(south, west, north, east, safeLimit)
                .stream()
                .map(r -> {
                	Long hs = r.getHasSignal();
                	boolean hasSignal = hs != null && hs > 0;
                	
                	return CrosswalkDto.builder()
                        .cw_uid(r.getCwUid())
                        .crosswalk_lat(r.getCrosswalkLat())
                        .crosswalk_lon(r.getCrosswalkLon())
                        .address(r.getAddress())
                        .hasSignal(hasSignal)
                        .isHighland(r.getIsHighland())
                        .hasPedButton(r.getHasPedButton())
                        .hasPedSound(r.getHasPedSound())
                        .hasBump(r.getHasBump())
                        .hasBrailleBlock(r.getHasBrailleBlock())
                        .hasSpotlight(r.getHasSpotlight())
                        .signalSource(r.getSignalSource())
                        .build();
                		})
                .toList();
    }
}