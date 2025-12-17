# 설계 문서

## 개요

횡단보도 신호등 설치 현황과 보행 안전 리스크 분석 대시보드는 Spring Boot 백엔드와 React 프론트엔드로 구성된 웹 애플리케이션입니다. MySQL 데이터베이스에 저장된 횡단보도, 신호등, 사고다발지역 데이터를 분석하여 개선 우선순위를 제공합니다.

## 아키텍처

### 전체 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js Web  │    │  Spring Boot    │    │   MySQL DB      │
│   Frontend     │◄──►│   Backend       │◄──►│                 │
│                │    │                 │    │                 │
│ - Dashboard    │    │ - REST APIs     │    │ - crosswalks    │
│ - Map View     │    │ - Data Service  │    │ - signals       │
│ - Analytics    │    │ - Score Engine  │    │ - accidents     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 기술 스택

**백엔드 (Spring Boot)**
- Spring Boot 3.x
- Spring Data JPA
- MySQL Connector
- Spring Web (REST API)
- Jackson (JSON 처리)

**프론트엔드 (Next.js)**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Leaflet (지도 라이브러리)
- Chart.js (차트 라이브러리)
- Axios (HTTP 클라이언트)
- Tailwind CSS 또는 Material-UI (스타일링)

**데이터베이스**
- MySQL 8.0+

## 컴포넌트 및 인터페이스

### 백엔드 컴포넌트

#### 1. 데이터 모델 (Entity)
```java
@Entity
public class Crosswalk {
    @Id
    private String crosswalkId;
    private String city;
    private String district;
    private Double latitude;
    private Double longitude;
    private Boolean hasPedestrianSignal;
    private Boolean hasAudioSignal;
    private Boolean hasRemainingTimeDisplay;
    // ... 기타 필드
}

@Entity 
public class TrafficSignal {
    @Id
    private String signalId;
    private String city;
    private String district;
    private Double latitude;
    private Double longitude;
    private Boolean hasRemainingTimeDisplay;
    private Boolean hasAudioSignal;
    private Boolean hasPedestrianButton;
    // ... 기타 필드
}

@Entity
public class AccidentHotspot {
    @Id
    private Long id;
    private String region;
    private Double latitude;
    private Double longitude;
    private Integer accidentCount;
    private Integer year;
    // ... 기타 필드
}
```

#### 2. 서비스 계층
```java
@Service
public class SafetyAnalysisService {
    public DashboardStats getDashboardStats();
    public List<CrosswalkWithScore> getImprovementCandidates(int limit);
    public VulnerabilityScore calculateVulnerabilityScore(Crosswalk crosswalk);
    public RiskScore calculateRiskScore(Double lat, Double lng);
}

@Service
public class DataImportService {
    public void importCrosswalkData(MultipartFile csvFile);
    public void importSignalData(MultipartFile csvFile);
    public void importAccidentData(MultipartFile csvFile);
}
```

#### 3. REST API 컨트롤러
```java
@RestController
@RequestMapping("/api")
public class DashboardController {
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStats> getDashboardStats();
    
    @GetMapping("/map/crosswalks")
    public ResponseEntity<List<CrosswalkDto>> getCrosswalks();
    
    @GetMapping("/map/signals") 
    public ResponseEntity<List<SignalDto>> getSignals();
    
    @GetMapping("/map/accidents")
    public ResponseEntity<List<AccidentDto>> getAccidentHotspots();
    
    @GetMapping("/analysis/improvement-candidates")
    public ResponseEntity<List<ImprovementCandidate>> getImprovementCandidates();
    
    @GetMapping("/analysis/correlation")
    public ResponseEntity<CorrelationData> getVulnerabilityAccidentCorrelation();
}
```

### 프론트엔드 컴포넌트 (Next.js)

#### 1. 페이지 구조 (App Router)
```typescript
// app/page.tsx - 메인 대시보드 페이지
export default function Dashboard() {
  return (
    <div className="dashboard">
      <StatsOverview />
      <MapView />
      <AnalyticsPanel />
    </div>
  );
}

// app/analysis/page.tsx - 분석 페이지
export default function AnalysisPage() {
  return (
    <div className="analysis">
      <CorrelationChart />
      <ImprovementTable />
    </div>
  );
}
```

