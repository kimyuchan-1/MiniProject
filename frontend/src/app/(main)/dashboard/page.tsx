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
    accidentReductionRate: 12.3,
    safetyIndex: 85.2
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

  const [regionData, setRegionData] = useState<RegionData[]>([
    { name: '서울특별시', crosswalks: 15420, signalRate: 85.2, accidents: 234, safetyIndex: 88.5 },
    { name: '부산광역시', crosswalks: 8930, signalRate: 79.8, accidents: 156, safetyIndex: 82.1 },
    { name: '대구광역시', crosswalks: 6540, signalRate: 76.3, accidents: 98, safetyIndex: 79.8 },
    { name: '인천광역시', crosswalks: 7820, signalRate: 81.4, accidents: 142, safetyIndex: 84.2 },
    { name: '광주광역시', crosswalks: 4230, signalRate: 74.6, accidents: 67, safetyIndex: 77.9 }
  ]);

  const months = [
    '2024-12', '2024-11', '2024-10', '2024-09', '2024-08', '2024-07'
  ];

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    if (mapLevel === 'country') {
      setMapLevel('province');
    } else if (mapLevel === 'province') {
      setMapLevel('district');
    }
  };

  const resetMapLevel = () => {
    setMapLevel('country');
    setSelectedRegion('전국');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">보행자 안전 분석 대시보드</h1>
              <p className="text-gray-600 mt-1">보행자 사고 데이터 기반 안전 현황 분석</p>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <button
                onClick={resetMapLevel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                전국 보기
              </button>
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
              content={kpiData.safetyIndex + "%"} 
              caption="100점 만점" 
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