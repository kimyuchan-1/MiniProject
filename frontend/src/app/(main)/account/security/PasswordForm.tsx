"use client";

import { useMemo, useState } from "react";
import { changePassword } from "@/lib/api/account";
import { FaLock, FaKey, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function validPw(pw: string) {
  return pw.length >= 8;
}

// 스타일 결합 유틸리티
function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
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
      setOkMsg("비밀번호가 성공적으로 변경되었습니다.");
    } catch (e: any) {
      setError(e?.message || "비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  const pwMismatch = confirm.length > 0 && newPassword !== confirm;

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden transition-all">
        <div className="p-8 space-y-8">
          
          {/* 현재 비밀번호 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <FaLock className="text-slate-300" /> Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setOkMsg(null);
                setError(null);
              }}
              placeholder="현재 비밀번호 입력"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-800 transition-all outline-none"
            />
          </div>

          {/* 새 비밀번호 그룹 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <FaKey className="text-slate-300" /> New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setOkMsg(null);
                  setError(null);
                }}
                placeholder="최소 8자 이상"
                className={cx(
                  "w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-800 transition-all outline-none",
                  !validPw(newPassword) && newPassword.length > 0 
                    ? "border-rose-100 focus:border-rose-400" 
                    : "border-transparent focus:border-blue-500 focus:bg-white"
                )}
              />
              {!validPw(newPassword) && newPassword.length > 0 && (
                <p className="text-[10px] text-rose-500 font-bold ml-1 animate-in fade-in slide-in-from-left-1">
                  8자 이상 입력해 주세요.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <FaCheckCircle className="text-slate-300" /> Confirm New Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setOkMsg(null);
                  setError(null);
                }}
                placeholder="한번 더 입력"
                className={cx(
                  "w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-800 transition-all outline-none",
                  pwMismatch 
                    ? "border-rose-100 focus:border-rose-400" 
                    : "border-transparent focus:border-blue-500 focus:bg-white"
                )}
              />
              {pwMismatch && (
                <p className="text-[10px] text-rose-500 font-bold ml-1 animate-in fade-in slide-in-from-left-1">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
          </div>

          {/* 하단 액션바 */}
          <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <FaShieldAlt className="text-blue-400 w-3 h-3" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Security Protocol Active</span>
            </div>
            
            <button
              type="submit"
              disabled={!canSave || saving}
              className={cx(
                "w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-lg hover:cursor-pointer disabled:cursor-not-allowed",
                canSave && !saving
                  ? "bg-slate-900 text-white hover:bg-black hover:-translate-y-0.5 shadow-slate-200"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              )}
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating...
                </div>
              ) : "비밀번호 변경하기"}
            </button>
          </div>
        </div>
      </div>

      {/* 결과 피드백 */}
      <div className="px-2 space-y-3">
        {okMsg && (
          <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-5 py-4 rounded-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
            <FaCheckCircle className="shrink-0 text-lg" />
            <div className="space-y-0.5">
              <p className="text-sm font-black">Success</p>
              <p className="text-xs font-medium opacity-80">{okMsg}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 px-5 py-4 rounded-2xl border border-rose-100 animate-in zoom-in-95 duration-300">
            <FaExclamationCircle className="shrink-0 text-lg" />
            <div className="space-y-0.5">
              <p className="text-sm font-black">Error</p>
              <p className="text-xs font-medium opacity-80">{error}</p>
            </div>
          </div>
        )}
        
        <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed italic">
          계정 보안을 위해 주기적인 비밀번호 변경을 권장합니다.<br/>
          변경 후에는 보안 정책에 따라 재로그인이 필요할 수 있습니다.
        </p>
      </div>
    </form>
  );
}