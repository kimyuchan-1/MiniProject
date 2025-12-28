# 요구사항 문서

## 소개

시도별·시군구별·월별 보행자 사고 데이터를 기반으로 한 교통 안전 분석 대시보드 시스템입니다. 인터랙티브 지도를 통해 횡단보도와 신호등 현황을 시각화하고, 사고 데이터 히트맵으로 위험 지역을 파악할 수 있습니다. 횡단보도 클릭시 개선된 팝업을 통해 안전 지표와 위험 지표를 실시간으로 확인할 수 있으며, 시민 참여형 건의 시스템을 통해 데이터 기반 정책 수립을 지원합니다.

## 용어 정의

- **Dashboard_System**: 교통 안전 분석 대시보드 시스템 (Next.js + Spring Boot 기반)
- **Supabase_Database**: 횡단보도, 신호등, 월별 사고 데이터를 저장하는 Supabase PostgreSQL 데이터베이스
- **Interactive_Map**: Leaflet 기반 인터랙티브 지도 (횡단보도 마커, 클러스터링, 히트맵 지원)
- **Monthly_Accident_Data**: 시도별·시군구별·월별 보행자 사고 통계 데이터 (ACC 테이블)
- **Heatmap_Visualization**: 사고 밀도를 색상 강도로 표현하는 히트맵 레이어
- **Crosswalk_Data**: 횡단보도 위치, 보행자신호등 유무, 음향신호기 설치여부 등의 정보
- **Signal_Data**: 신호등 상세 정보 (잔여시간표시기, 음향신호기, 보행자작동신호기 등)
- **Enhanced_Popup**: 횡단보도 클릭시 표시되는 개선된 팝업 (안전/위험 지표, 시설 정보 포함)
- **Safety_Score**: 프론트엔드에서 실시간 계산되는 안전 지표 (신호등, 안전 시설 기반)
- **Risk_Score**: 프론트엔드에서 실시간 계산되는 위험 지표 (사고 데이터 기반)
- **Suggestion_Board**: 사용자가 신호등 설치를 건의할 수 있는 게시판
- **Regional_Statistics**: 선택된 지역의 월별 통계 및 실시간 계산 지표
- **REST_API**: Next.js API Routes와 Spring Boot에서 제공하는 RESTful API 엔드포인트

## 요구사항

### 요구사항 1

**사용자 스토리:** 정책 분석가로서, 시도별·시군구별·월별 보행자 사고 데이터를 인터랙티브 지도에서 확인하고 사고 히트맵을 통해 위험 지역을 파악하고 싶습니다. 그래야 데이터 기반의 교통 안전 정책을 수립할 수 있습니다.

#### 승인 기준

1. WHEN 대시보드에 접근할 때 THE Dashboard_System SHALL 지도에 횡단보도와 신호등 정보를 마커로 표시한다
2. WHEN 사고 히트맵을 활성화할 때 THE Dashboard_System SHALL ACC 데이터를 기반으로 사고 밀도를 색상 강도로 시각화한다
3. WHEN 지도를 이동하거나 확대할 때 THE Dashboard_System SHALL 현재 화면 영역의 데이터만 효율적으로 로드한다
4. WHEN 히트맵 토글을 조작할 때 THE Dashboard_System SHALL 히트맵 표시/숨김을 즉시 반영한다
5. WHEN 마커를 클러스터링할 때 THE Dashboard_System SHALL 줌 레벨에 따라 적절한 그룹화를 제공한다

### 요구사항 2

**사용자 스토리:** 교통 안전 연구자로서, 횡단보도 클릭시 상세한 안전 정보와 위험 지표를 확인하고 싶습니다. 그래야 각 지점의 안전 현황을 정확히 파악하고 개선 방안을 수립할 수 있습니다.

#### 승인 기준

