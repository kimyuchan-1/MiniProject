# 요구사항 문서

## 소개

시도별·시군구별·월별 보행자 사고 데이터를 기반으로 한 교통 안전 분석 대시보드 시스템입니다. 전국→시도→구 단계별 확대가 가능한 인터랙티브 지도를 통해 월별 사고 트렌드를 시각화하고, 보행자 사고 다발지역의 신호등 설치 현황 및 기능을 분석하는 KPI 중심의 대시보드를 제공합니다. 데이터 기반 정책 수립을 위한 시민 참여형 건의 시스템과 예측 분석 기능을 포함합니다.

## 용어 정의

- **Dashboard_System**: 교통 안전 분석 대시보드 시스템 (Spring Boot 기반)
- **MySQL_Database**: 횡단보도, 신호등, 월별 사고 데이터를 저장하는 MySQL 데이터베이스
- **Interactive_Map**: 전국→시도→구 단계별 확대가 가능한 인터랙티브 지도
- **Monthly_Accident_Data**: 시도별·시군구별·월별 보행자 사고 통계 데이터
- **KPI_Dashboard**: 신호등 설치율, 사고 감소율, 안전 지수 등 핵심 성과 지표
- **Crosswalk_Data**: 횡단보도 위치, 보행자신호등 유무, 음향신호기 설치여부 등의 정보
- **Signal_Data**: 신호등 상세 정보 (잔여시간표시기, 음향신호기, 보행자작동신호기 등)
- **Accident_Hotspot_Analysis**: 사고 다발지역의 신호등 설치 현황 및 기능 분석
- **Trend_Analysis**: 월별 사고 트렌드 및 계절성 분석
- **Prediction_Model**: 사고 예측 및 신호등 설치 효과 예측 모델
- **Suggestion_Board**: 사용자가 신호등 설치를 건의할 수 있는 게시판
- **Regional_Statistics**: 선택된 지역의 월별 통계 및 KPI 데이터
- **REST_API**: Spring Boot에서 제공하는 RESTful API 엔드포인트

## 요구사항

### 요구사항 1

**사용자 스토리:** 정책 분석가로서, 시도별·시군구별·월별 보행자 사고 데이터를 인터랙티브 지도에서 확인하고 KPI를 통해 안전 현황을 파악하고 싶습니다. 그래야 데이터 기반의 교통 안전 정책을 수립할 수 있습니다.

#### 승인 기준

1. WHEN 대시보드에 접근할 때 THE Dashboard_System SHALL 전국 지도에 월별 보행자 사고 데이터를 시각화하여 표시한다
2. WHEN 시도를 클릭할 때 THE Dashboard_System SHALL 해당 시도 지도로 확대하고 시도별 월별 사고 통계 및 KPI를 업데이트한다
3. WHEN 구를 클릭할 때 THE Dashboard_System SHALL 해당 구 지도로 확대하고 구별 월별 상세 통계 및 KPI를 업데이트한다
4. WHEN 월별 필터를 적용할 때 THE Dashboard_System SHALL 선택된 기간의 사고 데이터와 트렌드를 지도와 차트에 반영한다
5. WHEN KPI 대시보드를 표시할 때 THE Dashboard_System SHALL 신호등 설치율, 사고 감소율, 안전 지수, 월별 변화율을 실시간으로 계산하여 표시한다

### 요구사항 2

**사용자 스토리:** 교통 안전 연구자로서, 보행자 사고 다발지역의 신호등 설치 현황과 기능을 분석하여 안전 개선 효과를 측정하고 싶습니다. 그래야 신호등 설치 및 기능 개선의 우선순위를 과학적으로 결정할 수 있습니다.

#### 승인 기준

1. WHEN 사고 다발지역 분석을 요청할 때 THE Dashboard_System SHALL 월별 사고 데이터를 기반으로 다발지역을 식별하고 해당 지역의 신호등 설치 현황을 매핑한다
2. WHEN 신호등 기능 분석을 수행할 때 THE Dashboard_System SHALL 음향신호기, 잔여시간표시기, 보행자작동신호기 등 각 기능별 설치 현황과 사고율의 상관관계를 분석한다
3. WHEN 월별 트렌드를 분석할 때 THE Dashboard_System SHALL 계절별, 월별 사고 패턴과 신호등 설치 효과의 변화를 시각화한다
4. WHEN 효과성 지표를 계산할 때 THE Dashboard_System SHALL 신호등 설치 전후 사고 감소율, 기능별 안전 개선 효과를 정량화하여 제공한다

