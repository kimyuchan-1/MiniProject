"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react"; // 아이콘 라이브러리 추가

type ProvinceOpt = { province: string; lat: number; lon: number };
type CityOpt = { key: string; city: string; lat: number; lon: number };

export default function DistrictSelectors({
  onMove,
}: {
  onMove: (v: { lat: number; lon: number; zoom?: number }) => void;
}) {
  const [provinces, setProvinces] = useState<ProvinceOpt[]>([]);
  const [cities, setCities] = useState<CityOpt[]>([]);
  const [province, setProvince] = useState("ALL");
  const [cityKey, setCityKey] = useState("ALL");
  const [loadingCities, setLoadingCities] = useState(false);

  // 1) provinces fetch
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/dashboard/provinces", { cache: "no-store" });
      const j = await r.json();
      if (r.ok) setProvinces(j);
      else console.error(j);
    })();
  }, []);

  // 2) cities fetch
  useEffect(() => {
    (async () => {
      if (province === "ALL") {
        setCities([]);
        return;
      }
      setLoadingCities(true);
      try {
        const r = await fetch(`/api/dashboard/cities?province=${encodeURIComponent(province)}`, {
          cache: "no-store",
        });
        const j = await r.json();
        if (r.ok) setCities(j);
        else console.error(j);
      } finally {
        setLoadingCities(false);
      }
    })();
  }, [province]);

  // 3) 이동 로직 (생략 없이 원본 유지)
  useEffect(() => {
    if (province === "ALL") return;
    const p = provinces.find(x => x.province === province);
    if (!p) return;
    onMove({ lat: p.lat, lon: p.lon, zoom: 10 });
  }, [province, provinces, onMove]);

  useEffect(() => {
    if (province === "ALL" || cityKey === "ALL") return;
    const c = cities.find(x => x.key === cityKey);
    if (!c) return;
    onMove({ lat: c.lat, lon: c.lon, zoom: 12 });
  }, [province, cityKey, cities, onMove]);

  return (
    <div className="flex flex-col gap-3 p-2 bg-white/80  border-slate-200 w-full max-w-60">

      <div className="relative group">
        <select
          className="w-full h-11 appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
          value={province}
          onChange={(e) => {
            setProvince(e.target.value);
            setCityKey("ALL");
          }}
        >
          <option value="ALL">시/도 전체</option>
          {provinces.map(p => (
            <option key={p.province} value={p.province}>
              {p.province}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
      </div>

      <div className="relative group">
        <select
          className="w-full h-11 appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
          value={cityKey}
          onChange={(e) => setCityKey(e.target.value)}
          disabled={province === "ALL" || loadingCities}
        >
          <option value="ALL">
            {loadingCities ? "데이터 로딩 중..." : "시/군/구 전체"}
          </option>
          {cities.map(c => (
            <option key={c.key} value={c.key}>
              {c.city}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
      </div>
    </div>
  );
}