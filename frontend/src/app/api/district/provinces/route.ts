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
    .order("district_code", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 시도 코드는 앞 2자리로 구분하되, 5자리 형태로 저장 (예: 11000, 42000)
  const provinces = new Map<string, { code: string; name: string }>();
  
  (data ?? []).forEach((row: any) => {
    const districtCode = String(row.district_code ?? "");
    const districtName = String(row.district_short_name ?? "");
    
    if (districtCode.length >= 2) {
      const provincePrefix = districtCode.substring(0, 2);
      const provinceCode = provincePrefix + "000"; // 5자리 형태로 만들기
      
      // 시도명 추출 (예: "서울특별시 종로구" -> "서울특별시")
      let provinceName = districtName;
      if (districtName.includes(" ")) {
        provinceName = districtName.split(" ")[0];
      }
      
      // 시도 레벨의 데이터만 포함 (공백이 없거나 첫 번째 구성요소가 시도명인 경우)
      const isProvinceLevel = !districtName.includes(" ") || 
                             provinceName.includes("특별시") || 
                             provinceName.includes("광역시") || 
                             provinceName.includes("특별자치시") || 
                             provinceName.includes("특별자치도") ||
                             provinceName.endsWith("도");
      
      if (isProvinceLevel && !provinces.has(provinceCode)) {
        provinces.set(provinceCode, {
          code: provinceCode,
          name: provinceName
        });
      }
    }
  });

  const result = Array.from(provinces.values()).sort((a, b) => a.name.localeCompare(b.name));
  
  console.log(`Provinces found: ${result.length}`);
  console.log("Provinces:", result);

  return NextResponse.json(result);
}