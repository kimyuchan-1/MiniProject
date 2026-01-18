"use client";

import { useEffect, useState } from "react";
import type { FilterState } from "@/features/board/types";

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                    value={filters.status}
                    onChange={(e) => onChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">전체</option>
                    <option value="PENDING">접수</option>
                    <option value="REVIEWING">검토중</option>
                    <option value="APPROVED">승인</option>
                    <option value="REJECTED">반려</option>
                    <option value="COMPLETED">완료</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                    value={filters.type}
                    onChange={(e) => onChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">전체</option>
                    <option value="SIGNAL">신호등 설치</option>
                    <option value="CROSSWALK">횡단보도 설치</option>
                    <option value="FACILITY">기타 시설</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <select
                    value={filters.region}
                    onChange={(e) => onChange("region", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loadingRegions}
                >
                    <option value="ALL">전체</option>
                    {loadingRegions ? (
                        <option disabled>로딩 중...</option>
                    ) : (
                        regions.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">정렬</label>
                <select
                    value={filters.sortBy}
                    onChange={(e) => onChange("sortBy", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="latest">최신순</option>
                    <option value="popular">인기순</option>
                    <option value="priority">우선순위순</option>
                    <option value="status">상태순</option>
                </select>
            </div>
        </div>
    );
}
