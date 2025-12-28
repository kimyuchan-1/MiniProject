import { EnhancedCrosswalk, AccidentData, calculateSafetyScore, calculateRiskScore } from '@/types/accident';
import { getScoreDescription } from '@/utils/safetyCalculations';

interface EnhancedCrosswalkPopupProps {
  crosswalk: EnhancedCrosswalk;
  nearbyAccidents?: AccidentData[]; // 해당 지역의 사고 데이터
}

export function EnhancedCrosswalkPopup({ crosswalk, nearbyAccidents = [] }: EnhancedCrosswalkPopupProps) {
  // 안전 지표 계산
  const safetyScore = calculateSafetyScore(crosswalk);
  const safetyDescription = getScoreDescription(safetyScore, 'safety');
  
  // 위험 지표 계산 (해당 지역 사고 데이터 합산)
  const totalRiskScore = nearbyAccidents.reduce((sum, accident) => {
    return sum + calculateRiskScore(accident);
  }, 0);
  const riskDescription = getScoreDescription(totalRiskScore, 'risk');

  // 안전 기능 목록 생성
  const safetyFeatures = [
    { name: '신호등', value: crosswalk.hasSignal, icon: '🚦' },
    { name: '보행자 버튼', value: crosswalk.button, icon: '🔘' },
    { name: '음향신호기', value: crosswalk.sound_signal, icon: '🔊' },
    { name: '고원식', value: crosswalk.highland, icon: '⬆️' },
    { name: '보도턱 낮춤', value: crosswalk.bump, icon: '♿' },
    { name: '점자블록', value: crosswalk.braille_block, icon: '⚫' },
    { name: '집중조명', value: crosswalk.spotlight, icon: '💡' }
  ].filter(feature => feature.value !== undefined);

  return (
    <div className="enhanced-crosswalk-popup">
      {/* 헤더 - 상단 중앙 */}
      <div className="text-center mt-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">횡단보도</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{crosswalk.address}</p>
      </div>

      {/* 안전/위험 지표 - 중앙 정렬 */}
      <div className="flex justify-center gap-6 mb-4 mx-1">
        {/* 안전 지표 */}
        <div className="safety-score bg-green-50 p-3 rounded-lg border border-green-200 text-center min-w-[70px]">
          <div className="text-xs text-green-800 mb-1 flex items-center justify-center">
            <span className="mr-1">🛡️</span>안전
          </div>
          <div className="text-lg font-bold text-green-700">{safetyScore}</div>
        </div>

        {/* 위험 지표 */}
        <div className="risk-score bg-red-50 p-3 rounded-lg border border-red-200 text-center min-w-[70px]">
          <div className="text-xs text-red-800 mb-1 flex items-center justify-center">
            <span className="mr-1">⚠️</span>위험
          </div>
          <div className="text-lg font-bold text-red-700">{totalRiskScore}</div>
        </div>

        {/* 근처 사고 정보 */}
        {nearbyAccidents.length > 0 && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center min-w-[70px]">
            <div className="text-xs text-orange-800 mb-1 flex items-center justify-center">
              <span className="mr-1">📊</span>사고
            </div>
            <div className="text-lg font-bold text-orange-700">
              {nearbyAccidents.reduce((sum, acc) => sum + acc.accident_count, 0)}
            </div>
          </div>
        )}
      </div>

      {/* 주요 안전 기능 - 하단 */}
      <div className='mx-1 mb-2'>
        <h4 className="text-xs font-medium text-gray-700 mb-3 text-center">주요 시설</h4>
        <div className="grid grid-cols-2 gap-2">
          {safetyFeatures.slice(0, 4).map((feature, index) => (
            <div 
              key={index}
              className={`flex items-center text-xs px-3 py-2 rounded-lg ${
                feature.value 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className="mr-2">{feature.icon}</span>
              <span className={feature.value ? 'font-medium' : 'line-through text-xs'}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .enhanced-crosswalk-popup {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          border-radius: 12px;
          padding: 20px;
          min-width: 360px;
          max-width: 380px;
        }
      `}</style>
    </div>
  );
}