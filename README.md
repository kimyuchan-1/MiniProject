# 보행자 교통안전 분석 대시보드

전국 보행자 사고 데이터와 교통 시설 정보를 통합한 데이터 기반 교통 안전 분석 플랫폼

## 📋 프로젝트 개요

이 프로젝트는 횡단보도·신호등 시설 정보를 결합하여 보행자 안전 지수를 평가하고, 신호등 설치 및 기능 개선의 우선순위를 사고 다발 지역 데이터를 기반으로 정량적으로 제시하는 것을 목표로 합니다.

### 주요 목적
- 보행자 사고 데이터 시각화
- 교통 시설(횡단보도, 신호등) 현황 파악
- 사고 다발지역 식별 및 개선 우선순위 제시
- 시민 참여형 교통 안전 개선 건의 시스템

## ✨ 주요 기능

### 1. 인터랙티브 지도 분석
- 시도, 시군구 기준으로 원하는 지역 이동
- 사고 다발지역 위치 마커(빨간 삼각형) 표시
- 횡단보도 및 신호등 위치 마커(신호등 有: 초록 원, 신호등 無: 빨간 원) 표시

### 2. KPI 중심 대시보드
- 신호등 설치율 분석
- 시설 취약도 기반(음향신호기, 점자블록 등 편의시설) 안전 지수 계산
- 횡단보도 반경 500m 내 사고다발지역 기반 위험 지수 계산

### 3. 시민 참여형 건의 시스템
- 지도 기반 신호등 설치 건의 작성
- 선택된 지역 위험 지수 확인
- 댓글 및 좋아요 기능

### 4. 사용자 계정 관리
- OAuth2 기반 소셜 로그인 (구글, 네이버, 깃허브)
- 이메일 기반 회원가입/로그인
- 프로필 관리 및 비밀번호 변경
- 내 활동 내역 조회

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Map**: Leaflet, React-Leaflet
- **Charts**: Chart.js, React-ChartJS-2
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Backend
- **Framework**: Spring Boot 3.5.8
- **Language**: Java 21
- **ORM**: Spring Data JPA
- **Database**: MySQL 8
- **Security**: Spring Security, JWT
- **Authentication**: OAuth2 Client
- **Build Tool**: Maven

### Database Schema
- **accident**: 보행자 사고 데이터
- **accident_hotspot**: 사고 다발지역
- **crosswalk**: 횡단보도 정보
- **traffic_signal**: 신호등 정보
- **cw_acc_map**: 횡단보도-사고 매핑
- **cw_sig_map**: 횡단보도-신호등 매핑
- **district**: 행정구역 정보
- **suggestion**: 시민 건의사항
- **suggestion_comment**: 건의 댓글
- **suggestion_like**: 건의 좋아요
- **user**: 사용자 정보
- **v_summary_kpi_fast**: kpi 정보 뷰

## 📊 데이터셋

### 사용 데이터
- **보행자 사고 데이터**: 전국 월별 보행자 교통사고 통계
- **횡단보도 표준 데이터**: 전국 횡단보도 위치 및 시설 정보
- **신호등 표준 데이터**: 전국 신호등 위치 및 종류 정보
- **행정구역 데이터**: 시도/시군구 코드 및 경계 정보

### 데이터 처리
- Python을 활용한 데이터 전처리 및 정제
- 공간 데이터 매핑 (횡단보도-사고, 횡단보도-신호등)
- 500m 반경 기반 사고 다발지역 분석
- MySQL 데이터베이스 적재 및 인덱싱

## 🚀 시작하기

### 사전 요구사항
- Node.js 20+
- Java 21+
- MySQL 8+
- Maven 3.6+

### Frontend 설치 및 실행

```bash
cd frontend
npm install
npm run dev
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

### Backend 설치 및 실행

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend API는 `http://localhost:8080`에서 실행됩니다.

### 환경 변수 설정

#### Frontend (.env)
```env
NEXT_PUBLIC_BACKEND_URL=https://{우회 backend url}
```

#### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ped_accident
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_jwt_secret
spring.security.oauth2.client.registration.naver.client-id=your_naver_client_id
spring.security.oauth2.client.registration.naver.client-secret=your_naver_client_secret
```

## 📁 프로젝트 구조

```
.
├── frontend/                 # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/             # App Router 페이지
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── features/        # 기능별 비즈니스 로직
│   │   ├── hooks/           # 커스텀 React Hooks
│   │   └── lib/             # 유틸리티 및 API 클라이언트
│   └── public/              # 정적 파일
│
├── backend/                 # Spring Boot 백엔드
│   └── src/main/java/com/kdt03/ped_accident/
│       ├── api/             # REST API 컨트롤러 및 DTO
│       ├── domain/          # 도메인 엔티티 및 서비스
│       └── global/          # 전역 설정 및 예외 처리
│
└── dataset/                 # 데이터셋 및 전처리 스크립트
    ├── raw/                 # 원본 데이터
    ├── python code/         # 데이터 전처리 스크립트
    └── *.csv                # 처리된 데이터
```

## 🔑 API 명세

### 인증 (Authentication)

#### 로그인
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "picture": "https://example.com/profile.jpg",
    "role": "USER",
    "provider": "LOCAL"
  }
}
```

#### 회원가입
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}

Response (200 OK):
{
  "success": true,
  "message": "회원가입 성공",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

#### 로그아웃
```
POST /api/auth/logout
Cookie: accessToken=...

Response (200 OK):
{
  "success": true,
  "message": "로그아웃 성공",
  "data": null
}
```

#### OAuth2 로그인
```
GET /oauth2/authorization/{provider}
Providers: google, naver, github

Response: Redirect to OAuth2 provider
```

#### 인증 상태 확인
```
GET /api/auth/check
Cookie: accessToken=...

Response (200 OK):
{
  "success": true,
  "message": "인증 상태 확인",
  "data": true
}
```

### 사용자 (User)

#### 내 정보 조회
```
GET /api/me
Cookie: accessToken=...

Response (200 OK):
{
  "success": true,
  "message": "사용자 정보 조회 성공",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "picture": "https://example.com/profile.jpg",
    "role": "USER",
    "provider": "LOCAL"
  }
}
```

#### 내 정보 수정
```
PATCH /api/me
Cookie: accessToken=...
Content-Type: application/json

Request Body:
{
  "name": "김철수"
}

Response (200 OK):
{
  "success": true,
  "message": "회원명 수정 성공",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "김철수",
    "picture": "https://example.com/profile.jpg",
    "role": "USER"
  }
}
```

#### 비밀번호 변경
```
POST /api/auth/change-password
Cookie: accessToken=...
Content-Type: application/json

Request Body:
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}

Response (200 OK):
{
  "success": true,
  "message": "비밀번호 변경 성공",
  "data": null
}
```

### 대시보드 (Dashboard)

#### KPI 통계 조회
```
GET /api/dashboard/kpi

Response (200 OK):
{
  "totalCrosswalks": 50000,
  "crosswalksWithSignals": 35000,
  "signalInstallationRate": 70.0,
  "totalAccidents": 12000,
  "averageSafetyScore": 65.5,
  "averageRiskScore": 45.2
}
```

#### 시도 목록 조회
```
GET /api/dashboard/provinces

Response (200 OK):
[
  {
    "code": "11",
    "name": "서울특별시"
  },
  {
    "code": "26",
    "name": "부산광역시"
  }
]
```

#### 시군구 목록 조회
```
GET /api/dashboard/cities?province=서울특별시

Query Parameters:
- province (required): 시도명

Response (200 OK):
[
  {
    "code": "11110",
    "name": "종로구"
  },
  {
    "code": "11140",
    "name": "중구"
  }
]
```

### 지도 (Map)

#### 횡단보도 목록 조회
```
GET /api/map/crosswalks?bounds=37.5,126.9,37.6,127.0&limit=5000

Query Parameters:
- bounds (required): south,west,north,east (위도/경도 범위)
- limit (optional): 최대 결과 수 (기본값: 5000)

Response (200 OK):
[
  {
    "id": 1,
    "latitude": 37.5665,
    "longitude": 126.9780,
    "address": "서울특별시 중구 태평로1가",
    "hasSignal": true,
    "hasSound": true,
    "hasBraille": false,
    "safetyScore": 75.5,
    "riskScore": 35.2,
    "nearbyAccidents": 3
  }
]
```

#### 사고 다발지역 조회
```
GET /api/map/acc_hotspots?bounds=37.5,126.9,37.6,127.0&limit=5000

Query Parameters:
- bounds (required): south,west,north,east (위도/경도 범위)
- limit (optional): 최대 결과 수 (기본값: 5000)

Response (200 OK):
{
  "success": true,
  "message": "ok",
  "data": [
    {
      "id": 1,
      "latitude": 37.5665,
      "longitude": 126.9780,
      "address": "서울특별시 중구 태평로1가",
      "accidentCount": 15,
      "fatalityCount": 2,
      "seriousInjuryCount": 5,
      "minorInjuryCount": 8
    }
  ]
}
```

### 보행자 사고 통계 (Pedestrian Accidents)

#### 사고 통계 요약 조회
```
GET /api/pedacc/summary?region=서울특별시

Query Parameters:
- region (optional): 지역명 (시도 또는 시군구)

Response (200 OK):
{
  "region": "서울특별시",
  "regionType": "PROVINCE",
  "yearly": [
    {
      "year": 2023,
      "accident_count": 1500,
      "casualty_count": 1800,
      "fatality_count": 50,
      "serious_injury_count": 300,
      "minor_injury_count": 1200,
      "reported_injury_count": 250
    }
  ],
  "monthly": [
    {
      "year": 2023,
      "month": 1,
      "accident_count": 120,
      "casualty_count": 150,
      "fatality_count": 4,
      "serious_injury_count": 25,
      "minor_injury_count": 100,
      "reported_injury_count": 21
    }
  ]
}
```

### 건의사항 (Suggestions)

#### 건의사항 목록 조회
```
GET /api/suggestions?page=1&size=10&status=PENDING&type=SIGNAL_INSTALLATION&region=서울특별시&search=신호등&sort=latest

Query Parameters:
- page (optional): 페이지 번호 (기본값: 1)
- size (optional): 페이지 크기 (기본값: 10)
- status (optional): 상태 필터 (ALL, PENDING, IN_PROGRESS, COMPLETED, REJECTED)
- type (optional): 유형 필터 (ALL, SIGNAL_INSTALLATION, SIGNAL_IMPROVEMENT, CROSSWALK_IMPROVEMENT, OTHER)
- region (optional): 지역 필터
- search (optional): 검색어
- sort (optional): 정렬 방식 (latest, popular, priority, status)

Response (200 OK):
{
  "content": [
    {
      "id": 1,
      "title": "신호등 설치 요청",
      "content": "이 지역은 사고가 자주 발생합니다.",
      "location_lat": 37.5665,
      "location_lon": 126.9780,
      "address": "서울특별시 중구 태평로1가",
      "sido": "서울특별시",
      "sigungu": "중구",
      "suggestion_type": "SIGNAL_INSTALLATION",
      "status": "PENDING",
      "priority_score": 85.5,
      "like_count": 15,
      "view_count": 120,
      "comment_count": 8,
      "created_at": "2024-01-15T10:30:00",
      "updated_at": "2024-01-15T10:30:00",
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "홍길동",
        "picture": "https://example.com/profile.jpg"
      }
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 1,
  "size": 10
}
```

#### 건의사항 상세 조회
```
GET /api/suggestions/{id}
Cookie: accessToken=... (optional)

Response (200 OK):
{
  "id": 1,
  "title": "신호등 설치 요청",
  "content": "이 지역은 사고가 자주 발생합니다.",
  "location_lat": 37.5665,
  "location_lon": 126.9780,
  "address": "서울특별시 중구 태평로1가",
  "sido": "서울특별시",
  "sigungu": "중구",
  "sido_code": "11",
  "sigungu_code": "11140",
  "suggestion_type": "SIGNAL_INSTALLATION",
  "status": "PENDING",
  "priority_score": 85.5,
  "like_count": 15,
  "view_count": 121,
  "comment_count": 8,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00",
  "processed_at": null,
  "admin_response": null,
  "user_id": 1,
  "user": {
    "id": 1,
    "name": "홍길동",
    "picture": "https://example.com/profile.jpg"
  },
  "is_liked": false
}
```

#### 건의사항 작성
```
POST /api/suggestions
Cookie: accessToken=...
Content-Type: application/json

Request Body:
{
  "title": "신호등 설치 요청",
  "content": "이 지역은 사고가 자주 발생합니다.",
  "suggestion_type": "SIGNAL_INSTALLATION",
  "location_lat": 37.5665,
  "location_lon": 126.9780,
  "address": "서울특별시 중구 태평로1가",
  "priority_score": 85.5,
  "sido_code": "11",
  "sigungu_code": "11140"
}

Response (201 Created):
{
  "id": 1,
  "title": "신호등 설치 요청",
  "content": "이 지역은 사고가 자주 발생합니다.",
  "location_lat": 37.5665,
  "location_lon": 126.9780,
  "address": "서울특별시 중구 태평로1가",
  "sido_code": "11",
  "sigungu_code": "11140",
  "suggestion_type": "SIGNAL_INSTALLATION",
  "status": "PENDING",
  "priority_score": 85.5,
  "like_count": 0,
  "view_count": 0,
  "comment_count": 0,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00",
  "user_id": 1
}
```

#### 건의사항 수정
```
PUT /api/suggestions/{id}
Cookie: accessToken=...
Content-Type: application/json

Request Body:
{
  "title": "신호등 설치 요청 (수정)",
  "content": "수정된 내용입니다.",
  "suggestion_type": "SIGNAL_INSTALLATION",
  "location_lat": 37.5665,
  "location_lon": 126.9780,
  "address": "서울특별시 중구 태평로1가"
}

Response (200 OK):
{
  "id": 1,
  "title": "신호등 설치 요청 (수정)",
  "content": "수정된 내용입니다.",
  "location_lat": 37.5665,
  "location_lon": 126.9780,
  "address": "서울특별시 중구 태평로1가",
  "suggestion_type": "SIGNAL_INSTALLATION",
  "status": "PENDING",
  "priority_score": 85.5,
  "like_count": 15,
  "view_count": 121,
  "comment_count": 8,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T11:00:00",
  "user_id": 1
}
```

#### 건의사항 삭제
```
DELETE /api/suggestions/{id}
Cookie: accessToken=...

Response (200 OK):
{
  "message": "건의사항이 삭제되었습니다."
}
```

#### 건의사항 상태 변경 (관리자 전용)
```
PUT /api/suggestions/{id}/status
Cookie: accessToken=...
Content-Type: application/json

Request Body:
{
  "status": "COMPLETED",
  "adminResponse": "신호등 설치가 완료되었습니다."
}

Response (200 OK):
{
  "id": 1,
  "status": "COMPLETED",
  "admin_response": "신호등 설치가 완료되었습니다.",
  "processed_at": "2024-01-20T15:00:00"
}
```

#### 내 건의사항 목록 조회
```
GET /api/suggestions/my?page=1&pageSize=10&status=ALL
Cookie: accessToken=...

Query Parameters:
- page (optional): 페이지 번호 (기본값: 1)
- pageSize (optional): 페이지 크기 (기본값: 10)
- status (optional): 상태 필터 (ALL, PENDING, IN_PROGRESS, COMPLETED, REJECTED)

Response (200 OK):
{
  "success": true,
  "message": "내 게시글 조회 성공",
  "data": {
    "items": [...],
    "totalCount": 25,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3
  }
}
```

#### 지역 목록 조회
```
GET /api/suggestions/regions

Response (200 OK):
[
  "서울특별시",
  "부산광역시",
  "인천광역시"
]
```

### 댓글 (Comments)

#### 댓글 목록 조회
```
GET /api/suggestions/{id}/comments

Response (200 OK):
[
  {
    "id": 1,
    "suggestion_id": 1,
    "content": "좋은 의견입니다.",
    "created_at": "2024-01-15T11:00:00",
    "user": {
      "id": 2,
      "name": "김철수",
      "picture": "https://example.com/profile2.jpg"
    },
    "parent_id": null,
    "replies": [
      {
        "id": 2,
        "suggestion_id": 1,
        "content": "감사합니다.",
        "created_at": "2024-01-15T11:30:00",
        "user": {
          "id": 1,
          "name": "홍길동",
          "picture": "https://example.com/profile.jpg"
        },
        "parent_id": 1,
        "replies": []
      }
    ]
  }
]
```

#### 댓글 작성
```
POST /api/suggestions/{id}/comments
Cookie: accessToken=...
Content-Type: application/json

Request Body:
{
  "content": "좋은 의견입니다.",
  "parentId": null
}

Response (201 Created):
{
  "id": 1,
  "suggestion_id": 1,
  "content": "좋은 의견입니다.",
  "created_at": "2024-01-15T11:00:00",
  "user": {
    "id": 2,
    "name": "김철수",
    "picture": "https://example.com/profile2.jpg"
  },
  "parent_id": null,
  "replies": []
}
```

#### 댓글 수정
```
PUT /api/suggestions/{suggestionId}/comments/{commentId}
Cookie: accessToken=...
Content-Type: application/json

Request Body:
{
  "content": "수정된 댓글 내용입니다."
}

Response (200 OK):
{
  "id": 1,
  "suggestion_id": 1,
  "content": "수정된 댓글 내용입니다.",
  "created_at": "2024-01-15T11:00:00",
  "user": {
    "id": 2,
    "name": "김철수",
    "picture": "https://example.com/profile2.jpg"
  },
  "parent_id": null,
  "replies": []
}
```

#### 댓글 삭제
```
DELETE /api/suggestions/{suggestionId}/comments/{commentId}
Cookie: accessToken=...

Response (200 OK):
{
  "message": "댓글이 삭제되었습니다."
}
```

### 좋아요 (Likes)

#### 좋아요 토글
```
POST /api/suggestions/{id}/like
Cookie: accessToken=...

Response (200 OK):
{
  "liked": true,
  "message": "좋아요를 추가했습니다."
}

또는

{
  "liked": false,
  "message": "좋아요를 취소했습니다."
}
```

### 행정구역 (Districts)

#### 시도 목록 조회
```
GET /api/district/provinces

Response (200 OK):
[
  {
    "code": "11",
    "name": "서울특별시"
  }
]
```

#### 시군구 목록 조회
```
GET /api/district/cities?provinceCode=11

Query Parameters:
- provinceCode (required): 시도 코드

Response (200 OK):
[
  {
    "code": "11110",
    "name": "종로구"
  }
]
```

## 🧪 테스트

### Frontend 테스트
```bash
cd frontend
npm run test          # 단위 테스트 실행
npm run test:watch    # Watch 모드
npm run test:ui       # UI 모드
```

Property-Based Testing을 활용한 테스트 포함

### Backend 테스트
```bash
cd backend
mvn test
```

## 📈 주요 알고리즘

### 좌표 데이터 거리 계산
Haversine 공식을 활용하여 대원 기리(Great Circle distance)을 계산합니다.
- 횡단보도 - 신호등 데이터를 공간 매핑(반경 30m)하는데 사용
- 횡단보도 - 사고다발지역 데이터를 공간 매핑(반경 500m)하는데 사용

### 위험 지수 계산
특정 위치의 위험 지수는 주변 사고 데이터를 기반으로 계산됩니다:
- 반경 500m 내 사고 데이터 수집
- 거리 가중치 적용 (가까울수록 높은 가중치)
- 사고 심각도 반영 (사망 > 중상 > 경상)
- 지수 압축을 통한 0-100 정규화

### 안전 지수 계산
횡단보도의 안전 지수는 다음 요소를 기반으로 계산됩니다:
- 신호등 설치 여부
- 음향신호기 설치 여부
- 점자블록 설치 여부
- 보도턱 낮춤 여부
- 집중조명 설치 여부

### 우선순위
건의사항의 개선 우선순위는 위험 지수를 기반으로 결정됩니다:
```
우선순위 점수 = 위험 지수 (0-100)
```

**우선순위 레벨:**
- 매우 높음 (80-100): 즉시 개선 필요
- 높음 (60-79): 우선 개선 필요
- 보통 (40-59): 개선 권장
- 낮음 (20-39): 장기 개선 검토
- 매우 낮음 (0-19): 현상 유지

이 알고리즘을 통해 실제 사고 위험도가 높은 지역의 건의사항이 우선적으로 처리될 수 있도록 합니다.

## 🤝 기여

이 프로젝트는 KDT 03기 미니 프로젝트로 개발되었습니다.

## 📄 라이선스

이 프로젝트는 교육 목적으로 개발되었습니다.

## 📞 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.

---

**보행자 교통안전 분석 대시보드** - 데이터 기반 교통 안전 개선을 위한 플랫폼
