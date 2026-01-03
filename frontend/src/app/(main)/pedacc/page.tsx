"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { YearlyTrendChart, MonthlyChart, AccidentTypeChart } from "@/components/AccidentChart";

type YearRow = {
  year: number;
  month: number;
  accident_count: number;
  casualty_count: number;
  fatality_count: number;
  serious_injury_count: number;
  minor_injury_count: number;
  reported_injury_count: number;
};

type MonthlyData = {
  year: number;
  month: number;
  accident_count: number;
  casualty_count: number;
  fatality_count: number;
  serious_injury_count: number;
  minor_injury_count: number;
  reported_injury_count: number;
};

type DistrictOpt = { code5: string; name: string };
type ProvinceOpt = { code: string; name: string };
type CityOpt = { code: string; name: string; fullName: string; provinceName: string };

export default function PedAccPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const region = sp.get("region") ?? ""; // 없으면 전국

  const [districts, setDistricts] = useState<DistrictOpt[]>([]);
  const [provinces, setProvinces] = useState<ProvinceOpt[]>([]);
  const [cities, setCities] = useState<CityOpt[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [yearly, setYearly] = useState<YearRow[]>([]);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 지역 select의 현재 값: region 없으면 "ALL"
  const selected = region && region.length >= 2 ? region : "ALL";

  // URL 파라미터에서 시도/시군구 분리
  useEffect(() => {
    console.log(`=== URL 파라미터 분석 ===`);
    console.log(`region 파라미터: ${region}`);
    
    if (region) {
      if (region.length >= 5) {
        // 시군구 코드가 있는 경우
        const provinceCode = region.substring(0, 2) + "000";
        console.log(`시군구 코드 감지: ${region} -> 시도: ${provinceCode}`);
        setSelectedProvince(provinceCode);
        setSelectedCity(region);
      } else if (region.length >= 2) {
        // 시도 코드만 있는 경우 - 5자리 형태로 변환
        const provinceCode = region.length === 2 ? region + "000" : region;
        console.log(`시도 코드 감지: ${region} -> ${provinceCode}`);
        setSelectedProvince(provinceCode);
        setSelectedCity("ALL");
      }
    } else {
      console.log(`전국 선택`);
      setSelectedProvince("ALL");
      setSelectedCity("ALL");
    }
  }, [region]);

  // 시도 목록 로딩
  useEffect(() => {
    const run = async () => {
      try {
        const resp = await fetch("/api/district/provinces");
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error ?? "Failed to load provinces");
        const provinceData = Array.isArray(json) ? json : [];
        console.log(`Loaded ${provinceData.length} provinces:`, provinceData);
        setProvinces(provinceData);
      } catch (e: any) {
        console.error("Failed to load provinces:", e);
      }
    };
    run();
  }, []);

  // 선택된 시도의 시군구 목록 로딩
  useEffect(() => {
    const run = async () => {
      setLoadingCities(true);
      try {
        let resp;
        if (selectedProvince === "ALL") {
          // 전국의 모든 시군구 가져오기
          resp = await fetch("/api/district/all-cities");
        } else {
          // 특정 시도의 시군구만 가져오기
          resp = await fetch(`/api/district/cities?province=${encodeURIComponent(selectedProvince)}`);
        }
        
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error ?? "Failed to load cities");
        const cityData = Array.isArray(json) ? json : [];
        console.log(`Loaded ${cityData.length} cities for province ${selectedProvince}:`, cityData);
        setCities(cityData);
      } catch (e: any) {
        console.error("Failed to load cities:", e);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    run();
  }, [selectedProvince]);

  // 통계 로딩: region 없으면 전국, 있으면 해당 지역
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        let regionParam = "";
        let logMessage = "";
        
        if (selectedCity !== "ALL") {
          // 특정 시군구 선택된 경우
          regionParam = `?region=${encodeURIComponent(selectedCity)}`;
          logMessage = `특정 시군구 통계: ${selectedCity}`;
        } else if (selectedProvince !== "ALL") {
          // 시도만 선택된 경우 - 시도 전체 통계
          const provincePrefix = selectedProvince.substring(0, 2);
          regionParam = `?region=${encodeURIComponent(provincePrefix)}`;
          logMessage = `시도 전체 통계: ${selectedProvince} (prefix: ${provincePrefix})`;
        } else {
          // 전국 통계
          logMessage = "전국 통계";
        }
        
        console.log(`=== 통계 API 호출 ===`);
        console.log(`선택된 시도: ${selectedProvince}`);
        console.log(`선택된 시군구: ${selectedCity}`);
        console.log(`API 호출: /api/pedacc/summary${regionParam}`);
        console.log(`설명: ${logMessage}`);
        
        const resp = await fetch(`/api/pedacc/summary${regionParam}`);
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error ?? "Failed");
        
        console.log(`통계 데이터 수신:`, json.yearly?.length || 0, "개 연도");
        console.log(`원본 데이터 샘플:`, json.yearly?.slice(0, 3));
        console.log(`월별 원본 데이터:`, json.rawMonthly?.length || 0, "개");
        console.log(`월별 원본 샘플:`, json.rawMonthly?.slice(0, 3));
        
        setYearly(json.yearly ?? []);
        
        // 월별 데이터 처리 - rawMonthly 사용
        const monthlyData = json.rawMonthly ?? [];
        setMonthly(monthlyData);
        console.log(`월별 데이터 설정:`, monthlyData.length, "개 월");
        
        // 첫 번째 연도를 기본 선택으로 설정
        if (monthlyData.length > 0) {
          const firstYear = monthlyData[0].year;
          console.log(`기본 선택 연도:`, firstYear);
          setSelectedYear(firstYear);
        } else {
          setSelectedYear(null);
        }
      } catch (e: any) {
        console.error("통계 로딩 오류:", e);
        setError(e.message ?? "Error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selectedProvince, selectedCity]);

  // 연도별 집계 데이터 생성 - API에서 이미 제공하므로 그대로 사용
  const yearlyAggregated = useMemo(() => {
    return yearly.sort((a, b) => a.year - b.year);
  }, [yearly]);

  const total = useMemo(() => {
    return yearlyAggregated.reduce(
      (acc, r) => {
        acc.accident_count += r.accident_count;
        acc.casualty_count += r.casualty_count;
        acc.fatality_count += r.fatality_count;
        acc.serious_injury_count += r.serious_injury_count;
        acc.minor_injury_count += r.minor_injury_count;
        acc.reported_injury_count += r.reported_injury_count;
        return acc;
      },
      {
        accident_count: 0,
        casualty_count: 0,
        fatality_count: 0,
        serious_injury_count: 0,
        minor_injury_count: 0,
        reported_injury_count: 0,
      }
    );
  }, [yearlyAggregated]);

  // 선택된 연도의 월별 데이터
  const selectedYearMonthly = useMemo(() => {
    console.log(`=== 월별 데이터 처리 ===`);
    console.log(`선택된 연도: ${selectedYear}`);
    console.log(`전체 월별 데이터 개수: ${monthly.length}`);
    
    if (!selectedYear) return [];
    
    const monthlyForYear = monthly.filter(row => row.year === selectedYear);
    console.log(`${selectedYear}년 데이터:`, monthlyForYear.length, "개");
    console.log(`${selectedYear}년 데이터 샘플:`, monthlyForYear.slice(0, 3));
    
    // 1월부터 12월까지 모든 월 데이터 생성 (데이터가 없는 월은 0으로 채움)
    const allMonths = [];
    for (let month = 1; month <= 12; month++) {
      const monthData = monthlyForYear.find(row => row.month === month);
      const finalData = monthData || {
        year: selectedYear,
        month,
        accident_count: 0,
        casualty_count: 0,
        fatality_count: 0,
        serious_injury_count: 0,
        minor_injury_count: 0,
        reported_injury_count: 0,
      };
      allMonths.push(finalData);
      
      if (month <= 3) { // 처음 3개월만 로그
        console.log(`${month}월 데이터:`, monthData ? "실제 데이터" : "기본값", finalData);
      }
    }
    
    console.log(`최종 월별 데이터:`, allMonths.length, "개");
    return allMonths;
  }, [monthly, selectedYear]);

  // 사용 가능한 연도 목록
  const availableYears = useMemo(() => {
    const years = [...new Set(monthly.map(row => row.year))];
    return years.sort((a, b) => b - a); // 최신 연도부터
  }, [monthly]);

  const selectedName = useMemo(() => {
    if (selectedProvince === "ALL") {
      if (selectedCity === "ALL") {
        return "전국";
      } else {
        const cityInfo = cities.find(c => c.code === selectedCity);
        return cityInfo ? cityInfo.fullName : selectedCity;
      }
    }
    
    const provinceName = provinces.find(p => p.code === selectedProvince)?.name ?? 
                        selectedProvince.substring(0, 2);
    
    if (selectedCity === "ALL") {
      return provinceName;
    }
    
    const cityInfo = cities.find(c => c.code === selectedCity);
    if (cityInfo) {
      return `${provinceName} ${cityInfo.name}`;
    }
    
    return `${provinceName} ${selectedCity}`;
  }, [selectedProvince, selectedCity, provinces, cities]);

  const onChangeProvince = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    setSelectedCity("ALL");
    
    if (provinceCode === "ALL") {
      router.push("/pedacc");
    } else {
      // URL에는 앞 2자리만 사용
      const provincePrefix = provinceCode.substring(0, 2);
      router.push(`/pedacc?region=${encodeURIComponent(provincePrefix)}`);
    }
  };

  const onChangeCity = (cityCode: string) => {
    setSelectedCity(cityCode);
    
    if (cityCode === "ALL") {
      if (selectedProvince === "ALL") {
        router.push("/pedacc");
      } else {
        // URL에는 앞 2자리만 사용
        const provincePrefix = selectedProvince.substring(0, 2);
        router.push(`/pedacc?region=${encodeURIComponent(provincePrefix)}`);
      }
    } else {
      router.push(`/pedacc?region=${encodeURIComponent(cityCode)}`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">보행자 사고 현황</h1>
          <div className="text-sm text-gray-600">선택 지역: {selectedName}</div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">시도 선택</label>
            <select
              className="border rounded-lg px-3 py-2 text-sm min-w-[120px]"
              value={selectedProvince}
              onChange={(e) => onChangeProvince(e.target.value)}
            >
              <option value="ALL">전국</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">시군구 선택</label>
            <select
              className="border rounded-lg px-3 py-2 text-sm min-w-[120px]"
              value={selectedCity}
              onChange={(e) => onChangeCity(e.target.value)}
              disabled={loadingCities}
            >
              <option value="ALL">
                {loadingCities ? "로딩 중..." : 
                 selectedProvince === "ALL" ? "전체" : "전체 (시도 통계)"}
              </option>
              {cities.map((c) => (
                <option key={c.code} value={c.code}>
                  {selectedProvince === "ALL" ? `${c.provinceName} ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && <div>로딩 중…</div>}
      {error && <div className="text-red-600">에러: {error}</div>}

      {/* 그래프 섹션 */}
      {yearlyAggregated.length > 0 && (
        <div className="space-y-6">
          {/* 연도별 추세 그래프 */}
          <div className="rounded-xl border p-4 bg-white">
            <YearlyTrendChart yearlyData={yearlyAggregated} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 사고 유형별 그래프 */}
            <div className="rounded-xl border p-4 bg-white">
              <AccidentTypeChart yearlyData={yearlyAggregated} />
            </div>

            {/* 월별 상세 그래프 */}
            {selectedYear && (
              <div className="rounded-xl border p-4 bg-white">
                <MonthlyChart monthlyData={monthly} selectedYear={selectedYear} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 테이블 섹션 */}
      <div className="space-y-6">
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">상세 통계 테이블</h2>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <div className="px-4 py-3 font-semibold bg-gray-50">연도별 합계</div>
        <div className="overflow-auto">
          <table className="min-w-225 w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>연도</Th>
                <Th>사고</Th>
                <Th>사상자</Th>
                <Th>사망</Th>
                <Th>중상</Th>
                <Th>경상</Th>
                <Th>부상신고</Th>
              </tr>
            </thead>
            <tbody>
              {yearlyAggregated.map((r) => (
                <tr 
                  key={r.year} 
                  className={`border-t cursor-pointer hover:bg-gray-50 ${
                    selectedYear === r.year ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedYear(r.year)}
                >
                  <Td>{r.year}</Td>
                  <Td>{r.accident_count}</Td>
                  <Td>{r.casualty_count}</Td>
                  <Td>{r.fatality_count}</Td>
                  <Td>{r.serious_injury_count}</Td>
                  <Td>{r.minor_injury_count}</Td>
                  <Td>{r.reported_injury_count}</Td>
                </tr>
              ))}
              {!yearlyAggregated.length && (
                <tr className="border-t">
                  <Td colSpan={7}>데이터 없음</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedYear && (
        <div className="rounded-xl border overflow-hidden">
          <div className="px-4 py-3 font-semibold bg-gray-50 flex items-center justify-between">
            <span>{selectedYear}년 월별 상세</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </div>
          <div className="overflow-auto">
            <table className="min-w-225 w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>월</Th>
                  <Th>사고</Th>
                  <Th>사상자</Th>
                  <Th>사망</Th>
                  <Th>중상</Th>
                  <Th>경상</Th>
                  <Th>부상신고</Th>
                </tr>
              </thead>
              <tbody>
                {selectedYearMonthly.map((r) => (
                  <tr key={r.month} className="border-t">
                    <Td>{getMonthName(r.month)}</Td>
                    <Td>{r.accident_count}</Td>
                    <Td>{r.casualty_count}</Td>
                    <Td>{r.fatality_count}</Td>
                    <Td>{r.serious_injury_count}</Td>
                    <Td>{r.minor_injury_count}</Td>
                    <Td>{r.reported_injury_count}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

    </div>
  );

}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value.toLocaleString()}</div>
    </div>
  );
}

function Th({ children }: any) {
  return <th className="text-left px-3 py-2 font-semibold">{children}</th>;
}

function Td({ children, colSpan }: any) {
  return (
    <td colSpan={colSpan} className="px-3 py-2">
      {children}
    </td>
  );
}

function getMonthName(month: number): string {
  const months = [
    '', '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  return months[month] || `${month}월`;
}
