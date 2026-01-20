'use client';

import { FaLayerGroup } from "react-icons/fa"; // 선택 사항: 아이콘 추가

export type MapFilterValue = {
  signalHas: boolean;
  signalNone: boolean;
  accHotspot: boolean;
};

export default function MapFilter(props: {
  value: MapFilterValue;
  onChange: (next: MapFilterValue) => void;
  className?: string;
}) {
  const { value, onChange, className } = props;

  return (
    <div className={`absolute right-4 top-4 z-1000 min-w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl ${className}`}>

      {/* 필터 리스트 */}
      <div className="p-2">
        <div className="flex flex-col gap-1">
          {/* 신호등 있음 */}
          <label className="flex items-center justify-between gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors hover:bg-white/50 group">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
                <span className="relative inline-block w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
              </span>
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">신호등 있음</span>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600"
              checked={value.signalHas}
              onChange={(e) => onChange({ ...value, signalHas: e.target.checked })}
            />
          </label>

          {/* 신호등 없음 */}
          <label className="flex items-center justify-between gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors hover:bg-white/50 group">
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">신호등 없음</span>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600"
              checked={value.signalNone}
              onChange={(e) => onChange({ ...value, signalNone: e.target.checked })}
            />
          </label>

          {/* 사고다발지역 */}
          <label className="flex items-center justify-between gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors hover:bg-white/50 group border-t border-slate-50 mt-1 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-center">
                <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-12 border-b-red-500 drop-shadow-sm" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">사고다발지역</span>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600"
              checked={value.accHotspot}
              onChange={(e) => onChange({ ...value, accHotspot: e.target.checked })}
            />
          </label>
        </div>
      </div>
    </div>
  );
}