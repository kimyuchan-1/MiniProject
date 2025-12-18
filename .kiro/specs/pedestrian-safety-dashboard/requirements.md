# 요구사항 문서

## 소개

횡단보도 신호등 설치 현황과 보행 안전 리스크를 분석하는 대시보드 시스템입니다. 전국 지도에서 사고 다발지역을 히트맵으로 표시하고, 시도→구→상세 지역으로 단계적 확대가 가능한 인터랙티브 지도를 제공합니다. 횡단보도 신호등 유무에 따른 보행자 사고 효과를 분석하고, 사용자가 신호등 설치를 건의할 수 있는 커뮤니티 기능을 포함합니다.

## 용어 정의

- **Dashboard_System**: 횡단보도 안전 분석 대시보드 시스템 (Spring Boot 기반)
- **MySQL_Database**: 횡단보도, 신호등, 사고 데이터를 저장하는 MySQL 데이터베이스
- **Interactive_Map**: 전국→시도→구 단계별 확대가 가능한 인터랙티브 지도
- **Heatmap_Layer**: 사고 다발지역을 밀도로 표시하는 히트맵 레이어
- **Crosswalk_Data**: 횡단보도 위치, 보행자신호등 유무, 음향신호기 설치여부 등의 정보
- **Signal_Data**: 신호등 상세 정보 (잔여시간표시기, 음향신호기, 보행자작동신호기 등)
- **Accident_Hotspot**: 최근 3년 기준 보행자 교통사고 다발지역
- **Signal_Effect_Analysis**: 신호등 유무에 따른 보행자 사고 효과 분석
- **Suggestion_Board**: 사용자가 신호등 설치를 건의할 수 있는 게시판
- **Regional_Statistics**: 선택된 지역의 실시간 통계 데이터
- **REST_API**: Spring Boot에서 제공하는 RESTful API 엔드포인트

## 요구사항

### 요구사항 1

**사용자 스토리:** 분석가로서, 전국 지도에서 사고 다발지역을 히트맵으로 확인하고 지역별로 단계적 확대를 통해 상세 분석을 하고 싶습니다. 그래야 지역별 안전 현황을 체계적으로 파악할 수 있습니다.

#### 승인 기준

1. WHEN 대시보드에 접근할 때 THE Dashboard_System SHALL 전국 지도에 사고 다발지역을 히트맵으로 표시한다
2. WHEN 시도를 클릭할 때 THE Dashboard_System SHALL 해당 시도 지도로 확대하고 시도별 통계를 업데이트한다
3. WHEN 구를 클릭할 때 THE Dashboard_System SHALL 해당 구 지도로 확대하고 구별 상세 통계를 업데이트한다
4. WHEN 지역이 변경될 때 THE Dashboard_System SHALL 선택된 지역의 횡단보도 수, 신호등 설치 비율, 사고 건수를 실시간으로 업데이트한다

### 요구사항 2

**사용자 스토리:** 연구자로서, 횡단보도에 신호등 유무에 따른 보행자 사고 발생률의 차이를 분석하고 싶습니다. 그래야 신호등 설치의 효과를 정량적으로 입증할 수 있습니다.

#### 승인 기준

1. WHEN 신호등 효과 분석을 요청할 때 THE Dashboard_System SHALL 신호등이 있는 횡단보도와 없는 횡단보도 주변의 사고 발생률을 비교 분석한다
2. WHEN 분석 결과를 표시할 때 THE Dashboard_System SHALL 신호등 유무별 사고 건수, 사고율, 통계적 유의성을 제공한다
3. WHEN 지역별 효과를 분석할 때 THE Dashboard_System SHALL 선택된 지역 내에서 신호등 설치 효과를 별도로 계산한다
4. WHEN 시각화를 제공할 때 THE Dashboard_System SHALL 신호등 유무별 사고 분포를 차트와 지도로 표시한다

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