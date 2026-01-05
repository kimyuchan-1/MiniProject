import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL("/", req.url); // 로그아웃 후 이동할 경로

  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
