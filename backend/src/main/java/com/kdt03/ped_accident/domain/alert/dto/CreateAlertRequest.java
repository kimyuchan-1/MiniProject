package com.kdt03.ped_accident.domain.alert.dto;


import com.kdt03.ped_accident.domain.alert.entity.AlertType;
import lombok.Data;

@Data
public class CreateAlertRequest {
    
    private AlertType alertType;
    
    private String title;
    
    private String message;
    
    private String severity;
    private String sido;
    private String sigungu;
}
