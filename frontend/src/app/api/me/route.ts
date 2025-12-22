import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";
import { forwardSetCookie } from "@/lib/forwardSetCookie";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";

  const upstream = await backendClient.get("/api/me", {
    headers: {
      cookie,
      Accept: "application/json",
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
    withCredentials: true,
  });

  const res = NextResponse.json(upstream.data, { status: upstream.status });

  forwardSetCookie(res, upstream.headers);

  return res;
}
