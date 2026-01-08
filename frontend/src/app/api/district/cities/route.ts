import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function prefixRange(prefix2: string) {
  const p = Number(prefix2);
  const base = p * 100_000_000; // 11 -> 1100000000
  const next = (p + 1) * 100_000_000;
  return { gte: base, lt: next };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province = (searchParams.get("province") ?? "").trim(); // "11"

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }

  if (!/^\d{2}$/.test(province)) return NextResponse.json([]);

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // 1) ACC에서 해당 prefix 시도 범위의 sigungu_code만 추출
  const { gte, lt } = prefixRange(province);

  const { data: accRows, error: accErr } = await supabase
    .from("ACC")
    .select("sigungu_code, sido_code")
    .gte("sido_code", gte)
    .lt("sido_code", lt);

  if (accErr) return NextResponse.json({ error: accErr.message }, { status: 500 });

  const sigungu10 = uniq(
    (accRows ?? [])
      .map((r: any) => String(r.sigungu_code ?? "").trim())
      .filter((s) => /^\d{10}$/.test(s)) // 10자리만
  ).sort();

  if (sigungu10.length === 0) return NextResponse.json([]);

  // 2) District에서 표시명 매핑
  //    네 규칙: district_code = district_id 앞 5자리(=sigungu_code 앞 5자리로도 같게 맞춰두는 게 안정)
  const district5 = uniq(sigungu10.map((s) => Number(s.slice(0, 5))));

  const { data: dRows, error: dErr } = await supabase
    .from("District")
    .select("district_code, district_short_name, district_name")
    .in("district_code", district5);

  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 });

  const nameByDistrict5 = new Map<number, string>();
  (dRows ?? []).forEach((r: any) => {
    const dc = Number(r.district_code);
    const shortName = String(r.district_short_name ?? "").trim();
    const fullName = String(r.district_name ?? "").trim();
    const label = shortName || fullName;
    if (Number.isFinite(dc) && label && !nameByDistrict5.has(dc)) nameByDistrict5.set(dc, label);
  });

  // 3) 최종 cities: code=10자리 sigungu_code(조인키), name=표시명
  const result = sigungu10.map((code10) => {
    const dc5 = Number(code10.slice(0, 5));
    return {
      code: code10,
      name: nameByDistrict5.get(dc5) ?? code10, // 이름 없으면 일단 코드로 (DB매핑 누락 탐지용)
    };
  });

  return NextResponse.json(result);
}
