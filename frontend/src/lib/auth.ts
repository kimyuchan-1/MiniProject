import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export type AuthUser = {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(mustGetEnv("JWT_SECRET"));
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.sub ?? null,
      email: (payload as any).email ?? null,
      name: (payload as any).name ?? null,
      role: (payload as any).role ?? null,
    };
  } catch {
    return null;
  }
}
