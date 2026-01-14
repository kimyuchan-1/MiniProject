import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ provider: string }> }
) {
  const { provider } = await ctx.params;

  const backend = process.env.BACKEND_URL;
  if (!backend) return NextResponse.json({ error: "BACKEND_URL missing" }, { status: 500 });

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) return NextResponse.json({ error: "missing code" }, { status: 400 });

  // 1) 백엔드에 코드 교환 요청
  const r = await fetch(`${backend}/auth/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, code, state }),
  });

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    return NextResponse.json({ error: "exchange failed", detail: t }, { status: 401 });
  }

  const data = (await r.json()) as {
    accessToken: string;
    refreshToken?: string;
  };

  // 2) Next 도메인 쿠키로 저장 + 리다이렉트
  const res = NextResponse.redirect(new URL("/", url));
  res.cookies.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: false, // 운영 https면 true
    sameSite: "lax",
    path: "/",
  });

  if (data.refreshToken) {
    res.cookies.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}
