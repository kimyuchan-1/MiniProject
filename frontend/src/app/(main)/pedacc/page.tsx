"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type YearRow = {
  year: number;
  accident_count: number;
  casualty_count: number;
  fatality_count: number;
  serious_injury_count: number;
  minor_injury_count: number;
  reported_injury_count: number;
};

type DistrictOpt = { code5: string; name: string };

export default function PedAccPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const region = sp.get("region") ?? ""; // 없으면 전국

  const [districts, setDistricts] = useState<DistrictOpt[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearly, setYearly] = useState<YearRow[]>([]);
  const [error, setError] = useState<string>("");

  // 지역 select의 현재 값: region 없으면 "ALL"
  const selected = region && region.length >= 5 ? region.slice(0, 5) : "ALL";

  // district 옵션 로딩
  useEffect(() => {
    const run = async () => {
      try {
        const resp = await fetch("/api/district/list");
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error ?? "Failed to load districts");
        setDistricts(Array.isArray(json) ? json : []);
      } catch (e: any) {
        // district 로딩 실패해도 페이지는 전국/지역 통계는 동작할 수 있게 그냥 표시만
        console.error(e);
      }
    };
    run();
  }, []);

  // 통계 로딩: region 없으면 전국, 있으면 해당 지역
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const qs = selected === "ALL" ? "" : `?region=${encodeURIComponent(selected)}`;
        const resp = await fetch(`/api/pedacc/summary${qs}`);
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error ?? "Failed");
        setYearly(json.yearly ?? []);
      } catch (e: any) {
        setError(e.message ?? "Error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selected]);

  const total = useMemo(() => {
    return yearly.reduce(
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
  }, [yearly]);

  const selectedName =
    selected === "ALL"
      ? "전국"
      : districts.find((d) => d.code5 === selected)?.name ?? selected;

  const onChangeRegion = (v: string) => {
    if (v === "ALL") router.push("/pedacc");
    else router.push(`/pedacc?region=${encodeURIComponent(v)}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">보행자 사고 현황</h1>
          <div className="text-sm text-gray-600">선택 지역: {selectedName}</div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">지역 선택</label>
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={selected}
            onChange={(e) => onChangeRegion(e.target.value)}
          >
            <option value="ALL">전국</option>
            {districts.map((d) => (
              <option key={d.code5} value={d.code5}>
                {d.name} ({d.code5})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div>로딩 중…</div>}
      {error && <div className="text-red-600">에러: {error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="사고" value={total.accident_count} />
        <Kpi label="사상자" value={total.casualty_count} />
        <Kpi label="사망" value={total.fatality_count} />
        <Kpi label="중상" value={total.serious_injury_count} />
        <Kpi label="경상" value={total.minor_injury_count} />
        <Kpi label="부상신고" value={total.reported_injury_count} />
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
              {yearly.map((r) => (
                <tr key={r.year} className="border-t">
                  <Td>{r.year}</Td>
                  <Td>{r.accident_count}</Td>
                  <Td>{r.casualty_count}</Td>
                  <Td>{r.fatality_count}</Td>
                  <Td>{r.serious_injury_count}</Td>
                  <Td>{r.minor_injury_count}</Td>
                  <Td>{r.reported_injury_count}</Td>
                </tr>
              ))}
              {!yearly.length && (
                <tr className="border-t">
                  <Td colSpan={7}>데이터 없음</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
