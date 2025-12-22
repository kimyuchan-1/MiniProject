package com.kdt03.ped_accident.domain.investment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "investment_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_id")
    private Long planId;

    @Column(name = "hotspot_id")
    private Long hotspotId;

    @Column(name = "item_type")
    private String itemType;

    @Column(name = "location_lat", precision = 10, scale = 8)
    private BigDecimal locationLat;

    @Column(name = "location_lon", precision = 11, scale = 8)
    private BigDecimal locationLon;

    @Column(name = "estimated_cost")
    private BigDecimal estimatedCost;

    @Column(name = "priority_score")
    private BigDecimal priorityScore;

    private String status;
}
