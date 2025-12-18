# 설계 문서

## 개요

횡단보도 신호등 설치 현황과 보행 안전 리스크 분석 대시보드는 Spring Boot 백엔드와 Next.js 프론트엔드로 구성된 웹 애플리케이션입니다. 전국→시도→구 단계별 확대가 가능한 인터랙티브 지도와 히트맵을 통해 사고 다발지역을 시각화하고, 신호등 유무에 따른 사고 효과를 분석합니다. 시민 참여형 건의 게시판을 통해 신호등 설치 요청을 수집하고 관리합니다.

## 아키텍처

### 전체 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js Web  │    │  Spring Boot    │    │   MySQL DB      │
│   Frontend     │◄──►│   Backend       │◄──►│                 │
│                │    │                 │    │                 │
│ - Interactive  │    │ - REST APIs     │    │ - crosswalks    │
│   Map (3-Level)│    │ - Signal Effect │    │ - signals       │
│ - Heatmap      │    │   Analysis      │    │ - accidents     │
│ - Suggestion   │    │ - Suggestion    │    │ - suggestions   │
│   Board        │    │   Management    │    │ - users         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 기술 스택

**백엔드 (Spring Boot)**
- Spring Boot 3.x
- Spring Data JPA
- MySQL Connector
- Spring Web (REST API)
- Spring Security
- Spring OAuth2 Client
- Lombok
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
@Table(name = "crosswalks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Crosswalk {
    @Id
    @Column(name = "cw_uid")
    private String cwUid;
    
    private String sido;
    private String sigungu;
    private String address;
    
    @Column(name = "crosswalk_type")
    private Integer crosswalkType;
    
    private Integer highland;
    
    @Column(name = "crosswalk_lat", precision = 10, scale = 8)
    private BigDecimal crosswalkLat;
    
    @Column(name = "crosswalk_lon", precision = 11, scale = 8)
    private BigDecimal crosswalkLon;
    
    private Integer roadnum;
    
    @Column(name = "crosswalk_width", precision = 5, scale = 2)
    private BigDecimal crosswalkWidth;
    
    @Column(name = "crosswalk_length", precision = 5, scale = 2)
    private BigDecimal crosswalkLength;
    
    private Integer signal;           // 보행자신호등유무
    private Integer button;           // 보행자작동신호기유무
    
    @Column(name = "sound_signal")
    private Integer soundSignal;      // 음향신호기설치유무
    
    private Integer bump;             // 보도턱낮춤여부
    
    @Column(name = "braille_block")
    private Integer brailleBlock;     // 점자블록유무
    
    private Integer spotlight;        // 집중조명시설유무
    
    @Column(name = "org_code")
    private Integer orgCode;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

@Entity
@Table(name = "traffic_signals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficSignal {
    @Id
    @Column(name = "sg_uid")
    private String sgUid;
    
    private String sido;
    private String sigungu;
    
    @Column(name = "road_type")
    private Integer roadType;
    
    @Column(name = "road_direction")
    private Integer roadDirection;
    
    private String address;
    
    @Column(name = "signal_lat", precision = 10, scale = 8)
    private BigDecimal signalLat;
    
    @Column(name = "signal_lon", precision = 11, scale = 8)
    private BigDecimal signalLon;
    
    @Column(name = "road_shape")
    private Integer roadShape;
    
    @Column(name = "main_road")
    private Integer mainRoad;
    
    @Column(name = "signal_type")
    private Integer signalType;
    
    private Integer button;           // 보행자작동신호기유무
    
    @Column(name = "remain_time")
    private Integer remainTime;       // 잔여시간표시기유무
    
    @Column(name = "sound_signal")
    private Integer soundSignal;      // 시각장애인용음향신호기유무
    
    @Column(name = "org_code")
    private Integer orgCode;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

@Entity
@Table(name = "accident_hotspots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccidentHotspot {
    @Id
    @Column(name = "accident_id")
    private Long accidentId;
    
    private Integer year;
    
    @Column(name = "district_code")
    private Long districtCode;
    
    private String detail;
    
    @Column(name = "accident_count")
    private Integer accidentCount;
    
    @Column(name = "casualty_count")
    private Integer casualtyCount;
    
    @Column(name = "fatality_count")
    private Integer fatalityCount;
    
    @Column(name = "serious_injury_count")
    private Integer seriousInjuryCount;
    
    @Column(name = "minor_injury_count")
    private Integer minorInjuryCount;
    
    @Column(name = "reported_injury_count")
    private Integer reportedInjuryCount;
    
    @Column(name = "accident_lon", precision = 11, scale = 8)
    private BigDecimal accidentLon;
    
    @Column(name = "accident_lat", precision = 10, scale = 8)
    private BigDecimal accidentLat;
    
    @Column(name = "hotspot_polygon", columnDefinition = "JSON")
    private String hotspotPolygon;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

@Entity
@Table(name = "crosswalk_signal_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrosswalkSignalMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "cw_uid")
    private String cwUid;
    
    @Column(name = "sg_uid")
    private String sgUid;
    
    @Column(name = "distance_m", precision = 8, scale = 3)
    private BigDecimal distanceM;
    
    @Column(precision = 6, scale = 6)
    private BigDecimal confidence;
    
    private String sido;
    private String sigungu;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

@Entity
@Table(name = "districts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class District {
    @Id
    @Column(name = "district_code")
    private Long districtCode;
    
    @Column(name = "district_name")
    private String districtName;
    
    private Integer available;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

@Entity
@Table(name = "suggestions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Suggestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "location_lat", precision = 10, scale = 8)
    private BigDecimal locationLat;
    
    @Column(name = "location_lon", precision = 11, scale = 8)
    private BigDecimal locationLon;
    
    private String address;
    private String sido;
    private String sigungu;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "suggestion_type")
    private SuggestionType suggestionType;
    
    @Enumerated(EnumType.STRING)
    private SuggestionStatus status;
    
    @Column(name = "priority_score", precision = 5, scale = 2)
    private BigDecimal priorityScore;
    
    @Column(name = "like_count")
    private Integer likeCount = 0;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;
    
    @Column(name = "admin_id")
    private Long adminId;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", insertable = false, updatable = false)
    private User admin;
}

@Entity
@Table(name = "suggestion_likes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuggestionLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "suggestion_id")
    private Long suggestionId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suggestion_id", insertable = false, updatable = false)
    private Suggestion suggestion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
}

@Entity
@Table(name = "suggestion_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuggestionComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "suggestion_id")
    private Long suggestionId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "parent_id")
    private Long parentId;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suggestion_id", insertable = false, updatable = false)
    private Suggestion suggestion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private SuggestionComment parent;
}

// Enum 클래스들
@Getter
@RequiredArgsConstructor
public enum SuggestionType {
    SIGNAL("신호등 설치"),
    CROSSWALK("횡단보도 설치"),
    FACILITY("기타 시설");
    
    private final String description;
}

@Getter
@RequiredArgsConstructor
public enum SuggestionStatus {
    PENDING("접수"),
    REVIEWING("검토중"),
    APPROVED("승인"),
    REJECTED("반려"),
    COMPLETED("완료");
    
    private final String description;
}
```

#### 2. 서비스 계층
```java
@Service
public class SafetyAnalysisService {
    public DashboardStats getDashboardStats(String sido, String sigungu);
    public List<CrosswalkWithScore> getImprovementCandidates(String sido, String sigungu, int limit);
    public VulnerabilityScore calculateVulnerabilityScore(Crosswalk crosswalk);
    public RiskScore calculateRiskScore(Double lat, Double lng);
    public SignalEffectAnalysis analyzeSignalEffect(String sido, String sigungu);
}

@Service
public class DataImportService {
    public void importCrosswalkData(MultipartFile csvFile);
    public void importSignalData(MultipartFile csvFile);
    public void importAccidentData(MultipartFile csvFile);
}

@Service
public class MapService {
    public List<AccidentHotspot> getAccidentHeatmapData(String sido, String sigungu);
    public List<Crosswalk> getCrosswalksByRegion(String sido, String sigungu);
    public List<TrafficSignal> getSignalsByRegion(String sido, String sigungu);
    public RegionalStatistics getRegionalStatistics(String sido, String sigungu);
}

@Service
public class SuggestionService {
    public Page<Suggestion> getSuggestions(Pageable pageable, SuggestionStatus status, String region);
    public Suggestion createSuggestion(CreateSuggestionRequest request, Long userId);
    public Suggestion updateSuggestionStatus(Long suggestionId, SuggestionStatus status, String adminResponse, Long adminId);
    public void likeSuggestion(Long suggestionId, Long userId);
    public void unlikeSuggestion(Long suggestionId, Long userId);
    public List<SuggestionComment> getComments(Long suggestionId);
    public SuggestionComment addComment(Long suggestionId, String content, Long userId, Long parentId);
    public SuggestionStatistics getSuggestionStatistics();
}
```

#### 3. REST API 컨트롤러
```java
@RestController
@RequestMapping("/api")
public class DashboardController {
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu);
    
    @GetMapping("/map/heatmap")
    public ResponseEntity<List<AccidentHotspot>> getAccidentHeatmap(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu);
    
    @GetMapping("/map/crosswalks")
    public ResponseEntity<List<Crosswalk>> getCrosswalks(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu);
    
    @GetMapping("/map/signals") 
    public ResponseEntity<List<TrafficSignal>> getSignals(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu);
    
    @GetMapping("/analysis/signal-effect")
    public ResponseEntity<SignalEffectAnalysis> getSignalEffectAnalysis(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu);
    
    @GetMapping("/analysis/improvement-candidates")
    public ResponseEntity<List<ImprovementCandidate>> getImprovementCandidates(
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu,
        @RequestParam(defaultValue = "20") int limit);
}

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {
    
    @GetMapping
    public ResponseEntity<Page<Suggestion>> getSuggestions(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
        @RequestParam(required = false) SuggestionStatus status,
        @RequestParam(required = false) String region);
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Suggestion> createSuggestion(
        @RequestBody @Valid CreateSuggestionRequest request,
        Authentication authentication);
    
    @GetMapping("/{id}")
    public ResponseEntity<Suggestion> getSuggestion(@PathVariable Long id);
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Suggestion> updateSuggestionStatus(
        @PathVariable Long id,
        @RequestBody @Valid UpdateSuggestionStatusRequest request,
        Authentication authentication);
    
    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> likeSuggestion(
        @PathVariable Long id,
        Authentication authentication);
    
    @DeleteMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unlikeSuggestion(
        @PathVariable Long id,
        Authentication authentication);
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<SuggestionComment>> getComments(@PathVariable Long id);
    
    @PostMapping("/{id}/comments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SuggestionComment> addComment(
        @PathVariable Long id,
        @RequestBody @Valid AddCommentRequest request,
        Authentication authentication);
    
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuggestionStatistics> getSuggestionStatistics();
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
    cw_uid VARCHAR(20) PRIMARY KEY,                    -- 횡단보도 고유 ID
    sido VARCHAR(50) NOT NULL,                         -- 시도
    sigungu VARCHAR(50) NOT NULL,                      -- 시군구
    address VARCHAR(500) NOT NULL,                     -- 주소
    crosswalk_type TINYINT NOT NULL,                   -- 횡단보도 종류 (1-4, 99)
    highland TINYINT DEFAULT 0,                        -- 고원식 적용 여부 (0/1)
    crosswalk_lat DECIMAL(10, 8) NOT NULL,             -- 위도
    crosswalk_lon DECIMAL(11, 8) NOT NULL,             -- 경도
    roadnum TINYINT,                                   -- 차로수
    crosswalk_width DECIMAL(5, 2),                     -- 횡단보도 폭(m)
    crosswalk_length DECIMAL(5, 2),                    -- 횡단보도 길이(m)
    signal TINYINT DEFAULT 0,                          -- 보행자신호등유무 (0/1)
    button TINYINT DEFAULT 0,                          -- 보행자작동신호기유무 (0/1)
    sound_signal TINYINT DEFAULT 0,                    -- 음향신호기설치유무 (0/1)
    bump TINYINT DEFAULT 0,                            -- 보도턱낮춤여부 (0/1)
    braille_block TINYINT DEFAULT 0,                   -- 점자블록유무 (0/1)
    spotlight TINYINT DEFAULT 0,                       -- 집중조명시설유무 (0/1)
    org_code INT,                                      -- 관리기관 코드
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (crosswalk_lat, crosswalk_lon),
    INDEX idx_region (sido, sigungu),
    INDEX idx_facilities (signal, sound_signal, button, spotlight)
);
```

#### traffic_signals 테이블
```sql
CREATE TABLE traffic_signals (
    sg_uid VARCHAR(20) PRIMARY KEY,                    -- 신호등 고유 ID
    sido VARCHAR(50) NOT NULL,                         -- 시도
    sigungu VARCHAR(50) NOT NULL,                      -- 시군구
    road_type TINYINT,                                 -- 도로 종류 (1-7, 99)
    road_direction TINYINT,                            -- 도로 방향 (1-3)
    address VARCHAR(500) NOT NULL,                     -- 주소
    signal_lat DECIMAL(10, 8) NOT NULL,                -- 위도
    signal_lon DECIMAL(11, 8) NOT NULL,                -- 경도
    road_shape TINYINT,                                -- 도로 형태 (1-2, 99)
    main_road TINYINT DEFAULT 0,                       -- 주도로 여부 (0/1)
    signal_type TINYINT,                               -- 신호등 종류 (1-7, 99)
    button TINYINT DEFAULT 0,                          -- 보행자작동신호기유무 (0/1)
    remain_time TINYINT DEFAULT 0,                     -- 잔여시간표시기유무 (0/1)
    sound_signal TINYINT DEFAULT 0,                    -- 시각장애인용음향신호기유무 (0/1)
    org_code INT,                                      -- 행정기관코드
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (signal_lat, signal_lon),
    INDEX idx_region (sido, sigungu),
    INDEX idx_features (button, remain_time, sound_signal)
);
```

#### accident_hotspots 테이블
```sql
CREATE TABLE accident_hotspots (
    accident_id BIGINT PRIMARY KEY,                    -- 사고 번호
    year SMALLINT NOT NULL,                            -- 사고 년도
    district_code BIGINT,                              -- 지역 구분 코드
    detail VARCHAR(200),                               -- 상세 지역
    accident_count SMALLINT NOT NULL,                  -- 사고건수
    casualty_count SMALLINT DEFAULT 0,                 -- 사상자수
    fatality_count SMALLINT DEFAULT 0,                 -- 사망자수
    serious_injury_count SMALLINT DEFAULT 0,           -- 중상자수
    minor_injury_count SMALLINT DEFAULT 0,             -- 경상자수
    reported_injury_count SMALLINT DEFAULT 0,          -- 부상신고자수
    accident_lon DECIMAL(11, 8) NOT NULL,              -- 사고 경도
    accident_lat DECIMAL(10, 8) NOT NULL,              -- 사고 위도
    hotspot_polygon JSON,                              -- 다발지역 폴리곤 (GeoJSON)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_location (accident_lat, accident_lon),
    INDEX idx_year (year),
    INDEX idx_district (district_code),
    INDEX idx_severity (fatality_count, serious_injury_count)
);
```

#### crosswalk_signal_mapping 테이블 (연결 관계)
```sql
CREATE TABLE crosswalk_signal_mapping (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cw_uid VARCHAR(20) NOT NULL,                       -- 횡단보도 ID
    sg_uid VARCHAR(20) NOT NULL,                       -- 신호등 ID
    distance_m DECIMAL(8, 3),                          -- 거리(m)
    confidence DECIMAL(6, 6),                          -- 가중치
    sido VARCHAR(50),                                  -- 시도
    sigungu VARCHAR(50),                               -- 시군구
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cw_uid) REFERENCES crosswalks(cw_uid),
    FOREIGN KEY (sg_uid) REFERENCES traffic_signals(sg_uid),
    INDEX idx_crosswalk (cw_uid),
    INDEX idx_signal (sg_uid),
    INDEX idx_distance (distance_m)
);
```

#### districts 테이블 (참조용)
```sql
CREATE TABLE districts (
    district_code BIGINT PRIMARY KEY,                  -- 지역 구분 코드
    district_name VARCHAR(200) NOT NULL,               -- 지역명
    available TINYINT DEFAULT 1,                       -- 유효여부 (0/1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (district_name)
);
```

#### suggestions 테이블 (건의사항)
```sql
CREATE TABLE suggestions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,                           -- 작성자 ID
    title VARCHAR(200) NOT NULL,                       -- 건의 제목
    content TEXT NOT NULL,                             -- 건의 내용
    location_lat DECIMAL(10, 8) NOT NULL,              -- 건의 위치 위도
    location_lon DECIMAL(11, 8) NOT NULL,              -- 건의 위치 경도
    address VARCHAR(500),                              -- 건의 위치 주소
    sido VARCHAR(50),                                  -- 시도
    sigungu VARCHAR(50),                               -- 시군구
    suggestion_type ENUM('SIGNAL', 'CROSSWALK', 'FACILITY') DEFAULT 'SIGNAL', -- 건의 유형
    status ENUM('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING', -- 처리 상태
    priority_score DECIMAL(5, 2) DEFAULT 0,           -- 우선순위 점수
    like_count INT DEFAULT 0,                          -- 좋아요 수
    view_count INT DEFAULT 0,                          -- 조회수
    admin_response TEXT,                               -- 관리자 답변
    admin_id BIGINT,                                   -- 처리 관리자 ID
    processed_at TIMESTAMP NULL,                       -- 처리 완료 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES users(id),
    INDEX idx_location (location_lat, location_lon),
    INDEX idx_region (sido, sigungu),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_priority (priority_score DESC)
);
```

#### suggestion_likes 테이블 (건의사항 좋아요)
```sql
CREATE TABLE suggestion_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    suggestion_id BIGINT NOT NULL,                     -- 건의사항 ID
    user_id BIGINT NOT NULL,                           -- 사용자 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (suggestion_id) REFERENCES suggestions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_suggestion (user_id, suggestion_id),
    INDEX idx_suggestion (suggestion_id)
);
```

#### suggestion_comments 테이블 (건의사항 댓글)
```sql
CREATE TABLE suggestion_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    suggestion_id BIGINT NOT NULL,                     -- 건의사항 ID
    user_id BIGINT NOT NULL,                           -- 작성자 ID
    content TEXT NOT NULL,                             -- 댓글 내용
    parent_id BIGINT NULL,                             -- 대댓글인 경우 부모 댓글 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (suggestion_id) REFERENCES suggestions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES suggestion_comments(id) ON DELETE CASCADE,
    INDEX idx_suggestion (suggestion_id),
    INDEX idx_created (created_at)
);
```

### 데이터 전송 객체 (DTO)

#### DashboardStats
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalCrosswalks;
    private double pedestrianSignalRatio;
    private double audioSignalMissingRatio;
    private double remainingTimeDisplayMissingRatio;
    private long accidentHotspotCount;
    private List<RegionStats> topRiskyRegions;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionStats {
    private String sido;
    private String sigungu;
    private long crosswalkCount;
    private long accidentCount;
    private double riskScore;
}
```

