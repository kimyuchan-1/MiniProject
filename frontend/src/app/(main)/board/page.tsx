'use client'

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaFilter, FaSearch, FaHeart, FaComment, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 건의사항 타입 정의
interface Suggestion {
  id: number;
  title: string;
  content: string;
  location_lat: number;
  location_lon: number;
  address: string;
  sido: string;
  sigungu: string;
  suggestion_type: 'SIGNAL' | 'CROSSWALK' | 'FACILITY';
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  priority_score: number;
  like_count: number;
  view_count: number;
  comment_count?: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  admin_response?: string;
}

// 필터 타입
interface FilterState {
  status: string;
  type: string;
  region: string;
  sortBy: string;
}

const SuggestionTypeLabels = {
  SIGNAL: '신호등 설치',
  CROSSWALK: '횡단보도 설치', 
  FACILITY: '기타 시설'
};

const SuggestionStatusLabels = {
  PENDING: '접수',
  REVIEWING: '검토중',
  APPROVED: '승인',
  REJECTED: '반려',
  COMPLETED: '완료'
};

const StatusColors = {
  PENDING: 'bg-gray-100 text-gray-800',
  REVIEWING: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-purple-100 text-purple-800'
};

export default function BoardPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'ALL',
    type: 'ALL',
    region: 'ALL',
    sortBy: 'latest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // 건의사항 목록 조회
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '10',
        search: searchTerm,
        status: filters.status !== 'ALL' ? filters.status : '',
        type: filters.type !== 'ALL' ? filters.type : '',
        region: filters.region !== 'ALL' ? filters.region : '',
        sort: filters.sortBy
      });

      const response = await fetch(`/api/suggestions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.content || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('건의사항 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [currentPage, filters, searchTerm]);

  // 좋아요 토글
  const toggleLike = async (suggestionId: number) => {
    try {
      const response = await fetch(`/api/suggestions/${suggestionId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchSuggestions(); // 목록 새로고침
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  // 필터 변경
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSuggestions();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시민 건의사항</h1>
              <p className="text-gray-600 mt-1">교통 안전 시설 개선을 위한 시민 참여 공간</p>
            </div>
            <Link
              href="/board/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              건의사항 작성
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="제목, 내용, 지역으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FaFilter className="w-4 h-4" />
              필터
            </button>
          </form>

          {/* 필터 옵션 */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">전체</option>
                  <option value="PENDING">접수</option>
                  <option value="REVIEWING">검토중</option>
                  <option value="APPROVED">승인</option>
                  <option value="REJECTED">반려</option>
                  <option value="COMPLETED">완료</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">전체</option>
                  <option value="SIGNAL">신호등 설치</option>
                  <option value="CROSSWALK">횡단보도 설치</option>
                  <option value="FACILITY">기타 시설</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">전체</option>
                  <option value="서울특별시">서울특별시</option>
                  <option value="부산광역시">부산광역시</option>
                  <option value="대구광역시">대구광역시</option>
                  <option value="인천광역시">인천광역시</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">정렬</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">최신순</option>
                  <option value="popular">인기순</option>
                  <option value="priority">우선순위순</option>
                  <option value="status">상태순</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 건의사항 목록 */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${StatusColors[suggestion.status]}`}>
                          {SuggestionStatusLabels[suggestion.status]}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {SuggestionTypeLabels[suggestion.suggestion_type]}
                        </span>
                        {suggestion.priority_score > 7 && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                            긴급
                          </span>
                        )}
                      </div>
                      <Link href={`/board/${suggestion.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {suggestion.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {suggestion.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        <span>{suggestion.sido} {suggestion.sigungu}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEye className="w-3 h-3" />
                        <span>{suggestion.view_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaComment className="w-3 h-3" />
                        <span>{suggestion.comment_count || 0}</span>
                      </div>
                      <span>{suggestion.user.name}</span>
                      <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLike(suggestion.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaHeart className="w-3 h-3" />
                        <span>{suggestion.like_count}</span>
                      </button>
                    </div>
                  </div>

                  {/* 관리자 답변 */}
                  {suggestion.admin_response && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="text-sm font-medium text-blue-800 mb-1">관리자 답변</div>
                      <p className="text-sm text-blue-700">{suggestion.admin_response}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
