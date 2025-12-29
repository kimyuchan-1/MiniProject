import { NextRequest, NextResponse } from 'next/server';
import { dummySuggestions } from '@/lib/dummyData';

// 건의사항 상세 조회 (GET) - 더미 데이터 사용
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const suggestionId = parseInt(id);

    // 더미 데이터에서 건의사항 찾기
    const suggestion = dummySuggestions.find(s => s.id === suggestionId);

    if (!suggestion) {
      return NextResponse.json({ error: '건의사항을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 조회수 증가 (더미 데이터에서)
    suggestion.view_count += 1;

    // 좋아요 여부 확인 (더미 데이터)
    const is_liked = false;

    return NextResponse.json({
      ...suggestion,
      is_liked
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 건의사항 수정 (PUT) - 더미 데이터 사용
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const suggestionId = parseInt(id);
    const body = await request.json();
    const { title, content, suggestion_type } = body;

    // 더미 데이터에서 건의사항 찾기
    const suggestionIndex = dummySuggestions.findIndex(s => s.id === suggestionId);

    if (suggestionIndex === -1) {
      return NextResponse.json({ error: '건의사항을 찾을 수 없습니다.' }, { status: 404 });
    }

    const suggestion = dummySuggestions[suggestionIndex];

    if (suggestion.status !== 'PENDING') {
      return NextResponse.json({ error: '접수 상태의 건의사항만 수정할 수 있습니다.' }, { status: 400 });
    }

    // 건의사항 수정
    dummySuggestions[suggestionIndex] = {
      ...suggestion,
      title,
      content,
      suggestion_type,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(dummySuggestions[suggestionIndex]);

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 건의사항 삭제 (DELETE) - 더미 데이터 사용
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const suggestionId = parseInt(id);

    // 더미 데이터에서 건의사항 찾기
    const suggestionIndex = dummySuggestions.findIndex(s => s.id === suggestionId);

    if (suggestionIndex === -1) {
      return NextResponse.json({ error: '건의사항을 찾을 수 없습니다.' }, { status: 404 });
    }

    const suggestion = dummySuggestions[suggestionIndex];

    if (suggestion.status !== 'PENDING') {
      return NextResponse.json({ error: '접수 상태의 건의사항만 삭제할 수 있습니다.' }, { status: 400 });
    }

    // 건의사항 삭제
    dummySuggestions.splice(suggestionIndex, 1);

    return NextResponse.json({ message: '건의사항이 삭제되었습니다.' });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}