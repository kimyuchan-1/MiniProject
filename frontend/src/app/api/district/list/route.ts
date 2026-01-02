import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // ✅ 너 district 테이블 컬럼에 맞게 여기만 조정하면 됨
  // 예시: district_code(10자리 또는 그 이상), district_name
  const { data, error } = await supabase
    .from("District")
    .select("district_id, district_name")
    .order("district_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []).map((r: any) => {
    const code5 = String(r.district_code ?? "").slice(0, 5);
    return { code5, name: String(r.district_name ?? code5) };
  });

  // code5 중복 제거(같은 시군구가 여러 행으로 있을 수 있으니)
  const uniq = new Map<string, { code5: string; name: string }>();
  for (const r of rows) {
    if (r.code5 && r.code5.length === 5 && !uniq.has(r.code5)) uniq.set(r.code5, r);
  }

  return NextResponse.json(Array.from(uniq.values()));
}
