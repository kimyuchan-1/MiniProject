package com.kdt03.ped_accident.domain.crosswalk.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;
import com.kdt03.ped_accident.domain.crosswalk.repository.CrosswalkRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CrosswalkService {

  private final CrosswalkRepository crosswalkRepository;

  public List<Crosswalk> getCrosswalksInBounds(double south, double north, double west, double east) {
    return crosswalkRepository.findInBoundsWithSg(
        south, north, west, east,
        PageRequest.of(0, 5000)
    );
  }
}