#### 2. 지도 컴포넌트
```typescript
'use client';

interface LayerState {
  crosswalks: boolean;
  signals: boolean;
  accidents: boolean;
}

const MapView: React.FC = () => {
  const [layers, setLayers] = useState<LayerState>({
    crosswalks: true,
    signals: true,
    accidents: true
  });
  
  return (
    <div className="map-container">
      <LayerToggle layers={layers} onToggle={setLayers} />
      <LeafletMap>
        {layers.crosswalks && <CrosswalkLayer />}
        {layers.signals && <SignalLayer />}
        {layers.accidents && <AccidentLayer />}
      </LeafletMap>
      <DetailPanel />
    </div>
  );
};
```

#### 3. API 라우트 (Next.js API Routes)
```typescript
// app/api/dashboard/stats/route.ts
export async function GET() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/dashboard/stats`);
  const data = await response.json();
  return Response.json(data);
}

// app/api/map/crosswalks/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bounds = searchParams.get('bounds');
  
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/map/crosswalks?bounds=${bounds}`
  );
  const data = await response.json();
  return Response.json(data);
}
```
```

## 데이터 모델

### MySQL 테이블 구조

#### crosswalks 테이블
```sql
CREATE TABLE crosswalks (
    crosswalk_id VARCHAR(50) PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    road_name VARCHAR(200),
    address VARCHAR(500),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    has_pedestrian_signal BOOLEAN DEFAULT FALSE,
    has_audio_signal BOOLEAN DEFAULT FALSE,
    has_remaining_time_display BOOLEAN DEFAULT FALSE,
    has_braille_block BOOLEAN DEFAULT FALSE,
    green_time INT,
    red_time INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude),
    INDEX idx_city_district (city, district)
);
```

#### traffic_signals 테이블
```sql
CREATE TABLE traffic_signals (
    signal_id VARCHAR(50) PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    road_name VARCHAR(200),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    has_remaining_time_display BOOLEAN DEFAULT FALSE,
    has_audio_signal BOOLEAN DEFAULT FALSE,
    has_pedestrian_button BOOLEAN DEFAULT FALSE,
    signal_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude),
    INDEX idx_city_district (city, district)
);
```

#### accident_hotspots 테이블
```sql
CREATE TABLE accident_hotspots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    region VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accident_count INT NOT NULL,
    year INT NOT NULL,
    severity_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude),
    INDEX idx_year (year)
);
```

### 데이터 전송 객체 (DTO)

#### DashboardStats
```java
public class DashboardStats {
    private long totalCrosswalks;
    private double pedestrianSignalRatio;
    private double audioSignalMissingRatio;
    private double remainingTimeDisplayMissingRatio;
    private long accidentHotspotCount;
    private List<RegionStats> topRiskyRegions;
}
```

#### ImprovementCandidate
```java
public class ImprovementCandidate {
    private String crosswalkId;
    private String address;
    private double latitude;
    private double longitude;
    private double facilityScore;      // 시설 취약 점수 (0-5점)
    private double riskScore;          // 위험 점수 (0-3점)
    private double totalScore;         // 최종 점수 = facilityScore * 0.4 + riskScore * 0.6
    private List<String> missingFeatures;
    private String recommendedImprovement;
    private double nearestAccidentDistance; // 가장 가까운 사고다발지까지 거리(m)
}

#### ScoreCalculationRequest
```java
public class ScoreCalculationRequest {
    private boolean hasAudioSignal;
    private boolean hasRemainingTimeDisplay;
    private boolean hasPedestrianButton;
    private boolean hasIntensiveLighting;
    private double latitude;
    private double longitude;
}
```

## 정확성 속성

*속성은 시스템의 모든 유효한 실행에서 참이어야 하는 특성이나 동작입니다. 본질적으로 시스템이 무엇을 해야 하는지에 대한 공식적인 명세입니다. 속성은 사람이 읽을 수 있는 명세와 기계가 검증할 수 있는 정확성 보장 사이의 다리 역할을 합니다.*

### 속성 1: 대시보드 통계 정확성
*모든* 데이터베이스 상태에 대해, 대시보드 통계 API를 호출했을 때 반환되는 횡단보도 수, 신호등 비율, 미설치 비율이 실제 데이터베이스 내용과 일치해야 한다
**검증: 요구사항 1.1, 1.2, 1.3**

