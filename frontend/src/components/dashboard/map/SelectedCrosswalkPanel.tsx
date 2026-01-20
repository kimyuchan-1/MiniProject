'use client';

import { useMemo } from 'react';
import { Crosswalk, AccidentData } from '@/features/acc_calculate/types';
import { calculateAggregatedRiskScore, calculateSafetyScore } from '@/features/acc_calculate/utils';
import { CrosswalkFeatureIcons } from './CrosswalkFeatures';
import { X, AlertCircle, ShieldCheck, Activity } from "lucide-react";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function scoreLevel(score: number, kind: "risk" | "safety") {
  const s = clamp(score, 0, 100);
  if (kind === "risk") {
    if (s >= 80) return { label: "위험 매우 높음", tone: "red" as const };
    if (s >= 60) return { label: "위험 높음", tone: "red" as const };
    if (s >= 40) return { label: "주의 요망", tone: "orange" as const };
    if (s >= 20) return { label: "낮음", tone: "gray" as const };
    return { label: "매우 낮음", tone: "gray" as const };
  } else {
    if (s >= 80) return { label: "매우 안전함", tone: "blue" as const };
    if (s >= 60) return { label: "비교적 안전", tone: "blue" as const };
    if (s >= 40) return { label: "보통", tone: "gray" as const };
    if (s >= 20) return { label: "시설 보완 권장", tone: "orange" as const };
    return { label: "위험 시설군", tone: "red" as const };
  }
}

function toneClasses(tone: "red" | "orange" | "blue" | "gray") {
  switch (tone) {
    case "red": return { chip: "bg-red-50 border-red-100 text-red-700", bar: "bg-red-500", text: "text-red-600", light: "bg-red-100" };
    case "orange": return { chip: "bg-orange-50 border-orange-100 text-orange-700", bar: "bg-orange-500", text: "text-orange-600", light: "bg-orange-100" };
    case "blue": return { chip: "bg-blue-50 border-blue-100 text-blue-700", bar: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100" };
    default: return { chip: "bg-slate-50 border-slate-200 text-slate-600", bar: "bg-slate-400", text: "text-slate-500", light: "bg-slate-100" };
  }
}

function StatPill(props: { label: string; value: string; tone?: 'red' | 'orange' | 'blue' | 'gray' }) {
  const tone = toneClasses(props.tone ?? 'gray');
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs', tone.chip)}>
      <span className="opacity-90">{props.label}</span>
      <b className={cx('font-semibold', tone.text)}>{props.value}</b>
    </span>
  );
}

function ProgressCard({ title, score, kind, icon: Icon }: { title: string, score: number, kind: "risk" | "safety", icon: any }) {
  const lv = scoreLevel(score, kind);
  const tone = toneClasses(lv.tone);
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className={cx("p-2 rounded-lg", tone.light)}>
          <Icon className={cx("w-4 h-4", tone.text)} />
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</div>
          <div className="text-xl font-black text-slate-800">{score}<span className="text-xs font-normal text-slate-400 ml-0.5">pt</span></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={cx("h-full rounded-full transition-all duration-500", tone.bar)} style={{ width: `${score}%` }} />
        </div>
        <div className={cx("text-[11px] font-semibold", tone.text)}>{lv.label}</div>
      </div>
    </div>
  );
}

function SkeletonLine({ w = 'w-full' }: { w?: string }) {
  return <div className={cx('h-3 animate-pulse rounded bg-gray-100', w)} />;
}


