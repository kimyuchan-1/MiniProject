import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET() {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "BACKEND_URL is not set" },
      { status: 500 }
    );
  }

  const target = new URL("/oauth2/authorization/naver", BACKEND_URL);
  return NextResponse.redirect(target.toString(), 302);
}
