"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { YearlyTrendChart, MonthlyChart, AccidentTypeChart } from "@/components/pedacc/AccidentChart";
import { AccData, ProvinceOpt, CityOpt } from "@/features/pedacc/types";

import RegionSelectors from "./RegionSelectors";
import TablesSection from "./TablesSection";

export default function PedAccClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const region = sp.get("region") ?? ""; // 없으면 전국

  const [provinces, setProvinces] = useState<ProvinceOpt[]>([]);
  const [cities, setCities] = useState<CityOpt[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [yearly, setYearly] = useState<AccData[]>([]);
  const [monthly, setMonthly] = useState<AccData[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // URL 파라미터에서 시도/시군구 분리
  useEffect(() => {

    if (region) {
      if (region.length >= 5) {
        // 시군구 코드가 있는 경우
        const provinceCode = region.substring(0, 2) + "000";
        setSelectedProvince(provinceCode);
        setSelectedCity(region);
      } else if (region.length >= 2) {
        // 시도 코드만 있는 경우 - 5자리 형태로 변환
        const provinceCode = region.length === 2 ? region + "000" : region;
        setSelectedProvince(provinceCode);
        setSelectedCity("ALL");
      }
    } else {
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
    // ✅ 전국이면 cities를 비우고 끝
    if (selectedProvince === "ALL") {
      setCities([]);
      setLoadingCities(false);
      return;
    }

    setLoadingCities(true);
    try {
      const resp = await fetch(`/api/district/cities?province=${encodeURIComponent(selectedProvince)}`);
      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.error ?? "Failed to load cities");
      setCities(Array.isArray(json) ? json : []);
    } catch (e) {
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

        if (selectedCity !== "ALL") {
          // 특정 시군구 선택된 경우
          regionParam = `?region=${encodeURIComponent(selectedCity)}`;
        } else if (selectedProvince !== "ALL") {
          // 시도만 선택된 경우 - 시도 전체 통계
          const provincePrefix = selectedProvince.substring(0, 2);
          regionParam = `?region=${encodeURIComponent(provincePrefix)}`;
        }

        const resp = await fetch(`/api/pedacc/summary${regionParam}`);
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error ?? "Failed");

        setYearly(json.yearly ?? []);

        const monthlyData = json.monthly ?? [];
        setMonthly(monthlyData);

        // 첫 번째 연도를 기본 선택으로 설정
        if (monthlyData.length > 0) {
          const firstYear = monthlyData[0].year;
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

  // 선택된 연도의 월별 데이터
  const selectedYearMonthly = useMemo(() => {

    if (!selectedYear) return [];

    const monthlyForYear = monthly.filter(row => row.year === selectedYear);

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
    }
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
    <div className="w-full bg-gray-50 h-full">
      <div className="max-w-7xl p-6 space-y-6 h-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">보행자 사고 현황</h1>
            <div className="text-sm text-gray-600">선택 지역: {selectedName}</div>
          </div>

          <RegionSelectors
            provinces={provinces}
            cities={cities}
            selectedProvince={selectedProvince}
            selectedCity={selectedCity}
            loadingCities={loadingCities}
            onChangeProvince={onChangeProvince}
            onChangeCity={onChangeCity}
          />
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
        <TablesSection
          yearlyAggregated={yearlyAggregated}
          selectedYear={selectedYear}
          availableYears={availableYears}
          selectedYearMonthly={selectedYearMonthly}
          setSelectedYear={setSelectedYear}
        />
      </div>
    </div>
  );

}


