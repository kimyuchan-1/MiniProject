# 설계 문서

## 개요

시도별·시군구별·월별 보행자 사고 데이터 기반 교통 안전 분석 대시보드는 Next.js 프론트엔드와 Spring Boot 백엔드로 구성된 웹 애플리케이션입니다. 복잡한 기능보다는 핵심 가치를 제공하는 세 가지 주요 기능에 집중합니다: 1) 횡단보도 + 신호등 시각화, 2) 개선된 팝업, 3) 사고 히트맵. 프론트엔드에서 실시간으로 안전/위험 지표를 계산하여 백엔드 복잡성을 최소화합니다.

## 아키텍처

### 전체 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js Web  │    │  Spring Boot    │    │  Supabase DB    │
│   Frontend     │◄──►│   Backend       │◄──►│                 │
│                │    │                 │    │                 │
│ - Interactive  │    │ - REST APIs     │    │ - crosswalks    │
│   Map (Leaflet)│    │ - Data Import   │    │ - signals       │
│ - Enhanced     │    │ - CSV Processing│    │ - ACC (사고)    │
│   Popups       │    │ - Authentication│    │ - district_all  │
│ - Heatmap      │    │ - JWT Security  │    │ - suggestions   │
│ - Real-time    │    │ - Suggestion    │    │ - users         │
│   Calculations │    │   Management    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 기술 스택

**백엔드 (Spring Boot)**
- Spring Boot 3.x
- Spring Data JPA
- Supabase PostgreSQL Connector
- Spring Web (REST API)
- Spring Security
- Spring Security OAuth2 Client
- JJWT (JWT Library)
- Lombok
- Jackson (JSON 처리)

**프론트엔드 (Next.js)**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Leaflet (지도 라이브러리)
- Leaflet.heat (히트맵 플러그인)
- Axios (HTTP 클라이언트)
- Tailwind CSS (스타일링)

**데이터베이스**
- Supabase PostgreSQL

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
    
    @Column(name = "crosswalk_lat", precision = 10, scale = 8)
    private BigDecimal crosswalkLat;
    
    @Column(name = "crosswalk_lon", precision = 11, scale = 8)
    private BigDecimal crosswalkLon;
    
    @Column(name = "crosswalk_width", precision = 5, scale = 2)
    private BigDecimal crosswalkWidth;
    
    private Boolean hasSignal;           // 보행자신호등유무
    private Boolean button;              // 보행자작동신호기유무
    private Boolean soundSignal;         // 음향신호기설치유무
    private Boolean highland;            // 고원식 적용 여부
    private Boolean bump;                // 보도턱낮춤여부
    private Boolean brailleBlock;        // 점자블록유무
    private Boolean spotlight;           // 집중조명시설유무
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

@Entity
@Table(name = "acc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccidentData {
    @Id
    @Column(name = "acc_uid")
    private String accUid;
    
    @Column(name = "sido_code")
    private String sidoCode;
    
    @Column(name = "sigungu_code")
    private String sigunguCode;
    
    private Integer year;
    private Integer month;
    
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
    
    @Column(name = "district_name")
    private String districtName;
    
    // 히트맵을 위한 추정 좌표 (지역 중심점)
    @Column(name = "estimated_lat", precision = 10, scale = 8)
    private BigDecimal estimatedLat;
    
    @Column(name = "estimated_lon", precision = 11, scale = 8)
    private BigDecimal estimatedLon;
    
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
}

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
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String name;
    private String picture;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;
    
    @Column(name = "provider_id")
    private String providerId;
    
    @Column(name = "refresh_token")
    private String refreshToken;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
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

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN("ROLE_ADMIN", "관리자"),
    USER("ROLE_USER", "일반사용자");
    
    private final String key;
    private final String title;
}

@Getter
public enum AuthProvider {
    LOCAL,
    GOOGLE,
    NAVER,
    KAKAO
}
```

#### 2. 서비스 계층
```java
@Service
public class MapService {
    public List<Crosswalk> getCrosswalksByBounds(String bounds);
    public List<AccidentData> getAccidentsByBounds(String bounds);
    public List<AccidentData> getAccidentsByRegion(String sido, String sigungu);
    public CrosswalkDetails getCrosswalkDetails(String cwUid);
}

@Service
public class SuggestionService {
    public Page<Suggestion> getSuggestions(Pageable pageable, SuggestionStatus status, String region);
    public Suggestion createSuggestion(CreateSuggestionRequest request, Long userId);
    public List<SuggestionComment> getComments(Long suggestionId);
    public SuggestionComment addComment(Long suggestionId, String content, Long userId);
    public SuggestionStatistics getSuggestionStatistics();
}

