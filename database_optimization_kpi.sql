-- ============================================
-- KPI View 성능 최적화 방안
-- ============================================

-- 방법 1: Materialized View 대신 실제 테이블로 변환 (가장 빠름)
-- 주기적으로 업데이트하는 방식

-- 1-1. KPI 요약 테이블 생성
DROP TABLE IF EXISTS `kpi_summary_cache`;
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

-- 1-2. KPI 캐시 업데이트 프로시저
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_refresh_kpi_cache`$$
CREATE PROCEDURE `sp_refresh_kpi_cache`()
BEGIN
    -- 기존 데이터 삭제
    TRUNCATE TABLE `kpi_summary_cache`;
    
    -- 새로운 데이터 삽입
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

-- 1-3. 초기 데이터 로드
CALL sp_refresh_kpi_cache();

-- 1-4. 빠른 조회용 뷰 생성
DROP VIEW IF EXISTS `v_kpi_summary_fast`;
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


-- ============================================
-- 방법 2: 기존 뷰에 인덱스 추가로 최적화
-- ============================================

-- 2-1. crosswalks 테이블 인덱스
ALTER TABLE `crosswalks` 
ADD INDEX `idx_signal_features` (`has_ped_signal`, `has_ped_button`, `has_ped_sound`),
ADD INDEX `idx_safety_features` (`is_highland`, `has_bump`, `has_braille_block`, `has_spotlight`);

-- 2-2. crosswalk_signal_map 테이블 인덱스
ALTER TABLE `crosswalk_signal_map`
ADD INDEX `idx_cw_uid` (`cw_uid`);

-- 2-3. cw_acc_map 테이블 인덱스
ALTER TABLE `cw_acc_map`
ADD INDEX `idx_cw_distance` (`cw_uid`, `distance`),
ADD INDEX `idx_accident_id` (`accident_id`);

-- 2-4. accident_hotspots 테이블 인덱스
ALTER TABLE `accident_hotspots`
ADD INDEX `idx_accident_counts` (`accident_id`, `fatality_count`, `serious_injury_count`);


-- ============================================
-- 방법 3: 최적화된 뷰 재작성 (중간 CTE 제거)
-- ============================================

DROP VIEW IF EXISTS `mv_kpi_summary_optimized`;
CREATE VIEW `mv_kpi_summary_optimized` AS
SELECT
    -- Total crosswalks
    (SELECT COUNT(*) FROM crosswalks) AS total_crosswalks,
    
    -- Crosswalks with signals (direct + mapped)
    (
        SELECT COUNT(DISTINCT c.cw_uid)
        FROM crosswalks c
        WHERE c.has_ped_signal = '1'
           OR EXISTS (
               SELECT 1 FROM crosswalk_signal_map m 
               WHERE m.cw_uid = c.cw_uid
           )
    ) AS crosswalks_with_signals,
    
    -- Direct signals
    (
        SELECT COUNT(*) 
        FROM crosswalks 
        WHERE has_ped_signal = '1'
    ) AS direct_signals,
    
    -- Mapped signals
    (
        SELECT COUNT(DISTINCT c.cw_uid)
        FROM crosswalks c
        WHERE (c.has_ped_signal IS NULL OR c.has_ped_signal = '0')
          AND EXISTS (
              SELECT 1 FROM crosswalk_signal_map m 
              WHERE m.cw_uid = c.cw_uid
          )
    ) AS mapped_signals,
    
    -- Signal installation rate
    CASE 
        WHEN (SELECT COUNT(*) FROM crosswalks) > 0 
        THEN ROUND(
            (
                (SELECT COUNT(DISTINCT c.cw_uid)
                 FROM crosswalks c
                 WHERE c.has_ped_signal = '1'
                    OR EXISTS (SELECT 1 FROM crosswalk_signal_map m WHERE m.cw_uid = c.cw_uid))
                / (SELECT COUNT(*) FROM crosswalks)
            ) * 100, 
            1
        )
        ELSE 0 
    END AS signal_installation_rate,
    
    -- Risk index (simplified - 실제 계산은 복잡하므로 캐시 테이블 사용 권장)
    0.0 AS risk_index,
    
    -- Safety index (simplified)
    (
        SELECT IFNULL(AVG(
            CASE 
                WHEN max_score > 0 
                THEN (earned_score / max_score) * 100 
                ELSE 0 
            END
        ), 0)
        FROM (
            SELECT
                (
                    (30 * IF(has_ped_signal = '1', 1, 0)) +
                    (10 * IF(has_ped_button = '1', 1, 0)) +
                    (15 * IF(has_ped_sound = '1', 1, 0)) +
                    (20 * IF(is_highland = '1', 1, 0)) +
                    (8 * IF(has_bump = '1', 1, 0)) +
                    (12 * IF(has_braille_block = '1', 1, 0)) +
                    (15 * IF(has_spotlight = '1', 1, 0))
                ) AS earned_score,
                (
                    (30 * IF(has_ped_signal IS NOT NULL, 1, 0)) +
                    (10 * IF(has_ped_button IS NOT NULL, 1, 0)) +
                    (15 * IF(has_ped_sound IS NOT NULL, 1, 0)) +
                    (20 * IF(is_highland IS NOT NULL, 1, 0)) +
                    (8 * IF(has_bump IS NOT NULL, 1, 0)) +
                    (12 * IF(has_braille_block IS NOT NULL, 1, 0)) +
                    (15 * IF(has_spotlight IS NOT NULL, 1, 0))
                ) AS max_score
            FROM crosswalks
        ) t
    ) AS safety_index;


-- ============================================
-- 방법 4: 이벤트 스케줄러로 자동 업데이트
-- ============================================

-- 4-1. 이벤트 스케줄러 활성화 확인
SET GLOBAL event_scheduler = ON;

-- 4-2. 5분마다 KPI 캐시 업데이트 이벤트
DROP EVENT IF EXISTS `evt_refresh_kpi_cache`;
CREATE EVENT `evt_refresh_kpi_cache`
ON SCHEDULE EVERY 5 MINUTE
STARTS CURRENT_TIMESTAMP
DO
    CALL sp_refresh_kpi_cache();

-- 또는 매일 자정에 업데이트
DROP EVENT IF EXISTS `evt_refresh_kpi_daily`;
CREATE EVENT `evt_refresh_kpi_daily`
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE + INTERVAL 1 DAY)
DO
    CALL sp_refresh_kpi_cache();


-- ============================================
-- 방법 5: 부분 캐싱 (각 지표별로 별도 테이블)
-- ============================================

-- 5-1. 신호등 설치율 캐시
DROP TABLE IF EXISTS `cache_signal_stats`;
CREATE TABLE `cache_signal_stats` (
    `total_crosswalks` BIGINT,
    `crosswalks_with_signals` BIGINT,
    `direct_signals` BIGINT,
    `mapped_signals` BIGINT,
    `signal_installation_rate` DECIMAL(5,2),
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5-2. 안전 지수 캐시
DROP TABLE IF EXISTS `cache_safety_index`;
CREATE TABLE `cache_safety_index` (
    `safety_index` DECIMAL(10,6),
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5-3. 위험 지수 캐시 (가장 무거운 계산)
DROP TABLE IF EXISTS `cache_risk_index`;
CREATE TABLE `cache_risk_index` (
    `risk_index` DECIMAL(10,6),
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================
-- 사용 방법
-- ============================================

-- 방법 1 사용 시 (권장):
-- 1. 위의 테이블과 프로시저 생성
-- 2. 초기 데이터 로드: CALL sp_refresh_kpi_cache();
-- 3. 애플리케이션에서 v_kpi_summary_fast 조회
-- 4. 데이터 변경 시 sp_refresh_kpi_cache() 호출

-- 수동 업데이트:
-- CALL sp_refresh_kpi_cache();

-- 빠른 조회:
-- SELECT * FROM v_kpi_summary_fast;

-- 캐시 상태 확인:
-- SELECT *, TIMESTAMPDIFF(MINUTE, last_updated, NOW()) as minutes_old 
-- FROM kpi_summary_cache;


-- ============================================
-- 성능 비교 쿼리
-- ============================================

-- 기존 뷰 (느림)
-- SELECT * FROM v_kpi_summary_json;

-- 캐시 테이블 (빠름)
-- SELECT * FROM v_kpi_summary_fast;

-- 실행 시간 측정
-- SET profiling = 1;
-- SELECT * FROM v_kpi_summary_json;
-- SELECT * FROM v_kpi_summary_fast;
-- SHOW PROFILES;
