import SectionHeader from "@/components/account/SectionHeader";
import PasswordForm from "../security/PasswordForm";

export default function SecurityPage() {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="보안"
                description="비밀번호를 변경할 수 있습니다."
            />
            <PasswordForm />
        </div>
    );
}
