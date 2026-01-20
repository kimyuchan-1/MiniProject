"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMe, updateProfile, type Me } from "@/lib/api/account";
import { FaUser, FaEnvelope, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function isValidName(name: string) {
    const v = name.trim();
    return v.length >= 2 && v.length <= 20;
}

// 스타일 결합 유틸리티
function cx(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

export default function ProfileForm() {
    const [me, setMe] = useState<Me | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const canSave = useMemo(() => {
        if (!me) return false;
        if (!isValidName(name)) return false;
        return name.trim() !== me.name?.trim();
    }, [me, name]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchMe();
                if (!mounted) return;
                setMe(data);
                setName(data.name ?? "");
            } catch (e: any) {
                if (!mounted) return;
                setError(e?.message || "사용자 정보를 불러오지 못했습니다.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    async function onSave() {
        if (!canSave) return;
        try {
            setSaving(true);
            setError(null);
            setOkMsg(null);

            const nextName = name.trim();
            await updateProfile({ name: nextName });
            setMe((prev) => (prev ? { ...prev, name: nextName } : prev));
            setOkMsg("회원 정보가 안전하게 변경되었습니다.");
        } catch (e: any) {
            setError(e?.message || "저장에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-slate-100 rounded-2xl" />
                <div className="h-20 bg-slate-100 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* 이메일 섹션 (ReadOnly) */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            <FaEnvelope className="text-slate-300" /> Account Email
                        </label>
                        <div className="relative group">
                            <input
                                value={me?.email ?? ""}
                                readOnly
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-bold text-sm cursor-not-allowed"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <span className="text-[10px] font-black text-slate-300 bg-white px-2 py-1 rounded-md border border-slate-100 uppercase">ReadOnly</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium ml-1 flex items-center gap-1">
                             로그인용 아이디로 사용되는 이메일입니다.
                        </p>
                    </div>

                    {/* 회원명 섹션 */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            <FaUser className="text-slate-300" /> Display Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setOkMsg(null);
                                setError(null);
                            }}
                            placeholder="이름을 입력하세요 (2~20자)"
                            className={cx(
                                "w-full px-5 py-4 bg-white border-2 rounded-2xl font-bold text-slate-800 transition-all outline-none",
                                !isValidName(name) && name.length > 0
                                    ? "border-rose-100 focus:border-rose-400 bg-rose-50/20"
                                    : "border-slate-100 focus:border-blue-500 shadow-sm"
                            )}
                        />
                        <div className="flex items-center justify-between px-1">
                            {!isValidName(name) && name.length > 0 ? (
                                <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1 animate-in slide-in-from-left-1">
                                    <FaExclamationCircle /> 2자에서 20자 사이로 입력해 주세요.
                                </p>
                            ) : (
                                <p className="text-[11px] text-slate-400 font-medium">타인에게 표시될 본인의 성함이나 닉네임을 입력하세요.</p>
                            )}
                        </div>
                    </div>

                    {/* 권한 및 저장 버튼 섹션 */}
                    <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <FaShieldAlt className="text-blue-400 w-3 h-3" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                {me?.role ? `Access Role: ${me.role}` : "Standard Member"}
                            </span>
                        </div>
                        
                        <button
                            onClick={onSave}
                            disabled={!canSave || saving}
                            className={cx(
                                "w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-lg hover:cursor-pointer",
                                canSave && !saving
                                    ? "bg-slate-900 text-white hover:bg-black hover:-translate-y-0.5 shadow-slate-200"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                            )}
                        >
                            {saving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </div>
                            ) : "설정 저장하기"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 메시지 알림 */}
            <div className="px-2">
                {okMsg && (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                        <FaCheckCircle className="shrink-0" />
                        <span className="text-xs font-bold">{okMsg}</span>
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
                        <FaExclamationCircle className="shrink-0" />
                        <span className="text-xs font-bold">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}