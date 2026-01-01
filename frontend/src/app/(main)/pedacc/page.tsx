"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type YearRow = {
    year: number;
    accident_count: number;
    casualty_count: number;
    fatality_count: number;
    serious_injury_count: number;
    minor_injury_count: number;
    reported_injury_count: number;
};

export default function PedAccPage() {
    const sp = useSearchParams();
    const region = sp.get("region") ?? "";

    const [loading, setLoading] = useState(false);
    const [yearly, setYearly] = useState<YearRow[]>([]);
    const [rawMonthly, setRawMonthly] = useState<any[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!region || region.length < 5) return;

        const run = async () => {
            setLoading(true);
            setError("");
            try {
                const resp = await fetch(`/api/pedacc/summary?region=${encodeURIComponent(region)}`);
                const json = await resp.json();
                if (!resp.ok) throw new Error(json?.error ?? "Failed");
                setYearly(json.yearly ?? []);
                setRawMonthly(json.rawMonthly ?? []);
            } catch (e: any) {
                setError(e.message ?? "Error");
            } finally {
                setLoading(false);
            }
        };

        run();
    }, [region]);

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

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">보행자 사고 현황</h1>
            <div className="text-sm text-gray-600">지역코드(앞 5자리): {region || "(선택 안 됨)"}</div>

            {loading && <div>로딩 중…</div>}
            {error && <div className="text-red-600">에러: {error}</div>}

            {/* 요약 KPI */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <Kpi label="사고" value={total.accident_count} />
                <Kpi label="사상자" value={total.casualty_count} />
                <Kpi label="사망" value={total.fatality_count} />
                <Kpi label="중상" value={total.serious_injury_count} />
                <Kpi label="경상" value={total.minor_injury_count} />
                <Kpi label="부상신고" value={total.reported_injury_count} />
            </div>

            {/* 연도별 테이블 */}
            <div className="rounded-xl border overflow-hidden">
                <div className="px-4 py-3 font-semibold bg-gray-50">연도별 합계</div>
                <div className="overflow-auto">
                    <table className="min-w-[900px] w-full text-sm">
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

            {/* 그래프는 지금 데이터(rawMonthly/yearly)를 기반으로 Recharts 넣으면 끝 */}
            {/* 예: 연도별 사고건수 line chart / stacked bar 등 */}
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
