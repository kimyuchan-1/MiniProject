"use client";

import { FaHistory } from "react-icons/fa";

interface SectionHeaderProps {
    title: string;
    description: string;
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
    return (

        <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {title}
            </h2>
            <p className="text-sm font-medium text-slate-400">
                {description}
            </p>
            {/* 하단 장식 선 */}
            <div className="h-1 w-10 bg-blue-600 rounded-full mt-2" />
        </div>
    );
}