@Service
public class UserService {
    public User createUser(RegisterRequest request);
    public User findByEmail(String email);
    public void updateRefreshToken(Long userId, String refreshToken);
    public boolean existsByEmail(String email);
}
```

#### 3. REST API 컨트롤러
```java
@RestController
@RequestMapping("/api/map")
public class MapController {
    
    @GetMapping("/crosswalks")
    public ResponseEntity<List<Crosswalk>> getCrosswalks(
        @RequestParam String bounds);
    
    @GetMapping("/crosswalks/{cwUid}")
    public ResponseEntity<CrosswalkDetails> getCrosswalkDetails(
        @PathVariable String cwUid);
    
    @GetMapping("/accidents")
    public ResponseEntity<List<AccidentData>> getAccidents(
        @RequestParam String bounds);
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
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<SuggestionComment>> getComments(@PathVariable Long id);
    
    @PostMapping("/{id}/comments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SuggestionComment> addComment(
        @PathVariable Long id,
        @RequestBody @Valid AddCommentRequest request,
        Authentication authentication);
}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtTokenDto>> login(
        @RequestBody @Valid LoginRequest request);
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSessionDto>> register(
        @RequestBody @Valid RegisterRequest request);
    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtTokenDto>> refresh(
        @RequestBody @Valid RefreshTokenRequest request);
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSessionDto>> getCurrentUser(
        Authentication authentication);
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(Authentication authentication);
}
```

### 프론트엔드 컴포넌트 (Next.js)

#### 1. 페이지 구조 (Next.js 16 App Router)
```typescript
// app/page.tsx - 메인 대시보드 페이지
export default function Dashboard() {
  return (
    <div className="dashboard">
      <EnhancedMapView />
    </div>
  );
}

// app/suggestions/page.tsx - 건의사항 페이지
export default function SuggestionsPage() {
  return (
    <div className="suggestions">
      <SuggestionList />
      <SuggestionForm />
    </div>
  );
}

// app/admin/page.tsx - 관리자 페이지
export default function AdminPage() {
  return (
    <div className="admin">
      <DataImportPanel />
      <SuggestionManagement />
    </div>
  );
}
```

#### 2. 지도 컴포넌트
```typescript
'use client';

interface EnhancedMapViewProps {
  className?: string;
  onCrosswalkClick?: (crosswalk: Crosswalk) => void;
}

const EnhancedMapView: React.FC<EnhancedMapViewProps> = ({ className, onCrosswalkClick }) => {
  const [rows, setRows] = useState<Crosswalk[]>([]);
  const [loading, setLoading] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  
  return (
    <div className="map-container">
      <HeatmapToggle visible={heatmapVisible} onToggle={setHeatmapVisible} />
      <LeafletMap>
        <CrosswalkLayer crosswalks={rows} onCrosswalkClick={onCrosswalkClick} />
        {heatmapVisible && <HeatmapLayer />}
      </LeafletMap>
      <EnhancedLegend />
    </div>
  );
};
```

#### 3. API 라우트 (Next.js API Routes)
```typescript
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

