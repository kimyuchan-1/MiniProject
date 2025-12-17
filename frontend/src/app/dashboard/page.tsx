export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              횡단보도 안전 대시보드
            </h1>
            <nav className="flex space-x-8">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                대시보드
              </a>
              <a
                href="/analysis"
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                분석
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 통계 개요 섹션 */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              전체 현황
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-500">
                  전체 횡단보도
                </div>
                <div className="text-2xl font-bold text-gray-900">-</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-500">
                  보행자 신호등 설치율
                </div>
                <div className="text-2xl font-bold text-blue-600">-%</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-500">
                  음향신호기 미설치율
                </div>
                <div className="text-2xl font-bold text-red-600">-%</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-500">
                  사고다발지역
                </div>
                <div className="text-2xl font-bold text-orange-600">-</div>
              </div>
            </div>
          </div>

          {/* 지도 섹션 */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              지도 뷰
            </h2>
            <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
              <p className="text-gray-500">지도 컴포넌트가 여기에 표시됩니다</p>
            </div>
          </div>

          {/* 상세 정보 패널 */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              상세 정보
            </h2>
            <div className="bg-white rounded-lg shadow p-6 h-96">
              <p className="text-gray-500">
                지도에서 요소를 클릭하면 상세 정보가 표시됩니다
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}