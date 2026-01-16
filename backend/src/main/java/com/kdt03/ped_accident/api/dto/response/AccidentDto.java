package com.kdt03.ped_accident.api.dto.response;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AccidentDto {
	
    private Long accidentId;
    private String districtCode;
    private Integer year;
    
    private Integer casualtyCount;
    private Integer accidentCount;
    private Integer fatalityCount;
    private Integer seriousInjuryCount;
    private Integer minorInjuryCount;
    private Integer reportedInjuryCount;
    
    private Double accidentLon;
    private Double accidentLat;
}