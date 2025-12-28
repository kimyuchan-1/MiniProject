'use client'

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaSave, FaTimes } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// 지도 컴포넌트 (위치 선택용)
const LocationPicker = dynamic(() => import('../../../../components/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">지도를 불러오는 중...</div>
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
    address: ''
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">건의사항 작성</h1>
          <p className="text-gray-600 mt-1">교통 안전 시설 개선을 위한 건의사항을 작성해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* 건의 유형 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                건의 유형 <span className="text-red-500">*</span>
              </label>
              <select
                name="suggestion_type"
                value={form.suggestion_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="SIGNAL">신호등 설치</option>
                <option value="CROSSWALK">횡단보도 설치</option>
                <option value="FACILITY">기타 시설</option>
              </select>
            </div>

            {/* 제목 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="건의사항 제목을 입력해주세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {form.title.length}/200자
              </div>
            </div>

            {/* 내용 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
                placeholder="건의사항 내용을 자세히 작성해주세요&#10;&#10;예시:&#10;- 현재 상황 (사고 위험성, 불편사항 등)&#10;- 개선 필요성&#10;- 기대 효과"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
                maxLength={2000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {form.content.length}/2000자
              </div>
            </div>

            {/* 위치 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                위치 선택 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {/* 선택된 주소 표시 */}
                {form.address && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-600 w-4 h-4" />
                    <span className="text-blue-800 font-medium">{form.address}</span>
                  </div>
                )}
                
                {/* 지도 */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      form.location_lat && form.location_lon
                        ? { lat: form.location_lat, lon: form.location_lon }
                        : undefined
                    }
                  />
                </div>
                <p className="text-xs text-gray-500">
                  지도를 클릭하여 건의사항 위치를 선택해주세요
                </p>
              </div>
            </div>
          </div>

          {/* 현재 시설 현황 (선택된 위치 기준) */}
          {form.location_lat && form.location_lon && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">현재 시설 현황</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">주변 횡단보도</div>
                  <div className="text-2xl font-bold text-blue-600">3개</div>
                  <div className="text-xs text-gray-500">100m 반경 내</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">주변 신호등</div>
                  <div className="text-2xl font-bold text-green-600">2개</div>
                  <div className="text-xs text-gray-500">100m 반경 내</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">사고 이력</div>
                  <div className="text-2xl font-bold text-red-600">5건</div>
                  <div className="text-xs text-gray-500">최근 1년</div>
                </div>
              </div>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FaTimes className="w-4 h-4" />
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              {loading ? '등록 중...' : '건의사항 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}