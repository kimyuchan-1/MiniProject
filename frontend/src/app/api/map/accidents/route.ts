import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

type Bounds = { south: number; west: number; north: number; east: number };

function parseBounds(str: string | null): Bounds | null {
    if (!str) return null;
    const [south, west, north, east] = str.split(",").map(Number);
    if ([south, west, north, east].some(Number.isNaN)) return null;
    return { south, west, north, east };
}

interface AccidentData {
    acc_uid: string;
    sido_code: string;
    sigungu_code: string;
    year: number;
    month: number;
    accident_count: number;
    casualty_count: number;
    fatality_count: number;
    serious_injury_count: number;
    minor_injury_count: number;
    reported_injury_count: number;
    district_name?: string;
    // 히트맵을 위한 추정 좌표 (지역 중심점)
    estimated_lat?: number;
    estimated_lon?: number;
}

// 지역별 대략적인 중심 좌표 (서울 주요 구역)
const DISTRICT_COORDINATES: Record<string, { lat: number; lon: number }> = {
    // 서울특별시 주요 구
    '1111': { lat: 37.5735, lon: 126.9788 }, // 종로구
    '1114': { lat: 37.5636, lon: 126.9977 }, // 중구
    '1117': { lat: 37.5384, lon: 126.9650 }, // 용산구
    '1120': { lat: 37.5664, lon: 127.0147 }, // 성동구
    '1121': { lat: 37.5394, lon: 127.0821 }, // 광진구
    '1123': { lat: 37.5219, lon: 127.0411 }, // 동대문구
    '1126': { lat: 37.4954, lon: 127.0664 }, // 중랑구
    '1129': { lat: 37.5388, lon: 127.0823 }, // 성북구
    '1130': { lat: 37.6066, lon: 127.0925 }, // 강북구
    '1131': { lat: 37.6396, lon: 127.0255 }, // 도봉구
    '1132': { lat: 37.6541, lon: 127.0568 }, // 노원구
    '1135': { lat: 37.5714, lon: 127.0594 }, // 은평구
    '1138': { lat: 37.5791, lon: 126.9368 }, // 서대문구
    '1141': { lat: 37.5502, lon: 126.9495 }, // 마포구
    '1144': { lat: 37.5270, lon: 126.8956 }, // 양천구
    '1147': { lat: 37.5172, lon: 126.8663 }, // 강서구
    '1150': { lat: 37.4844, lon: 126.9018 }, // 구로구
    '1153': { lat: 37.4636, lon: 126.8958 }, // 금천구
    '1156': { lat: 37.4837, lon: 126.9297 }, // 영등포구
    '1159': { lat: 37.4925, lon: 126.9644 }, // 동작구
    '1162': { lat: 37.4783, lon: 126.9516 }, // 관악구
    '1165': { lat: 37.5033, lon: 127.0146 }, // 서초구
    '1168': { lat: 37.5172, lon: 127.0473 }, // 강남구
    '1171': { lat: 37.5145, lon: 127.1059 }, // 송파구
    '1174': { lat: 37.5301, lon: 127.1238 }, // 강동구
};

function getEstimatedCoordinates(sigunguCode: string | number | null): { lat: number; lon: number } | null {
    // sigungu_code를 문자열로 변환하고 유효성 검사
    if (!sigunguCode) return null;
    
    const codeStr = String(sigunguCode);
    if (codeStr.length < 4) return null;
    
    // sigungu_code의 앞 4자리로 구 식별
    const districtKey = codeStr.substring(0, 4);
    return DISTRICT_COORDINATES[districtKey] || null;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const bound = parseBounds(searchParams.get("bounds"));

    if (!bound) {
        return NextResponse.json({ error: "Invalid bounds" }, { status: 400 });
    }

    try {
        // ACC 테이블에서 사고 데이터 조회
        const { data: accidents, error: accErr } = await supabase
            .from("ACC")
            .select(`
                acc_uid,
                sido_code,
                sigungu_code,
                year,
                month,
                accident_count,
                casualty_count,
                fatality_count,
                serious_injury_count,
                minor_injury_count,
                reported_injury_count
            `)
            .limit(500); // 일단 전체 데이터 가져오기 (나중에 최적화)

        if (accErr) {
            console.error("[Accidents API] Supabase error:", accErr);
            return NextResponse.json({ error: accErr.message }, { status: 500 });
        }

        if (!accidents?.length) {
            console.log("[Accidents API] No accidents data found");
            return NextResponse.json([]);
        }

        console.log("[Accidents API] Sample accident data:", accidents[0]);

        // 데이터 형식 변환 및 좌표 추정
        const formattedAccidents = accidents
            .map((acc) => {
                try {
                    const coords = getEstimatedCoordinates(acc.sigungu_code);
                    
                    return {
                        acc_uid: acc.acc_uid,
                        sido_code: acc.sido_code,
                        sigungu_code: acc.sigungu_code,
                        year: acc.year,
                        month: acc.month,
                        accident_count: Number(acc.accident_count) || 0,
                        casualty_count: Number(acc.casualty_count) || 0,
                        fatality_count: Number(acc.fatality_count) || 0,
                        serious_injury_count: Number(acc.serious_injury_count) || 0,
                        minor_injury_count: Number(acc.minor_injury_count) || 0,
                        reported_injury_count: Number(acc.reported_injury_count) || 0,
                        estimated_lat: coords?.lat,
                        estimated_lon: coords?.lon
                    };
                } catch (error) {
                    console.error("[Accidents API] Error processing accident:", acc, error);
                    return null;
                }
            })
            .filter((acc): acc is NonNullable<typeof acc> => acc !== null)
            .filter(acc => {
                // 좌표가 있고 범위 내에 있는 데이터만 필터링
                return acc.estimated_lat && acc.estimated_lon &&
                       acc.estimated_lat >= bound.south &&
                       acc.estimated_lat <= bound.north &&
                       acc.estimated_lon >= bound.west &&
                       acc.estimated_lon <= bound.east;
            });

        console.log(`[Accidents API] Returning ${formattedAccidents.length} accidents`);
        return NextResponse.json(formattedAccidents);

    } catch (error) {
        console.error("[Accidents API] Unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}