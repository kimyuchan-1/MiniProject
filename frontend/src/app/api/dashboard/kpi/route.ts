import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 });
    }

    const { data, error } = await supabase.rpc("get_kpi_summary");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // data는 jsonb 그대로 옴
    return NextResponse.json(data);

  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
