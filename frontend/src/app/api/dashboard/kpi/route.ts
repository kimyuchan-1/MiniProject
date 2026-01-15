import { NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function GET() {
  try {
    const response = await backendClient.get("/api/dashboard/kpi");
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("[Dashboard KPI API] Error:", error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to fetch KPI data" },
      { status: error.response?.status || 500 }
    );
  }
}
