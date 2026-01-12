package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.domain.crosswalk.entity.Crosswalk;
import com.kdt03.ped_accident.domain.crosswalk.service.CrosswalkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/crosswalks")
public class CrosswalkController {

  private final CrosswalkService crosswalkService;

  @GetMapping
  public List<Crosswalk> list(
      @RequestParam double south,
      @RequestParam double north,
      @RequestParam double west,
      @RequestParam double east
  ) {
    return crosswalkService.getCrosswalksInBounds(south, north, west, east);
  }
}
