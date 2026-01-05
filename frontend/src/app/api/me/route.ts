import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("access_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Not signed in" },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(mustGetEnv("JWT_SECRET"));
    const { payload } = await jwtVerify(token, secret);

    // payload는 signin에서 넣은 값(sub/email/role/name 등)
    return NextResponse.json(
      {
        ok: true,
        user: {
          id: payload.sub ?? null,
          email: (payload as any).email ?? null,
          role: (payload as any).role ?? null,
          name: (payload as any).name ?? null,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