### 요구사항 3

**사용자 스토리:** 시민으로서, 특정 지역에 신호등이 필요하다고 생각되는 곳에 대해 건의하고 다른 사용자들과 의견을 공유하고 싶습니다. 그래야 시민 참여를 통한 교통 안전 개선이 가능합니다.

#### 승인 기준

1. WHEN 건의 게시판에 접근할 때 THE Dashboard_System SHALL 지역별 신호등 설치 건의 목록을 표시한다
2. WHEN 새 건의를 작성할 때 THE Dashboard_System SHALL 지도에서 위치를 선택하고 건의 사유를 입력할 수 있게 한다
3. WHEN 건의를 제출할 때 THE Dashboard_System SHALL 해당 위치의 현재 시설 현황과 주변 사고 이력을 자동으로 첨부한다
4. WHEN 건의를 조회할 때 THE Dashboard_System SHALL 건의 위치를 지도에 마커로 표시하고 상세 정보를 제공한다
5. WHEN 사용자가 건의에 반응할 때 THE Dashboard_System SHALL 좋아요, 댓글 기능을 통해 시민 의견을 수집한다

### 요구사항 4

**사용자 스토리:** 관리자로서, 지역별 통계와 히트맵을 통해 위험 지역을 식별하고 개선 우선순위를 파악하고 싶습니다. 그래야 효율적인 예산 배정과 정책 수립이 가능합니다.

#### 승인 기준

1. WHEN 지역을 선택할 때 THE Dashboard_System SHALL 해당 지역의 횡단보도 수, 신호등 설치율, 사고 건수, 사망자 수를 실시간으로 계산하여 표시한다
2. WHEN 히트맵을 표시할 때 THE Dashboard_System SHALL 사고 밀도에 따라 색상 강도를 조절하여 위험 지역을 시각적으로 구분한다
3. WHEN 개선 우선순위를 계산할 때 THE Dashboard_System SHALL 사고 빈도, 신호등 미설치 여부, 시민 건의 수를 종합하여 점수를 산정한다
4. WHEN 우선순위 목록을 표시할 때 THE Dashboard_System SHALL 상위 위험 지역을 점수 순으로 정렬하고 개선 방안을 제안한다

### 요구사항 5

**사용자 스토리:** 시스템 사용자로서, 횡단보도와 신호등 데이터를 정확하게 파싱하고 MySQL에 저장하고 싶습니다. 그래야 분석의 기초 데이터가 신뢰할 수 있습니다.

#### 승인 기준

1. WHEN CSV 파일을 업로드할 때 THE Dashboard_System SHALL 한글 인코딩을 올바르게 처리하여 데이터를 파싱한다
2. WHEN 횡단보도 데이터를 처리할 때 THE Dashboard_System SHALL 위경도, 음향신호기 설치여부, 보행자신호등 유무 등 필수 필드를 검증한다
3. WHEN 신호등 데이터를 처리할 때 THE Dashboard_System SHALL 잔여시간표시기, 음향신호기, 보행자작동신호기 정보를 정확히 추출한다
4. WHEN 데이터를 저장할 때 THE Dashboard_System SHALL MySQL 데이터베이스 테이블에 정규화된 구조로 저장한다
5. WHEN Spring Boot 애플리케이션이 시작될 때 THE Dashboard_System SHALL MySQL 연결을 설정하고 데이터 접근 계층을 초기화한다

### 요구사항 6

**사용자 스토리:** 분석 엔진 사용자로서, 시설 취약성과 사고 위험도를 결합한 개선 우선순위 점수를 계산하고 싶습니다. 그래야 객관적인 기준으로 개선 대상을 선정할 수 있습니다.

#### 승인 기준

1. WHEN 취약성 점수를 계산할 때 THE Dashboard_System SHALL 음향신호기, 잔여시간표시기, 보행자작동신호기 미설치 여부를 가중치와 함께 합산한다
2. WHEN 위험도 점수를 계산할 때 THE Dashboard_System SHALL 반경 100m 내 사고다발지역과의 거리를 고려하여 점수를 산정한다
3. WHEN 최종 우선순위를 결정할 때 THE Dashboard_System SHALL 취약성 점수와 위험도 점수를 결합하여 종합 점수를 계산한다
4. WHEN 개선 추천을 제공할 때 THE Dashboard_System SHALL 가장 부족한 시설을 우선순위로 제안한다

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

