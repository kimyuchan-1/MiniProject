package com.kdt03.ped_accident.domain.safety.service;

import com.kdt03.ped_accident.api.dto.response.RiskScore;
import com.kdt03.ped_accident.api.dto.response.VulnerabilityScore;
import com.kdt03.ped_accident.domain.accidentHotSpot.repository.AccidentHotspotRepository;
import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;
import com.kdt03.ped_accident.domain.crosswalk.repository.CrosswalkRepository;
import com.kdt03.ped_accident.domain.cwsigmap.repository.CwSigMapRepository;
import com.kdt03.ped_accident.domain.district.repository.DistrictRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SafetyAnalysisService {

    private final AccidentHotspotRepository accidentHotspotRepository;
    private final CrosswalkRepository crosswalkRepository;
    private final DistrictRepository districtRepository;
    private final CwSigMapRepository cwSigMapRepository;

    /**
     * 개선이 시급한 횡단보도 후보 목록을 조회합니다.
     *
     * @param districtCode 지역 코드
     * @param limit        반환할 후보 개수
     * @return 횡단보도 및 점수 목록
     */
    public List<CrosswalkWithScore> getImprovementCandidates(Long districtCode, int limit) {
        // TODO: Implement logic to find crosswalks that are candidates for improvement.
        // 1. Find all crosswalks in the district.
        // 2. For each crosswalk, calculate a "vulnerability score".
        // 3. Sort crosswalks by this score in descending order.
        // 4. Return the top 'limit' crosswalks.
        return Collections.emptyList();
    }

    /**
     * 횡단보도의 취약점 점수를 계산합니다.
     *
     * @param crosswalk 횡단보도 엔티티
     * @return 취약점 점수
     */
    public VulnerabilityScore calculateVulnerabilityScore(Crosswalk crosswalk) {
        // TODO: Implement logic to calculate the vulnerability score for a single crosswalk.
        // This could be based on the number and severity of accidents nearby.
        return new VulnerabilityScore(0.0);
    }

    public RiskScore calculateRiskScore(Double lat, Double lng) {
        // TODO: Implement logic to calculate risk score for a specific lat/lng.
        // This could involve querying for nearby accident hotspots.
        return new RiskScore(0.0);
    }

    public record CrosswalkWithScore(Crosswalk crosswalk, double score) {}
}
