'use client'

import { getMonthName } from "@/features/pedacc/utils";
import { AccData } from "@/features/pedacc/types";

// 정렬 및 스타일 유연성을 위해 className props 추가
function Th({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <th className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50/50 ${className}`}>
            {children}
        </th>
    );
}

function Td({ children, colSpan, className = "" }: { children: React.ReactNode; colSpan?: number, className?: string }) {
    return (
        <td colSpan={colSpan} className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${className}`}>
            {children}
        </td>
    );
}

export default function TablesSection(props: {
    yearlyAggregated: AccData[];
    selectedYear: number | null;
    availableYears: number[];
    selectedYearMonthly: AccData[];
    setSelectedYear: (year: number | null) => void;
}) {
    const { yearlyAggregated, selectedYear, availableYears, selectedYearMonthly, setSelectedYear } = props;

    return (
        <div className="space-y-8">
            <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    상세 통계 데이터
                </h2>
            </div>

            {/* 연도별 합계 테이블 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">연도별 합계</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">행을 클릭하여 월별 상세 보기</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-150">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <Th className="text-left pl-6">연도</Th>
                                <Th className="text-right">사고건수</Th>
                                <Th className="text-right">사상자</Th>
                                <Th className="text-right text-red-600">사망</Th>
                                <Th className="text-right text-orange-600">중상</Th>
                                <Th className="text-right">경상</Th>
                                <Th className="text-right pr-6">부상신고</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {yearlyAggregated.map((r) => {
                                const isSelected = selectedYear === r.year;
                                return (
                                    <tr
                                        key={r.year}
                                        onClick={() => setSelectedYear(r.year)}
                                        className={`
                      cursor-pointer transition-colors duration-150 hover:bg-gray-50
                      ${isSelected ? 'bg-blue-50/60' : 'bg-white'}
                    `}
                                    >
                                        <Td className={`pl-6 font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {/* 선택된 행 표시를 위한 작은 인디케이터 */}
                                            <div className="flex items-center gap-2">
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                                {r.year}년
                                            </div>
                                        </Td>
                                        <Td className="text-right tabular-nums font-medium">{r.accident_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums">{r.casualty_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-red-600 font-medium bg-red-50/30">{r.fatality_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-orange-600">{r.serious_injury_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-gray-600">{r.minor_injury_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-gray-500 pr-6">{r.reported_injury_count.toLocaleString()}</Td>
                                    </tr>
                                );
                            })}
                            {!yearlyAggregated.length && (
                                <tr>
                                    <Td colSpan={7} className="text-center py-8 text-gray-500">데이터가 없습니다.</Td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 월별 상세 테이블 (선택 시 표시) */}
            {selectedYear && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex flex-wrap gap-3 items-center justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-blue-600">{selectedYear}년</span> 월별 상세
                        </h3>
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-8 py-1.5 cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}년 데이터 보기</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-150">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <Th className="text-left pl-6">월</Th>
                                    <Th className="text-right">사고건수</Th>
                                    <Th className="text-right">사상자</Th>
                                    <Th className="text-right text-red-600">사망</Th>
                                    <Th className="text-right text-orange-600">중상</Th>
                                    <Th className="text-right">경상</Th>
                                    <Th className="text-right pr-6">부상신고</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {selectedYearMonthly.map((r) => (
                                    <tr key={r.month} className="hover:bg-gray-50 transition-colors">
                                        <Td className="pl-6 font-medium text-gray-900">{getMonthName(r.month)}</Td>
                                        <Td className="text-right tabular-nums">{r.accident_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums">{r.casualty_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-red-600 bg-red-50/10">{r.fatality_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-orange-600">{r.serious_injury_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-gray-600">{r.minor_injury_count.toLocaleString()}</Td>
                                        <Td className="text-right tabular-nums text-gray-500 pr-6">{r.reported_injury_count.toLocaleString()}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}