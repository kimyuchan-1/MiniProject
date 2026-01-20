'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

type AuthUser = {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
};

export default function AccountMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuId = useId();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onLogout = async () => {
    setOpen(false);
    await fetch("/api/signout", { method: "POST", credentials: "include" });
    router.replace("/");
    router.refresh();        
  };

  const displayName = user.name ?? "사용자";
  const displayEmail = user.email ?? "";
  const initial = (displayName?.[0] ?? "U").toUpperCase();

  return (
    <div className="relative">
      {/* 아바타 버튼 */}
      <button
        ref={btnRef}
        type="button"
        className={`
          h-10 w-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center overflow-hidden shadow-sm hover:cursor-pointer
          ${open ? 'border-blue-500 ring-4 ring-blue-50' : 'border-white bg-slate-100 hover:bg-slate-200 hover:shadow-md'}
        `}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-sm font-black text-slate-700">{initial}</span>
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 p-2 z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* 사용자 정보 섹션 */}
          <div className="px-4 py-4 mb-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-inner">
                {initial}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-black text-slate-900 truncate">{displayName}</span>
                <span className="text-xs text-slate-400 truncate font-medium">{displayEmail}</span>
              </div>
            </div>
            {/* 역할 표시 (있을 경우) */}
            {user.role && (
              <div className="mt-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-wider" />
                  {user.role}
                </div>
            )}
          </div>

          <div className="h-px bg-slate-100 mx-2 mb-1" />

          {/* 메뉴 아이템들 */}
          <div className="space-y-1">
            <a
              role="menuitem"
              href="/account"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 group"
              onClick={() => setOpen(false)}
            >
              <FaCog className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              계정 설정
            </a>

            <button
              role="menuitem"
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 group hover:cursor-pointer"
              onClick={onLogout}
            >
              <FaSignOutAlt className="text-rose-400 group-hover:text-rose-600 transition-colors" />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}