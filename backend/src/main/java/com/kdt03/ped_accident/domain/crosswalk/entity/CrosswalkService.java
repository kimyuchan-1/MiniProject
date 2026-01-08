package com.kdt03.ped_accident.domain.crosswalk.entity;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.crosswalk.repository.CWRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CrosswalkService {

  private final CWRepository cwRepository;

  public List<CW> getCrosswalksInBounds(double south, double north, double west, double east) {
    return cwRepository.findInBoundsWithSg(
        south, north, west, east,
        PageRequest.of(0, 5000)
    );
  }
}