'use client'

import { useState, useEffect } from 'react';
import { Suggestion, FilterState } from '@/features/board/types';
import SuggestionList from './SuggestionList';
import Pagination from './Pagination';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import SearchBar from './SearchBar';
import FiltersPanel from './FiltersPanel';

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
          <SearchBar
            value={searchTerm}
            onChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
            onToggleFilters={() => setShowFilters(v => !v)}
            onSubmit={() => fetchSuggestions()}
          />
          {/* 필터 옵션 */}
          {showFilters && (
            <FiltersPanel
              filters={filters}
              onChange={handleFilterChange} />
          )}
        </div>

        {/* 건의사항 목록 */}
        <SuggestionList
          loading={loading}
          suggestions={suggestions}
          onLike={toggleLike}
        />

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={(p) => setCurrentPage(p)}
        />
      </div>
    </div>
  );
}
