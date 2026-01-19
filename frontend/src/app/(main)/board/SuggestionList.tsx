import type { Suggestion } from "@/features/board/types";
import SuggestionCard from "./SuggestionCard";

export default function SuggestionList(props: {
    loading: boolean;
    suggestions: Suggestion[];
    onLike: (id: number) => void;
}) {
    const { loading, suggestions, onLike } = props;

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {suggestions.map((s) => (
                <SuggestionCard key={s.id} suggestion={s} onLike={onLike} />
            ))}
        </div>
    );
}
