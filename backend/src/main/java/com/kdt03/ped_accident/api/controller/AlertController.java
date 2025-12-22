package com.kdt03.ped_accident.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdt03.ped_accident.domain.alert.dto.CreateAlertRequest;
import com.kdt03.ped_accident.domain.alert.entity.AlertNotification;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    
    @GetMapping("/unread")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AlertNotification>> getUnreadAlerts(Authentication authentication) {
		return null;
	}
    
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
		return null;
	}
    
    @PostMapping("/manual")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlertNotification> createManualAlert(
        @RequestBody @Validated CreateAlertRequest request) {
		return null;
	}
}