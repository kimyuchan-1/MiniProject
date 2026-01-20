"use client";
import type { ProvinceOpt, CityOpt } from "@/features/pedacc/types";

export default function RegionSelectors(props: {
  provinces: ProvinceOpt[];
  cities: CityOpt[];
  selectedProvince: string;
  selectedCity: string;
  loadingCities: boolean;
  onChangeProvince: (v: string) => void;
  onChangeCity: (v: string) => void;
}) {
  const {
    provinces,
    cities,
    selectedProvince,
    selectedCity,
    loadingCities,
    onChangeProvince,
    onChangeCity,
  } = props;

  const isAllProvince = selectedProvince === "ALL";

  const cityLabel = (c: CityOpt) => {
    const parts = (c.name ?? "").split(" ");
    return parts.length >= 2 ? parts[parts.length - 1] : c.name;
  };

  const uniqueCities = cities.reduce((acc, city) => {
    if (!acc.find((c) => c.code === city.code)) {
      acc.push(city);
    }
    return acc;
  }, [] as CityOpt[]);

  // 공통 Select 스타일 클래스
  const selectBaseStyles = `
    block w-full sm:w-48 pl-3 pr-10 py-2.5 text-sm font-medium
    bg-white border border-gray-200 rounded-xl shadow-sm
    appearance-none cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 w-fit">
      {/* 시도 선택 */}
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
          시도 선택
        </label>
        <div className="relative group">
          <select
            className={selectBaseStyles}
            value={selectedProvince}
            onChange={(e) => onChangeProvince(e.target.value)}
          >
            <option value="ALL">전국 (전체)</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-gray-600 transition-colors">
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* 구분선 (데스크탑 전용) */}
      <div className="hidden sm:block h-8 w-px bg-gray-200 mt-5" />

      {/* 시군구 선택 */}
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
          시군구 선택
        </label>
        <div className="relative group">
          <select
            className={selectBaseStyles}
            value={selectedCity}
            onChange={(e) => onChangeCity(e.target.value)}
            disabled={loadingCities || isAllProvince}
          >
            {isAllProvince ? (
              <option value="ALL">전국 전체</option>
            ) : (
              <>
                <option value="ALL">
                  {loadingCities ? "데이터 로딩 중..." : "전체 (시도 통계)"}
                </option>
                {uniqueCities.map((c) => (
                  <option key={c.code} value={c.code}>
                    {cityLabel(c)}
                  </option>
                ))}
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-gray-600 transition-colors">
            {loadingCities ? (
              <LoadingSpinner />
            ) : (
              <ChevronIcon />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 아이콘 컴포넌트 분리
function ChevronIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}