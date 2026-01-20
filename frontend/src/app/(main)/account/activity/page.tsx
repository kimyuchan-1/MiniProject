import SectionHeader from "@/components/account/SectionHeader";
import MySuggestionsList from "../activity/MySuggestionsList";

export default function ActivityPage() {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="활동 내역"
                description="지금까지 작성하신 건의사항과 진행 상황을 한곳에서 관리하세요."
            />
            <MySuggestionsList />
        </div>
    );
}