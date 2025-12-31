import { Crosswalk, AccidentData, calculateSafetyScore, calculateAggregatedRiskScore } from '@/types/accident';
import { CrosswalkFeatureIcons } from './CrosswalkFeatures';

interface CrosswalkPopupProps {
  crosswalk: Crosswalk;
  nearbyAccidents?: AccidentData[]; // 해당 지역의 사고 데이터
}

export function CrosswalkPopup({ crosswalk, nearbyAccidents = [] }: CrosswalkPopupProps) {
  // 안전 지표 계산
  const safetyScore = calculateSafetyScore(crosswalk);

  // 사고 다발 지역 개수(500m 이내)
  const hotspotCount = new Set(nearbyAccidents.map(h => String(h.accident_id))).size; // ✅ 개수

  // 위험 지표 계산 (해당 지역 사고 데이터 합산)
  const totalRiskScore = calculateAggregatedRiskScore(
    nearbyAccidents,
    crosswalk.crosswalk_lat,
    crosswalk.crosswalk_lon
  );

  return (
    <div className="enhanced-crosswalk-popup bg-white rounded-lg p-2 w-64 max-w-[90vw]">
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

        {hotspotCount > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs bg-orange-50 border border-orange-200 text-orange-800">
            📊 사고 <b className="text-orange-700">{hotspotCount}</b>
          </span>
        )}
      </div>

      <div className="mx-1 mb-2">
        <h4 className="text-xs font-medium text-gray-700 mb-2 text-center">주요 시설</h4>
        <CrosswalkFeatureIcons crosswalk={crosswalk} />
      </div>
    </div >
  );
}