# KPI View 성능 최적화 가이드

## 문제 분석

현재 `mv_kpi_summary` 뷰는 다음과 같은 이유로 느립니다:

1. **복잡한 CTE 체인**: 여러 단계의 WITH 절이 중첩되어 있음
2. **전체 테이블 스캔**: 매번 모든 crosswalks, accidents, hotspots 데이터를 계산
3. **복잡한 JOIN**: crosswalk_signal_map, cw_acc_map 등 여러 테이블 조인
4. **무거운 계산**: risk_index 계산에 지수 함수와 거리 기반 가중치 적용
5. **인덱스 부족**: 필요한 컬럼에 인덱스가 없을 가능성

## 추천 솔루션: 캐시 테이블 + 주기적 업데이트

### 장점
- ⚡ **즉시 응답**: 미리 계산된 데이터를 조회하므로 밀리초 단위 응답
- 📊 **정확성 유지**: 주기적 업데이트로 최신 데이터 반영
- 🔧 **유지보수 용이**: 업데이트 주기 조절 가능
- 💾 **서버 부하 감소**: 매 요청마다 계산하지 않음

### 구현 단계

#### 1단계: 캐시 테이블 생성

```sql
CREATE TABLE `kpi_summary_cache` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `total_crosswalks` BIGINT,
    `crosswalks_with_signals` BIGINT,
    `direct_signals` BIGINT,
    `mapped_signals` BIGINT,
    `signal_installation_rate` DECIMAL(5,2),
    `risk_index` DECIMAL(10,6),
    `safety_index` DECIMAL(10,6),
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_last_updated` (`last_updated`)
) ENGINE=InnoDB;
```

#### 2단계: 업데이트 프로시저 생성

```sql
DELIMITER $$

CREATE PROCEDURE `sp_refresh_kpi_cache`()
BEGIN
    TRUNCATE TABLE `kpi_summary_cache`;
    
    INSERT INTO `kpi_summary_cache` (
        `total_crosswalks`,
        `crosswalks_with_signals`,
        `direct_signals`,
        `mapped_signals`,
        `signal_installation_rate`,
        `risk_index`,
        `safety_index`
    )
    SELECT 
        total_crosswalks,
        crosswalks_with_signals,
        direct_signals,
        mapped_signals,
        signal_installation_rate,
        risk_index,
        safety_index
    FROM `mv_kpi_summary`;
END$$

DELIMITER ;
```

#### 3단계: 빠른 조회 뷰 생성

```sql
CREATE VIEW `v_kpi_summary_fast` AS
SELECT 
    JSON_OBJECT(
        'totalCrosswalks', total_crosswalks,
        'crosswalksWithSignals', crosswalks_with_signals,
        'directSignals', direct_signals,
        'mappedSignals', mapped_signals,
        'signalInstallationRate', signal_installation_rate,
        'riskIndex', risk_index,
        'safetyIndex', safety_index,
        'lastUpdated', last_updated
    ) AS `data`
FROM `kpi_summary_cache`
ORDER BY `id` DESC
LIMIT 1;
```

#### 4단계: 초기 데이터 로드

```sql
CALL sp_refresh_kpi_cache();
```

#### 5단계: 자동 업데이트 설정 (선택사항)

```sql
-- 이벤트 스케줄러 활성화
SET GLOBAL event_scheduler = ON;

-- 5분마다 업데이트
CREATE EVENT `evt_refresh_kpi_cache`
ON SCHEDULE EVERY 5 MINUTE
STARTS CURRENT_TIMESTAMP
DO
    CALL sp_refresh_kpi_cache();
```

### 백엔드 코드 수정

기존 코드에서 뷰 이름만 변경:

```java
// KPIRepository.java
@Query(value = "SELECT data FROM v_kpi_summary_fast", nativeQuery = true)
String getKPISummaryJson();
```

또는 캐시 테이블 직접 조회:

```java
@Query(value = """
    SELECT JSON_OBJECT(
        'totalCrosswalks', total_crosswalks,
        'crosswalksWithSignals', crosswalks_with_signals,
        'directSignals', direct_signals,
        'mappedSignals', mapped_signals,
        'signalInstallationRate', signal_installation_rate,
        'riskIndex', risk_index,
        'safetyIndex', safety_index,
        'lastUpdated', last_updated
    )
    FROM kpi_summary_cache
    ORDER BY id DESC
    LIMIT 1
    """, nativeQuery = true)
