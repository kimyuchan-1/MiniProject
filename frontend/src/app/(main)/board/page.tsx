'use client'

import { useState, useEffect, useCallback } from 'react';
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
  const [searchQuery, setSearchQuery] = useState(''); // 실제 검색에 사용되는 값
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
  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '10',
        search: searchQuery,
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
  }, [currentPage, filters, searchQuery]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

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

  // 검색 실행
  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 헤더 */}
        <div className="flex flex-row justify-between gap-6 mb-8">
          <div className="border-b border-slate-100 m-4 pb-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">시민 건의사항</h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm md:text-base">교통 안전 시설 개선을 위한 시민 참여 공간</p>
          </div>
          <div className='flex items-end'>
            <Link
              href="/board/create"
              className="inline-flex items-center gap-2 px-4 py-2 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              건의사항 작성
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onToggleFilters={() => setShowFilters(v => !v)}
            onSubmit={handleSearch}
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
