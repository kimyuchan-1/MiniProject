import SectionHeader from "@/components/account/SectionHeader";
import ProfileForm from "../profile/ProfileForm";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="프로필"
                description="회원명과 계정 정보를 관리합니다."
            />
            <ProfileForm />
        </div>
    );
}