### 속성 2: 데이터 일관성
*모든* 데이터베이스 업데이트 후, 즉시 조회한 통계가 변경된 데이터를 반영해야 한다
**검증: 요구사항 1.3**

### 속성 3: 레이어 토글 동작
*모든* 레이어 토글 조합에 대해, 선택된 레이어만 지도 API 응답에 포함되고 선택되지 않은 레이어는 제외되어야 한다
**검증: 요구사항 2.2**

### 속성 4: 지도 요소 상세 정보
*모든* 지도 요소 클릭에 대해, 해당 요소의 상세 정보와 주변 위험지표, 개선 후보 점수가 응답에 포함되어야 한다
**검증: 요구사항 2.3, 2.4**

### 속성 5: 산점도 축 배치
*모든* 구/동별 데이터에 대해, 산점도 생성 시 X축은 취약시설 비율, Y축은 사고다발지 밀도로 올바르게 배치되어야 한다
**검증: 요구사항 3.2**

### 속성 6: 개선 후보 정렬 및 제한
*모든* 개선 후보 데이터에 대해, 상위 20곳을 요청했을 때 점수 순으로 정렬된 최대 20개의 결과가 반환되어야 한다
**검증: 요구사항 4.1**

### 속성 7: 테이블 필터링
*모든* 필터 조건에 대해, 적용된 필터 기준(점수, 구, 취약항목)을 만족하는 결과만 반환되어야 한다
**검증: 요구사항 4.2**

### 속성 8: 테이블 정렬
*모든* 정렬 기준에 대해, 선택된 기준에 따라 올바른 순서로 정렬된 결과가 반환되어야 한다
**검증: 요구사항 4.3**

### 속성 9: CSV 파싱 라운드트립
*모든* 유효한 횡단보도/신호등 데이터에 대해, CSV로 내보낸 후 다시 파싱했을 때 원본과 동일한 데이터가 복원되어야 한다
**검증: 요구사항 5.1, 5.2, 5.3**

### 속성 10: 데이터 저장 무결성
*모든* 입력 데이터에 대해, MySQL에 저장한 후 조회했을 때 원본 데이터와 일치해야 한다
**검증: 요구사항 5.4**

### 속성 11: 취약성 점수 계산
*모든* 시설 데이터에 대해, 취약성 점수는 다음 가중치로 계산되어야 한다: 음향신호기 없음 +2, 잔여시간표시기 없음 +1, 보행자작동신호기 없음 +1, 집중조명 없음 +1
**검증: 요구사항 6.1**

### 속성 12: 위험도 점수 거리 기반 계산
*모든* 위치와 사고다발지역 데이터에 대해, 위험도 점수는 거리별 가중치로 계산되어야 한다: 0-100m +3, 100-300m +2, 300-500m +1
**검증: 요구사항 6.2**

### 속성 13: 종합 점수 결합
*모든* 취약성 점수와 위험도 점수에 대해, 종합 점수는 (시설취약점수 × 0.4) + (위험점수 × 0.6) 공식으로 계산되어야 한다
**검증: 요구사항 6.3**

### 속성 14: 개선 추천 우선순위
*모든* 시설 상태에 대해, 개선 추천은 가장 부족한 시설을 우선순위로 제안해야 한다
**검증: 요구사항 6.4**

### 속성 15: 로딩 상태 표시
*모든* 데이터 로딩 요청에 대해, API 응답에 로딩 상태 정보가 포함되어야 한다
**검증: 요구사항 7.3**

## 오류 처리

### 데이터 검증 오류
- CSV 파일 형식 오류 시 명확한 오류 메시지 제공
- 필수 필드 누락 시 구체적인 필드명과 함께 오류 반환
- 위경도 범위 초과 시 유효 범위 안내

### 데이터베이스 오류
- MySQL 연결 실패 시 재시도 로직 구현
- 트랜잭션 롤백을 통한 데이터 무결성 보장
- 쿼리 타임아웃 시 적절한 오류 응답

### API 오류
- 잘못된 요청 파라미터에 대한 400 Bad Request
- 존재하지 않는 리소스에 대한 404 Not Found
- 서버 내부 오류에 대한 500 Internal Server Error
- 각 오류에 대한 구조화된 JSON 응답

