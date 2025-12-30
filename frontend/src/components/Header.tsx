"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";
import { isLoginAtom } from "@/atoms/isLogin";
import NavTabs from "./NavTabs";
import AccountMenu from "./AccountMenu";

export default function Header() {
    const isLogin = useAtomValue(isLoginAtom);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-gray-50/80 backdrop-blur">
            <nav className="w-full flex h-16 items-center justify-between px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 select-none"
                    aria-label="Go to Home"
                >
                    <span className="text-lg font-extrabold tracking-tight text-gray-900">
                        PedSafe
                    </span>
                    <span className="hidden sm:inline text-sm text-gray-500">
                        보행자 교통안전 대시보드
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {!isLogin ? (
                        <>
                            <Link
                                href="/signin"
                                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                로그인
                            </Link>

                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                                회원가입
                            </Link>
                        </>
                    ) : (
                        <>
                            <NavTabs />
                            <span className="mx-1" aria-hidden="true" />
                            <AccountMenu />
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
