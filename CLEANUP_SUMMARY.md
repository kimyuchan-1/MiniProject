# 코드 정리 요약 (Code Cleanup Summary)

## 삭제된 파일 (Deleted Files)

### 백엔드 (Backend)
- `backend/src/main/java/com/kdt03/ped_accident/global/service/DataImportService.java`
  - 이유: 완전히 비어있는 서비스 클래스, 어디서도 사용되지 않음

### 루트 파일 (Root Files)
- `~$미니프로젝트계획서.pptx`
  - 이유: Microsoft Office 임시 잠금 파일

## 제거된 코드 (Removed Code)

### 프론트엔드 (Frontend)

#### 1. 사용하지 않는 타입 정의
- **파일**: `frontend/src/app/(main)/dashboard/page.tsx`
- **제거**: `type MoveTarget = { lat: number; lon: number; zoom?: number } | null;`

#### 2. 사용하지 않는 Props
- **파일**: `frontend/src/components/board/map/LocationViewer.tsx`
- **제거**: `address: string` prop (선언되었지만 사용되지 않음)

#### 3. 주석 처리된 코드
- **파일**: `frontend/src/components/pedacc/AccidentChart.tsx`
- **제거**: 주석 처리된 stepSize 설정 (2곳)

#### 4. 사용하지 않는 의존성
- **파일**: `frontend/package.json`
- **제거**: `jotai` 패키지 (코드에서 전혀 사용되지 않음)

#### 5. 환경 변수 정리
- **파일**: `frontend/.env`
- **제거**: `BACKEND_URL_NGROK` (사용되지 않는 백엔드 URL)

### 백엔드 (Backend)

#### 1. 주석 처리된 메서드 제거
- **파일**: `backend/src/main/java/com/kdt03/ped_accident/api/controller/MapController.java`
- **제거**:
  - 주석 처리된 `getCrosswalkDetails()` 엔드포인트
  - 주석 처리된 `getAccidents()` 엔드포인트
  - 사용하지 않는 import: `@PathVariable`

#### 2. 주석 처리된 메서드 및 사용하지 않는 import 제거
- **파일**: `backend/src/main/java/com/kdt03/ped_accident/domain/safety/service/SafetyAnalysisService.java`
- **제거**:
  - 주석 처리된 `getDashboardStats()` 메서드
  - 주석 처리된 `analyzeSignalEffect()` 메서드
  - 사용하지 않는 import: `DashboardStats`, `SignalEffectAnalysis`

#### 3. 주석 처리된 오버라이드 메서드 제거
- **파일**: `backend/src/main/java/com/kdt03/ped_accident/domain/user/service/CustomUserPrincipal.java`
- **제거**:
  - 주석 처리된 `isAccountNonExpired()` 메서드
  - 주석 처리된 `isAccountNonLocked()` 메서드
  - 주석 처리된 `isCredentialsNonExpired()` 메서드
  - (이 메서드들은 UserDetails 인터페이스의 기본 구현으로 충분함)

## 유지된 항목 (Kept Items)

### 구현 필요 메서드 (TODO Methods)
다음 메서드들은 TODO로 표시되어 있지만 API 엔드포인트에서 사용되므로 유지:

1. **SuggestionService.getSuggestionStatistics()**
   - 사용처: `SuggestionController.getSuggestionStatistics()`
   - 상태: 구현 필요

2. **SafetyAnalysisService.getImprovementCandidates()**
   - 사용처: `DashboardController.getImprovementCandidates()`
   - 상태: 구현 필요

3. **SafetyAnalysisService.calculateVulnerabilityScore()**
   - 상태: 구현 필요

4. **SafetyAnalysisService.calculateRiskScore()**
   - 상태: 구현 필요

### 데이터셋 파일 (Dataset Files)
- `dataset/report/` 폴더는 비어있지만 향후 사용을 위해 유지
- `dataset/python code/` 내의 Jupyter 노트북들은 데이터 처리에 사용될 수 있으므로 유지
- 중간 CSV 파일들도 데이터 처리 파이프라인에 필요할 수 있으므로 유지

## 정리 효과 (Cleanup Impact)

- **삭제된 파일**: 2개
- **제거된 코드 라인**: 약 60-80줄
- **제거된 사용하지 않는 import**: 3개
- **제거된 사용하지 않는 props/types**: 2개
- **제거된 의존성**: 1개 (jotai)

## 권장 사항 (Recommendations)

### 높은 우선순위
1. TODO로 표시된 메서드들을 구현하거나 사용하지 않는 경우 제거
2. `dataset/python code/test.ipynb` 검토 후 불필요시 삭제
3. `dataset/python code/table.ipynb`가 `table_updated.ipynb`로 대체되었는지 확인

### 중간 우선순위
1. Eclipse 메타데이터 폴더 (`backend/.metadata/`) 검토 - Git에서 제외되어야 함
2. 데이터셋 폴더의 중간 CSV 파일들이 여전히 필요한지 확인
3. SQL 마이그레이션 파일들을 별도 폴더로 이동 고려

### 낮은 우선순위
1. 오래된 Python 노트북들을 아카이브 폴더로 이동
2. 프로젝트 문서화 개선
