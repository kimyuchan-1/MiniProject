type KPICardProps = {
  title: string;
  content: string;
  caption: string;
  color: 'gray' | 'red' | 'green' | 'blue'; // 타입을 명확히 제한
};

// 색상 테마 매핑 (텍스트, 배경, 테두리, 포인트 컬러 세트)
const colorTheme: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  gray: { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', dot: 'bg-slate-400' },
  red: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500' },
  green: { text: 'text-green-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', dot: 'bg-blue-500' },
};

export default function KPICard({ title, content, caption, color }: KPICardProps) {
  const theme = colorTheme[color] || colorTheme.gray;

  return (
    <div className="relative group overflow-hidden bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-1">
      {/* 우측 상단 장식용 배경 원 (디자인 포인트) */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 transition-transform group-hover:scale-125 ${theme.bg}`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* 헤더 부분 */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
          <span className="text-sm font-semibold text-slate-500 tracking-tight">
            {title}
          </span>
        </div>

        {/* 메인 수치 */}
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-black text-slate-900 tracking-tight italic">
            {content}
          </div>
          
          {/* 하단 캡션/배지 */}
          <div className={`inline-flex w-fit items-center px-2 py-0.5 rounded-md text-xs font-bold mt-2 ${theme.bg} ${theme.text} border ${theme.border}`}>
            {caption}
          </div>
        </div>
      </div>
    </div>
  );
}