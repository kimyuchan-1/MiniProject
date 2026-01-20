'use client'

import KPICard from '@/components/dashboard/KPICard';
import { useState, useEffect, useMemo } from 'react';
import { FaInfoCircle, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import dynamic from 'next/dynamic';

import { SelectedCrosswalkPanel } from '@/components/dashboard/map/SelectedCrosswalkPanel';
import { useCrosswalkDetails, convertToEnhancedCrosswalk } from '@/hooks/useCrosswalkDetails';
import type { Crosswalk } from '@/features/acc_calculate/types';

import DistrictSelectors from '@/components/dashboard/DistrictSelectors';
import IndexExplain from "./IndexExplain";

const MapView = dynamic(() => import('./MapView'), { ssr: false });

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
  const [openExplain, setOpenExplain] = useState(false);
  const [selectedCrosswalk, setSelectedCrosswalk] = useState<Crosswalk | null>(null);
  const [moveTo, setMoveTo] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);

  const enhancedSelected = useMemo(() => {
    return selectedCrosswalk ? convertToEnhancedCrosswalk(selectedCrosswalk) : null;
  }, [selectedCrosswalk]);

  const { nearbyAccidents, loading: loadingDetails, error: detailsError } = useCrosswalkDetails({
    crosswalk: enhancedSelected,
    enabled: !!enhancedSelected,
  });

  // 데이터 페칭 로직 (동일)
  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await fetch('/api/dashboard/kpi', { cache: 'no-store' });
        const payload = await resp.json().catch(() => ({}));
        if (alive) setKpiData(normalizeKpiPayload(payload));
      } catch (err) {
        if (alive) setKpiData(EMPTY_KPI);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchData();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]"> {/* 배경색을 약간 더 밝은 슬레이트 톤으로 변경 */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        <div className="flex flex-row justify-between gap-6 mb-8 ">
          {/* 상단: 제목 섹션 (전체 너비 사용) */}
          <div className="border-b border-slate-100 m-4 pb-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              교통안전 대시보드
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm md:text-base">
              <FaMapMarkerAlt className="text-blue-500" />
              횡단보도 신호등 설치 현황 및 위험도 분석
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenExplain(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              <FaInfoCircle className="text-blue-500" />
              지수 산정 기준
            </button>
            <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block" />
            <div className="flex flex-col items-end bg-white p-2 px-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">District Select</span>
              <DistrictSelectors onMove={setMoveTo} />
            </div>
          </div>
        </div>

        {/* KPI 대시보드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="전체 횡단보도"
            content={loading ? "..." : kpiData.totalCrosswalks.toLocaleString()}
            caption="관리 대상 개소"
            color="gray"
          />
          <KPICard
            title="신호등 설치율"
            content={loading ? "..." : `${kpiData.signalInstallationRate}%`}
            caption="설치 목표 대비 85%"
            color="green"
          />
          <KPICard
            title="안전 지수"
            content={loading ? "..." : `${(kpiData.safetyIndex).toFixed(2)}`}
            caption="종합 안전 점수"
            color="blue"
          />
          <KPICard
            title="위험 지수"
            content={loading ? "..." : `${(kpiData.riskIndex).toFixed(2)}`}
            caption="집중 관리 필요"
            color="red"
          />
        </div>

        {/* 메인 콘텐츠 (지도 & 패널 비율 조정) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 지도 섹션: 비중을 12 중 7로 축소 (기존 8~9) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden h-125 lg:h-175">
              <MapView
                selectedCrosswalkId={selectedCrosswalk?.cw_uid ?? null}
                onSelectCrosswalk={setSelectedCrosswalk}
                moveTo={moveTo}
              />
            </div>
          </div>

          {/* 상세 패널 섹션: 비중을 12 중 5로 확대 (기존 3~4) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm h-full max-h-175 flex flex-col">
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

        {/* 모던 모달 (지수 정보) */}
        {
          openExplain && (
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setOpenExplain(false)}
              />
              <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
                  <h3 className="text-xl font-bold text-slate-800">지수 산정 기준 안내</h3>
                  <button
                    onClick={() => setOpenExplain(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <FaTimes className="text-slate-400 text-xl" />
                  </button>
                </div>
                <div className="overflow-y-auto p-8 max-h-[calc(90vh-80px)]">
                  <IndexExplain />
                </div>
              </div>
            </div>
          )
        }
      </main >
    </div >
  );
}