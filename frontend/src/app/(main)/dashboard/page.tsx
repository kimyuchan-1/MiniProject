'use client'

import { useState, useEffect } from 'react';

interface RegionData {
  name: string;
  crosswalks: number;
  signalRate: number;
  accidents: number;
  safetyIndex: number;
}

interface KPIData {
  totalCrosswalks: number;
  signalInstallationRate: number;
  accidentReductionRate: number;
  safetyIndex: number;
  monthlyChange: number;
}

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>('전국');
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-12');
  const [mapLevel, setMapLevel] = useState<'country' | 'province' | 'district'>('country');
  const [kpiData, setKpiData] = useState<KPIData>({
    totalCrosswalks: 125847,
    signalInstallationRate: 78.5,
    accidentReductionRate: 12.3,
    safetyIndex: 85.2,
    monthlyChange: 2.1
  });

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
              <h1 className="text-2xl font-bold text-gray-900">교통 안전 분석 대시보드</h1>
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
            핵심 성과 지표 (KPI) - {selectedRegion}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-500 mb-2">
                전체 횡단보도
              </div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.totalCrosswalks.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">개소</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-500 mb-2">
                신호등 설치율
              </div>
              <div className="text-2xl font-bold text-blue-600">{kpiData.signalInstallationRate}%</div>
              <div className="text-xs text-green-600 mt-1">↑ {kpiData.monthlyChange}% 전월 대비</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-500 mb-2">
                사고 감소율
              </div>
              <div className="text-2xl font-bold text-green-600">{kpiData.accidentReductionRate}%</div>
              <div className="text-xs text-green-600 mt-1">전년 동월 대비</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-500 mb-2">
                안전 지수
              </div>
              <div className="text-2xl font-bold text-purple-600">{kpiData.safetyIndex}</div>
              <div className="text-xs text-gray-500 mt-1">100점 만점</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-500 mb-2">
                월별 변화율
              </div>
              <div className="text-2xl font-bold text-orange-600">+{kpiData.monthlyChange}%</div>
              <div className="text-xs text-gray-500 mt-1">안전도 개선</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 인터랙티브 지도 섹션 */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                인터랙티브 지도 ({mapLevel === 'country' ? '전국' : mapLevel === 'province' ? '시도별' : '구별'})
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  사고 다발지역
                </button>
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  신호등 현황
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  안전 지역
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border h-[500px] relative overflow-hidden">
              {/* 지도 플레이스홀더 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p className="text-gray-600 mb-2">인터랙티브 지도</p>
                  <p className="text-sm text-gray-500">
                    {mapLevel === 'country' ? '전국 지도 - 시도를 클릭하여 확대' : 
                     mapLevel === 'province' ? '시도별 지도 - 구를 클릭하여 상세보기' : 
                     '구별 상세 지도'}
                  </p>
                </div>
              </div>
              
              {/* 히트맵 오버레이 시뮬레이션 */}
              <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm">
                <div className="text-xs font-medium text-gray-700 mb-2">사고 밀도</div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-xs">낮음</span>
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-xs">보통</span>
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span className="text-xs">높음</span>
                </div>
              </div>
            </div>
          </div>

          {/* 지역별 통계 및 상세 정보 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 선택된 지역 상세 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                지역별 상세 통계
              </h2>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-medium text-gray-900 mb-4">{selectedRegion}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">횡단보도 수</span>
                    <span className="font-medium">15,420개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">신호등 설치율</span>
                    <span className="font-medium text-blue-600">85.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">월별 사고 건수</span>
                    <span className="font-medium text-red-600">234건</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">사망자 수</span>
                    <span className="font-medium text-red-800">12명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">안전 지수</span>
                    <span className="font-medium text-green-600">88.5점</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 사고 다발지역 순위 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                위험 지역 순위
              </h3>
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <div className="text-sm font-medium text-gray-700">개선 우선순위</div>
                </div>
                <div className="divide-y">
                  {regionData.slice(0, 5).map((region, index) => (
                    <div 
                      key={region.name} 
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRegionClick(region.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0 ? 'bg-red-500' : 
                            index === 1 ? 'bg-orange-500' : 
                            index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{region.name}</div>
                            <div className="text-xs text-gray-500">사고 {region.accidents}건</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{region.safetyIndex}점</div>
                          <div className="text-xs text-gray-500">안전지수</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 월별 트렌드 차트 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                월별 사고 트렌드
              </h3>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-32 flex items-end justify-between gap-2">
                  {[45, 38, 52, 41, 35, 29].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">
                        {months[index].split('-')[1]}월
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <div className="text-sm text-gray-600">월별 사고 건수 추이</div>
                  <div className="text-xs text-green-600 mt-1">↓ 12.3% 감소 (전년 대비)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 추가 정보 섹션 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 신호등 기능별 분석 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              신호등 기능별 설치 현황
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">음향신호기</span>
                  <span className="text-sm font-medium">67.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">잔여시간표시기</span>
                  <span className="text-sm font-medium">82.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '82.4%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">보행자작동신호기</span>
                  <span className="text-sm font-medium">45.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 예측 분석 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              사고 위험도 예측 (향후 3개월)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-red-800">2025년 1월</div>
                  <div className="text-sm text-red-600">고위험 예상</div>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium text-yellow-800">2025년 2월</div>
                  <div className="text-sm text-yellow-600">중위험 예상</div>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-800">2025년 3월</div>
                  <div className="text-sm text-green-600">저위험 예상</div>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}