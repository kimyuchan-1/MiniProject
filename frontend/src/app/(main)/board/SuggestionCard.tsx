import Link from "next/link";
import { FaComment, FaEye, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import type { Suggestion } from "@/features/board/types";
import { StatusColors, SuggestionStatusLabels, SuggestionTypeLabels } from "@/features/board/constants";

export default function SuggestionCard(props: {
    suggestion: Suggestion;
    onLike: (id: number) => void;
}) {
    const { suggestion, onLike } = props;

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${StatusColors[suggestion.status]}`}>
                                {SuggestionStatusLabels[suggestion.status]}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                {SuggestionTypeLabels[suggestion.suggestion_type]}
                            </span>
                            {suggestion.priority_score > 7 && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">긴급</span>
                            )}
                        </div>

                        <Link href={`/board/${suggestion.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {suggestion.title}
                            </h3>
                        </Link>

                        <p className="text-gray-600 mt-2 line-clamp-2">{suggestion.content}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="w-3 h-3" />
                            <span>
                                {suggestion.sido} {suggestion.sigungu}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaEye className="w-3 h-3" />
                            <span>{suggestion.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaComment className="w-3 h-3" />
                            <span>{suggestion.comment_count || 0}</span>
                        </div>
                        <span>{suggestion.user?.name ?? "익명"}</span>
                        <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
                    </div>

                    <button
                        onClick={() => onLike(suggestion.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FaHeart className="w-3 h-3" />
                        <span>{suggestion.like_count}</span>
                    </button>
                </div>

                {suggestion.admin_response && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="text-sm font-medium text-blue-800 mb-1">관리자 답변</div>
                        <p className="text-sm text-blue-700">{suggestion.admin_response}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
