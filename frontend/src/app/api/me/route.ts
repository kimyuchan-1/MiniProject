import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { backendClient } from "@/lib/backendClient";

export async function GET(_req: Request) {
  try {
    // ✅ Next 타입에서 cookies()가 Promise면 await 필요
    const c = await cookies();
    const accessToken = c.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다", data: null },
        { status: 401 }
      );
    }

    const upstream = await backendClient.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      validateStatus: () => true,
    });

    return NextResponse.json(upstream.data ?? null, { status: upstream.status });
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { success: false, message: "백엔드 연결 실패", data: { detail: err.message } },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