// app/api/map/accidents/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bounds = searchParams.get('bounds');
  
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/map/accidents?bounds=${bounds}`
  );
  const data = await response.json();
  return Response.json(data);
}
```
```

## 데이터 모델

### Supabase 테이블 구조

#### crosswalks 테이블
```sql
CREATE TABLE crosswalks (
    cw_uid VARCHAR(20) PRIMARY KEY,                    -- 횡단보도 고유 ID
    sido VARCHAR(50) NOT NULL,                         -- 시도
    sigungu VARCHAR(50) NOT NULL,                      -- 시군구
    address VARCHAR(500) NOT NULL,                     -- 주소
    crosswalk_lat DECIMAL(10, 8) NOT NULL,             -- 위도
    crosswalk_lon DECIMAL(11, 8) NOT NULL,             -- 경도
    crosswalk_width DECIMAL(5, 2),                     -- 횡단보도 폭(m)
    has_signal BOOLEAN DEFAULT FALSE,                  -- 보행자신호등유무
    button BOOLEAN DEFAULT FALSE,                      -- 보행자작동신호기유무
    sound_signal BOOLEAN DEFAULT FALSE,                -- 음향신호기설치유무
    highland BOOLEAN DEFAULT FALSE,                    -- 고원식 적용 여부
    bump BOOLEAN DEFAULT FALSE,                        -- 보도턱낮춤여부
    braille_block BOOLEAN DEFAULT FALSE,               -- 점자블록유무
    spotlight BOOLEAN DEFAULT FALSE,                   -- 집중조명시설유무
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_location (crosswalk_lat, crosswalk_lon),
    INDEX idx_region (sido, sigungu),
    INDEX idx_facilities (has_signal, sound_signal, button, spotlight)
);
```

#### acc 테이블 (사고 데이터)
```sql
CREATE TABLE acc (
    acc_uid VARCHAR(20) PRIMARY KEY,                   -- 사고 고유 ID
    sido_code VARCHAR(10) NOT NULL,                    -- 시도 코드
    sigungu_code VARCHAR(10) NOT NULL,                 -- 시군구 코드
    year INTEGER NOT NULL,                             -- 년도
    month INTEGER NOT NULL,                            -- 월 (1-12)
    accident_count INTEGER DEFAULT 0,                  -- 사고건수
    casualty_count INTEGER DEFAULT 0,                  -- 사상자수
    fatality_count INTEGER DEFAULT 0,                  -- 사망자수
    serious_injury_count INTEGER DEFAULT 0,            -- 중상자수
    minor_injury_count INTEGER DEFAULT 0,              -- 경상자수
    reported_injury_count INTEGER DEFAULT 0,           -- 신고부상자수
    district_name VARCHAR(100),                        -- 지역명
    estimated_lat DECIMAL(10, 8),                      -- 추정 위도 (히트맵용)
    estimated_lon DECIMAL(11, 8),                      -- 추정 경도 (히트맵용)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_region_month (sido_code, sigungu_code, year, month),
    INDEX idx_region (sido_code, sigungu_code),
    INDEX idx_date (year, month),
    INDEX idx_location (estimated_lat, estimated_lon)
);
```

#### suggestions 테이블 (건의사항)
```sql
CREATE TABLE suggestions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,                           -- 작성자 ID
    title VARCHAR(200) NOT NULL,                       -- 건의 제목
    content TEXT NOT NULL,                             -- 건의 내용
    location_lat DECIMAL(10, 8) NOT NULL,              -- 건의 위치 위도
    location_lon DECIMAL(11, 8) NOT NULL,              -- 건의 위치 경도
    address VARCHAR(500),                              -- 건의 위치 주소
    sido VARCHAR(50),                                  -- 시도
    sigungu VARCHAR(50),                               -- 시군구
    suggestion_type VARCHAR(20) DEFAULT 'SIGNAL',      -- 건의 유형
    status VARCHAR(20) DEFAULT 'PENDING',              -- 처리 상태
    like_count INTEGER DEFAULT 0,                      -- 좋아요 수
    view_count INTEGER DEFAULT 0,                      -- 조회수
    admin_response TEXT,                               -- 관리자 답변
    admin_id BIGINT,                                   -- 처리 관리자 ID
    processed_at TIMESTAMP NULL,                       -- 처리 완료 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES users(id),
    INDEX idx_location (location_lat, location_lon),
    INDEX idx_region (sido, sigungu),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
```

#### users 테이블 (사용자)
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,                -- 이메일 (로그인 ID)
    password VARCHAR(255),                             -- 암호화된 비밀번호 (OAuth2 사용자는 null)
    name VARCHAR(100),                                 -- 사용자 이름
    picture VARCHAR(500),                              -- 프로필 이미지 URL
    role VARCHAR(20) NOT NULL DEFAULT 'USER',          -- 사용자 역할 (USER, ADMIN)
    provider VARCHAR(20),                              -- 인증 제공자 (LOCAL, GOOGLE, NAVER)
    provider_id VARCHAR(255),                          -- 제공자 ID
    refresh_token TEXT,                                -- JWT 리프레시 토큰 private final User user;
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    UNIQUE (provider, provider_id)
);
```

#### district_all 테이블 (지역 정보 - 참조용)
```sql
CREATE TABLE district_all (
    district_code VARCHAR(10) PRIMARY KEY,             -- 지역 구분 코드
    sido VARCHAR(50) NOT NULL,                         -- 시도명
    sigungu VARCHAR(50),                               -- 시군구명
    center_lat DECIMAL(10, 8),                         -- 중심 위도
    center_lon DECIMAL(11, 8),                         -- 중심 경도
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_region (sido, sigungu),
    INDEX idx_location (center_lat, center_lon)
);
```LYST', 'MANAGER', 'ALL') DEFAULT 'ALL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,                            -- 읽은 시간
    
    INDEX idx_type_severity (alert_type, severity),
    INDEX idx_region (sido, sigungu),
    INDEX idx_created (created_at),
    INDEX idx_unread (is_read, created_at)
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