#### ImprovementCandidate
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImprovementCandidate {
    private String cwUid;              // 횡단보도 ID
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private double facilityScore;      // 시설 취약 점수 (0-5점)
    private double riskScore;          // 위험 점수 (0-3점)
    private double totalScore;         // 최종 점수 = facilityScore * 0.4 + riskScore * 0.6
    private List<String> missingFeatures;
    private String recommendedImprovement;
    private double nearestAccidentDistance; // 가장 가까운 사고다발지까지 거리(m)
    
    // 시설 현황
    private boolean hasSignal;         // 보행자신호등
    private boolean hasButton;         // 보행자작동신호기
    private boolean hasSoundSignal;    // 음향신호기
    private boolean hasSpotlight;      // 집중조명
    private boolean hasBrailleBlock;   // 점자블록
}
```

#### CrosswalkDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrosswalkDto {
    private String cwUid;
    private String sido;
    private String sigungu;
    private String address;
    private BigDecimal crosswalkLat;
    private BigDecimal crosswalkLon;
    private Integer signal;
    private Integer button;
    private Integer soundSignal;
    private Integer spotlight;
    private Integer brailleBlock;
    private Double facilityScore;
    private Double riskScore;
}
```

#### SignalDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalDto {
    private String sgUid;
    private String sido;
    private String sigungu;
    private String address;
    private BigDecimal signalLat;
    private BigDecimal signalLon;
    private Integer button;
    private Integer remainTime;
    private Integer soundSignal;
    private Integer signalType;
}
```

#### AccidentDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccidentDto {
    private Long accidentId;
    private Integer year;
    private String detail;
    private Integer accidentCount;
    private Integer fatalityCount;
    private Integer seriousInjuryCount;
    private BigDecimal accidentLat;
    private BigDecimal accidentLon;
    private String hotspotPolygon;
}
```

