-- 간단한 버전: 기존 suggestions의 priority_score를 위험 지수로 업데이트
-- MySQL 5.7+ 호환

-- 1. 백업 테이블 생성 (권장)
CREATE TABLE IF NOT EXISTS suggestions_backup AS 
SELECT * FROM suggestions;

-- 2. priority_score 업데이트
-- 각 건의사항 위치 기준 반경 500m 내 사고 데이터로 위험 지수 계산
UPDATE suggestions s
SET s.priority_score = (
    SELECT 
        -- 위험 지수 계산 및 0-100 범위로 정규화
        LEAST(100, GREATEST(0, ROUND(
            100 * (1 - EXP(-(
                -- 가중치 합계: 사망 10점, 중상 5점, 경상 2점, 사고 1점, 신고부상 0.5점
                COALESCE(SUM(a.fatality_count * 10), 0) +
                COALESCE(SUM(a.serious_injury_count * 5), 0) +
                COALESCE(SUM(a.minor_injury_count * 2), 0) +
                COALESCE(SUM(a.accident_count * 1), 0) +
                COALESCE(SUM(a.reported_injury_count * 0.5), 0)
            ) / 80))
        )))
    FROM 
        accident_hotspot a
    WHERE 
        -- 반경 약 500m (위도/경도 약 0.005도)
        a.accident_lat BETWEEN s.location_lat - 0.005 AND s.location_lat + 0.005
        AND a.accident_lon BETWEEN s.location_lon - 0.005 AND s.location_lon + 0.005
        -- Haversine 거리 계산 (500m 이내)
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
    AND s.location_lon IS NOT NULL;

-- 3. 위치 정보가 없는 건의사항은 0으로 설정
UPDATE suggestions
SET priority_score = 0
WHERE location_lat IS NULL OR location_lon IS NULL;

-- 4. 결과 확인
SELECT 
    COUNT(*) AS total_suggestions,
    COUNT(CASE WHEN priority_score > 0 THEN 1 END) AS with_risk_score,
    ROUND(AVG(priority_score), 2) AS avg_score,
    MIN(priority_score) AS min_score,
    MAX(priority_score) AS max_score,
    COUNT(CASE WHEN priority_score >= 80 THEN 1 END) AS critical,
    COUNT(CASE WHEN priority_score >= 60 AND priority_score < 80 THEN 1 END) AS high,
    COUNT(CASE WHEN priority_score >= 40 AND priority_score < 60 THEN 1 END) AS medium,
    COUNT(CASE WHEN priority_score < 40 THEN 1 END) AS low
FROM suggestions;

-- 5. 상위 10개 위험 지역
SELECT 
    id,
    title,
    address,
    priority_score,
    status,
    created_at
FROM suggestions
WHERE priority_score > 0
ORDER BY priority_score DESC
LIMIT 10;

SELECT '✅ 업데이트 완료!' AS message;