export function SelectedCrosswalkPanel(props: {
  selected: Crosswalk | null;
  nearbyAccidents: AccidentData[];
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}) {
  const { selected, nearbyAccidents, onClose, loading = false, error = null } = props;

  if (!selected) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center h-full">
        <Activity className="w-10 h-10 text-slate-300 mb-3" />
        <div className="text-sm text-slate-600 font-semibold italic">횡단보도를 선택해주세요</div>
        <p className="mt-1 text-xs text-slate-400">지도의 횡단보도 아이콘을 클릭하면 상세 분석이 시작됩니다.</p>
      </div>
    );
  }

  const safetyScore = useMemo(() => clamp(calculateSafetyScore(selected), 0, 100), [selected]);

  const uniqueHotspots = useMemo(
    () => new Set(nearbyAccidents.map((h) => String((h as any).accidentId))).size,
    [nearbyAccidents]
  );

  const accidentAgg = useMemo(() => {
    // 필드명이 어떤 형태로 와도 최대한 합산되도록 방어적으로 처리
    const sum = (k: string) =>
      nearbyAccidents.reduce((acc, cur: any) => acc + (Number(cur?.[k]) || 0), 0);

    const accidents = sum('accidentCount');
    const casualties = sum('casualtyCount');
    const deaths = sum('fatalityCount');

    // year 범위 표시 (있으면)
    const years = nearbyAccidents
      .map((d: any) => Number(d?.year))
      .filter((v) => Number.isFinite(v))
      .sort((a, b) => a - b);

    const yearText =
      years.length > 0 ? `${years[0]}–${years[years.length - 1]}` : '최근';

    return { accidents, casualties, deaths, yearText };
  }, [nearbyAccidents]);

  const totalRiskScore = useMemo(() => {
    return clamp(
      calculateAggregatedRiskScore(nearbyAccidents, selected.crosswalk_lat, selected.crosswalk_lon),
      0,
      100
    );
  }, [nearbyAccidents, selected.crosswalk_lat, selected.crosswalk_lon]);

  const headerStripTone = scoreLevel(totalRiskScore, 'risk').tone;
  //const strip = toneClasses(headerStripTone).strip;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-xl overflow-hidden flex flex-col h-full transition-all">
      {/* Top Header */}
      <div className="bg-white px-5 py-4 border-b border-slate-100">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase mb-1">Detailed Analysis</span>
            <h3 className="text-base font-bold text-slate-900 truncate pr-2 leading-tight">
              {selected.address || "주소 정보 없음"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors group">
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>
        
        <div className="mt-3 flex gap-2">
          <div className={cx("px-2.5 py-1 rounded-full border text-[11px] font-medium flex items-center gap-1.5", 
            selected.hasSignal ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700")}>
            <div className={cx("w-1.5 h-1.5 rounded-full", selected.hasSignal ? "bg-emerald-500" : "bg-rose-500")} />
            신호등 {selected.hasSignal ? "운영중" : "미설치"}
          </div>
          <div className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 text-[11px] font-medium">
            사고다발 <span className="text-slate-900 font-bold">{uniqueHotspots}</span>개소
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* KPI Score Grid */}
        <div className="grid grid-cols-2 gap-3">
          <ProgressCard title="위험 지수" score={totalRiskScore} kind="risk" icon={AlertCircle} />
          <ProgressCard title="안전 지수" score={safetyScore} kind="safety" icon={ShieldCheck} />
        </div>

        {/* 사고 요약 카드 */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accident Summary</h4>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">{accidentAgg.yearText}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-black text-white">{accidentAgg.accidents}</div>
                <div className="text-[10px] text-slate-400 font-medium">총 사고</div>
              </div>
              <div className="border-x border-white/10">
                <div className="text-xl font-black text-white">{accidentAgg.casualties}</div>
                <div className="text-[10px] text-slate-400 font-medium">총 사상자</div>
              </div>
              <div>
                <div className="text-xl font-black text-rose-400">{accidentAgg.deaths}</div>
                <div className="text-[10px] text-slate-400 font-medium">사망자</div>
              </div>
            </div>
          </div>
          {/* 장식용 배경 패턴 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        {/* 시설 아이콘 섹션 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
            <span className="text-xs font-bold text-slate-700">안전 시설물 현황</span>
            <span className="text-[10px] text-slate-400">Icon scan</span>
          </div>
          <CrosswalkFeatureIcons crosswalk={selected} />
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-600">데이터 동기화 중...</span>
          </div>
        </div>
      )}
    </div>
  );
}