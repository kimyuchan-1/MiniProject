# 요구사항 문서

## 소개

횡단보도 신호등 설치 현황과 보행 안전 리스크를 분석하는 대시보드 시스템입니다. 횡단보도/신호등 시설물 분포와 보행자 사고 다발지를 한 화면에서 겹쳐 보여주고, 시설 취약성과 사고 위험을 결합하여 개선 우선순위 후보 지점을 식별하는 서비스입니다.

## 용어 정의

- **Dashboard_System**: 횡단보도 안전 분석 대시보드 시스템 (Spring Boot 기반)
- **MySQL_Database**: 횡단보도, 신호등, 사고 데이터를 저장하는 MySQL 데이터베이스
- **Crosswalk_Data**: 횡단보도 위치, 보행자신호등 유무, 음향신호기 설치여부 등의 정보
- **Signal_Data**: 신호등 상세 정보 (잔여시간표시기, 음향신호기, 보행자작동신호기 등)
- **Accident_Hotspot**: 최근 3년 기준 보행자 교통사고 다발지역
- **Vulnerability_Score**: 시설 취약성을 수치화한 점수
- **Risk_Analysis**: 사고 위험도와 시설 취약성을 결합한 분석
- **Improvement_Priority**: 개선 우선순위 점수
- **REST_API**: Spring Boot에서 제공하는 RESTful API 엔드포인트

## 요구사항

### 요구사항 1

**사용자 스토리:** 관리자로서, 전체 횡단보도와 신호등 현황을 한눈에 파악하고 싶습니다. 그래야 전반적인 안전 시설 상태를 이해할 수 있습니다.

#### 승인 기준

1. WHEN 대시보드에 접근할 때 THE Dashboard_System SHALL 전체 횡단보도 수, 보행자 신호등 설치 비율, 음향신호기 미설치 비율, 잔여시간표시기 미설치 비율을 표시한다
2. WHEN 개요 카드를 표시할 때 THE Dashboard_System SHALL 최근 3년 보행자 사고 다발지역 수를 구/동별로 집계하여 상위 지역을 표시한다
3. WHEN 통계 데이터를 계산할 때 THE Dashboard_System SHALL 실시간으로 데이터베이스에서 최신 정보를 조회하여 정확한 수치를 제공한다

### 요구사항 2

**사용자 스토리:** 분석가로서, 지도에서 횡단보도, 신호등, 사고다발지역을 레이어별로 토글하며 시각적으로 분석하고 싶습니다. 그래야 지역별 패턴을 파악할 수 있습니다.

#### 승인 기준

1. WHEN 지도 화면을 로드할 때 THE Dashboard_System SHALL 횡단보도, 신호등, 사고다발지역을 각각 다른 레이어로 표시한다
2. WHEN 사용자가 레이어 토글을 조작할 때 THE Dashboard_System SHALL 선택된 레이어만 지도에 표시하고 나머지는 숨긴다
3. WHEN 지도 요소를 클릭할 때 THE Dashboard_System SHALL 우측 패널에 해당 시설의 상세 속성 정보를 표시한다
4. WHEN 시설 정보를 표시할 때 THE Dashboard_System SHALL 주변 위험지표와 개선 후보 점수를 함께 제공한다

### 요구사항 3

**사용자 스토리:** 정책 담당자로서, 구/동별 취약시설 비율과 사고다발지 밀도의 상관관계를 분석하고 싶습니다. 그래야 효과적인 개선 정책을 수립할 수 있습니다.

#### 승인 기준

1. WHEN 분석 탭에 접근할 때 THE Dashboard_System SHALL 구/동별 취약시설 비율과 사고다발지 밀도를 산점도로 표시한다
2. WHEN 산점도를 생성할 때 THE Dashboard_System SHALL X축에 취약시설 비율, Y축에 사고다발지 밀도를 배치하여 상관관계를 시각화한다
3. WHEN 시간신호 데이터가 존재할 때 THE Dashboard_System SHALL 녹색시간과 적색시간의 분포를 히스토그램으로 표시한다

### 요구사항 4

**사용자 스토리:** 현장 관리자로서, 개선이 가장 시급한 상위 20곳의 목록을 확인하고 필터링하고 싶습니다. 그래야 우선순위에 따라 작업을 계획할 수 있습니다.

#### 승인 기준

1. WHEN 개선 후보 테이블을 요청할 때 THE Dashboard_System SHALL 상위 20곳의 개선 후보 지점을 점수 순으로 정렬하여 표시한다
2. WHEN 테이블 필터를 적용할 때 THE Dashboard_System SHALL 점수, 구, 취약항목별로 결과를 필터링한다
3. WHEN 정렬 옵션을 변경할 때 THE Dashboard_System SHALL 선택된 기준에 따라 테이블을 재정렬한다

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