# Priority Score 업데이트 가이드

기존 suggestions 테이블의 priority_score를 각 위치의 위험 지수로 업데이트하는 방법입니다.

## 📋 개요

이 스크립트는 각 건의사항의 위치(location_lat, location_lon)를 기반으로 주변 500m 내 사고 데이터를 분석하여 위험 지수를 계산하고, 이를 priority_score에 저장합니다.

## 🎯 위험 지수 계산 방식

### 1. 주변 사고 데이터 수집
- 건의사항 위치 기준 반경 500m 내 사고 데이터 조회
- Haversine 공식을 사용한 정확한 거리 계산

### 2. 가중치 적용
```
원점수 = (사망자 × 10) + (중상자 × 5) + (경상자 × 2) + (사고건수 × 1) + (신고부상 × 0.5)
```

### 3. 지수 압축 (0-100 정규화)
```
위험 지수 = 100 × (1 - e^(-원점수 / 80))
```

## 📁 제공 파일

### 1. `update_priority_scores.sql` (상세 버전)
- 단계별 상세 분석 포함
- 업데이트 전/후 통계 비교
- 임시 테이블을 사용한 안전한 업데이트
- 상위 위험 지역 확인

**장점:**
- 업데이트 전 결과 미리 확인 가능
- 상세한 통계 정보 제공
- 디버깅 용이

**단점:**
- 실행 시간이 더 오래 걸림
- 임시 테이블 생성 권한 필요

### 2. `update_priority_scores_simple.sql` (간단 버전)
- 단일 UPDATE 쿼리로 즉시 업데이트
- 백업 테이블 자동 생성
- 빠른 실행

**장점:**
- 빠른 실행 속도
- 간단한 구조

**단점:**
- 업데이트 전 미리보기 없음

## 🚀 사용 방법

### 방법 1: 상세 버전 사용 (권장)

```bash
# MySQL 접속
mysql -u your_username -p your_database

# 스크립트 실행
source update_priority_scores.sql;
```

또는

```bash
mysql -u your_username -p your_database < update_priority_scores.sql
```

### 방법 2: 간단 버전 사용

```bash
mysql -u your_username -p your_database < update_priority_scores_simple.sql
```

### 방법 3: MySQL Workbench 사용

1. MySQL Workbench 실행
2. 데이터베이스 연결
3. File → Open SQL Script 선택
4. `update_priority_scores.sql` 또는 `update_priority_scores_simple.sql` 선택
5. Execute (⚡ 아이콘) 클릭

## ⚠️ 주의사항

### 1. 백업 필수
업데이트 전 반드시 데이터베이스 백업을 수행하세요:

```sql
-- 전체 데이터베이스 백업
mysqldump -u your_username -p your_database > backup_$(date +%Y%m%d).sql

-- 또는 suggestions 테이블만 백업
CREATE TABLE suggestions_backup_20260118 AS SELECT * FROM suggestions;
```

### 2. 실행 시간
- 건의사항 수와 사고 데이터 양에 따라 실행 시간이 달라집니다
- 대량 데이터의 경우 수 분이 소요될 수 있습니다

### 3. 데이터베이스 권한
다음 권한이 필요합니다:
- SELECT (suggestions, accident_hotspot)
- UPDATE (suggestions)
- CREATE TEMPORARY TABLE (상세 버전)
- CREATE TABLE (백업용)

### 4. 트랜잭션
안전한 업데이트를 위해 트랜잭션 사용을 권장합니다:

```sql
START TRANSACTION;

-- 스크립트 실행
source update_priority_scores_simple.sql;

-- 결과 확인 후
COMMIT;  -- 또는 ROLLBACK;
```

## 📊 결과 확인

### 업데이트 후 통계 확인

```sql
SELECT 
    COUNT(*) AS total,
    ROUND(AVG(priority_score), 2) AS avg_score,
    MIN(priority_score) AS min_score,
    MAX(priority_score) AS max_score,
    COUNT(CASE WHEN priority_score >= 80 THEN 1 END) AS critical,
    COUNT(CASE WHEN priority_score >= 60 THEN 1 END) AS high,
    COUNT(CASE WHEN priority_score >= 40 THEN 1 END) AS medium
FROM suggestions;
```

### 우선순위 높은 건의사항 확인

```sql
SELECT 
    id,
    title,
    address,
    priority_score,
    status,
    created_at
FROM suggestions
ORDER BY priority_score DESC
LIMIT 20;
```

### 우선순위 분포 확인

```sql
SELECT 
    CASE 
        WHEN priority_score >= 80 THEN '매우 높음 (80-100)'
        WHEN priority_score >= 60 THEN '높음 (60-79)'
        WHEN priority_score >= 40 THEN '보통 (40-59)'
        WHEN priority_score >= 20 THEN '낮음 (20-39)'
        ELSE '매우 낮음 (0-19)'
    END AS priority_level,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM suggestions), 2) AS percentage
FROM suggestions
GROUP BY priority_level
ORDER BY MIN(priority_score) DESC;
```

## 🔄 정기 업데이트

새로운 사고 데이터가 추가되면 정기적으로 priority_score를 업데이트하는 것을 권장합니다.

### Cron Job 설정 예시 (매일 새벽 2시)

```bash
# crontab -e
0 2 * * * /usr/bin/mysql -u username -ppassword database < /path/to/update_priority_scores_simple.sql >> /var/log/priority_update.log 2>&1
```

## 🐛 문제 해결

### 1. "Unknown column" 오류
- suggestions 테이블에 location_lat, location_lon 컬럼이 있는지 확인
- accident_hotspot 테이블 구조 확인

### 2. "Out of range value" 오류
- priority_score 컬럼 타입이 INTEGER인지 확인
- 필요시 DECIMAL(5,2)로 변경

### 3. 실행 시간이 너무 오래 걸림
- accident_hotspot 테이블에 인덱스 추가:
```sql
CREATE INDEX idx_accident_location ON accident_hotspot(accident_lat, accident_lon);
```

### 4. 모든 priority_score가 0
- accident_hotspot 테이블에 데이터가 있는지 확인
- 위도/경도 값이 올바른지 확인

## 📞 문의

문제가 발생하면 다음을 확인하세요:
1. MySQL 버전 (5.7 이상 권장)
2. 테이블 구조
3. 데이터 샘플
4. 에러 메시지 전문

---

**마지막 업데이트:** 2026-01-18
