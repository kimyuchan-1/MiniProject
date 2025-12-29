import { NextRequest, NextResponse } from 'next/server';
import { dummyComments } from '@/lib/dummyData';

// 댓글 목록 조회 (GET) - 더미 데이터 사용
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const suggestionId = parseInt(id);

    // 더미 데이터에서 해당 건의사항의 댓글 필터링
    const comments = dummyComments.filter(c => c.suggestion_id === suggestionId);

    return NextResponse.json(comments);

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 댓글 작성 (POST) - 더미 데이터 사용
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const suggestionId = parseInt(id);
    const body = await request.json();
    const { content, parent_id } = body;

    // 입력 검증
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: '댓글은 1000자 이내로 작성해주세요.' }, { status: 400 });
    }

    // 새 댓글 생성
    const newComment = {
      id: Math.max(...dummyComments.map(c => c.id), 0) + 1,
      suggestion_id: suggestionId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      user: {
        id: 1,
        name: '사용자'
      },
      parent_id: parent_id || null,
      replies: []
    };

    // 더미 데이터에 추가
    dummyComments.push(newComment);

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}