#### CorrelationData
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrelationData {
    private List<RegionCorrelation> regionData;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionCorrelation {
        private String regionName;
        private double vulnerabilityRatio;    // 취약시설 비율
        private double accidentDensity;       // 사고다발지 밀도
        private long totalCrosswalks;
        private long totalAccidents;
    }
}
```
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

## 보안 및 인증

### Spring Security 설정

#### 1. OAuth2 클라이언트 설정
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/dashboard/**").authenticated()
                .requestMatchers("/api/map/**").authenticated()
                .requestMatchers("/api/analysis/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService())
                )
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
            )
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        return http.build();
    }
    
    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        return new CustomOAuth2UserService();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

#### 2. 사용자 엔티티
```java
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    private String name;
    private String picture;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    private Provider provider;
    
    private String providerId;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN("ROLE_ADMIN", "관리자"),
    USER("ROLE_USER", "일반사용자");
    
    private final String key;
    private final String title;
}

@Getter
@RequiredArgsConstructor
public enum Provider {
    GOOGLE("google"),
    NAVER("naver"),
    KAKAO("kakao");
    
    private final String registrationId;
}
```

#### 3. OAuth2 사용자 서비스
```java
@Service
@RequiredArgsConstructor
@Transactional
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    
    private final UserRepository userRepository;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
        
        User user = saveOrUpdate(attributes);
        
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().getKey())),
                attributes.getAttributes(),
                attributes.getNameAttributeKey()
        );
    }
    
    private User saveOrUpdate(OAuthAttributes attributes) {
        User user = userRepository.findByEmail(attributes.getEmail())
                .map(entity -> entity.update(attributes.getName(), attributes.getPicture()))
                .orElse(attributes.toEntity());
        
        return userRepository.save(user);
    }
}
```

### API 접근 제어

#### 1. 역할 기반 접근 제어
- **ADMIN**: 모든 API 접근 가능, 데이터 임포트 기능
- **USER**: 대시보드 조회, 분석 기능만 접근 가능

#### 2. API 엔드포인트 보안
```java
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {
    
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        // 구현
    }
    
    @PostMapping("/admin/import/crosswalks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImportResult> importCrosswalks(@RequestParam MultipartFile file) {
        // 구현
    }
}
```

### 환경 설정

#### application.yml
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
          naver:
            client-id: ${NAVER_CLIENT_ID}
            client-secret: ${NAVER_CLIENT_SECRET}
            scope:
              - name
              - email
            authorization-grant-type: authorization_code
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
        provider:
          naver:
            authorization-uri: https://nid.naver.com/oauth2.0/authorize
            token-uri: https://nid.naver.com/oauth2.0/token
            user-info-uri: https://openapi.naver.com/v1/nid/me
            user-name-attribute: response
```