// 더미 데이터 (실제로는 Supabase나 백엔드 API에서 가져와야 함)

export const dummySuggestions = [
  {
    id: 1,
    title: "강남역 2번 출구 앞 횡단보도 신호등 설치 요청",
    content: "강남역 2번 출구 앞 횡단보도에 신호등이 없어서 매우 위험합니다.\n\n현재 상황:\n- 출퇴근 시간대 차량 통행량이 매우 많음\n- 보행자들이 무단횡단을 하는 경우가 빈번함\n- 최근 1년간 경미한 접촉사고 3건 발생\n\n개선 필요성:\n- 보행자 안전 확보\n- 교통 흐름 개선\n- 사고 예방\n\n기대 효과:\n- 보행자 사고 위험 감소\n- 질서 있는 교통 흐름 조성",
    location_lat: 37.4979,
    location_lon: 127.0276,
    address: "서울특별시 강남구 역삼동 강남역 2번 출구",
    sido: "서울특별시",
    sigungu: "강남구",
    suggestion_type: "SIGNAL" as const,
    status: "REVIEWING" as const,
    like_count: 24,
    view_count: 156,
    created_at: "2024-12-20T09:30:00Z",
    updated_at: "2024-12-20T09:30:00Z",
    user: {
      id: 1,
      name: "김민수"
    },
    admin_response: "해당 지역의 교통량 조사를 진행 중입니다. 조사 결과에 따라 신호등 설치를 검토하겠습니다.",
    comment_count: 8
  },
  {
    id: 2,
    title: "홍대입구역 근처 스쿨존 횡단보도 개선",
    content: "홍대입구역 근처 초등학교 앞 횡단보도가 너무 좁고 시설이 부족합니다.\n\n문제점:\n- 횡단보도 폭이 좁아 학생들이 몰릴 때 위험\n- 음향신호기가 없어 시각장애인 이용 불편\n- 보도턱이 높아 휠체어 이용자 접근 어려움\n\n개선 요청사항:\n- 횡단보도 폭 확장\n- 음향신호기 설치\n- 보도턱 낮춤 공사",
    location_lat: 37.5563,
    location_lon: 126.9239,
    address: "서울특별시 마포구 서교동 홍익초등학교 앞",
    sido: "서울특별시",
    sigungu: "마포구",
    suggestion_type: "CROSSWALK" as const,
    status: "APPROVED" as const,
    like_count: 45,
    view_count: 289,
    created_at: "2024-12-18T14:20:00Z",
    updated_at: "2024-12-19T10:15:00Z",
    user: {
      id: 2,
      name: "박영희"
    },
    admin_response: "스쿨존 안전 개선 사업으로 승인되었습니다. 2025년 1월 중 공사 예정입니다.",
    comment_count: 12
  },
  {
    id: 3,
    title: "잠실역 지하보도 안전시설 보강 요청",
    content: "잠실역 지하보도에 CCTV와 비상벨이 부족합니다.\n\n현재 상황:\n- 야간 시간대 조명이 어두움\n- CCTV 사각지대 존재\n- 비상시 신고할 수 있는 시설 부족\n\n요청사항:\n- CCTV 추가 설치\n- 비상벨 설치\n- LED 조명 교체",
    location_lat: 37.5133,
    location_lon: 127.1000,
    address: "서울특별시 송파구 잠실동 잠실역 지하보도",
    sido: "서울특별시",
    sigungu: "송파구",
    suggestion_type: "FACILITY" as const,
    status: "PENDING" as const,
    like_count: 18,
    view_count: 94,
    created_at: "2024-12-22T16:45:00Z",
    updated_at: "2024-12-22T16:45:00Z",
    user: {
      id: 3,
      name: "이철수"
    },
    comment_count: 5
  },
  {
    id: 4,
    title: "신촌로터리 보행자 신호 시간 연장 요청",
    content: "신촌로터리 횡단보도 신호 시간이 너무 짧습니다.\n\n문제점:\n- 현재 신호 시간: 25초\n- 거리가 길어 고령자나 장애인이 건너기 어려움\n- 신호 위반 보행자 증가\n\n개선 요청:\n- 보행 신호 시간을 35초로 연장\n- 잔여시간 표시기 설치",
    location_lat: 37.5596,
    location_lon: 126.9370,
    address: "서울특별시 서대문구 신촌동 신촌로터리",
    sido: "서울특별시",
    sigungu: "서대문구",
    suggestion_type: "SIGNAL" as const,
    status: "COMPLETED" as const,
    like_count: 31,
    view_count: 178,
    created_at: "2024-12-15T11:20:00Z",
    updated_at: "2024-12-21T09:30:00Z",
    user: {
      id: 4,
      name: "최미영"
    },
    admin_response: "신호 시간을 35초로 연장하고 잔여시간 표시기를 설치 완료했습니다.",
    comment_count: 15
  },
  {
    id: 5,
    title: "이태원역 앞 무단횡단 방지 시설 설치",
    content: "이태원역 앞에서 무단횡단이 빈번하게 발생합니다.\n\n현재 문제:\n- 신호등까지 거리가 멀어 무단횡단 유발\n- 중앙분리대가 낮아 효과 미미\n- 외국인 관광객들의 무단횡단 빈발\n\n제안사항:\n- 중앙분리대 높이 조정\n- 무단횡단 방지 펜스 설치\n- 다국어 안내판 설치",
    location_lat: 37.5344,
    location_lon: 126.9944,
    address: "서울특별시 용산구 이태원동 이태원역 앞",
    sido: "서울특별시",
    sigungu: "용산구",
    suggestion_type: "FACILITY" as const,
    status: "REJECTED" as const,
    like_count: 12,
    view_count: 67,
    created_at: "2024-12-10T13:15:00Z",
    updated_at: "2024-12-20T14:20:00Z",
    user: {
      id: 5,
      name: "김태현"
    },
    admin_response: "해당 지역은 관광특구로 경관을 고려하여 펜스 설치가 어렵습니다. 대신 바닥 신호등 설치를 검토하겠습니다.",
    comment_count: 9
  }
];

export const dummyComments = [
  {
    id: 1,
    suggestion_id: 1,
    content: "저도 매일 이용하는 곳인데 정말 위험해요. 빨리 설치되었으면 좋겠습니다.",
    created_at: "2024-12-20T10:30:00Z",
    user: {
      id: 6,
      name: "정수민"
    },
    parent_id: null,
    replies: [
      {
        id: 2,
        suggestion_id: 1,
        content: "맞아요. 특히 비 오는 날에는 더 위험한 것 같아요.",
        created_at: "2024-12-20T11:15:00Z",
        user: {
          id: 7,
          name: "이영수"
        },
        parent_id: 1
      }
    ]
  },
  {
    id: 3,
    suggestion_id: 1,
    content: "관련 부서에 문의해보니 내년 상반기에 검토 예정이라고 하네요.",
    created_at: "2024-12-21T09:20:00Z",
    user: {
      id: 8,
      name: "박지현"
    },
    parent_id: null,
    replies: []
  }
];