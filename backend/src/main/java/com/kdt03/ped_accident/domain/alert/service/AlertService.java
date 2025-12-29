package com.kdt03.ped_accident.domain.alert.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kdt03.ped_accident.domain.alert.entity.AlertNotification;
import com.kdt03.ped_accident.domain.alert.entity.AlertType;

@Service
public class AlertService {
	public void createAlert(AlertType type, String title, String message, Long districtCode) {
	}

	public List<AlertNotification> getUnreadAlerts(String role) {
		return null;
	}

	public void markAsRead(Long alertId) {
	}

	public void checkAccidentSpikes() {
	}

	public void checkNewHotspots() {
	}
}