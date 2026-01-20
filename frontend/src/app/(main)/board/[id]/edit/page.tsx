'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaSave, FaTimes, FaArrowLeft, FaEdit, FaRegClipboard } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// 지도 컴포넌트 (위치 선택용)
const LocationPicker = dynamic(() => import('../../../../../components/board/map/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">지도를 불러오는 중...</div>
    </div>
  ),
});

// 위치 정보 패널 (위험/안전 지수 표시)
const LocationInfoPanel = dynamic(() => import('../../../../../components/board/map/LocationInfoPanel'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border bg-gray-50 p-6">
      <div className="text-center text-gray-500">
        <div className="text-sm font-medium">위치 정보 로딩 중...</div>
      </div>
    </div>
  ),
});

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

interface SuggestionForm {
  title: string;
  content: string;
  suggestion_type: 'SIGNAL' | 'CROSSWALK' | 'FACILITY';
  location_lat: number | null;
  location_lon: number | null;
  address: string;
}

export default function EditSuggestionPage() {
  const params = useParams();
  const router = useRouter();
  const suggestionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SuggestionForm>({
    title: '',
    content: '',
    suggestion_type: 'SIGNAL',
    location_lat: null,
    location_lon: null,
    address: ''
  });

  // 기존 건의사항 데이터 로드
  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const response = await fetch(`/api/suggestions/${suggestionId}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setForm({
            title: data.title,
            content: data.content,
            suggestion_type: data.suggestion_type,
            location_lat: data.location_lat,
            location_lon: data.location_lon,
            address: data.address
          });
        } else if (response.status === 404) {
          alert('존재하지 않는 건의사항입니다.');
          router.push('/board');
        } else if (response.status === 403) {
          alert('수정 권한이 없습니다.');
          router.push(`/board/${suggestionId}`);
        }
      } catch (error) {
        console.error('건의사항 조회 실패:', error);
        alert('건의사항을 불러오는 중 오류가 발생했습니다.');
        router.push('/board');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [suggestionId, router]);

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

    setSaving(true);
    try {
      const response = await fetch(`/api/suggestions/${suggestionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      if (response.ok) {
        alert('건의사항이 성공적으로 수정되었습니다.');
        router.push(`/board/${suggestionId}`);
      } else {
        const error = await response.json();
        alert(error.error || '건의사항 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('건의사항 수정 실패:', error);
      alert('건의사항 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">기존 건의 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 상단 네비게이션 바 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-2">
          <button
            onClick={() => router.push(`/board/${suggestionId}`)}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all mb-8 text-sm font-medium hover:cursor-pointer"
          >
            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            취소하고 돌아가기
          </button>

          <div className="flex items-end justify-between">
            {/* 헤더 섹션 */}
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">건의사항 수정</h1>
              <p className="ext-slate-500 mt-2 flex items-center gap-2 text-sm md:text-base">더 나은 도로 환경을 위해 상세 내용을 보완해주세요.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 왼쪽: 입력 폼 섹션 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 transition-all">

              <div className="space-y-8">
                {/* 건의 유형 선택 (칩 스타일) */}
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-4 items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> 건의 유형
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['SIGNAL', 'CROSSWALK', 'FACILITY'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, suggestion_type: type }))}
                        className={cx(
                          "py-3 px-4 rounded-2xl text-sm font-bold transition-all border-2 hover:cursor-pointer",
                          form.suggestion_type === type
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        {type === 'SIGNAL' ? '신호등' : type === 'CROSSWALK' ? '횡단보도' : '기타 시설'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 제목 입력 */}
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> 제목
                    </span>
                    <span className={cx("text-[10px]", form.title.length > 180 ? "text-red-500" : "text-slate-400")}>
                      {form.title.length}/200
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="핵심 내용을 요약해주세요"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    required
                  />
                </div>

                {/* 내용 입력 */}
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> 상세 내용
                    </span>
                    <span className={cx("text-[10px]", form.content.length > 1800 ? "text-red-500" : "text-slate-400")}>
                      {form.content.length}/2000
                    </span>
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleInputChange}
                    placeholder="현재 상황과 개선 아이디어를 들려주세요."
                    rows={10}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 leading-relaxed resize-none placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 위치 및 분석 정보 섹션 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 sticky top-24">
              <label className="block text-sm font-black text-slate-700 mb-4 items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> 위치 정보 수정
              </label>

              <div className="space-y-6">
                {/* 주소 표시 칩 */}
                <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl shadow-lg">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <FaMapMarkerAlt className="text-blue-400 w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter leading-none mb-1">Current Address</p>
                    <p className="text-white font-bold text-sm truncate">{form.address || '지도를 클릭해 위치를 선택하세요'}</p>
                  </div>
                </div>

                {/* 지도 선택 영역 */}
                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-inner ring-1 ring-slate-100">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      form.location_lat && form.location_lon
                        ? { lat: form.location_lat, lon: form.location_lon }
                        : undefined
                    }
                  />
                </div>

                {/* 실시간 분석 패널 연동 */}
                <LocationInfoPanel
                  lat={form.location_lat}
                  lon={form.location_lon}
                  address={form.address}
                />

                {/* 저장 버튼 그룹 */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => router.push(`/board/${suggestionId}`)}
                    className="py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:cursor-pointer"
                  >
                    <FaTimes /> 취소
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:cursor-pointer"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FaSave className="text-blue-400" />
                    )}
                    {saving ? '저장 중' : '수정 저장'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}