**사용자 스토리:** 웹 애플리케이션 사용자로서, 세션 기반 인증을 통해 안전하고 편리하게 로그인하고 싶습니다. 그래야 프론트엔드와 백엔드 간 원활한 인증 상태 관리가 가능합니다.

#### 승인 기준

1. WHEN 사용자가 로그인할 때 THE Dashboard_System SHALL 사용자 정보를 서버 세션에 저장하고 세션 ID를 쿠키로 전송한다
2. WHEN 인증이 필요한 API를 호출할 때 THE Dashboard_System SHALL 세션 쿠키를 검증하여 사용자 인증 상태를 확인한다
3. WHEN 사용자가 로그아웃할 때 THE Dashboard_System SHALL 서버 세션을 무효화하고 클라이언트 쿠키를 삭제한다
4. WHEN 세션이 만료될 때 THE Dashboard_System SHALL 자동으로 로그아웃 처리하고 로그인 페이지로 리다이렉트한다
5. WHEN 프론트엔드에서 인증 상태를 확인할 때 THE Dashboard_System SHALL 현재 세션의 사용자 정보와 권한을 반환한다

### 요구사항 9

**사용자 스토리:** 데이터 분석가로서, 월별 사고 데이터를 기반으로 미래 사고 위험도를 예측하고 신호등 설치 효과를 시뮬레이션하고 싶습니다. 그래야 예방적 안전 정책을 수립할 수 있습니다.

#### 승인 기준

1. WHEN 사고 예측 분석을 요청할 때 THE Dashboard_System SHALL 과거 월별 사고 데이터와 계절성을 분석하여 향후 3개월간 사고 위험도를 예측한다
2. WHEN 신호등 설치 시뮬레이션을 수행할 때 THE Dashboard_System SHALL 특정 지역에 신호등 설치 시 예상되는 사고 감소 효과를 모델링한다
3. WHEN 예측 결과를 시각화할 때 THE Dashboard_System SHALL 위험도 예측 지도, 월별 트렌드 차트, 신뢰구간을 포함한 예측 그래프를 제공한다
4. WHEN 정확도를 검증할 때 THE Dashboard_System SHALL 예측 모델의 성능 지표와 과거 예측 대비 실제 결과를 비교 분석한다

### 요구사항 10

**사용자 스토리:** 교통 정책 담당자로서, 예산 대비 최적의 신호등 설치 계획을 수립하고 투자 우선순위를 결정하고 싶습니다. 그래야 한정된 예산으로 최대의 안전 효과를 달성할 수 있습니다.

#### 승인 기준

1. WHEN 투자 우선순위 분석을 요청할 때 THE Dashboard_System SHALL 사고 위험도, 설치 비용, 예상 효과를 종합하여 ROI 기반 우선순위를 계산한다
2. WHEN 예산 시나리오를 설정할 때 THE Dashboard_System SHALL 주어진 예산 범위 내에서 최적의 신호등 설치 조합을 추천한다
3. WHEN 효과 시뮬레이션을 수행할 때 THE Dashboard_System SHALL 제안된 설치 계획의 예상 사고 감소 효과와 비용 대비 편익을 계산한다
4. WHEN 결과를 보고할 때 THE Dashboard_System SHALL 투자 계획서, 예상 효과 보고서, 단계별 실행 로드맵을 자동 생성한다

### 요구사항 11

**사용자 스토리:** 시민 안전 모니터링 담당자로서, 실시간 사고 알림과 위험 지역 모니터링을 통해 신속한 대응을 하고 싶습니다. 그래야 사고 발생 시 즉각적인 안전 조치를 취할 수 있습니다.

#### 승인 기준

1. WHEN 사고 데이터가 업데이트될 때 THE Dashboard_System SHALL 새로운 사고 발생 시 관련 담당자에게 실시간 알림을 발송한다
2. WHEN 위험 임계치를 초과할 때 THE Dashboard_System SHALL 특정 지역의 월별 사고 건수가 평균 대비 일정 수준을 초과하면 경고 알림을 생성한다
3. WHEN 모니터링 대시보드를 표시할 때 THE Dashboard_System SHALL 실시간 사고 현황, 위험 지역 순위, 대응 필요 지역을 한눈에 볼 수 있게 표시한다
4. WHEN 대응 이력을 관리할 때 THE Dashboard_System SHALL 사고 발생 후 취해진 조치, 개선 사항, 효과 측정 결과를 기록하고 추적한다