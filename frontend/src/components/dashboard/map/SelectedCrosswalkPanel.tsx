'use client';

import { Crosswalk, AccidentData } from '@/features/acc_calculate/types';
import { calculateAggregatedRiskScore, calculateSafetyScore } from '@/features/acc_calculate/utils';
import { CrosswalkFeatureIcons } from './CrosswalkFeatures';

export function SelectedCrosswalkPanel(props: {
  selected: Crosswalk | null;
  nearbyAccidents: AccidentData[];
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}) {
  const { selected, nearbyAccidents, onClose, loading = false, error = null } = props;

  if (!selected) {
    return (
      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-gray-600">지도의 횡단보도를 클릭하면 상세 정보가 여기에 표시돼.</div>
      </div>
    );
  }

  const safetyScore = calculateSafetyScore(selected);

  const hotspotCount = new Set(nearbyAccidents.map(h => String(h.accident_id))).size;

  const totalRiskScore = calculateAggregatedRiskScore(
    nearbyAccidents,
    selected.crosswalk_lat,
    selected.crosswalk_lon
  );

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-500">선택된 횡단보도</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">{selected.address}</div>
        </div>

        <button
          onClick={onClose}
          className="text-xs px-2 py-1 rounded-md border bg-white hover:bg-gray-50"
        >
          닫기
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="px-2.5 py-1 rounded-full text-xs bg-green-50 border border-green-200 text-green-800">
          🛡️ 안전 <b className="text-green-700">{safetyScore}</b>
        </span>

        <span className="px-2.5 py-1 rounded-full text-xs bg-red-50 border border-red-200 text-red-800">
          ⚠️ 위험 <b className="text-red-700">{totalRiskScore}</b>
        </span>

        <span className="px-2.5 py-1 rounded-full text-xs bg-orange-50 border border-orange-200 text-orange-800">
          📊 사고 <b className="text-orange-700">{hotspotCount}</b>
          <span className="text-[10px] text-orange-700/80 ml-1">(500m)</span>
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-medium text-gray-700 mb-2">주요 시설</h4>
        <CrosswalkFeatureIcons crosswalk={selected} />
      </div>
    </div>
  );
}
