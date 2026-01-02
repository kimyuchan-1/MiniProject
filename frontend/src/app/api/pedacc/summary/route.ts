import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region"); // 없으면 전국

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // region이 있으면 범위 필터, 없으면 전체
  let q = supabase
    .from("ACC")
    .select("year, month, accident_count, casualty_count, fatality_count, serious_injury_count, minor_injury_count, reported_injury_count, sigungu_code")
    .order("year", { ascending: true })
    .order("month", { ascending: true });

  if (region && region.length >= 5) {
    // bigint 컬럼이라면 LIKE 대신 범위로 처리 (이미 너가 만든 방식)
    const base = Number(region);
    const from = base * 100000;
    const to = base * 100000 + 99999;

    q = q.gte("sigungu_code", from).lte("sigungu_code", to);
  }

  const { data, error } = await q;

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
    region: region && region.length >= 5 ? region.slice(0, 5) : null,
    yearly,
    rawMonthly: rows,
  });
}
