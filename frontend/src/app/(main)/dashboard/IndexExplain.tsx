"use client";

import { useState } from "react";

export default function IndexExplain() {
  const [showDetail, setShowDetail] = useState(false);

  // 스타일 상수
  const thStyle = "px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200";
  const tdStyle = "px-4 py-3 text-sm text-slate-700 border-b border-slate-100 last:border-0";

  return (
    <div className="mx-auto w-full max-w-none rounded-2xl bg-white shadow-sm overflow-hidden border border-slate-200">
      <div className="px-6 py-8 max-h-[80vh] overflow-auto custom-scrollbar">
        {/* 헤더 */}
        <header className="border-b border-slate-100 pb-6 mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">지수 산출 가이드</h1>
          <p className="mt-2 text-slate-500 text-sm">횡단보도 위험도와 안전도를 평가하는 지수 체계에 대한 상세 설명입니다.</p>
        </header>

        {/* 핵심 요약 */}
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100">
            <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500" /> 위험지수 (Risk)
            </h3>
            <p className="text-sm text-red-900/70 leading-relaxed">
              사고 발생 위치와 심각도를 분석하여 산출합니다. <b>숫자가 높을수록 사고 위험이 큼</b>을 의미합니다.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <h3 className="text-emerald-700 font-bold flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 안전지수 (Safety)
            </h3>
            <p className="text-sm text-emerald-900/70 leading-relaxed">
              안전 시설물 설치 현황을 분석합니다. <b>숫자가 높을수록 보행 환경이 안전함</b>을 의미합니다.
            </p>
          </div>
        </div>

        {/* 거리 가중치 테이블 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4">1. 거리별 사고 반영 비중</h2>
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thStyle}>반경 거리</th>
                  <th className={thStyle}>반영 정도</th>
                  <th className={thStyle}>설명</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: "50m 이내", grade: "100%", desc: "사고 영향 매우 높음", color: "text-red-600 bg-red-50" },
                  { range: "50 ~ 100m", grade: "70%", desc: "사고 영향 높음", color: "text-orange-600 bg-orange-50" },
                  { range: "100 ~ 300m", grade: "40%", desc: "사고 영향 보통", color: "text-amber-600 bg-amber-50" },
                  { range: "300 ~ 500m", grade: "10%", desc: "사고 영향 낮음", color: "text-slate-600 bg-slate-50" },
                  { range: "500m 초과", grade: "0%", desc: "데이터 미반영", color: "text-slate-400 bg-white" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className={`${tdStyle} font-semibold`}>{row.range}</td>
                    <td className={tdStyle}>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.color}`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className={`${tdStyle} text-slate-500 text-xs`}>{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 상세 수식 (에러 해결 지점) */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="w-full flex items-center justify-between p-5 text-white hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 px-2 py-1 rounded text-[10px] font-black italic">ALG</div>
              <span className="font-bold tracking-tight">수식 및 정규화 기준 (Technical)</span>
            </div>
            <span className="text-slate-400 text-sm font-medium">{showDetail ? "접기" : "펼치기"}</span>
          </button>

          {showDetail && (
            <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-8">
              {/* 거리 공식 */}
              <div>
                <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 italic">Haversine Distance</h4>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
                  {`d = 2R · asin(√[sin²(Δφ/2) + cos(φ₁)cos(φ₂)sin²(Δλ/2)])`}
                </div>
              </div>

              {/* 가중치 평균 */}
              <div>
                <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3 italic">Risk Weighting</h4>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
                  {`S = 10F + 5Sr + 2M + 1A + 0.5R\n`}
                  <div className="h-px bg-slate-800 my-3" />
                  {`Weighted Score (S̄) = Σ(Si · w(di)) / Σw(di)`}
                </div>
              </div>

              {/* 지수 변환 */}
              <div>
                <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3 italic">Index Normalization</h4>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
                  {`Risk Index = 100 · (1 - exp(-S̄ / 80))\n`}
                  {`Safety Index = 100 · (Σ설치점수 / 최대가능점수)`}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}