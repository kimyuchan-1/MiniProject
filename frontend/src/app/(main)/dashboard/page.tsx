'use client'

import KPICard from '@/components/dashboard/KPICard';
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

import { SelectedCrosswalkPanel } from '@/components/dashboard/map/SelectedCrosswalkPanel';
import { useCrosswalkDetails, convertToEnhancedCrosswalk } from '@/hooks/useCrosswalkDetails';
import type { Crosswalk } from '@/features/acc_calculate/types';

import DistrictSelectors from '@/components/dashboard/DistrictSelectors';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

type MoveTarget = { lat: number; lon: number; zoom?: number } | null;

export interface KPIData {
  totalCrosswalks: number;
  signalInstallationRate: number;
  riskIndex: number;
  accidentReductionRate: number;
  safetyIndex: number;
}

const EMPTY_KPI: KPIData = {
  totalCrosswalks: 0,
  signalInstallationRate: 0,
  riskIndex: 0,
  accidentReductionRate: 0,
  safetyIndex: 0,
};

function coerceNumber(v: unknown, fallback = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeKpiPayload(payload: any): KPIData {
  const src = payload;

  return {
    totalCrosswalks: coerceNumber(src.totalCrosswalks),
    signalInstallationRate: coerceNumber(src.signalInstallationRate),
    riskIndex: coerceNumber(src.riskIndex),
    accidentReductionRate: coerceNumber(src.accidentReductionRate),
    safetyIndex: coerceNumber(src.safetyIndex),
  };
}

export default function Dashboard() {
  const [kpiData, setKpiData] = useState<KPIData>(EMPTY_KPI);
  const [loading, setLoading] = useState(false);

  const [selectedCrosswalk, setSelectedCrosswalk] = useState<Crosswalk | null>(null);

  const selectedCrosswalkId = selectedCrosswalk?.cw_uid ?? null;

  const enhancedSelected = useMemo(() => {
    return selectedCrosswalk ? convertToEnhancedCrosswalk(selectedCrosswalk) : null;
  }, [selectedCrosswalk]);

  const {
    nearbyAccidents,
    loading: loadingDetails,
    error: detailsError,
  } = useCrosswalkDetails({
    crosswalk: enhancedSelected,
    enabled: !!enhancedSelected,
  });

  const [moveTo, setMoveTo] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const resp = await fetch('/api/dashboard/kpi', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
        });

        const payload = await resp.json().catch(() => ({}));

        if (!resp.ok) {
          const msg = payload?.error ?? payload?.message ?? `HTTP ${resp.status}`;
          throw new Error(msg);
        }

        const normalized = normalizeKpiPayload(payload);

        if (alive) setKpiData(normalized);
      } catch (err: any) {
        console.error('KPI fetch failed:', err);
        if (alive) {
          setKpiData(EMPTY_KPI);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-4">
        {/* 헤더 */}
        <div className="mb-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              횡단보도 신호등 설치 현황
            </h2>
          </div>

        </div>

        {/* KPI 대시보드 */}
        <div className="mb-4">
          <div className="grid grid-cols-5 md:grid-cols-5 gap-4 min-w-0">
            <KPICard
              title="전체 횡단보도"
              content={loading ? "로딩중..." : kpiData.totalCrosswalks.toLocaleString()}
              caption="개소"
              color="gray"
            />
            <KPICard
              title="신호등 설치율"
              content={loading ? "로딩중..." : `${kpiData.signalInstallationRate}%`}
              caption="전체 횡단보도 대비"
              color="green"
            />
            <KPICard
              title="안전 지수"
              content={loading ? "로딩중..." : `${Math.round(kpiData.safetyIndex * 100) / 100}점`}
              caption="100점 만점"
              color="blue"
            />
            <KPICard
              title="위험 지수"
              content={loading ? "로딩중..." : `${Math.round(kpiData.riskIndex * 100) / 100}점`}
              caption="100점 만점"
              color="red"
            />
            <div className='py-5 px-4 flex flex-col items-end'>
              <div className="text-md font-medium text-gray-500 mb-2">
                지역 선택
              </div>
              <DistrictSelectors onMove={setMoveTo} />
            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border relative overflow-hidden h-105 sm:h-130 lg:h-160">
              <MapView
                selectedCrosswalkId={selectedCrosswalkId}
                onSelectCrosswalk={setSelectedCrosswalk}
                moveTo={moveTo}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:max-h-[calc(100vh-7rem)] lg:overflow-auto pb-4">
              <SelectedCrosswalkPanel
                selected={enhancedSelected}
                nearbyAccidents={nearbyAccidents ?? []}
                loading={loadingDetails}
                error={detailsError}
                onClose={() => setSelectedCrosswalk(null)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
