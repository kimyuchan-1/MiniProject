'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaHeart, FaComment, FaEye, FaArrowLeft } from 'react-icons/fa';
import { Suggestion, Comment } from '@/features/board/types';
import { SuggestionStatusLabels, SuggestionTypeLabels, StatusColors } from '@/features/board/constants';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// 지도 컴포넌트
const LocationViewer = dynamic(() => import('../../../../components/board/map/LocationViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">지도를 불러오는 중...</div>
    </div>
  ),
});

export default function SuggestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const suggestionId = params.id as string;

  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);

  // 건의사항 상세 조회
  const fetchSuggestion = async () => {
    try {
      const response = await fetch(`/api/suggestions/${suggestionId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestion(data);
      } else if (response.status === 404) {
        alert('존재하지 않는 건의사항입니다.');
        router.push('/board');
      }
    } catch (error) {
      console.error('건의사항 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 조회
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/suggestions/${suggestionId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchSuggestion();
    fetchComments();
  }, [suggestionId]);

  // 좋아요 토글
  const toggleLike = async () => {
    if (!suggestion) return;

    try {
      const response = await fetch(`/api/suggestions/${suggestionId}/like`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setSuggestion(prev => prev ? {
          ...prev,
          like_count: prev.is_liked ? prev.like_count - 1 : prev.like_count + 1,
          is_liked: !prev.is_liked
        } : null);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await fetch(`/api/suggestions/${suggestionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment,
          parent_id: replyTo
        })
      });

      if (response.ok) {
        setNewComment('');
        setReplyTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!suggestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">건의사항을 찾을 수 없습니다</h2>
          <Link href="/board" className="text-blue-600 hover:text-blue-700">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </button>
        </div>

        {/* 건의사항 상세 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${StatusColors[suggestion.status]}`}>
                  {SuggestionStatusLabels[suggestion.status]}
                </span>
                <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                  {SuggestionTypeLabels[suggestion.suggestion_type]}
                </span>
                {suggestion.priority_score > 7 && (
                  <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
                    긴급
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {suggestion.title}
              </h1>
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>{suggestion.sido} {suggestion.sigungu}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaEye className="w-4 h-4" />
              <span>{suggestion.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaComment className="w-4 h-4" />
              <span>{comments.length}</span>
            </div>
            <span>{suggestion.user?.name ?? "익명"}</span>
            <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
          </div>

          {/* 내용 */}
          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {suggestion.content}
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">위치 정보</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FaMapMarkerAlt className="text-blue-600 w-4 h-4" />
                <span className="text-blue-800 font-medium">{suggestion.address}</span>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <LocationViewer
                  lat={suggestion.location_lat}
                  lon={suggestion.location_lon}
                  address={suggestion.address}
                />
              </div>
            </div>
          </div>

          {/* 좋아요 버튼 */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${suggestion.is_liked
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FaHeart className={`w-4 h-4 ${suggestion.is_liked ? 'text-red-600' : ''}`} />
              <span>{suggestion.like_count}</span>
            </button>
          </div>
        </div>

        {/* 관리자 답변 */}
        {suggestion.admin_response && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                관
              </div>
              <div>
                <div className="font-semibold text-gray-900">관리자 답변</div>
                <div className="text-sm text-gray-500">
                  {suggestion.processed_at && new Date(suggestion.processed_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-blue-800 whitespace-pre-wrap">{suggestion.admin_response}</p>
            </div>
          </div>
        )}

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            댓글 ({comments.length})
          </h3>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            {replyTo && (
              <div className="mb-2 text-sm text-gray-600">
                답글 작성 중...
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-blue-600 hover:text-blue-700"
                >
                  취소
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commentLoading ? '작성 중...' : '댓글 작성'}
              </button>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                첫 번째 댓글을 작성해보세요!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {(comment.user?.name ?? "익명").charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.user?.name ?? "익명"}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap mb-2">{comment.content}</p>
                      <button
                        onClick={() => setReplyTo(comment.id)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        답글
                      </button>
                    </div>
                  </div>

                  {/* 답글 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 mt-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                            {(reply.user?.name ?? "익명").charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{reply.user?.name ?? "익명"}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-800 text-sm whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}