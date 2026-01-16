package com.kdt03.ped_accident.domain.accident.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.api.dto.response.AccidentSummaryDto;
import com.kdt03.ped_accident.api.dto.response.AccidentSummaryDto.MonthlyAccident;
import com.kdt03.ped_accident.api.dto.response.AccidentSummaryDto.YearlyAccident;
import com.kdt03.ped_accident.domain.accident.entity.Accident;
import com.kdt03.ped_accident.domain.accident.repository.AccidentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccidentService {

    private final AccidentRepository accidentRepository;

    public AccidentSummaryDto getSummary(String region) {
        List<Accident> accidents = fetchAccidents(region);
        String regionType = determineRegionType(region);

        List<YearlyAccident> yearly = aggregateYearly(accidents);
        List<MonthlyAccident> monthly = aggregateMonthly(accidents);

        return AccidentSummaryDto.builder()
                .region(region == null || region.isEmpty() ? null : region)
                .regionType(regionType)
                .yearly(yearly)
                .monthly(monthly)
                .build();
    }

    private List<Accident> fetchAccidents(String region) {
        if (region == null || region.isEmpty()) {
            return accidentRepository.findAll();
        }

        if (region.matches("^\\d{2}$")) {
            // 시도(2자리)
            int prefix = Integer.parseInt(region);
            String gte = String.valueOf(prefix * 100_000_000L);
            String lt = String.valueOf((prefix + 1) * 100_000_000L);
            return accidentRepository.findBySidoCodeRange(gte, lt);
        }

        if (region.matches("^\\d{5}$")) {
            // 시군구(5자리)
            long d5 = Long.parseLong(region);
            String gte = String.valueOf(d5 * 100_000L);
            String lt = String.valueOf((d5 + 1) * 100_000L);
            return accidentRepository.findBySigunguCodeRange(gte, lt);
        }

        if (region.matches("^\\d{10}$")) {
            // 시군구(10자리) 정확히 일치
            return accidentRepository.findBySigunguCode(region);
        }

        return new ArrayList<>();
    }

    private String determineRegionType(String region) {
        if (region == null || region.isEmpty()) {
            return "NATION";
        }
        if (region.matches("^\\d{2}$")) {
            return "SIDO_PREFIX2";
        }
        if (region.matches("^\\d{5}$")) {
            return "DISTRICT5";
        }
        if (region.matches("^\\d{10}$")) {
            return "SIGUNGU10";
        }
        return "UNKNOWN";
    }

    private List<YearlyAccident> aggregateYearly(List<Accident> accidents) {
        Map<Integer, YearlyAccident> byYear = new HashMap<>();

        for (Accident a : accidents) {
            int year = a.getYear();
            YearlyAccident cur = byYear.computeIfAbsent(year, y -> YearlyAccident.builder()
                    .year(y)
                    .accidentCount(0L)
                    .casualtyCount(0L)
                    .fatalityCount(0L)
                    .seriousInjuryCount(0L)
                    .minorInjuryCount(0L)
                    .reportedInjuryCount(0L)
                    .build());

            cur.setAccidentCount(cur.getAccidentCount() + nullToZero(a.getAccidentCount()));
            cur.setCasualtyCount(cur.getCasualtyCount() + nullToZero(a.getCasualtyCount()));
            cur.setFatalityCount(cur.getFatalityCount() + nullToZero(a.getFatalityCount()));
            cur.setSeriousInjuryCount(cur.getSeriousInjuryCount() + nullToZero(a.getSeriousInjuryCount()));
            cur.setMinorInjuryCount(cur.getMinorInjuryCount() + nullToZero(a.getMinorInjuryCount()));
            cur.setReportedInjuryCount(cur.getReportedInjuryCount() + nullToZero(a.getReportedInjuryCount()));
        }

        List<YearlyAccident> result = new ArrayList<>(byYear.values());
        result.sort(Comparator.comparingInt(YearlyAccident::getYear));
        return result;
    }

    private List<MonthlyAccident> aggregateMonthly(List<Accident> accidents) {
        Map<Integer, MonthlyAccident> byMonth = new HashMap<>();

        for (Accident a : accidents) {
            int year = a.getYear();
            int month = a.getMonth();
            int key = year * 100 + month;

            MonthlyAccident cur = byMonth.computeIfAbsent(key, k -> MonthlyAccident.builder()
                    .year(year)
                    .month(month)
                    .accidentCount(0L)
                    .casualtyCount(0L)
                    .fatalityCount(0L)
                    .seriousInjuryCount(0L)
                    .minorInjuryCount(0L)
                    .reportedInjuryCount(0L)
                    .build());

            cur.setAccidentCount(cur.getAccidentCount() + nullToZero(a.getAccidentCount()));
            cur.setCasualtyCount(cur.getCasualtyCount() + nullToZero(a.getCasualtyCount()));
            cur.setFatalityCount(cur.getFatalityCount() + nullToZero(a.getFatalityCount()));
            cur.setSeriousInjuryCount(cur.getSeriousInjuryCount() + nullToZero(a.getSeriousInjuryCount()));
            cur.setMinorInjuryCount(cur.getMinorInjuryCount() + nullToZero(a.getMinorInjuryCount()));
            cur.setReportedInjuryCount(cur.getReportedInjuryCount() + nullToZero(a.getReportedInjuryCount()));
        }

        List<MonthlyAccident> result = new ArrayList<>(byMonth.values());
        result.sort(Comparator.comparingInt(MonthlyAccident::getYear)
                .thenComparingInt(MonthlyAccident::getMonth));
        return result;
    }

    private long nullToZero(Integer value) {
        return value == null ? 0L : value.longValue();
    }
}
