'use client'

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaSave, FaTimes, FaArrowLeft, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// 지도 컴포넌트 (위치 선택용)
const LocationPicker = dynamic(() => import('../../../../components/board/map/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">지도를 불러오는 중...</div>
    </div>
  ),
});

// 위치 정보 패널 (위험/안전 지수 표시)
const LocationInfoPanel = dynamic(() => import('../../../../components/board/map/LocationInfoPanel'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border bg-gray-50 p-6">
      <div className="text-center text-gray-500">
        <div className="text-sm font-medium">위치 정보 로딩 중...</div>
      </div>
    </div>
  ),
});

interface SuggestionForm {
  title: string;
  content: string;
  suggestion_type: 'SIGNAL' | 'CROSSWALK' | 'FACILITY';
  location_lat: number | null;
  location_lon: number | null;
  address: string;
  priority_score: number;
}

export default function CreateSuggestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SuggestionForm>({
    title: '',
    content: '',
    suggestion_type: 'SIGNAL',
    location_lat: null,
    location_lon: null,
    address: '',
    priority_score: 0
  });

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 위치 선택 핸들러
  const handleLocationSelect = useCallback((lat: number, lon: number, address: string) => {
    setForm(prev => ({
      ...prev,
      location_lat: lat,
      location_lon: lon,
      address: address
    }));
  }, []);

  // 우선순위 점수 계산 핸들러
  const handlePriorityScoreCalculated = useCallback((score: number) => {
    // console.log('[CreateSuggestionPage] Priority score calculated:', score);
    setForm(prev => ({
      ...prev,
      priority_score: score
    }));
  }, []);

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (!form.location_lat || !form.location_lon) {
      alert('지도에서 위치를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const result = await response.json();
        alert('건의사항이 성공적으로 등록되었습니다.');
        router.push(`/board/${result.id}`);
      } else {
        const error = await response.json();
        alert(error.message || '건의사항 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('건의사항 등록 실패:', error);
      alert('건의사항 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]"> {/* 더 밝은 slate 톤 배경 */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* 상단 네비게이션 & 헤더 */}
        <div className="mb-2">
          <button
            onClick={() => router.push("/board")}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all mb-4 text-sm font-medium hover:cursor-pointer"
          >
            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            목록으로 돌아가기
          </button>
          <div className="flex items-end justify-between">
            <div className="border-b border-slate-100 m-4 pb-4">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">건의사항 작성</h1>
              <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm md:text-base">
                <FaInfoCircle className="text-blue-500" />
                교통 안전 시설 개선을 위한 시민의 소중한 의견을 들려주세요.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 1 of 2</span>
              <div className="flex gap-1 mt-1">
                <div className="h-1.5 w-10 bg-blue-500 rounded-full" />
                <div className="h-1.5 w-10 bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 섹션 1: 기본 정보 */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-1 bg-linear-to-r from-blue-500 to-indigo-500" /> {/* 상단 컬러 바 */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 건의 유형 */}
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    건의 유형 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="suggestion_type"
                      value={form.suggestion_type}
                      onChange={handleInputChange}
                      className="w-full appearance-none bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-slate-700"
                      required
                    >
                      <option value="SIGNAL">신호등 설치</option>
                      <option value="CROSSWALK">횡단보도 설치</option>
                      <option value="FACILITY">기타 안전 시설</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.707 6.536 4.293 7.95l4.293 4.293z" /></svg>
                    </div>
                  </div>
                </div>

                {/* 제목 */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    제목 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="핵심 내용을 요약해주세요"
                    className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-semibold text-slate-800 placeholder:text-slate-400"
                    required
                    maxLength={200}
                  />
                  <div className="flex justify-end mt-2">
                    <span className={`text-[11px] font-bold ${form.title.length >= 200 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {form.title.length} / 200
                    </span>
                  </div>
                </div>

                {/* 내용 */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    상세 내용 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleInputChange}
                    placeholder="사고 위험성이나 불편한 점을 자유롭게 작성해주세요."
                    rows={6}
                    className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed text-slate-700 placeholder:text-slate-400"
                    required
                    maxLength={2000}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      {form.content.length.toLocaleString()} / 2,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 2: 위치 정보 */}
          <div className="flex items-end justify-end">
            <div className="hidden md:block text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 2 of 2</span>
              <div className="flex gap-1 mt-1">
                <div className="h-1.5 w-10 bg-slate-200 rounded-full" />
                <div className="h-1.5 w-10 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <FaMapMarkerAlt className="w-4 h-4" />
              </div>

              <h2 className="text-lg font-bold text-slate-800">위치 지정</h2>
            </div>

            <div className="space-y-6">
              {form.address ? (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl ring-1 ring-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-emerald-500 w-5 h-5" />
                    <span className="text-emerald-900 font-semibold">{form.address}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter bg-white px-2 py-1 rounded-md shadow-sm">Verified</span>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm font-medium">
                  ⚠️ 아래 지도에서 사고 위험 지역을 클릭하여 정확한 위치를 지정해 주세요.
                </div>
              )}

              <div className="rounded-2xl border-4 border-slate-50 overflow-hidden shadow-inner relative">
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    form.location_lat && form.location_lon
                      ? { lat: form.location_lat, lon: form.location_lon }
                      : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <LocationInfoPanel
                  lat={form.location_lat}
                  lon={form.location_lon}
                  address={form.address}
                  onPriorityScoreCalculated={handlePriorityScoreCalculated}
                />
              </div>
            </div>
          </section>

          {/* 액션 버튼 */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-slate-400 italic">
              * 필수 항목을 모두 입력해야 등록이 가능합니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-xl transition-all hover:cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative px-10 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-200 active:scale-95 overflow-hidden hover:cursor-pointer"
              >
                <div className="flex items-center gap-2 relative z-10">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaSave className="w-4 h-4" />
                  )}
                  {loading ? '등록 중...' : '건의사항 제출'}
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}