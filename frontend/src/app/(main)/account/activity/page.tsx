import SectionHeader from "@/components/account/SectionHeader";
import MySuggestionsList from "../activity/MySuggestionsList";

export default function ActivityPage() {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="활동 내역"
                description="내가 작성한 건의를 확인합니다."
            />
            <MySuggestionsList />
        </div>
    );
}
