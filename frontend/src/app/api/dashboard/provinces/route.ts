import { NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function GET() {
  try {
    const response = await backendClient.get("/api/dashboard/provinces");
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[Dashboard Provinces API] Error:", error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to fetch provinces" },
      { status: error.response?.status || 500 }
    );
  }
}
