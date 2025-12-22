package com.kdt03.ped_accident.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AlertService {
	public void createAlert(AlertType type, String title, String message, String sido, String sigungu) {
	}

	public List<AlertNotification> getUnreadAlerts(String role);

	public void markAsRead(Long alertId) {
	}

	public void checkAccidentSpikes() {
	}

	public void checkNewHotspots() {
	}

	public void sendPredictionAlerts() {
	}
}