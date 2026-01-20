"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle, FaShieldAlt, FaChartLine } from "react-icons/fa";

const items = [
  { href: "/account/profile", label: "프로필", icon: FaUserCircle },
  { href: "/account/security", label: "보안 설정", icon: FaShieldAlt },
  { href: "/account/activity", label: "활동 내역", icon: FaChartLine },
];

// 스타일 결합 유틸리티
function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="p-1">
      <ul className="space-y-2">
        {items.map((it) => {
          const isActive = pathname === it.href;
          const Icon = it.icon;

          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cx(
                  "group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cx(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-blue-400" : "text-slate-300 group-hover:text-slate-600"
                )} />
                <span className="tracking-tight">{it.label}</span>
                
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}