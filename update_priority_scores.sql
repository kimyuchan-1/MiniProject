-- 기존 suggestions의 priority_score를 위험 지수로 업데이트하는 스크립트
-- 각 건의사항의 위치(location_lat, location_lon)를 기반으로 주변 사고 데이터를 분석하여 위험 지수 계산

-- 1. 임시 테이블 생성: 각 건의사항의 위험 지수 계산
DROP TEMPORARY TABLE IF EXISTS temp_suggestion_risk_scores;

CREATE TEMPORARY TABLE temp_suggestion_risk_scores AS
SELECT 
    s.id AS suggestion_id,
    s.location_lat,
    s.location_lon,
    -- 반경 500m 내 사고 데이터 집계
    COUNT(DISTINCT a.accident_id) AS nearby_accidents,
    COALESCE(SUM(a.accident_count), 0) AS total_accidents,
    COALESCE(SUM(a.casualty_count), 0) AS total_casualties,
    COALESCE(SUM(a.fatality_count), 0) AS total_fatalities,
    COALESCE(SUM(a.serious_injury_count), 0) AS total_serious_injuries,
    COALESCE(SUM(a.minor_injury_count), 0) AS total_minor_injuries,
    COALESCE(SUM(a.reported_injury_count), 0) AS total_reported_injuries,
    -- 위험 지수 계산 (간단한 버전)
    -- 가중치: 사망 10점, 중상 5점, 경상 2점, 사고 1점, 신고부상 0.5점
    LEAST(100, GREATEST(0, 
        (COALESCE(SUM(a.fatality_count), 0) * 10) +
        (COALESCE(SUM(a.serious_injury_count), 0) * 5) +
        (COALESCE(SUM(a.minor_injury_count), 0) * 2) +
        (COALESCE(SUM(a.accident_count), 0) * 1) +
        (COALESCE(SUM(a.reported_injury_count), 0) * 0.5)
    )) AS raw_risk_score
FROM 
    suggestions s
LEFT JOIN 
    accident_hotspot a ON (
        -- 반경 약 500m 계산 (위도/경도 약 0.005도)
        a.accident_lat BETWEEN s.location_lat - 0.005 AND s.location_lat + 0.005
        AND a.accident_lon BETWEEN s.location_lon - 0.005 AND s.location_lon + 0.005
        -- 더 정확한 거리 계산 (Haversine 공식 근사)
        AND (
            6371000 * 2 * ASIN(SQRT(
                POW(SIN((RADIANS(a.accident_lat) - RADIANS(s.location_lat)) / 2), 2) +
                COS(RADIANS(s.location_lat)) * COS(RADIANS(a.accident_lat)) *
                POW(SIN((RADIANS(a.accident_lon) - RADIANS(s.location_lon)) / 2), 2)
            ))
        ) <= 500
    )
WHERE 
    s.location_lat IS NOT NULL 
    AND s.location_lon IS NOT NULL
GROUP BY 
    s.id, s.location_lat, s.location_lon;

-- 2. 위험 지수 정규화 (0-100 범위로 조정)
-- 지수 압축 적용: risk_score = 100 * (1 - exp(-raw_score / K))
-- K = 80 (압축 파라미터)
DROP TEMPORARY TABLE IF EXISTS temp_normalized_risk_scores;

CREATE TEMPORARY TABLE temp_normalized_risk_scores AS
SELECT 
    suggestion_id,
    location_lat,
    location_lon,
    nearby_accidents,
    total_accidents,
    total_casualties,
    total_fatalities,
    raw_risk_score,
    -- 지수 압축 적용
    ROUND(100 * (1 - EXP(-raw_risk_score / 80)), 2) AS normalized_risk_score,
    -- 정수로 변환 (priority_score는 INTEGER)
    ROUND(100 * (1 - EXP(-raw_risk_score / 80))) AS priority_score
FROM 
    temp_suggestion_risk_scores;

-- 3. 계산 결과 확인 (업데이트 전)
SELECT 
    '업데이트 전 통계' AS status,
    COUNT(*) AS total_suggestions,
    COUNT(CASE WHEN priority_score > 0 THEN 1 END) AS suggestions_with_score,
    ROUND(AVG(priority_score), 2) AS avg_priority_score,
    MIN(priority_score) AS min_priority_score,
    MAX(priority_score) AS max_priority_score
FROM 
    suggestions;

-- 4. 새로 계산된 위험 지수 통계
SELECT 
    '새로 계산된 위험 지수 통계' AS status,
    COUNT(*) AS total_calculated,
    ROUND(AVG(priority_score), 2) AS avg_risk_score,
    MIN(priority_score) AS min_risk_score,
    MAX(priority_score) AS max_risk_score,
    COUNT(CASE WHEN priority_score >= 80 THEN 1 END) AS critical_count,
    COUNT(CASE WHEN priority_score >= 60 AND priority_score < 80 THEN 1 END) AS high_count,
    COUNT(CASE WHEN priority_score >= 40 AND priority_score < 60 THEN 1 END) AS medium_count,
    COUNT(CASE WHEN priority_score >= 20 AND priority_score < 40 THEN 1 END) AS low_count,
    COUNT(CASE WHEN priority_score < 20 THEN 1 END) AS minimal_count
FROM 
    temp_normalized_risk_scores;

-- 5. 상위 10개 위험 지역 확인
SELECT 
    s.id,
    s.title,
    s.address,
    t.nearby_accidents,
    t.total_accidents,
    t.total_casualties,
    t.total_fatalities,
    t.raw_risk_score,
    t.priority_score AS new_priority_score,
    s.priority_score AS old_priority_score
FROM 
    temp_normalized_risk_scores t
JOIN 
    suggestions s ON t.suggestion_id = s.id
ORDER BY 
    t.priority_score DESC
LIMIT 10;

-- 6. suggestions 테이블 업데이트
-- 주의: 이 쿼리를 실행하면 기존 priority_score가 모두 덮어씌워집니다!
-- 백업을 먼저 수행하는 것을 권장합니다.

-- 백업 테이블 생성 (선택사항)
-- CREATE TABLE suggestions_backup_20260118 AS SELECT * FROM suggestions;

UPDATE suggestions s
JOIN temp_normalized_risk_scores t ON s.id = t.suggestion_id
SET s.priority_score = t.priority_score;

-- 7. 업데이트 결과 확인
SELECT 
    '업데이트 후 통계' AS status,
    COUNT(*) AS total_suggestions,
    COUNT(CASE WHEN priority_score > 0 THEN 1 END) AS suggestions_with_score,
    ROUND(AVG(priority_score), 2) AS avg_priority_score,
    MIN(priority_score) AS min_priority_score,
    MAX(priority_score) AS max_priority_score,
    COUNT(CASE WHEN priority_score >= 80 THEN 1 END) AS critical_count,
    COUNT(CASE WHEN priority_score >= 60 AND priority_score < 80 THEN 1 END) AS high_count,
    COUNT(CASE WHEN priority_score >= 40 AND priority_score < 60 THEN 1 END) AS medium_count,
    COUNT(CASE WHEN priority_score >= 20 AND priority_score < 40 THEN 1 END) AS low_count,
    COUNT(CASE WHEN priority_score < 20 THEN 1 END) AS minimal_count
FROM 
    suggestions;

-- 8. 임시 테이블 정리
DROP TEMPORARY TABLE IF EXISTS temp_suggestion_risk_scores;
DROP TEMPORARY TABLE IF EXISTS temp_normalized_risk_scores;

-- 완료 메시지
SELECT '✅ priority_score 업데이트 완료!' AS message;
