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
  const { provinces, cities, selectedProvince, selectedCity, loadingCities, onChangeProvince, onChangeCity } = props;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 whitespace-nowrap">시도 선택</label>
        <select
          className="border rounded-lg px-3 py-2 text-sm min-w-30"
          value={selectedProvince}
          onChange={(e) => onChangeProvince(e.target.value)}
        >
          <option value="ALL">전국</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 whitespace-nowrap">시군구 선택</label>
        <select
          className="border rounded-lg px-3 py-2 text-sm min-w-30"
          value={selectedCity}
          onChange={(e) => onChangeCity(e.target.value)}
          disabled={loadingCities}
        >
          <option value="ALL">
            {loadingCities ? "로딩 중..." : selectedProvince === "ALL" ? "전체" : "전체 (시도 통계)"}
          </option>
          {cities.map((c) => (
            <option key={c.code} value={c.code}>
              {selectedProvince === "ALL" ? `${c.provinceName} ${c.name}` : c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
