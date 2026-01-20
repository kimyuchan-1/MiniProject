'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaHeart, FaComment, FaEye, FaArrowLeft, FaEdit, FaTrash, FaCheckCircle, FaUserCircle, FaReply } from 'react-icons/fa';
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

interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // 현재 사용자 정보 조회
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setCurrentUser(data.data);
          }
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };

    fetchCurrentUser();
  }, []);

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
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchSuggestion();
        await fetchComments();
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
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
        const data = await response.json();
        // Update local state based on backend response
        setSuggestion(prev => prev ? {
          ...prev,
          like_count: data.liked ? prev.like_count + 1 : Math.max(0, prev.like_count - 1),
          is_liked: data.liked
        } : null);
      } else if (response.status === 401) {
        alert('로그인이 필요합니다.');
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
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
        // Refresh comments
        await fetchComments();
        // Update comment count in suggestion
        setSuggestion(prev => prev ? {
          ...prev,
          comment_count: (prev.comment_count ?? 0) + 1
        } : null);
      } else if (response.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || '댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  // 게시글 삭제
  const handleDeleteSuggestion = async () => {
    if (!confirm('정말 이 건의사항을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/suggestions/${suggestionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        alert('건의사항이 삭제되었습니다.');
        router.push('/board');
      } else {
        const errorData = await response.json();
        alert(errorData.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 댓글 수정 시작
  const startEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  // 댓글 수정 저장
  const handleUpdateComment = async (commentId: number) => {
    if (!editingContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/suggestions/${suggestionId}/comments?commentId=${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: editingContent })
      });

      if (response.ok) {
        cancelEditComment();
        await fetchComments();
      } else {
        const errorData = await response.json();
        alert(errorData.error || '댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/suggestions/${suggestionId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchComments();
        // Update comment count
        setSuggestion(prev => prev ? {
          ...prev,
          comment_count: Math.max(0, (prev.comment_count ?? 0) - 1)
        } : null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 권한 확인 함수
  const canEditSuggestion = () => {
    if (!currentUser || !suggestion) return false;
    return currentUser.id === suggestion.user_id || currentUser.role === 'ADMIN';
  };

  const canEditComment = (comment: Comment) => {
    if (!currentUser) return false;
    return currentUser.id === comment.user?.id || currentUser.role === 'ADMIN';
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
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* 상단 네비게이션 */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => router.push("/board")}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-semibold hover:cursor-pointer"
          >
            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            목록으로 돌아가기
          </button>
          
          {canEditSuggestion() && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/board/${suggestionId}/edit`)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200 hover:cursor-pointer"
              >
                <FaEdit className="w-3.5 h-3.5" /> 수정
              </button>
              <button
                onClick={handleDeleteSuggestion}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all hover:cursor-pointer"
              >
                <FaTrash className="w-3.5 h-3.5" /> 삭제
              </button>
            </div>
          )}
        </div>

        {/* 본문 카드 */}
        <div className="bg-white rounded-4xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-8 md:p-12">
            {/* 카테고리 & 상태 라벨 */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-full shadow-sm ${StatusColors[suggestion.status]}`}>
                {SuggestionStatusLabels[suggestion.status]}
              </span>
              <span className="px-4 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-full">
                {SuggestionTypeLabels[suggestion.suggestion_type]}
              </span>
              {suggestion.priority_score > 7 && (
                <span className="px-4 py-1.5 text-xs font-bold bg-rose-100 text-rose-600 rounded-full animate-pulse">
                  긴급 요청
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
              {suggestion.title}
            </h1>

            {/* 작성자 정보 바 */}
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-slate-400 mb-10 pb-8 border-b border-slate-100 font-medium">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">👤</div>
                {suggestion.user?.name ?? "익명"}
              </div>
              <div className="flex items-center gap-1.5">
                <FaEye className="w-3.5 h-3.5" /> {suggestion.view_count.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5">
                <FaComment className="w-3.5 h-3.5" /> {suggestion.comment_count}
              </div>
              <div className="ml-auto">
                {new Date(suggestion.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* 본문 내용 */}
            <div className="prose prose-slate max-w-none mb-12">
              <div className="whitespace-pre-wrap text-slate-700 leading-loose text-lg">
                {suggestion.content}
              </div>
            </div>

            {/* 위치 섹션 (인셋 카드 형태) */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">제안 위치 정보</h3>
                  <p className="text-sm text-slate-500 font-medium">{suggestion.address}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden border-4 border-white shadow-sm h-75">
                  <LocationViewer lat={suggestion.location_lat} lon={suggestion.location_lon} />
                </div>
                <LocationInfoPanel lat={suggestion.location_lat} lon={suggestion.location_lon} address={suggestion.address} />
              </div>
            </div>

            {/* 하단 인터랙션 */}
            <div className="mt-12 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={toggleLike}
                className={`group flex items-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all hover:cursor-pointer ${
                  suggestion.is_liked
                    ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                <FaHeart className={`w-5 h-5 transition-transform group-hover:scale-125 ${suggestion.is_liked ? 'fill-rose-600' : ''}`} />
                <span className="text-lg">{suggestion.like_count}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 관리자 답변 (Special Highlight) */}
        {suggestion.admin_response && (
          <div className="relative mb-8 group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-4xl p-8 md:p-10 border border-blue-100 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <FaCheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">공식 답변</h4>
                    <p className="text-sm text-slate-400 font-bold">{new Date(suggestion.processed_at!).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">Official</span>
              </div>
              <div className="bg-slate-50/50 p-6 rounded-2xl text-slate-700 leading-relaxed font-medium border border-slate-100">
                {suggestion.admin_response}
              </div>
            </div>
          </div>
        )}

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-4xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">의견 나눔</h3>
            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-sm font-bold">{suggestion.comment_count}</span>
          </div>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="mb-12 relative group">
             {replyTo && (
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl w-fit animate-in fade-in slide-in-from-top-1">
                <FaReply className="w-3 h-3" /> 답글을 작성하는 중입니다
                <button type="button" onClick={() => setReplyTo(null)} className="ml-2 underline underline-offset-2 opacity-60 hover:opacity-100 hover:cursor-pointer">취소</button>
              </div>
            )}
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="타인을 배려하는 따뜻한 댓글을 남겨주세요."
                rows={3}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none resize-none font-medium text-slate-700 placeholder:text-slate-400"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{newComment.length} characters</span>
                <button
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 disabled:opacity-30 transition-all shadow-md active:scale-95 hover:cursor-pointer disabled:cursor-not-allowed"
                >
                  {commentLoading ? '전송 중' : '댓글 등록'}
                </button>
              </div>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-8">
            {comments.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4 opacity-20">💬</div>
                <p className="text-slate-400 font-medium italic">아직 작성된 의견이 없습니다.<br/>첫 번째 의견을 들려주세요!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold shadow-sm">
                      {(comment.user?.name ?? "익명").charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{comment.user?.name ?? "익명"}</span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                           <button onClick={() => setReplyTo(comment.id)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors hover:cursor-pointer"><FaReply className="w-3.5 h-3.5" /></button>
                           {canEditComment(comment) && (
                             <>
                               <button onClick={() => startEditComment(comment.id, comment.content)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors hover:cursor-pointer"><FaEdit className="w-3.5 h-3.5" /></button>
                               <button onClick={() => handleDeleteComment(comment.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors hover:cursor-pointer"><FaTrash className="w-3.5 h-3.5" /></button>
                             </>
                           )}
                        </div>
                      </div>
                      
                      {editingCommentId === comment.id ? (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-2">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full bg-white px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-medium resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={cancelEditComment} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg hover:cursor-pointer">취소</button>
                            <button onClick={() => handleUpdateComment(comment.id)} className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm hover:cursor-pointer">수정 완료</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl rounded-tl-none inline-block min-w-25 border border-slate-100">
                          {comment.content}
                        </p>
                      )}
                      
                      {/* 대댓글 영역 (Replied Nested) */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-6 ml-4 border-l-2 border-slate-100 pl-8 space-y-6">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="relative">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-black">
                                  {(reply.user?.name ?? "익명").charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-slate-800">{reply.user?.name ?? "익명"}</span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date(reply.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-slate-600 font-medium bg-white p-3 rounded-xl rounded-tl-none border border-slate-100 inline-block shadow-sm">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}