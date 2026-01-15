package com.kdt03.ped_accident.domain.district.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.CityDto;
import com.kdt03.ped_accident.api.dto.response.ProvinceDto;
import com.kdt03.ped_accident.domain.district.entity.DistrictWithLatLon;
import com.kdt03.ped_accident.domain.district.repository.DistrictWithLatLonRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DistrictService {

    private final DistrictWithLatLonRepository districtWithLatLonRepository;

    public List<CityDto> getCitiesByProvince(String province) {
        List<DistrictWithLatLon> districts = districtWithLatLonRepository.findByProvincePrefix(province + " ");
        
        Map<String, CityAccumulator> cityMap = new HashMap<>();
        
        for (DistrictWithLatLon d : districts) {
            String[] tokens = d.getBjdNm().trim().split("\\s+");
            if (tokens.length < 2) continue;
            
            String prov = tokens[0];
            String city = tokens[1];
            
            if (!prov.equals(province)) continue;
            
            Double lat = d.getCenterLati();
            Double lon = d.getCenterLong();
            if (lat == null || lon == null) continue;
            
            cityMap.computeIfAbsent(city, k -> new CityAccumulator())
                   .add(lat, lon);
        }
        
        List<CityDto> result = new ArrayList<>();
        for (Map.Entry<String, CityAccumulator> entry : cityMap.entrySet()) {
            CityAccumulator acc = entry.getValue();
            result.add(CityDto.builder()
                    .city(entry.getKey())
                    .lat(acc.getAvgLat())
                    .lon(acc.getAvgLon())
                    .key(province + "|" + entry.getKey())
                    .build());
        }
        
        result.sort((a, b) -> a.getCity().compareTo(b.getCity()));
        return result;
    }

    public List<ProvinceDto> getProvinces() {
        List<DistrictWithLatLon> districts = districtWithLatLonRepository.findAllDistricts();
        
        Map<String, CityAccumulator> provinceMap = new HashMap<>();
        
        for (DistrictWithLatLon d : districts) {
            String[] tokens = d.getBjdNm().trim().split("\\s+");
            if (tokens.length < 1) continue;
            
            String province = tokens[0];
            Double lat = d.getCenterLati();
            Double lon = d.getCenterLong();
            if (lat == null || lon == null) continue;
            
            provinceMap.computeIfAbsent(province, k -> new CityAccumulator())
                       .add(lat, lon);
        }
        
        List<ProvinceDto> result = new ArrayList<>();
        for (Map.Entry<String, CityAccumulator> entry : provinceMap.entrySet()) {
            CityAccumulator acc = entry.getValue();
            result.add(ProvinceDto.builder()
                    .province(entry.getKey())
                    .lat(acc.getAvgLat())
                    .lon(acc.getAvgLon())
                    .build());
        }
        
        result.sort((a, b) -> a.getProvince().compareTo(b.getProvince()));
        return result;
    }

    private static class CityAccumulator {
        private double sumLat = 0;
        private double sumLon = 0;
        private int count = 0;

        void add(Double lat, Double lon) {
            sumLat += lat;
            sumLon += lon;
            count++;
        }

        double getAvgLat() {
            return count > 0 ? sumLat / count : 0;
        }

        double getAvgLon() {
            return count > 0 ? sumLon / count : 0;
        }
    }
}