String getKPISummaryJson();
```

### 데이터 업데이트 전략

#### 옵션 1: 주기적 자동 업데이트
- **5분마다**: 실시간에 가까운 데이터 (권장)
- **1시간마다**: 서버 부하 최소화
- **매일 자정**: 일일 통계용

#### 옵션 2: 이벤트 기반 업데이트
데이터 변경 시 수동으로 호출:

```java
// SuggestionService.java
@Transactional
public Suggestion createSuggestion(...) {
    Suggestion saved = suggestionRepository.save(suggestion);
    
    // KPI 캐시 업데이트 (비동기 권장)
    refreshKPICache();
    
    return saved;
}

private void refreshKPICache() {
    jdbcTemplate.execute("CALL sp_refresh_kpi_cache()");
}
```

#### 옵션 3: 하이브리드
- 자동: 5분마다 업데이트
- 수동: 중요한 데이터 변경 시 즉시 업데이트

## 추가 최적화

### 1. 인덱스 추가

```sql
-- crosswalks 테이블
ALTER TABLE `crosswalks` 
ADD INDEX `idx_signal_features` (`has_ped_signal`, `has_ped_button`, `has_ped_sound`),
ADD INDEX `idx_safety_features` (`is_highland`, `has_bump`, `has_braille_block`, `has_spotlight`);

-- crosswalk_signal_map 테이블
ALTER TABLE `crosswalk_signal_map`
ADD INDEX `idx_cw_uid` (`cw_uid`);

-- cw_acc_map 테이블
ALTER TABLE `cw_acc_map`
ADD INDEX `idx_cw_distance` (`cw_uid`, `distance`),
ADD INDEX `idx_accident_id` (`accident_id`);
```

### 2. 부분 캐싱

무거운 계산(risk_index)만 별도 캐싱:

```sql
CREATE TABLE `cache_risk_index` (
    `risk_index` DECIMAL(10,6),
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1시간마다 업데이트
CREATE EVENT `evt_refresh_risk_index`
ON SCHEDULE EVERY 1 HOUR
DO
    -- risk_index만 재계산
```

### 3. 읽기 전용 복제본

대용량 데이터의 경우 읽기 전용 복제본 사용

## 성능 비교

### 예상 성능 개선

| 방법 | 응답 시간 | 서버 부하 |
|------|----------|----------|
| 기존 뷰 | 2-5초 | 높음 |
| 캐시 테이블 | 10-50ms | 매우 낮음 |
| 인덱스 추가 | 500ms-2초 | 중간 |

### 측정 방법

```sql
SET profiling = 1;

-- 기존 뷰
SELECT * FROM v_kpi_summary_json;

-- 캐시 테이블
SELECT * FROM v_kpi_summary_fast;

SHOW PROFILES;
```

## 모니터링

### 캐시 상태 확인

```sql
SELECT 
    *,
    TIMESTAMPDIFF(MINUTE, last_updated, NOW()) as minutes_old 
FROM kpi_summary_cache;
```

### 업데이트 로그

```sql
CREATE TABLE `kpi_cache_update_log` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `duration_ms` INT,
    `status` VARCHAR(20)
);

-- 프로시저에 로깅 추가
DELIMITER $$

CREATE PROCEDURE `sp_refresh_kpi_cache_with_log`()
BEGIN
    DECLARE start_time BIGINT;
    DECLARE end_time BIGINT;
    DECLARE duration INT;
    
    SET start_time = UNIX_TIMESTAMP(NOW(3)) * 1000;
    
    CALL sp_refresh_kpi_cache();
    
    SET end_time = UNIX_TIMESTAMP(NOW(3)) * 1000;
    SET duration = end_time - start_time;
    
    INSERT INTO kpi_cache_update_log (duration_ms, status)
    VALUES (duration, 'SUCCESS');
END$$

DELIMITER ;
```

## 결론

**권장 방법**: 캐시 테이블 + 5분 자동 업데이트

이 방법은:
- ✅ 즉각적인 응답 속도 (10-50ms)
- ✅ 서버 부하 최소화
- ✅ 구현 간단
- ✅ 유지보수 용이
- ✅ 확장 가능

데이터가 실시간으로 변경되지 않는 통계 데이터이므로, 5분 정도의 지연은 허용 가능합니다.
