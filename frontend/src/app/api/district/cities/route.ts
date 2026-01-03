import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceCode = searchParams.get("province");

  if (!provinceCode) {
    return NextResponse.json({ error: "Province code is required" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // 시도 코드에서 앞 2자리 추출
  const provincePrefix = provinceCode.length >= 2 ? provinceCode.substring(0, 2) : provinceCode;

  const { data, error } = await supabase
    .from("District")
    .select("district_code, district_short_name")
    .order("district_short_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 클라이언트 사이드에서 필터링
  const filteredData = (data ?? []).filter((row: any) => {
    const districtCode = String(row.district_code ?? "");
    return districtCode.startsWith(provincePrefix);
  });

  const cities = filteredData
    .map((row: any) => {
      const districtCode = String(row.district_code ?? "");
      const districtName = String(row.district_short_name ?? "");
      
      // 시군구명 추출 (예: "서울특별시 종로구" -> "종로구")
      let cityName = districtName;
      let provinceName = "";
      
      if (districtName.includes(" ")) {
        const parts = districtName.split(" ");
        if (parts.length > 1) {
          provinceName = parts[0];
          cityName = parts.slice(1).join(" ");
        }
      } else {
        // 공백이 없는 경우 (예: "세종특별자치시") - 이런 경우는 시도와 동일하므로 제외
        return null;
      }
      
      return {
        code: districtCode,
        name: cityName,
        fullName: districtName,
        provinceName: provinceName
      };
    })
    .filter(city => city !== null) // null 제거
    .filter((city, index, self) => 
      // 중복 제거 (같은 코드가 있으면 첫 번째만 유지)
      index === self.findIndex(c => c.code === city.code)
    )
    .filter(city => {
      // 시군구명이 있고, 시도명과 다른 것만 포함
      return city.name && 
             city.name.trim() !== "" && 
             city.name !== city.provinceName &&
             !city.name.includes("특별시") &&
             !city.name.includes("광역시") &&
             !city.name.includes("특별자치시") &&
             !city.name.includes("특별자치도");
    });

  console.log(`Province code received: ${provinceCode}`);
  console.log(`Province prefix: ${provincePrefix}`);
  console.log(`Total districts from DB: ${data?.length || 0}`);
  console.log(`Filtered districts: ${filteredData.length}`);
  console.log(`Cities after removing province duplicates: ${cities.length}`);
  console.log("Sample cities:", cities.slice(0, 5));

  return NextResponse.json(cities);
}