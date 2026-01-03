import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data, error } = await supabase
    .from("District")
    .select("district_code, district_short_name")
    .order("district_short_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []).map((r: any) => {
    const code5 = String(r.district_code ?? "");
    return { code5, name: String(r.district_short_name ?? code5) };
  });

  // code5 중복 제거 및 필터링 조건 완화
  const uniq = new Map<string, { code5: string; name: string }>();
  for (const r of rows) {
    // 조건을 완화: code5가 존재하고 비어있지 않으면 포함
    if (r.code5 && r.code5.trim() !== "" && !uniq.has(r.code5)) {
      uniq.set(r.code5, r);
    }
  }

  const result = Array.from(uniq.values());
  
  // 디버깅을 위한 로깅
  console.log(`Total districts fetched: ${data?.length || 0}`);
  console.log(`Valid districts after filtering: ${result.length}`);
  console.log(`First 5 districts:`, result.slice(0, 5));

  return NextResponse.json(result);
}
