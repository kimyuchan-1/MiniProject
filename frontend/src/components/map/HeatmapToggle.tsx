interface HeatmapToggleProps {
  visible: boolean;
  onToggle: (visible: boolean) => void;
  accidentCount?: number;
}

export function HeatmapToggle({ visible, onToggle, accidentCount = 0 }: HeatmapToggleProps) {
  return (
    <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg border shadow-lg p-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(!visible)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${visible ? 'bg-blue-600' : 'bg-gray-200'}
            `}
            role="switch"
            aria-checked={visible}
            aria-label="사고 히트맵 표시 토글"
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${visible ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              사고 히트맵
            </span>
            <span className="text-xs text-gray-500">
              {accidentCount > 0 ? `${accidentCount}개 지역` : '데이터 없음'}
            </span>
          </div>
        </div>

        {/* 히트맵 범례 (토글이 켜져있을 때만 표시) */}
        {visible && (
          <div className="ml-4 pl-4 border-l border-gray-200">
            <div className="text-xs text-gray-600 mb-1">위험도</div>
            <div className="flex items-center gap-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-2 bg-gradient-to-r from-green-400 to-yellow-400 rounded-sm"></div>
                  <span className="text-xs text-gray-500">낮음</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-2 bg-gradient-to-r from-orange-400 to-red-600 rounded-sm"></div>
                  <span className="text-xs text-gray-500">높음</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 설명 텍스트 */}
      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
        💡 사고 발생 빈도와 심각도를 기반으로 한 위험 지역 표시
      </div>
    </div>
  );
}