"use client";

import { useEffect, useState } from "react";
import type { FilterState } from "@/features/board/types";
import { FaFilter, FaLayerGroup, FaMapMarkerAlt, FaSortAmountDown } from "react-icons/fa";

type Props = {
    filters: FilterState;
    onChange: (key: keyof FilterState, value: string) => void;
};

export default function FiltersPanel({ filters, onChange }: Props) {
    const [regions, setRegions] = useState<string[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(true);

    // 지역 목록 조회
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch('/api/suggestions/regions');
                if (response.ok) {
                    const data = await response.json();
                    setRegions(data);
                }
            } catch (error) {
                console.error('지역 목록 조회 실패:', error);
            } finally {
                setLoadingRegions(false);
            }
        };

        fetchRegions();
    }, []);

    const selectWrapperStyles = "relative flex items-center group";
  const selectStyles = `
    w-full pl-10 pr-4 py-2.5 
    bg-slate-50 border border-slate-200 
    rounded-xl text-sm font-medium text-slate-700 
    appearance-none transition-all duration-200
    hover:bg-white hover:border-blue-400 
    focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white
    outline-none
  `;
  const labelStyles = "flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1";
  const iconStyles = "absolute left-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none w-3.5 h-3.5";

  return (
    <div className="pt-6 mt-2 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 상태 필터 */}
        <div className="flex flex-col">
          <label className={labelStyles}>
            <FaFilter className="w-2.5 h-2.5" /> 진행 상태
          </label>
          <div className={selectWrapperStyles}>
            <FaFilter className={iconStyles} />
            <select
              value={filters.status}
              onChange={(e) => onChange("status", e.target.value)}
              className={selectStyles}
            >
              <option value="ALL">전체 상태</option>
              <option value="PENDING">접수 완료</option>
              <option value="REVIEWING">검토 중</option>
              <option value="APPROVED">승인됨</option>
              <option value="REJECTED">반려됨</option>
              <option value="COMPLETED">조치 완료</option>
            </select>
          </div>
        </div>

        {/* 유형 필터 */}
        <div className="flex flex-col">
          <label className={labelStyles}>
            <FaLayerGroup className="w-2.5 h-2.5" /> 건의 유형
          </label>
          <div className={selectWrapperStyles}>
            <FaLayerGroup className={iconStyles} />
            <select
              value={filters.type}
              onChange={(e) => onChange("type", e.target.value)}
              className={selectStyles}
            >
              <option value="ALL">모든 유형</option>
              <option value="SIGNAL">신호등 설치</option>
              <option value="CROSSWALK">횡단보도 설치</option>
              <option value="FACILITY">기타 안전 시설</option>
            </select>
          </div>
        </div>

        {/* 지역 필터 */}
        <div className="flex flex-col">
          <label className={labelStyles}>
            <FaMapMarkerAlt className="w-2.5 h-2.5" /> 지역별
          </label>
          <div className={selectWrapperStyles}>
            <FaMapMarkerAlt className={iconStyles} />
            <select
              value={filters.region}
              onChange={(e) => onChange("region", e.target.value)}
              className={selectStyles}
              disabled={loadingRegions}
            >
              <option value="ALL">전국 지역</option>
              {loadingRegions ? (
                <option disabled>로딩 중...</option>
              ) : (
                regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* 정렬 필터 */}
        <div className="flex flex-col">
          <label className={labelStyles}>
            <FaSortAmountDown className="w-2.5 h-2.5" /> 정렬 기준
          </label>
          <div className={selectWrapperStyles}>
            <FaSortAmountDown className={iconStyles} />
            <select
              value={filters.sortBy}
              onChange={(e) => onChange("sortBy", e.target.value)}
              className={selectStyles}
            >
              <option value="latest">최신 등록순</option>
              <option value="popular">공감 많은순</option>
              <option value="priority">우선순위순</option>
              <option value="status">진행 상태순</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}