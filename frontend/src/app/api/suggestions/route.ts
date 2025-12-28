import { NextRequest, NextResponse } from 'next/server';
import { dummySuggestions } from '@/lib/dummyData';

// 건의사항 목록 조회 (GET) - 더미 데이터 사용
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const size = parseInt(searchParams.get('size') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const region = searchParams.get('region') || '';
    const sort = searchParams.get('sort') || 'latest';

    let filteredSuggestions = [...dummySuggestions];

    // 검색 필터링
    if (search) {
      filteredSuggestions = filteredSuggestions.filter(s => 
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.content.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status && status !== 'ALL') {
      filteredSuggestions = filteredSuggestions.filter(s => s.status === status);
    }

    if (type && type !== 'ALL') {
      filteredSuggestions = filteredSuggestions.filter(s => s.suggestion_type === type);
    }

    if (region && region !== 'ALL') {
      filteredSuggestions = filteredSuggestions.filter(s => s.sido === region);
    }

    // 정렬
    switch (sort) {
      case 'popular':
        filteredSuggestions.sort((a, b) => b.like_count - a.like_count);
        break;
      case 'priority':
        filteredSuggestions.sort((a, b) => b.priority_score - a.priority_score);
        break;
      case 'status':
        filteredSuggestions.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default: // latest
        filteredSuggestions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // 페이징
    const offset = (page - 1) * size;
    const paginatedSuggestions = filteredSuggestions.slice(offset, offset + size);

    return NextResponse.json({
      content: paginatedSuggestions,
      totalElements: filteredSuggestions.length,
      totalPages: Math.ceil(filteredSuggestions.length / size),
      currentPage: page,
      size: size
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 건의사항 생성 (POST) - 더미 데이터에 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, suggestion_type, location_lat, location_lon, address } = body;

    // 입력 검증
    if (!title || !content || !suggestion_type || !location_lat || !location_lon) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }

    // 주소에서 시도/시군구 추출
    const addressParts = address.split(' ');
    const sido = addressParts[0] || '';
    const sigungu = addressParts[1] || '';

    // 새 건의사항 생성
    const newSuggestion = {
      id: Math.max(...dummySuggestions.map(s => s.id)) + 1,
      title,
      content,
      suggestion_type,
      location_lat,
      location_lon,
      address,
      sido,
      sigungu,
      priority_score: Math.random() * 10,
      status: 'PENDING' as const,
      like_count: 0,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 1,
        name: '사용자'
      },
      comment_count: 0
    };

    // 더미 데이터에 추가 (실제로는 데이터베이스에 저장)
    dummySuggestions.unshift(newSuggestion);

    return NextResponse.json(newSuggestion, { status: 201 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}