package com.kdt03.ped_accident.domain.accidentHotSpot.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.AccidentDto;
import com.kdt03.ped_accident.domain.accidentHotSpot.entity.AccidentHotspot;
import com.kdt03.ped_accident.domain.accidentHotSpot.repository.AccidentHotspotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccidentHotSpotService {

    private final AccidentHotspotRepository repository;

    public List<AccidentDto> getAccidentsByBounds(double south, double west, double north, double east, int limit) {
        Pageable pageable = PageRequest.of(0, Math.max(1, Math.min(limit, 5000)));

        return repository.findByBounds(south, west, north, east, pageable)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private AccidentDto toDto(AccidentHotspot a) {
        return AccidentDto.builder()
                .accidentId(a.getAccidentId())
                .districtCode(a.getDistrictCode())
                .year(a.getYear())

                
                .casualtyCount(nz(a.getCasualtyCount()))
                .fatalityCount(nz(a.getFatalityCount()))
                .seriousInjuryCount(nz(a.getSeriousInjuryCount()))
                .minorInjuryCount(nz(a.getMinorInjuryCount()))
                .accidentCount(nz(a.getAccidentCount()))
                .reportedInjuryCount(nz(a.getReportedInjuryCount()))

                .accidentLon(a.getAccidentLon() == null ? 0.0 : a.getAccidentLon())
                .accidentLat(a.getAccidentLat() == null ? 0.0 : a.getAccidentLat())
                .build();
    }

    private int nz(Integer v) {
        return v == null ? 0 : v;
    }
}