"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchMySuggestions, type MySuggestion } from "@/lib/api/account";
import { FaChevronLeft, FaChevronRight, FaRegListAlt, FaRegThumbsUp, FaRegEye } from "react-icons/fa";

// 스타일 결합 유틸리티
function cx(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

const StatusConfig: Record<MySuggestion["status"], { label: string; color: string }> = {
    PENDING: { label: "접수", color: "bg-slate-100 text-slate-600 border-slate-200" },
    REVIEWING: { label: "검토중", color: "bg-amber-50 text-amber-600 border-amber-100" },
    APPROVED: { label: "승인", color: "bg-blue-50 text-blue-600 border-blue-100" },
    REJECTED: { label: "반려", color: "bg-rose-50 text-rose-600 border-rose-100" },
    COMPLETED: { label: "완료", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
};

function StatusBadge({ status }: { status: MySuggestion["status"] }) {
    const config = StatusConfig[status] || { label: status, color: "bg-gray-100 text-gray-600" };
    return (
        <span className={cx("inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full border shadow-sm", config.color)}>
            {config.label}
        </span>
    );
}

export default function MySuggestionsList() {
    const [status, setStatus] = useState<"ALL" | MySuggestion["status"]>("ALL");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [items, setItems] = useState<MySuggestion[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetchMySuggestions({ page, pageSize, status });
                if (!mounted) return;
                setItems(res.items);
                setTotal(res.total);
            } catch (e: any) {
                if (!mounted) return;
                setError(e?.message || "목록을 불러오지 못했습니다.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [page, pageSize, status]);

    function onChangeStatus(v: "ALL" | MySuggestion["status"]) {
        setStatus(v);
        setPage(1);
    }

    return (
        <div className="space-y-6">
            {/* 상단 필터 바 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <FaRegListAlt className="text-blue-500 w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 tracking-tight">내 건의 내역</h3>
                        <p className="text-[11px] text-slate-400 font-medium">총 {total}건의 활동이 있습니다.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">필터</span>
                    <select
                        value={status}
                        onChange={(e) => onChangeStatus(e.target.value as any)}
                        className="text-xs font-bold bg-slate-50 border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-slate-700"
                    >
                        <option value="ALL">전체 보기</option>
                        <option value="PENDING">접수</option>
                        <option value="REVIEWING">검토중</option>
                        <option value="APPROVED">승인</option>
                        <option value="REJECTED">반려</option>
                        <option value="COMPLETED">완료</option>
                    </select>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="hidden md:grid grid-cols-[1fr_120px_160px] px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <div>제목 및 통계</div>
                    <div className="text-center">진행 상태</div>
                    <div className="text-right">작성 일자</div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <span className="text-xs font-bold text-slate-400">데이터 로딩 중...</span>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center text-rose-500 font-bold text-sm">{error}</div>
                ) : items.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-slate-300 font-black text-lg">Empty</p>
                        <p className="text-slate-400 text-xs mt-1">등록된 건의사항이 없습니다.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {items.map((it) => (
                            <li key={String(it.id)} className="group">
                                <Link
                                    href={`/board/${it.id}`}
                                    className="grid grid-cols-[1fr_100px] md:grid-cols-[1fr_120px_160px] gap-4 px-6 md:px-8 py-5 hover:bg-slate-50/80 transition-all items-center"
                                >
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                            {it.title}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                                <FaRegThumbsUp className="w-2.5 h-2.5" /> {it.likeCount ?? 0}
                                            </span>
                                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                                <FaRegEye className="w-2.5 h-2.5" /> {it.viewCount ?? 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end md:justify-center">
                                        <StatusBadge status={it.status} />
                                    </div>

                                    <div className="hidden md:block text-right text-xs font-bold text-slate-400 tracking-tighter tabular-nums">
                                        {it.createdAt ? new Date(it.createdAt).toLocaleDateString("ko-KR") : "-"}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-6 pt-2">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                    className="p-3 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:cursor-pointer"
                >
                    <FaChevronLeft className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-800">{page}</span>
                    <span className="text-xs font-bold text-slate-300">/</span>
                    <span className="text-xs font-bold text-slate-400">{totalPages}</span>
                </div>

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className="p-3 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:cursor-pointer"
                >
                    <FaChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}