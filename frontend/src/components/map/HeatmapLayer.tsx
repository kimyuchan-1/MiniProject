'use client'

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { AccidentData, calculateRiskScore } from '@/types/accident';

// Leaflet.heat 플러그인 타입 정의
declare global {
  interface Window {
    L: typeof L & {
      heatLayer?: (
        latlngs: Array<[number, number, number]>,
        options?: {
          radius?: number;
          blur?: number;
          maxZoom?: number;
          max?: number;
          minOpacity?: number;
          gradient?: { [key: string]: string };
        }
      ) => any;
    };
  }
}

interface HeatmapLayerProps {
  accidents: AccidentData[];
  visible: boolean;
}

export function HeatmapLayer({ accidents, visible }: HeatmapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);
  const pluginLoadedRef = useRef(false);

  useEffect(() => {
    // Leaflet.heat 플러그인 동적 로드
    const loadHeatPlugin = async () => {
      if (typeof window !== 'undefined' && !pluginLoadedRef.current) {
        try {
          // CDN에서 leaflet-heat 플러그인 로드
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
          script.async = true;
          
          return new Promise<void>((resolve, reject) => {
            script.onload = () => {
              pluginLoadedRef.current = true;
              resolve();
            };
            script.onerror = () => reject(new Error('Failed to load leaflet-heat'));
            document.head.appendChild(script);
          });
        } catch (error) {
          console.error('Failed to load heatmap plugin:', error);
        }
      }
    };

    loadHeatPlugin();
  }, []);

  useEffect(() => {
    if (!map || !pluginLoadedRef.current || !window.L?.heatLayer) return;

    // 기존 히트맵 레이어 제거
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!visible || accidents.length === 0) return;

    // 사고 데이터를 히트맵 포인트로 변환
    const heatPoints: Array<[number, number, number]> = accidents
      .filter(accident => accident.estimated_lat && accident.estimated_lon)
      .map(accident => {
        const riskScore = calculateRiskScore(accident);
        // 위험도를 0-1 범위로 정규화 (히트맵 강도용)
        const intensity = Math.min(riskScore / 100, 1);
        
        return [
          accident.estimated_lat!,
          accident.estimated_lon!,
          intensity
        ];
      });

    if (heatPoints.length === 0) return;

    try {
      // 히트맵 레이어 생성
      const heatLayer = window.L.heatLayer!(heatPoints, {
        radius: 25,           // 히트맵 반경
        blur: 15,             // 블러 효과
        maxZoom: 17,          // 최대 줌 레벨
        max: 1.0,             // 최대 강도
        minOpacity: 0.4,      // 최소 투명도
        gradient: {           // 색상 그라디언트 (위험도 표시)
          0.0: 'rgba(0, 255, 0, 0)',      // 투명한 녹색 (안전)
          0.2: 'rgba(255, 255, 0, 0.3)',  // 노란색 (주의)
          0.5: 'rgba(255, 165, 0, 0.5)',  // 주황색 (경고)
          0.8: 'rgba(255, 0, 0, 0.7)',    // 빨간색 (위험)
          1.0: 'rgba(139, 0, 0, 0.9)'     // 진한 빨간색 (매우 위험)
        }
      });

      // 지도에 히트맵 레이어 추가
      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    } catch (error) {
      console.error('Failed to create heatmap layer:', error);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (heatLayerRef.current) {
        try {
          map.removeLayer(heatLayerRef.current);
        } catch (error) {
          console.warn('Error removing heatmap layer:', error);
        }
        heatLayerRef.current = null;
      }
    };
  }, [map, accidents, visible]);

  return null; // 이 컴포넌트는 시각적 요소를 렌더링하지 않음
}