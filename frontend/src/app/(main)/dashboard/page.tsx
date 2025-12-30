'use client'

import KPICard from '@/components/KPICard';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
});


interface RegionData {
  name: string;
  crosswalks: number;
  signalRate: number;
  accidents: number;
  safetyIndex: number;
}

export interface KPIData {
  totalCrosswalks: number;
  signalInstallationRate: number;
  totalAccidents: number;
  accidentReductionRate: number;
  safetyIndex: number;
}

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>('전국');
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-12');
  const [mapLevel, setMapLevel] = useState<'country' | 'province' | 'district'>('country');
  const [kpiData, setKpiData] = useState<KPIData>({
    totalCrosswalks: 0,
    signalInstallationRate: 0,
    totalAccidents: 0,
    accidentReductionRate: 0,
    safetyIndex: 0
  });

  // KPI 데이터 로드
  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const response = await fetch('/api/dashboard/kpi');
        if (response.ok) {
          const data = await response.json();
          setKpiData(data);
        } else {
          console.error('Failed to fetch KPI data');
        }
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };

    fetchKPIData();
  }, [selectedRegion, selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">보행자 교통안전 대시보드</h1>
              <p className="text-gray-600 mt-1">보행자 사고 데이터 기반 안전 현황 분석</p>
            </div>
            
          </div>
        </div>

        {/* KPI 대시보드 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            횡단보도 신호등 설치 현황 - {selectedRegion}
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
            <KPICard 
              title="전체 횡단보도" 
              content={kpiData.totalCrosswalks.toLocaleString()} 
              caption="개소" 
              color="blue" 
            />
            <KPICard 
              title="신호등 설치율" 
              content={kpiData.signalInstallationRate + "%"}
              caption="전체 횡단보도 대비"
              color="green" 
            />
            <KPICard 
              title="전체 사고 건수" 
              content={kpiData.totalAccidents.toLocaleString()} 
              caption="건" 
              color="red" 
            />
            <KPICard 
              title="안전 지수" 
              content={Math.round(kpiData.safetyIndex*100)/100 + "점"} 
              caption="110점 만점" 
              color="gray" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 인터랙티브 지도 섹션 */}
          <div className="lg:col-span-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                인터랙티브 지도 ({mapLevel === 'country' ? '전국' : mapLevel === 'province' ? '시도별' : '구별'})
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm border h-125 relative overflow-hidden">
              <MapView />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}