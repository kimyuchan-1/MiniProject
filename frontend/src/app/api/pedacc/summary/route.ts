import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function sigunguRangeFromPrefix(prefix5: number) {
    const base = prefix5;

    return {
        from: base * 100000,
        to: base * 100000 + 99999,
    };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region"); // 5자리

    if (!region || region.length < 5) {
        return NextResponse.json({ error: "Missing or invalid region" }, { status: 400 });
    }

    const regionNumber = parseInt(region, 10);
    if (isNaN(regionNumber)) {
        return NextResponse.json({ error: "Invalid region format" }, { status: 400 });
    }

    const { from, to } = sigunguRangeFromPrefix(regionNumber);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

    // acc 테이블 컬럼은 프로젝트 설계상 sigungu_code, year, month, 사고/사상자/사망자/중상/경상/부상신고자 카운트가 있음 :contentReference[oaicite:1]{index=1}
    const { data, error } = await supabase
        .from("ACC")
        .select("year, month, accident_count, casualty_count, fatality_count, serious_injury_count, minor_injury_count, reported_injury_count, sigungu_code")
        .gte("sigungu_code", from)
        .lte("sigungu_code", to)
        .order("year", { ascending: true })
        .order("month", { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = data ?? [];

    // 연도별 합계
    const byYear = new Map<number, any>();
    for (const r of rows) {
        const y = Number(r.year);
        const cur =
            byYear.get(y) ??
            {
                year: y,
                accident_count: 0,
                casualty_count: 0,
                fatality_count: 0,
                serious_injury_count: 0,
                minor_injury_count: 0,
                reported_injury_count: 0,
            };

        cur.accident_count += Number(r.accident_count ?? 0);
        cur.casualty_count += Number(r.casualty_count ?? 0);
        cur.fatality_count += Number(r.fatality_count ?? 0);
        cur.serious_injury_count += Number(r.serious_injury_count ?? 0);
        cur.minor_injury_count += Number(r.minor_injury_count ?? 0);
        cur.reported_injury_count += Number(r.reported_injury_count ?? 0);

        byYear.set(y, cur);
    }

    const yearly = Array.from(byYear.values()).sort((a, b) => a.year - b.year);

    return NextResponse.json({
        region,
        yearly,
        rawMonthly: rows, // 필요하면 월별 차트도 여기로 그릴 수 있게 같이 내려줌
    });
}
