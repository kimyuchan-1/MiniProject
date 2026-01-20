import Link from "next/link";
import { FaComment, FaEye, FaHeart, FaMapMarkerAlt, FaExclamationTriangle, FaChevronRight } from "react-icons/fa";
import type { Suggestion } from "@/features/board/types";
import { StatusColors, SuggestionStatusLabels, SuggestionTypeLabels } from "@/features/board/constants";
import { getPriorityLevel } from "@/features/acc_calculate/priorityScore";

export default function SuggestionCard(props: {
    suggestion: Suggestion;
    onLike: (id: number) => void;
}) {
    const { suggestion, onLike } = props;
    
    // 우선순위 레벨 계산
    const priorityLevel = getPriorityLevel(suggestion.priority_score || 0);
    const showPriorityBadge = (suggestion.priority_score || 0) >= 60; // 높음 이상만 표시

    return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
      <div className="p-7">
        {/* 상단: 뱃지 그룹 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md ring-1 ring-inset ${StatusColors[suggestion.status]}`}>
            {SuggestionStatusLabels[suggestion.status]}
          </span>
          <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-md">
            {SuggestionTypeLabels[suggestion.suggestion_type]}
          </span>
          {showPriorityBadge && (
            <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md flex items-center gap-1 shadow-sm ${
              priorityLevel.level === 'CRITICAL' ? 'bg-red-500 text-white' :
              priorityLevel.level === 'HIGH' ? 'bg-orange-500 text-white' :
              'bg-amber-400 text-white'
            }`}>
              <FaExclamationTriangle className="w-2.5 h-2.5" />
              {priorityLevel.label}
            </span>
          )}
        </div>

        {/* 중단: 제목 및 본문 */}
        <div className="relative mb-6">
          <Link href={`/board/${suggestion.id}`} className="block group/title">
            <h3 className="text-xl font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors leading-tight mb-3 flex items-center gap-2">
              {suggestion.title}
              <FaChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-blue-500" />
            </h3>
          </Link>
          <p className="text-gray-500 leading-relaxed line-clamp-2 text-sm">
            {suggestion.content}
          </p>
        </div>

        {/* 하단: 정보 및 액션 */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-50">
          <div className="flex items-center gap-5">
            {/* 작성자 아바타 느낌 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-600">
                {suggestion.user?.name?.substring(0, 1) ?? "익"}
              </div>
              <span className="text-xs font-semibold text-gray-700">{suggestion.user?.name ?? "익명"}</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-gray-300" />
                <span>{suggestion.sido} {suggestion.sigungu}</span>
              </div>
              <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
                <span className="flex items-center gap-1"><FaEye className="w-3 h-3" /> {suggestion.view_count}</span>
                <span className="flex items-center gap-1"><FaComment className="w-3 h-3" /> {suggestion.comment_count || 0}</span>
              </div>
              <span className="font-mono">{new Date(suggestion.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <button
            onClick={() => onLike(suggestion.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              suggestion.is_liked 
                ? 'bg-red-50 text-red-600 ring-1 ring-red-200' 
                : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 group-hover:bg-white border border-transparent hover:border-red-100'
            }`}
          >
            <FaHeart className={suggestion.is_liked ? "fill-current" : "text-gray-300"} />
            <span>{suggestion.like_count}</span>
          </button>
        </div>

        {/* 관리자 답변 요약 */}
        {suggestion.admin_response && (
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-start transition-colors group-hover:bg-blue-50/50 group-hover:border-blue-100">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
              <FaComment className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-1">Official Response</div>
              <p className="text-xs text-slate-600 line-clamp-1 italic">"{suggestion.admin_response}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}