import { Crosswalk, AccidentData, calculateSafetyScore, calculateRiskScore } from '@/types/accident';
import { getScoreDescription } from '@/utils/safetyCalculations';
import { CrosswalkFeatureIcons } from './CrosswalkFeatures';

interface CrosswalkPopupProps {
  crosswalk: Crosswalk;
  nearbyAccidents?: AccidentData[]; // 해당 지역의 사고 데이터
}

export function CrosswalkPopup({ crosswalk, nearbyAccidents = [] }: CrosswalkPopupProps) {
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
    { name: '보행자 버튼', value: crosswalk.pedButton, icon: '🔘' },
    { name: '음향신호기', value: crosswalk.pedSound, icon: '🔊' },
    { name: '고원식', value: crosswalk.highland, icon: '⬆️' },
    { name: '보도턱 낮춤', value: crosswalk.bump, icon: '♿' },
    { name: '점자블록', value: crosswalk.brailleBlock, icon: '⚫' },
    { name: '집중조명', value: crosswalk.spotlight, icon: '💡' }
  ].filter(feature => feature.value !== false);

  return (
    <div className="enhanced-crosswalk-popup bg-white rounded-xl p-3 w-[320px] max-w-[92vw]">
      {/* 헤더 - 상단 중앙 */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-600 leading-relaxed"><span className='text-black'>주소: </span>{crosswalk.address}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
        <span className="px-2.5 py-1 rounded-full text-xs bg-green-50 border border-green-200 text-green-800">
          🛡️ 안전 <b className="text-green-700">{safetyScore}</b>
        </span>

        <span className="px-2.5 py-1 rounded-full text-xs bg-red-50 border border-red-200 text-red-800">
          ⚠️ 위험 <b className="text-red-700">{totalRiskScore}</b>
        </span>

        {nearbyAccidents.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs bg-orange-50 border border-orange-200 text-orange-800">
            📊 사고 <b className="text-orange-700">{nearbyAccidents.reduce((s, a) => s + a.accident_count, 0)}</b>
          </span>
        )}
      </div>
      <details className="mx-1 mb-3">
        <summary className="cursor-pointer text-xs text-gray-600 text-center select-none">
          상세 보기
        </summary>
        <div className="mt-2 text-xs text-gray-700 space-y-1">
          <div>안전도: {safetyDescription}</div>
          <div>위험도: {riskDescription}</div>
        </div>
      </details>

      <div className="mx-1 mb-2">
        <h4 className="text-xs font-medium text-gray-700 mb-2 text-center">주요 시설</h4>
        <CrosswalkFeatureIcons crosswalk={crosswalk} />
      </div>
    </div >
  );
}