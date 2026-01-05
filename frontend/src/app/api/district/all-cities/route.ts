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

  const cities = (data ?? [])
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
      // 유효한 코드가 있고, 시군구명이 있는 것만 포함 (시도와 동일한 이름 제외)
      return city.code &&
        city.code.trim() !== "" &&
        city.name &&
        city.name.trim() !== "" &&
        city.name !== city.provinceName &&
        !city.name.includes("특별시") &&
        !city.name.includes("광역시") &&
        !city.name.includes("특별자치시") &&
        !city.name.includes("특별자치도");
    });

  return NextResponse.json(cities);
}