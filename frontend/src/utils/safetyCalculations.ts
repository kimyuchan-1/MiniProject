// 안전도 및 위험도 계산 유틸리티

import { 
  AccidentData, 
  EnhancedCrosswalk, 
  HeatmapPoint, 
  RiskWeights, 
  SafetyWeights,
  DEFAULT_RISK_WEIGHTS,
  DEFAULT_SAFETY_WEIGHTS,
  calculateRiskScore,
  calculateSafetyScore
} from '@/types/accident';

// 지역별 데이터를 종합하여 히트맵 포인트 생성
export function generateHeatmapPoints(
  accidents: AccidentData[],
  crosswalks: EnhancedCrosswalk[],
  riskWeights: RiskWeights = DEFAULT_RISK_WEIGHTS,
  safetyWeights: SafetyWeights = DEFAULT_SAFETY_WEIGHTS
): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];
  
  // 지역별로 데이터 그룹화
  const regionData = new Map<string, {
    accidents: AccidentData[];
    crosswalks: EnhancedCrosswalk[];
    lat: number;
    lon: number;
  }>();

  // 사고 데이터 그룹화
  accidents.forEach(accident => {
    if (accident.estimated_lat && accident.estimated_lon) {
      const key = `${accident.sido_code}_${accident.sigungu_code}`;
      if (!regionData.has(key)) {
        regionData.set(key, {
          accidents: [],
          crosswalks: [],
          lat: accident.estimated_lat,
          lon: accident.estimated_lon
        });
      }
      regionData.get(key)!.accidents.push(accident);
    }
  });

  // 횡단보도 데이터 그룹화 (지역별로)
  crosswalks.forEach(crosswalk => {
    // 횡단보도의 sido, sigungu를 코드로 변환하는 로직 필요
    // 일단 좌표 기반으로 가장 가까운 지역에 할당
    let closestKey = '';
    let minDistance = Infinity;
    
    regionData.forEach((data, key) => {
      const distance = Math.sqrt(
        Math.pow(data.lat - crosswalk.crosswalk_lat, 2) +
        Math.pow(data.lon - crosswalk.crosswalk_lon, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestKey = key;
      }
    });
    
    if (closestKey && minDistance < 0.05) { // 약 5km 이내
      regionData.get(closestKey)!.crosswalks.push(crosswalk);
    }
  });

  // 각 지역별로 종합 점수 계산
  regionData.forEach((data) => {
    // 위험 점수 계산 (해당 지역의 모든 사고 합산)
    let totalRiskScore = 0;
    data.accidents.forEach(accident => {
      totalRiskScore += calculateRiskScore(accident, riskWeights);
    });

    // 안전 점수 계산 (해당 지역의 횡단보도 평균)
    let avgSafetyScore = 0;
    if (data.crosswalks.length > 0) {
      const totalSafetyScore = data.crosswalks.reduce((sum, crosswalk) => {
        return sum + calculateSafetyScore(crosswalk, safetyWeights);
      }, 0);
      avgSafetyScore = totalSafetyScore / data.crosswalks.length;
    }

    // 종합 점수 (안전도 - 위험도)
    const combinedScore = avgSafetyScore - totalRiskScore;

    points.push({
      lat: data.lat,
      lon: data.lon,
      riskScore: Math.min(totalRiskScore, 100),
      safetyScore: avgSafetyScore,
      combinedScore: combinedScore
    });
  });

  return points;
}

// 히트맵 표시 모드
export type HeatmapMode = 'risk' | 'safety' | 'combined';

// 히트맵 모드에 따른 강도 값 반환
export function getHeatmapIntensity(point: HeatmapPoint, mode: HeatmapMode): number {
  switch (mode) {
    case 'risk':
      return point.riskScore / 100; // 0-1 범위로 정규화
    case 'safety':
      return (100 - point.safetyScore) / 100; // 안전도가 낮을수록 강도 높음
    case 'combined':
      // 종합 점수를 0-1 범위로 변환 (위험할수록 1에 가까움)
      const normalizedCombined = Math.max(0, -point.combinedScore + 50) / 100;
      return Math.min(1, normalizedCombined);
    default:
      return point.riskScore / 100;
  }
}

// 히트맵 색상 그라디언트 설정
export const HEATMAP_GRADIENTS = {
  risk: {
    0.0: 'rgba(0, 255, 0, 0)',      // 투명한 녹색 (안전)
    0.2: 'rgba(255, 255, 0, 0.3)',  // 노란색 (주의)
    0.5: 'rgba(255, 165, 0, 0.5)',  // 주황색 (경고)
    0.8: 'rgba(255, 0, 0, 0.7)',    // 빨간색 (위험)
    1.0: 'rgba(139, 0, 0, 0.9)'     // 진한 빨간색 (매우 위험)
  },
  safety: {
    0.0: 'rgba(0, 255, 0, 0)',      // 투명한 녹색 (안전)
    0.3: 'rgba(255, 255, 0, 0.4)',  // 노란색 (보통)
    0.6: 'rgba(255, 165, 0, 0.6)',  // 주황색 (부족)
    1.0: 'rgba(255, 0, 0, 0.8)'     // 빨간색 (매우 부족)
  },
  combined: {
    0.0: 'rgba(0, 255, 0, 0)',      // 투명한 녹색 (매우 안전)
    0.3: 'rgba(255, 255, 0, 0.4)',  // 노란색 (보통)
    0.7: 'rgba(255, 165, 0, 0.6)',  // 주황색 (위험)
    1.0: 'rgba(255, 0, 0, 0.8)'     // 빨간색 (매우 위험)
  }
};

// 점수 범위별 설명 텍스트
export function getScoreDescription(score: number, type: 'risk' | 'safety'): string {
  if (type === 'risk') {
    if (score < 20) return '매우 안전';
    if (score < 40) return '안전';
    if (score < 60) return '보통';
    if (score < 80) return '위험';
    return '매우 위험';
  } else {
    if (score > 80) return '매우 안전';
    if (score > 60) return '안전';
    if (score > 40) return '보통';
    if (score > 20) return '부족';
    return '매우 부족';
  }
}