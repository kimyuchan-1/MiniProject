export default function AccountShell(props: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const { nav, children } = props;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">

          {/* 사이드바 네비게이션 영역 */}
          <aside className="lg:sticky lg:top-8 transition-all duration-300">
            <div className="space-y-6">
              <div className="px-8 py-6 bg-white/60 backdrop-blur-md rounded-4xl border border-slate-100 p-3 shadow-xl shadow-slate-200/40">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">계정 설정</h1>
                <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-widest">My Account</p>
                <div className="mt-8">
                  {nav}
                </div>
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 영역 */}
          <main className="relative group">
            {/* 장식용 배경 요소 */}
            <div className="absolute -inset-1 bg-linear-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 min-h-150">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}