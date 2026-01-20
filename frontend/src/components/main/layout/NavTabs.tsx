"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 스타일 결합을 위한 유틸리티 (페이지 내부에 정의하거나 별도 유틸 파일에서 가져오세요)
function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const items = [
  { href: "/dashboard", label: "지도" },
  { href: "/pedacc", label: "사고 현황" },
  { href: "/board", label: "건의 게시판" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="relative">
      <ul className="flex items-center gap-1 sm:gap-2">
        {items.map((item) => {
          // 현재 경로가 해당 href로 시작하는지 확인 (상세 페이지에서도 활성화 유지)
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className={cx(
                  "relative flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all duration-300 rounded-xl group",
                  isActive
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >                
                <span className="relative z-10">{item.label}</span>

                {/* 하단 활성화 바 애니메이션 */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}