1. WHEN 횡단보도 마커를 클릭할 때 THE Dashboard_System SHALL 개선된 팝업을 통해 주소, 지역 정보, 신호등 상태를 표시한다
2. WHEN 팝업이 표시될 때 THE Dashboard_System SHALL 프론트엔드에서 실시간으로 계산된 안전 지표와 위험 지표를 시각적으로 제공한다
3. WHEN 안전 시설 정보를 표시할 때 THE Dashboard_System SHALL 신호등, 음향신호기, 점자블록 등 각 시설의 설치 여부를 아이콘과 함께 표시한다
4. WHEN 근처 사고 현황을 표시할 때 THE Dashboard_System SHALL 해당 지역의 사고 건수, 사망자 수, 부상자 수를 요약하여 제공한다
5. WHEN 점수 바를 표시할 때 THE Dashboard_System SHALL 안전도와 위험도를 0-100 스케일의 시각적 바 차트로 표현한다

### 요구사항 3

**사용자 스토리:** 시민으로서, 특정 지역에 신호등이 필요하다고 생각되는 곳에 대해 건의하고 다른 사용자들과 의견을 공유하고 싶습니다. 그래야 시민 참여를 통한 교통 안전 개선이 가능합니다.

#### 승인 기준

1. WHEN 건의 게시판에 접근할 때 THE Dashboard_System SHALL 지역별 신호등 설치 건의 목록을 표시한다
2. WHEN 새 건의를 작성할 때 THE Dashboard_System SHALL 지도에서 위치를 선택하고 건의 사유를 입력할 수 있게 한다
3. WHEN 건의를 제출할 때 THE Dashboard_System SHALL 해당 위치의 현재 시설 현황과 주변 사고 이력을 자동으로 첨부한다
4. WHEN 건의를 조회할 때 THE Dashboard_System SHALL 건의 위치를 지도에 마커로 표시하고 상세 정보를 제공한다
5. WHEN 사용자가 건의에 반응할 때 THE Dashboard_System SHALL 좋아요, 댓글 기능을 통해 시민 의견을 수집한다

### 요구사항 4

**사용자 스토리:** 관리자로서, 사고 히트맵과 지역별 통계를 통해 위험 지역을 식별하고 개선 우선순위를 파악하고 싶습니다. 그래야 효율적인 예산 배정과 정책 수립이 가능합니다.

#### 승인 기준

1. WHEN 히트맵을 표시할 때 THE Dashboard_System SHALL ACC 데이터의 사고 밀도에 따라 색상 강도를 조절하여 위험 지역을 시각적으로 구분한다
2. WHEN 히트맵 모드를 선택할 때 THE Dashboard_System SHALL 위험도, 안전도, 종합 지표 중 선택하여 다른 관점의 히트맵을 제공한다
3. WHEN 지역을 선택할 때 THE Dashboard_System SHALL 해당 지역의 횡단보도 수, 신호등 설치율, 사고 건수를 프론트엔드에서 실시간으로 계산하여 표시한다
4. WHEN 우선순위를 계산할 때 THE Dashboard_System SHALL 사고 빈도, 신호등 미설치 여부, 안전 시설 부족도를 종합하여 개선 우선순위를 제안한다
5. WHEN 히트맵 범례를 표시할 때 THE Dashboard_System SHALL 색상별 위험도 수준과 의미를 명확히 설명한다

### 요구사항 5

**사용자 스토리:** 시스템 사용자로서, 횡단보도와 신호등 데이터를 정확하게 파싱하고 MySQL에 저장하고 싶습니다. 그래야 분석의 기초 데이터가 신뢰할 수 있습니다.

#### 승인 기준

1. WHEN CSV 파일을 업로드할 때 THE Dashboard_System SHALL 한글 인코딩을 올바르게 처리하여 데이터를 파싱한다
2. WHEN 횡단보도 데이터를 처리할 때 THE Dashboard_System SHALL 위경도, 음향신호기 설치여부, 보행자신호등 유무 등 필수 필드를 검증한다
3. WHEN 신호등 데이터를 처리할 때 THE Dashboard_System SHALL 잔여시간표시기, 음향신호기, 보행자작동신호기 정보를 정확히 추출한다
4. WHEN 데이터를 저장할 때 THE Dashboard_System SHALL MySQL 데이터베이스 테이블에 정규화된 구조로 저장한다
5. WHEN Spring Boot 애플리케이션이 시작될 때 THE Dashboard_System SHALL MySQL 연결을 설정하고 데이터 접근 계층을 초기화한다