### 프론트엔드 오류
- 네트워크 오류 시 사용자 친화적 메시지 표시
- 지도 로딩 실패 시 대체 UI 제공
- 차트 렌더링 오류 시 텍스트 기반 대안 표시

## 테스트 전략

### 이중 테스트 접근법

이 시스템은 단위 테스트와 속성 기반 테스트를 모두 포함하는 포괄적인 테스트 전략을 사용합니다:

**단위 테스트**는 다음을 검증합니다:
- 특정 예제와 엣지 케이스의 올바른 동작
- 컴포넌트 간 통합 지점
- 구체적인 오류 조건과 예외 처리

**속성 기반 테스트**는 다음을 검증합니다:
- 모든 입력에 대해 성립해야 하는 범용 속성
- 시스템의 일반적인 정확성 보장
- 예상치 못한 입력 조합에 대한 견고성

### 속성 기반 테스트 요구사항

- **테스트 라이브러리**: Java용 jqwik 라이브러리 사용
- **반복 횟수**: 각 속성 기반 테스트는 최소 100회 반복 실행
- **태그 형식**: 각 속성 기반 테스트는 다음 형식으로 태그 지정
  ```java
  /**
   * Feature: pedestrian-safety-dashboard, Property 1: 대시보드 통계 정확성
   */
  ```
- **구현 규칙**: 각 정확성 속성은 단일 속성 기반 테스트로 구현

### 단위 테스트 요구사항

- **프레임워크**: JUnit 5와 Spring Boot Test 사용
- **모킹**: Mockito를 사용한 의존성 모킹
- **데이터베이스**: H2 인메모리 데이터베이스를 사용한 통합 테스트
- **커버리지**: 핵심 비즈니스 로직에 대한 높은 코드 커버리지 유지

### 테스트 데이터 생성

- **지리적 데이터**: 대한민국 내 유효한 위경도 범위 내에서 생성
- **한글 데이터**: UTF-8 인코딩을 고려한 한글 주소 및 지명 생성
- **시설 데이터**: 실제 횡단보도/신호등 설치 패턴을 반영한 현실적인 데이터
- **사고 데이터**: 통계적으로 유의미한 사고 발생 패턴 시뮬레이션
### 점수 계산 알고리즘 상세

#### 시설 취약 점수 (Facility Vulnerability Score)
```java
public double calculateFacilityScore(CrosswalkFacilities facilities) {
    double score = 0.0;
    
    if (!facilities.hasAudioSignal()) score += 2.0;        // 음향신호기 없음
    if (!facilities.hasRemainingTimeDisplay()) score += 1.0; // 잔여시간표시기 없음
    if (!facilities.hasPedestrianButton()) score += 1.0;    // 보행자작동신호기 없음
    if (!facilities.hasIntensiveLighting()) score += 1.0;   // 집중조명 없음
    
    return score; // 최대 5점
}
```

#### 위험 점수 (Risk Score)
```java
public double calculateRiskScore(double latitude, double longitude, List<AccidentHotspot> hotspots) {
    double maxRiskScore = 0.0;
    
    for (AccidentHotspot hotspot : hotspots) {
        double distance = calculateHaversineDistance(latitude, longitude, 
                                                   hotspot.getLatitude(), hotspot.getLongitude());
        
        if (distance <= 100) {
            maxRiskScore = Math.max(maxRiskScore, 3.0);
        } else if (distance <= 300) {
            maxRiskScore = Math.max(maxRiskScore, 2.0);
        } else if (distance <= 500) {
            maxRiskScore = Math.max(maxRiskScore, 1.0);
        }
    }
    
    return maxRiskScore; // 최대 3점
}
```

#### 최종 종합 점수
```java
public double calculateTotalScore(double facilityScore, double riskScore) {
    return (facilityScore * 0.4) + (riskScore * 0.6);
}
```

### 확장 기능 설계

#### 스쿨존 연계 분석
- 어린이 보호구역 데이터와 연계하여 스쿨존 내 횡단보도 우선순위 강화
- 스쿨존 내 시설은 가중치 1.5배 적용

#### 스마트 횡단보도 레이어
- 바닥형 신호등, 스마트 보행신호기 등 첨단 시설 현황 표시
- 별도 레이어로 구분하여 시각화

#### 개선 시나리오 분석
- What-if 분석: 특정 시설 설치 시 점수 변화 시뮬레이션
- 예산 대비 효과 분석 기능