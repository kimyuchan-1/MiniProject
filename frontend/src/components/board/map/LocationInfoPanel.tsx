import { useMemo, useEffect, useState } from 'react';
import { AccidentData } from '@/features/acc_calculate/types';
import { calculateAggregatedRiskScore } from '@/features/acc_calculate/utils';
import { FaExclamationTriangle, FaInfoCircle, FaSkull, FaBriefcaseMedical, FaMapMarkerAlt } from 'react-icons/fa';

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function scoreLevel(score: number) {
  const s = clamp(score, 0, 100);
  if (s >= 80) return { label: '심각', tone: 'red' as const, description: '사고 발생 위험이 매우 높은 지역입니다.' };
  if (s >= 60) return { label: '주의', tone: 'orange' as const, description: '사고가 빈번하여 주의가 필요합니다.' };
  if (s >= 40) return { label: '보통', tone: 'yellow' as const, description: '평균 수준의 사고 위험을 보입니다.' };
  if (s >= 20) return { label: '안전', tone: 'blue' as const, description: '상대적으로 사고 위험이 낮은 지역입니다.' };
  return { label: '매우 안전', tone: 'emerald' as const, description: '사고 기록이 거의 없는 깨끗한 지역입니다.' };
}

function toneClasses(tone: 'red' | 'orange' | 'yellow' | 'blue' | 'emerald') {
  switch (tone) {
    case 'red': return { bar: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', accent: 'text-rose-700' };
    case 'orange': return { bar: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', accent: 'text-orange-700' };
    case 'yellow': return { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', accent: 'text-amber-700' };
    case 'blue': return { bar: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', accent: 'text-blue-700' };
    case 'emerald': return { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: 'text-emerald-700' };
  }
}

interface LocationInfoPanelProps {
  lat: number | null;
  lon: number | null;
  address: string;
  onPriorityScoreCalculated?: (score: number) => void;
}

export default function LocationInfoPanel({ lat, lon, address, onPriorityScoreCalculated }: LocationInfoPanelProps) {
  const [nearbyAccidents, setNearbyAccidents] = useState<AccidentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 주변 사고 데이터 가져오기
  useEffect(() => {
    if (!lat || !lon) {
      setNearbyAccidents([]);
      return;
    }

    const fetchNearbyAccidents = async () => {
      setLoading(true);
      setError(null);
      try {
        // 반경 약 500m를 위도/경도로 변환 (대략 0.005도)
        const delta = 0.005;
        const bounds = `${lat - delta},${lon - delta},${lat + delta},${lon + delta}`;
        
        // console.log('[LocationInfoPanel] Fetching accidents with bounds:', bounds);
        
        const response = await fetch(
          `/api/map/acc_hotspots?bounds=${encodeURIComponent(bounds)}&limit=1000`
        );
        
        // console.log('[LocationInfoPanel] Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          // console.log('[LocationInfoPanel] API Response:', result);
          
          const data = result.success ? result.data : [];
          // console.log('[LocationInfoPanel] Extracted data:', data);
          // console.log('[LocationInfoPanel] Data length:', Array.isArray(data) ? data.length : 'not array');
          
          setNearbyAccidents(Array.isArray(data) ? data : []);
        } else {
          const errorText = await response.text();
          console.error('[LocationInfoPanel] Error response:', errorText);
          setError('사고 데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('[LocationInfoPanel] 사고 데이터 조회 실패:', err);
        setError('사고 데이터 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyAccidents();
  }, [lat, lon]);

  const riskScore = useMemo(() => {
    if (!lat || !lon || nearbyAccidents.length === 0) return 0;
    return clamp(calculateAggregatedRiskScore(nearbyAccidents, lat, lon), 0, 100);
  }, [nearbyAccidents, lat, lon]);

  // 우선순위 점수는 위험 지수와 동일
  useEffect(() => {
    if (onPriorityScoreCalculated && lat && lon) {
      // console.log('[LocationInfoPanel] Priority score (= risk score):', riskScore);
      onPriorityScoreCalculated(riskScore);
    }
  }, [riskScore, lat, lon, onPriorityScoreCalculated]);

  // 100m 내 사고다발지역 개수
  const nearbyHotspots = useMemo(() => {
    if (!lat || !lon) return 0;
    
    // 간단한 거리 계산 (정확하지 않지만 대략적인 필터링용)
    const nearby = nearbyAccidents.filter(acc => {
      const latDiff = Math.abs(acc.accidentLat - lat);
      const lonDiff = Math.abs(acc.accidentLon - lon);
      // 대략 100m = 0.001도
      return latDiff <= 0.001 && lonDiff <= 0.001;
    });
    
    return new Set(nearby.map(a => a.accidentId)).size;
  }, [nearbyAccidents, lat, lon]);

  const { accidents, casualties, deaths, hotspots } = useMemo(() => {
    const sum = (k: keyof AccidentData) => nearbyAccidents.reduce((acc, cur) => acc + (Number(cur[k]) || 0), 0);
    const uniqueHotspots = new Set(nearbyAccidents.filter(acc => {
      if (!lat || !lon) return false;
      return Math.abs(acc.accidentLat - lat) <= 0.001 && Math.abs(acc.accidentLon - lon) <= 0.001;
    }).map(a => a.accidentId)).size;

    return {
      accidents: sum('accidentCount'),
      casualties: sum('casualtyCount'),
      deaths: sum('fatalityCount'),
      hotspots: uniqueHotspots
    };
  }, [nearbyAccidents, lat, lon]);

  if (!lat || !lon) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 transition-all">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
            <FaMapMarkerAlt className="w-5 h-5" />
          </div>
          <p className="text-slate-500 font-bold tracking-tight">지도를 클릭하여 위치를 선택해주세요</p>
          <p className="text-slate-400 text-sm mt-1">선택한 지점의 실시간 위험 분석 데이터가 표시됩니다.</p>
        </div>
      </div>
    );
  }

  const level = scoreLevel(riskScore);
  const tone = toneClasses(level.tone);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* 위험지수 메인 카드 */}
      <div className={cx("relative overflow-hidden rounded-4xl border transition-all duration-700 shadow-xl shadow-slate-200/50", tone.bg, tone.border)}>
        {/* 상단 장식용 그라데이션 라인 */}
        <div className={cx("absolute top-0 left-0 right-0 h-1.5 opacity-50", tone.bar)} />
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={cx("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-sm", tone.bar)}>
                  Risk Analytics
                </span>
                <span className={cx("text-sm font-bold flex items-center gap-1.5", tone.text)}>
                  <FaExclamationTriangle className="w-3 h-3" /> {level.label} 단계
                </span>
              </div>
              <h4 className="text-slate-900 text-lg font-black tracking-tight">교통 위험 분석 결과</h4>
              <p className="text-slate-500 text-sm font-medium">{level.description}</p>
            </div>

            <div className="flex items-center gap-5 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-inner">
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Danger Score</div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                  {riskScore.toFixed(1)}
                  <span className="text-lg text-slate-300 ml-1">/100</span>
                </div>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                 {/* 원형 프로그레스 바 배경 */}
                 <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                      strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * riskScore) / 100}
                      className={cx("transition-all duration-1000 ease-out", tone.text)} 
                    />
                 </svg>
                 <div className={cx("w-3 h-3 rounded-full animate-pulse", tone.bar)} />
              </div>
            </div>
          </div>

          {/* 수평 프로그레스 바 */}
          <div className="mt-8">
            <div className="h-4 w-full rounded-full bg-slate-200/50 p-1 overflow-hidden shadow-inner">
              <div 
                className={cx("h-full rounded-full transition-all duration-1000 ease-out shadow-sm", tone.bar)} 
                style={{ width: `${riskScore}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 세부 통계 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<FaExclamationTriangle />} label="누적 사고" value={`${accidents}건`} loading={loading} />
        <StatCard icon={<FaBriefcaseMedical />} label="부상자수" value={`${casualties}명`} loading={loading} />
        <StatCard icon={<FaSkull />} label="사망자수" value={`${deaths}명`} tone={deaths > 0 ? 'red' : 'gray'} loading={loading} />
        <StatCard icon={<FaMapMarkerAlt />} label="사고다발" value={`${hotspots}곳`} tone={hotspots >= 2 ? 'orange' : 'gray'} loading={loading} />
      </div>

      {/* 정보 안내 팁 */}
      <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
        <div className="bg-white p-2 rounded-xl shadow-sm">
          <FaInfoCircle className="text-blue-500 w-4 h-4" />
        </div>
        <p className="text-xs text-blue-800 font-medium leading-relaxed">
          해당 지표는 반경 500m 내의 최근 교통사고 데이터를 기반으로 <span className="font-bold underline">가중치 알고리즘</span>을 통해 산출되었습니다.
          수치가 높을수록 우선적인 도로 개선이 필요함을 의미합니다.
        </p>
      </div>
    </div>
  );
}

// 서브 컴포넌트: 통계 카드
function StatCard({ icon, label, value, tone = 'gray', loading }: { icon: React.ReactNode, label: string, value: string, tone?: 'gray' | 'red' | 'orange', loading: boolean }) {
  const tones = {
    gray: 'text-slate-400 bg-white border-slate-200',
    red: 'text-rose-500 bg-rose-50 border-rose-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-100'
  };

  return (
    <div className={cx("border p-4 rounded-2xl flex flex-col items-center justify-center transition-all hover:shadow-md", tones[tone])}>
      <div className="mb-2 opacity-80">{icon}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</div>
      {loading ? (
        <div className="h-5 w-12 bg-slate-100 animate-pulse rounded" />
      ) : (
        <div className="text-lg font-black text-slate-800 tracking-tight tabular-nums">{value}</div>
      )}
    </div>
  );
}