### 요구사항 6

**사용자 스토리:** 분석 엔진 사용자로서, 시설 안전도와 사고 위험도를 실시간으로 계산하여 개선 우선순위를 파악하고 싶습니다. 그래야 객관적인 기준으로 개선 대상을 선정할 수 있습니다.

#### 승인 기준

1. WHEN 안전도 점수를 계산할 때 THE Dashboard_System SHALL 프론트엔드에서 신호등 유무, 음향신호기, 잔여시간표시기, 보행자작동신호기, 점자블록, 집중조명 등의 시설 정보를 가중치와 함께 실시간으로 합산한다
2. WHEN 위험도 점수를 계산할 때 THE Dashboard_System SHALL 프론트엔드에서 사고 건수, 사망자 수, 중상자 수, 경상자 수를 가중치와 함께 실시간으로 합산한다
3. WHEN 사용자가 가중치를 조정할 때 THE Dashboard_System SHALL 모든 지표를 즉시 재계산하여 지도와 팝업에 반영한다
4. WHEN 지표를 표시할 때 THE Dashboard_System SHALL 안전도와 위험도를 0-100 스케일로 정규화하여 일관된 사용자 경험을 제공한다
5. THE Dashboard_System SHALL 계산된 지표를 데이터베이스에 저장하지 않고 원본 데이터(횡단보도 시설, 사고 통계)만 저장하여 데이터 일관성을 보장한다

### 요구사항 7

**사용자 스토리:** 웹 애플리케이션 사용자로서, 반응형 인터페이스를 통해 다양한 기기에서 대시보드를 사용하고 싶습니다. 그래야 현장에서도 편리하게 접근할 수 있습니다.

#### 승인 기준

1. WHEN 웹 애플리케이션을 로드할 때 THE Dashboard_System SHALL 모바일, 태블릿, 데스크톱 화면 크기에 맞춰 레이아웃을 조정한다
2. WHEN 지도 인터페이스를 표시할 때 THE Dashboard_System SHALL 터치 제스처와 마우스 조작을 모두 지원한다
3. WHEN 데이터를 로딩할 때 THE Dashboard_System SHALL 로딩 상태를 시각적으로 표시하여 사용자 경험을 향상시킨다

### 요구사항 8

**사용자 스토리:** 시스템 관리자로서, 사용자들의 건의사항을 효율적으로 관리하고 처리 상태를 추적하고 싶습니다. 그래야 시민 참여를 통한 지속적인 개선이 가능합니다.

#### 승인 기준

1. WHEN 관리자가 건의 관리 페이지에 접근할 때 THE Dashboard_System SHALL 모든 건의사항을 상태별로 분류하여 표시한다
2. WHEN 건의사항을 검토할 때 THE Dashboard_System SHALL 해당 위치의 교통량, 사고 이력, 기존 시설 현황을 종합적으로 제공한다
3. WHEN 건의 상태를 변경할 때 THE Dashboard_System SHALL 검토중, 승인, 반려, 완료 상태를 관리하고 사용자에게 알림을 발송한다
4. WHEN 통계를 조회할 때 THE Dashboard_System SHALL 지역별 건의 현황, 처리율, 시민 만족도를 대시보드로 제공한다

### 요구사항 12

**사용자 스토리:** 웹 애플리케이션 사용자로서, JWT 토큰 기반 인증을 통해 안전하고 편리하게 로그인하고 싶습니다. 그래야 프론트엔드와 백엔드 간 상태 비저장(stateless) 인증이 가능하고 확장성이 향상됩니다.

#### 승인 기준

