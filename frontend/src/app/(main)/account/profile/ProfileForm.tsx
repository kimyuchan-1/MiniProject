"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMe, updateProfile, type Me } from "@/lib/api/account";

function isValidName(name: string) {
    const v = name.trim();
    return v.length >= 2 && v.length <= 20;
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
        return () => {
            mounted = false;
        };
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
            setOkMsg("회원명이 저장되었습니다.");
        } catch (e: any) {
            setError(e?.message || "저장에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="text-sm text-gray-500">불러오는 중...</div>;
    }

    if (error && !me) {
        return (
            <div className="rounded-xl border p-4">
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border p-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">이메일</label>
                    <input
                        value={me?.email ?? ""}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">이메일은 로그인 ID입니다.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">회원명</label>
                    <input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setOkMsg(null);
                            setError(null);
                        }}
                        placeholder="2~20자"
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    {!isValidName(name) ? (
                        <p className="text-xs text-red-600 mt-1">회원명은 2~20자로 입력해줘.</p>
                    ) : null}
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                        {me?.role ? `권한: ${me.role}` : null}
                    </div>
                    <button
                        onClick={onSave}
                        disabled={!canSave || saving}
                        className="px-4 py-2 rounded-lg border bg-black text-white disabled:opacity-40"
                    >
                        {saving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>

            {okMsg ? <p className="text-sm text-green-700">{okMsg}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
