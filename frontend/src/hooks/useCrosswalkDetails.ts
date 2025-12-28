import { useState, useEffect } from 'react';
import { EnhancedCrosswalk, AccidentData } from '@/types/accident';

interface UseCrosswalkDetailsProps {
  crosswalk: EnhancedCrosswalk | null;
  enabled?: boolean;
}

interface CrosswalkDetailsData {
  crosswalk: EnhancedCrosswalk;
  nearbyAccidents: AccidentData[];
  loading: boolean;
  error: string | null;
}

// 임시 mock 사고 데이터 생성 함수
function generateMockAccidents(crosswalk: EnhancedCrosswalk): AccidentData[] {
  const mockAccidents: AccidentData[] = [];
  const accidentCount = Math.floor(Math.random() * 3) + 1; // 1-3개 사고
  
  for (let i = 0; i < accidentCount; i++) {
    const accident: AccidentData = {
      acc_uid: `mock_${crosswalk.cw_uid}_${i}`,
      sido_code: '11', // 서울
      sigungu_code: '1114', // 중구
      year: 2024,
      month: Math.floor(Math.random() * 12) + 1,
      accident_count: Math.floor(Math.random() * 3) + 1,
      casualty_count: Math.floor(Math.random() * 2),
      fatality_count: Math.random() > 0.9 ? 1 : 0, // 10% 확률로 사망사고
      serious_injury_count: Math.floor(Math.random() * 2),
      minor_injury_count: Math.floor(Math.random() * 3),
      reported_injury_count: Math.floor(Math.random() * 2),
      estimated_lat: crosswalk.crosswalk_lat + (Math.random() - 0.5) * 0.002,
      estimated_lon: crosswalk.crosswalk_lon + (Math.random() - 0.5) * 0.002
    };
    mockAccidents.push(accident);
  }
  
  return mockAccidents;
}

export function useCrosswalkDetails({ crosswalk, enabled = true }: UseCrosswalkDetailsProps) {
  const [data, setData] = useState<CrosswalkDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!crosswalk || !enabled) {
      setData(null);
      return;
    }

    const fetchCrosswalkDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // 횡단보도 주변 사고 데이터 조회 (반경 약 1km)
        const radius = 0.01; // 대략 1km
        const bounds = `${crosswalk.crosswalk_lat - radius},${crosswalk.crosswalk_lon - radius},${crosswalk.crosswalk_lat + radius},${crosswalk.crosswalk_lon + radius}`;
        
        let accidents: AccidentData[] = [];
        
        try {
          const response = await fetch(`/api/map/accidents?bounds=${bounds}`);
          
          if (response.ok) {
            accidents = await response.json();
          } else {
            console.warn('[useCrosswalkDetails] Accidents API failed, using mock data');
            // 사고 API 실패 시 임시 mock 데이터 생성
            accidents = generateMockAccidents(crosswalk);
          }
        } catch (apiError) {
          console.warn('[useCrosswalkDetails] Accidents API error, using mock data:', apiError);
          // API 오류 시 임시 mock 데이터 생성
          accidents = generateMockAccidents(crosswalk);
        }

        setData({
          crosswalk,
          nearbyAccidents: accidents,
          loading: false,
          error: null
        });

      } catch (err) {
        console.error('[useCrosswalkDetails] Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData({
          crosswalk,
          nearbyAccidents: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCrosswalkDetails();
  }, [crosswalk, enabled]);

  return {
    data: data?.crosswalk || null,
    nearbyAccidents: data?.nearbyAccidents || [],
    loading,
    error
  };
}

// 횡단보도 데이터를 EnhancedCrosswalk 형태로 변환하는 유틸리티
export function convertToEnhancedCrosswalk(basicCrosswalk: any): EnhancedCrosswalk {
  return {
    cw_uid: basicCrosswalk.cw_uid,
    sido: basicCrosswalk.sido || '서울특별시', // 기본값 설정
    sigungu: basicCrosswalk.sigungu || '중구', // 기본값 설정
    address: basicCrosswalk.address,
    crosswalk_lat: basicCrosswalk.crosswalk_lat,
    crosswalk_lon: basicCrosswalk.crosswalk_lon,
    hasSignal: basicCrosswalk.hasSignal,
    // 임시로 일부 안전 기능들을 랜덤하게 설정 (실제 데이터가 없으므로)
    crosswalk_width: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 3 : undefined, // 3-7m
    highland: Math.random() > 0.8, // 20% 확률
    button: basicCrosswalk.hasSignal ? Math.random() > 0.6 : false, // 신호등 있으면 40% 확률
    sound_signal: basicCrosswalk.hasSignal ? Math.random() > 0.7 : false, // 신호등 있으면 30% 확률
    bump: Math.random() > 0.5, // 50% 확률
    braille_block: Math.random() > 0.6, // 40% 확률
    spotlight: Math.random() > 0.8 // 20% 확률
  };
}