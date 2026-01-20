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
- 월별 보행자 사고 분포 시각화
- 사고 다발지역(Hotspot) 위치 마커 표시
- 횡단보도 및 신호등 위치 마커 표시

### 2. KPI 중심 대시보드
- 신호등 설치율 분석
- 시설 취약도 기반(음향신호기, 점자블록 등 편의시설) 안전 지수 계산
- 횡단보도 반경 500m 내 사고다발지역 기반 위험 지수 계산

### 3. 시민 참여형 건의 시스템
- 지도 기반 신호등 설치 건의 작성
- 선택된 지역 위험 지수 확인
- 댓글 및 좋아요 기능
- 관리자 검토·처리 상태 추적

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
- **Testing**: Vitest, Fast-check (Property-Based Testing)

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

## 🔑 주요 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /oauth2/authorization/{provider}` - OAuth2 로그인

### 대시보드
- `GET /api/dashboard/kpi` - KPI 통계 조회
- `GET /api/dashboard/provinces` - 시도 목록
- `GET /api/dashboard/cities` - 시군구 목록

### 지도
- `GET /api/map/crosswalks` - 횡단보도 목록
- `GET /api/map/acc_hotspots` - 사고 다발지역

### 건의사항
- `GET /api/suggestions` - 건의사항 목록
- `POST /api/suggestions` - 건의사항 작성
- `GET /api/suggestions/{id}` - 건의사항 상세
- `POST /api/suggestions/{id}/comments` - 댓글 작성
- `POST /api/suggestions/{id}/like` - 좋아요

### 사용자
- `GET /api/me` - 내 정보 조회
- `PUT /api/me` - 내 정보 수정
- `POST /api/auth/change-password` - 비밀번호 변경

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

### 우선순위 점수
건의사항의 개선 우선순위는 위험 지수를 기반으로 결정됩니다:
```
우선순위 점수 = 위험 지수 (0-100)
```

**계산 방식:**
- **위험 지수 (0-100)**: 주변 사고 발생 빈도 및 심각도
  - 높을수록 위험한 지역
  - 사고 건수, 사상자 수, 사망자 수를 종합적으로 반영

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
