"use client";

import { useMemo, useState } from "react";
import { changePassword } from "@/lib/api/account";

function validPw(pw: string) {
  return pw.length >= 8;
}

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => {
    if (!currentPassword) return false;
    if (!validPw(newPassword)) return false;
    if (newPassword !== confirm) return false;
    if (currentPassword === newPassword) return false;
    return true;
  }, [currentPassword, newPassword, confirm]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    try {
      setSaving(true);
      setOkMsg(null);
      setError(null);

      await changePassword({ currentPassword, newPassword });

      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setOkMsg("비밀번호가 변경되었습니다.");
    } catch (e: any) {
      setError(e?.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const pwMismatch = confirm.length > 0 && newPassword !== confirm;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-xl border p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setOkMsg(null);
              setError(null);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setOkMsg(null);
              setError(null);
            }}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="최소 8자"
          />
          {!validPw(newPassword) && newPassword.length > 0 ? (
            <p className="text-xs text-red-600 mt-1">비밀번호는 최소 8자 이상이어야 해.</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setOkMsg(null);
              setError(null);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {pwMismatch ? (
            <p className="text-xs text-red-600 mt-1">새 비밀번호가 일치하지 않아.</p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSave || saving}
            className="px-4 py-2 rounded-lg border bg-black text-white disabled:opacity-40"
          >
            {saving ? "변경 중..." : "변경"}
          </button>
        </div>
      </div>

      {okMsg ? <p className="text-sm text-green-700">{okMsg}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <p className="text-xs text-gray-500">
        저장 후 보안 정책에 따라 재로그인이 필요할 수 있습니다.
      </p>
    </form>
  );
}
