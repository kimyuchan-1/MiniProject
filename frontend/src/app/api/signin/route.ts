import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

type SignInBody = {
  email?: string;
  password?: string;
};

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as SignInBody;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Signin failed", detail: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = mustGetEnv("NEXT_PUBLIC_SUPABASE_URL");
    const serviceKey = mustGetEnv("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
    const jwtSecret = mustGetEnv("JWT_SECRET");

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const emailNorm = normalizeEmail(email);

    // 1) 사용자 조회
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password, name, role, picture")
      .eq("email", emailNorm)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { message: "Signin failed", detail: error.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "Signin failed", detail: "Invalid login credentials" },
        { status: 401 }
      );
    }

    // 2) 비밀번호 검증
    // user.password는 bcrypt 해시라고 가정.
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { message: "Signin failed", detail: "Invalid login credentials" },
        { status: 401 }
      );
    }

    // 3) JWT 발급 (7일 예시)
    const secretKey = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({
      sub: String(user.id),
      email: user.email,
      role: user.role ?? "USER",
      name: user.name ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    // 4) httpOnly 쿠키로 저장
    const res = NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          picture: user.picture,
        },
        token, // 프론트에서 헤더로 쓰고 싶으면 남기고, 쿠키만 쓸 거면 제거해도 됨
      },
      { status: 200 }
    );

    res.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { message: "Signin failed", detail: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
