import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ provider: string }> }
) {
  const { provider } = await ctx.params;

  const backend = process.env.BACKEND_URL; // 서버 전용 env 권장
  if (!backend) {
    return NextResponse.json({ error: "BACKEND_URL is not set" }, { status: 500 });
  }

  return NextResponse.redirect(`${backend}/oauth2/authorization/${provider}`);
}