### 속성 1: 지도 범위 데이터 로딩 정확성
*모든* 지도 범위 요청에 대해, API가 반환하는 횡단보도와 사고 데이터는 지정된 지리적 경계 내에만 포함되어야 한다
**검증: 요구사항 1.1, 1.3**

### 속성 2: 팝업 정보 정확성
*모든* 횡단보도 마커 클릭에 대해, 표시되는 팝업의 안전 지표와 위험 지표는 해당 횡단보도의 시설 정보와 근처 사고 데이터를 정확히 반영해야 한다
**검증: 요구사항 2.2, 2.3**

### 속성 3: 실시간 계산 일관성
*모든* 동일한 입력 데이터에 대해, 안전 지표와 위험 지표 계산 결과는 항상 동일해야 한다
**검증: 요구사항 6.1, 6.2**

### 속성 4: 히트맵 데이터 정확성
*모든* 사고 데이터 세트에 대해, 생성된 히트맵 포인트는 사고 건수, 사망자 수, 부상자 수를 가중치로 적용한 위험도를 정확히 반영해야 한다
**검증: 요구사항 9.1, 9.2**

### 속성 5: 건의사항 상태 관리 정확성
*모든* 건의사항 상태 변경에 대해, 데이터베이스에 저장된 상태와 API 응답의 상태가 일치해야 한다
**검증: 요구사항 7.2**

### 속성 6: JWT 토큰 인증 상태 관리
*모든* 유효한 JWT 토큰에 대해, 토큰 만료 전까지 사용자 정보와 권한이 일관되게 유지되어야 하고, 만료된 토큰은 자동으로 거부되어야 한다
**검증: 요구사항 8.2, 8.4**

## 오류 처리

### 데이터베이스 오류
- Supabase 연결 실패 시 재시도 로직 구현
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

### Spring Security JWT 기반 인증 설정

#### 1. JWT 기반 인증 설정
```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)
            )
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**", "/api/auth/**", "/oauth2/**", "/login/**").permitAll()
                .requestMatchers("/api/dashboard/**").authenticated()
                .requestMatchers("/api/map/**").authenticated()
                .requestMatchers("/api/analysis/**").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler(oAuth2AuthenticationSuccessHandler)
                .failureHandler(oAuth2AuthenticationFailureHandler)
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

#### 2. JWT 토큰 제공자
```java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private int jwtExpirationInMs;
    
    @Value("${jwt.refresh-expiration}")
    private int refreshExpirationInMs;
    
    private final CustomUserDetailsService userDetailsService;
    
    @PostConstruct
    protected void init() {
        jwtSecret = Base64.getEncoder().encodeToString(jwtSecret.getBytes());
    }
    
    public String createAccessToken(String email, String role) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);
        
        Date now = new Date();
        Date validity = new Date(now.getTime() + jwtExpirationInMs);
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }
    
    public String createRefreshToken(String email) {
        Claims claims = Jwts.claims().setSubject(email);
        
        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshExpirationInMs);
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }
    
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(getUsername(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
    
    public String getUsername(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

#### 3. JWT 인증 필터
```java
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {
    
    private final JwtTokenProvider jwtTokenProvider;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        String token = jwtTokenProvider.resolveToken((HttpServletRequest) request);
        
        if (token != null && jwtTokenProvider.validateToken(token)) {
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        chain.doFilter(request, response);
    }
}

#### 4. JWT 예외 처리
```java
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                        AuthenticationException authException) throws IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(
                ApiResponse.error("인증이 필요합니다: " + authException.getMessage())
        ));
    }
}

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                      AccessDeniedException accessDeniedException) throws IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(
                ApiResponse.error("접근 권한이 없습니다: " + accessDeniedException.getMessage())
        ));
    }
}
```

#### 2. 사용자 엔티티 (JWT 기반)
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
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String name;
    private String picture;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Column(name = "account_non_expired")
    private boolean accountNonExpired = true;
    
    @Column(name = "account_non_locked")
    private boolean accountNonLocked = true;
    
    @Column(name = "credentials_non_expired")
    private boolean credentialsNonExpired = true;
    
    private boolean enabled = true;
    
    @Column(name = "refresh_token")
    private String refreshToken;
    
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
```

