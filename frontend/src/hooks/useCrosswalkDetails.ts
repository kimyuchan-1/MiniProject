import { useState, useEffect } from 'react';
import { Crosswalk, AccidentData } from '@/types/accident';

interface UseCrosswalkDetailsProps {
  crosswalk: Crosswalk | null;
  enabled?: boolean;
}

interface CrosswalkDetailsData {
  crosswalk: Crosswalk;
  nearbyAccidents: AccidentData[];
  loading: boolean;
  error: string | null;
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
          const response = await fetch(`/api/map/acc_hotspots?bounds=${bounds}`);
          
          if (response.ok) {
            accidents = await response.json();
          } 
        } catch (apiError) {
          console.warn('[useCrosswalkDetails] Acc_Hotspots API error, using mock data:', apiError);
          // API 오류 시 임시 mock 데이터 생성
          accidents = [];
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
export function convertToEnhancedCrosswalk(basicCrosswalk: any): Crosswalk {
  return {
    cw_uid: basicCrosswalk.cw_uid,
    address: basicCrosswalk.address,
    crosswalk_lat: basicCrosswalk.crosswalk_lat,
    crosswalk_lon: basicCrosswalk.crosswalk_lon,
    hasSignal: basicCrosswalk.hasSignal,
    isHighland: basicCrosswalk.isHighland, 
    hasPedButton: basicCrosswalk.hasPedButton,
    hasPedSound: basicCrosswalk.hasPedSound, 
    hasBump: basicCrosswalk.hasBump, 
    hasBrailleBlock: basicCrosswalk.hasBrailleBlock, 
    hasSpotlight: basicCrosswalk.hasSpotlight,
  };
}