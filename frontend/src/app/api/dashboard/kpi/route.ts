import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log("[KPI API] Starting KPI calculation...");
        
        // Supabase 연결 확인
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Supabase environment variables not configured");
            return NextResponse.json({ error: "Database configuration error" }, { status: 500 });
        }

        // 전체 횡단보도 수 조회
        console.log("[KPI API] Counting total crosswalks...");
        const { count: totalCrosswalks, error: cwCountError } = await supabase
            .from("CW")
            .select("*", { count: 'exact', head: true });

        if (cwCountError) {
            console.error("Error counting crosswalks:", cwCountError);
            return NextResponse.json({ error: cwCountError.message }, { status: 500 });
        }

        console.log(`[KPI API] Total crosswalks: ${totalCrosswalks}`);

        // 모든 횡단보도의 has_ped_signal 정보 조회
        console.log("[KPI API] Fetching crosswalk signal data...");
        const { data: allCrosswalks, error: cwDataError } = await supabase
            .from("CW")
            .select("cw_uid, has_ped_signal");

        if (cwDataError) {
            console.error("Error fetching crosswalk data:", cwDataError);
            return NextResponse.json({ error: cwDataError.message }, { status: 500 });
        }

        console.log(`[KPI API] Fetched ${allCrosswalks?.length || 0} crosswalk records`);

        // CW_SG 매핑 정보 조회
        console.log("[KPI API] Fetching CW_SG mappings...");
        const { data: cwSgMappings, error: cwSgError } = await supabase
            .from("CW_SG")
            .select("cw_uid");

        if (cwSgError) {
            console.error("Error fetching CW_SG mappings:", cwSgError);
            return NextResponse.json({ error: cwSgError.message }, { status: 500 });
        }

        console.log(`[KPI API] Fetched ${cwSgMappings?.length || 0} CW_SG mappings`);

        // CW_SG에 매핑된 cw_uid들을 Set으로 변환 (빠른 검색을 위해)
        const mappedCwUids = new Set(cwSgMappings?.map(item => item.cw_uid) || []);

        // 신호등이 있는 횡단보도 계산
        let crosswalksWithSignals = 0;
        let directSignals = 0;
        let mappedSignals = 0;
        
        allCrosswalks?.forEach(cw => {
            // 1. has_ped_signal이 1이면 신호등 있음
            if (cw.has_ped_signal === 1) {
                crosswalksWithSignals++;
                directSignals++;
            }
            // 2. has_ped_signal이 null 또는 0이면 CW_SG 테이블 확인
            else if ((cw.has_ped_signal === null || cw.has_ped_signal === 0) && mappedCwUids.has(cw.cw_uid)) {
                crosswalksWithSignals++;
                mappedSignals++;
            }
        });

        console.log(`[KPI API] Signal analysis: Direct signals: ${directSignals}, Mapped signals: ${mappedSignals}, Total with signals: ${crosswalksWithSignals}`);

        // 신호등 설치율 계산
        const signalInstallationRate = (totalCrosswalks && totalCrosswalks > 0)
            ? Math.round((crosswalksWithSignals / totalCrosswalks) * 100 * 10) / 10 
            : 0;

        console.log(`[KPI API] Signal installation rate: ${signalInstallationRate}%`);

        // 사고 데이터 조회 (예시 - 실제 테이블명에 맞게 수정 필요)
        console.log("[KPI API] Counting accidents...");
        const { count: totalAccidents, error: accidentError } = await supabase
            .from("ACC")
            .select("*", { count: 'exact', head: true });

        if (accidentError) {
            console.warn("Error counting accidents:", accidentError);
        }

        console.log(`[KPI API] Total accidents: ${totalAccidents}`);

        const kpiData = {
            totalCrosswalks: totalCrosswalks || 0,
            signalInstallationRate: signalInstallationRate,
            totalAccidents: totalAccidents || 0,
            // 임시 값들 (실제 계산 로직으로 대체 가능)
            accidentReductionRate: 12.3,
            safetyIndex: 85.2
        };

        console.log("[KPI API] Final KPI data:", kpiData);
        return NextResponse.json(kpiData);
    } catch (error) {
        console.error("KPI API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}