#### 3. 사용자 인증 서비스
```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));
        
        return new CustomUserPrincipal(user);
    }
}

@Getter
public class CustomUserPrincipal implements UserDetails, OAuth2User {
    
    private final User user;
    private Map<String, Object> attributes;

    public CustomUserPrincipal(User user) {
        this.user = user;
    }

    public CustomUserPrincipal(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole().getKey()));
    }
    
    @Override
    public String getPassword() {
        return user.getPassword();
    }
    
    @Override
    public String getUsername() {
        return user.getEmail();
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return user.isAccountNonExpired();
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return user.isAccountNonLocked();
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return user.isCredentialsNonExpired();
    }
    
    @Override
    public boolean isEnabled() {
        return user.isEnabled();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
```

#### 4. JWT 기반 인증 핸들러
```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtTokenDto>> login(@RequestBody @Valid LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            User user = principal.getUser();
            
            String accessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().getKey());
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
            
            // Refresh token을 데이터베이스에 저장
            userService.updateRefreshToken(user.getId(), refreshToken);
            
            JwtTokenDto tokenDto = JwtTokenDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .user(UserSessionDto.from(user))
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success("로그인 성공", tokenDto));
            
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("로그인 실패: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSessionDto>> register(@RequestBody @Valid RegisterRequest request) {
        User user = userService.createUser(request);
        
        UserSessionDto userSession = UserSessionDto.from(user);
        
        return ResponseEntity.ok(ApiResponse.success("회원가입 성공", userSession));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtTokenDto>> refresh(@RequestBody @Valid RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();
            
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("유효하지 않은 리프레시 토큰"));
            }
            
            String email = jwtTokenProvider.getUsername(refreshToken);
            User user = userService.findByEmail(email);
            
            if (!refreshToken.equals(user.getRefreshToken())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("리프레시 토큰이 일치하지 않습니다"));
            }
            
            String newAccessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().getKey());
            String newRefreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
            
            userService.updateRefreshToken(user.getId(), newRefreshToken);
            
            JwtTokenDto tokenDto = JwtTokenDto.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .user(UserSessionDto.from(user))
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success("토큰 갱신 성공", tokenDto));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("토큰 갱신 실패: " + e.getMessage()));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSessionDto>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자"));
        }
        
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();
        
        UserSessionDto userSession = UserSessionDto.from(user);
        
        return ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", userSession));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            User user = principal.getUser();
            
            // 리프레시 토큰 무효화
            userService.updateRefreshToken(user.getId(), null);
        }
        
        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공", null));
    }
    
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkAuthStatus(Authentication authentication) {
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated();
        return ResponseEntity.ok(ApiResponse.success("인증 상태 확인", isAuthenticated));
    }
}
```

#### 5. 데이터 전송 객체
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSessionDto {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String picture;
    
    public static UserSessionDto from(User user) {
        return UserSessionDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().getKey())
                .build();
    }
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtTokenDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserSessionDto user;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String password;
    
    @NotBlank(message = "이름은 필수입니다")
    private String name;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
```

### API 접근 제어

#### 1. 역할 기반 접근 제어
- **ADMIN**: 모든 API 접근 가능, 데이터 임포트 기능, 사용자 관리
- **USER**: 대시보드 조회, 기본 분석 기능만 접근 가능


### 환경 설정

#### application.properties
```properties
spring.datasource.url=jdbc:postgresql://${SUPABASE_HOST}:5432/${SUPABASE_DB}?sslmode=require
spring.datasource.username=${SUPABASE_USER}
spring.datasource.password=${SUPABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT 설정
jwt.secret=${JWT_SECRET:mySecretKey}
jwt.expiration=3600000
jwt.refresh-expiration=86400000

# CORS 설정
cors.allowed-origins=${CORS_ORIGINS:http://localhost:3000}

# OAuth2 설정
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=profile,email

spring.security.oauth2.client.registration.naver.client-id=${NAVER_CLIENT_ID}
spring.security.oauth2.client.registration.naver.client-secret=${NAVER_CLIENT_SECRET}
spring.security.oauth2.client.registration.naver.client-authentication-method=post
spring.security.oauth2.client.registration.naver.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.naver.redirect-uri={baseUrl}/{action}/oauth2/code/{registrationId}
spring.security.oauth2.client.registration.naver.scope=name,email,profile_image
spring.security.oauth2.client.registration.naver.client-name=Naver

logging.level.org.springframework.security=DEBUG
logging.level.com.pedestriansafety=DEBUG
```