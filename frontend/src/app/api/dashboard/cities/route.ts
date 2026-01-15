import { NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get("province");

  if (!province || !province.trim()) {
    return NextResponse.json({ error: "province is required" }, { status: 400 });
  }

  try {
    const response = await backendClient.get("/api/dashboard/cities", {
      params: { province: province.trim() }
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[Dashboard Cities API] Error:", error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to fetch cities" },
      { status: error.response?.status || 500 }
    );
  }
}
