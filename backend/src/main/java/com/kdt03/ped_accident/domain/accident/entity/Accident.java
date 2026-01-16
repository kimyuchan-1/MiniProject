package com.kdt03.ped_accident.domain.accident.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;

@Entity
@RequiredArgsConstructor
@Table(
		name = "accidents",
		indexes = {
				@Index(name = "idx_year_month", columnList = "year, month"),
				@Index(name = "idx_sido", columnList = "sido_code")
		}
)
public class Accident {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "acc_uid")
	private Long acc_uid; 

	@Column(name = "sido_code", length = 20, nullable = false)
    private String sidoCode;

    @Column(name = "sigungu_code", length = 20, nullable = false)
    private String sigunguCode;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "accident_count")
    private Integer accidentCount = 0;

    @Column(name = "casualty_count")
    private Integer casualtyCount = 0;

    @Column(name = "fatality_count")
    private Integer fatalityCount = 0;

    @Column(name = "serious_injury_count")
    private Integer seriousInjuryCount = 0;

    @Column(name = "minor_injury_count")
    private Integer minorInjuryCount = 0;

    @Column(name = "reported_injury_count")
    private Integer reportedInjuryCount = 0;
}