1. WHEN 사용자가 OAuth2 로그인을 완료할 때 THE Dashboard_System SHALL JWT 액세스 토큰과 리프레시 토큰을 생성하여 클라이언트에 반환한다
2. WHEN 인증이 필요한 API를 호출할 때 THE Dashboard_System SHALL Authorization 헤더의 Bearer 토큰을 검증하여 사용자 인증 상태를 확인한다
3. WHEN 액세스 토큰이 만료될 때 THE Dashboard_System SHALL 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급한다
4. WHEN 사용자가 로그아웃할 때 THE Dashboard_System SHALL 리프레시 토큰을 무효화하고 클라이언트에서 토큰을 삭제하도록 지시한다
5. WHEN JWT 토큰을 검증할 때 THE Dashboard_System SHALL 토큰의 서명, 만료 시간, 발급자를 검증하여 토큰의 유효성을 확인한다

### 요구사항 9

**사용자 스토리:** 지도 사용자로서, 사고 데이터를 히트맵으로 시각화하여 위험 지역을 한눈에 파악하고 싶습니다. 그래야 지역별 위험도를 직관적으로 이해할 수 있습니다.

#### 승인 기준

1. WHEN 히트맵 기능을 활성화할 때 THE Dashboard_System SHALL Supabase ACC 데이터를 기반으로 지역별 사고 밀도를 계산한다
2. WHEN 히트맵을 렌더링할 때 THE Dashboard_System SHALL 사고 건수, 사망자 수, 부상자 수를 가중치로 적용하여 위험도를 산정한다
3. WHEN 히트맵 색상을 표시할 때 THE Dashboard_System SHALL 녹색(안전) → 노란색(주의) → 주황색(경고) → 빨간색(위험) 그라디언트를 사용한다
4. WHEN 히트맵 토글 버튼을 조작할 때 THE Dashboard_System SHALL 히트맵 레이어의 표시/숨김을 즉시 반영한다
5. WHEN 지도 범위가 변경될 때 THE Dashboard_System SHALL 현재 화면 영역의 사고 데이터만 효율적으로 로드하여 히트맵을 업데이트한다

### 요구사항 10

**사용자 스토리:** API 사용자로서, 지도 범위에 따른 사고 데이터를 효율적으로 조회하고 싶습니다. 그래야 히트맵과 지역별 분석에 필요한 데이터를 빠르게 제공받을 수 있습니다.

#### 승인 기준

1. WHEN 사고 데이터 API를 호출할 때 THE Dashboard_System SHALL 지도 경계(bounds) 파라미터를 받아 해당 영역의 사고 데이터만 반환한다
2. WHEN ACC 테이블을 조회할 때 THE Dashboard_System SHALL sido_code, sigungu_code를 기반으로 지역별 사고 통계를 집계한다
3. WHEN 지역 좌표를 매핑할 때 THE Dashboard_System SHALL district_all 데이터를 활용하여 지역 코드를 위경도 좌표로 변환한다
4. WHEN API 응답을 반환할 때 THE Dashboard_System SHALL 사고 건수, 사망자 수, 부상자 수와 함께 추정 좌표를 포함한다
5. WHEN 데이터 검증을 수행할 때 THE Dashboard_System SHALL 필수 필드(sido_code, sigungu_code, year, month)의 유효성을 확인한다

### 요구사항 11

**사용자 스토리:** 시민 안전 모니터링 담당자로서, 실시간 사고 알림과 위험 지역 모니터링을 통해 신속한 대응을 하고 싶습니다. 그래야 사고 발생 시 즉각적인 안전 조치를 취할 수 있습니다.

#### 승인 기준

1. WHEN 사고 데이터가 업데이트될 때 THE Dashboard_System SHALL 새로운 사고 발생 시 관련 담당자에게 실시간 알림을 발송한다
2. WHEN 위험 임계치를 초과할 때 THE Dashboard_System SHALL 특정 지역의 월별 사고 건수가 평균 대비 일정 수준을 초과하면 경고 알림을 생성한다
3. WHEN 모니터링 대시보드를 표시할 때 THE Dashboard_System SHALL 실시간 사고 현황, 위험 지역 순위, 대응 필요 지역을 한눈에 볼 수 있게 표시한다
4. WHEN 대응 이력을 관리할 때 THE Dashboard_System SHALL 사고 발생 후 취해진 조치, 개선 사항, 효과 측정 결과를 기록하고 추적한다