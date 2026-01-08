import { cookies } from "next/headers";
import { backendClient } from "@/lib/backendClient"; // 네 경로로 수정

export type AuthUser = {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  // Next(server) -> Spring Boot로 쿠키 수동 전달
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (!cookieHeader) return null;

  try {
    const res = await backendClient.get("/api/auth/me", {
      headers: { cookie: cookieHeader },
      validateStatus: (s) => s >= 200 && s < 500,
    });

    if (res.status !== 200) return null;

    // 백엔드 응답 DTO에 맞춰 매핑
    const data = res.data ?? {};
    return {
      id: data.id?.toString?.() ?? data.id ?? null,
      email: data.email ?? null,
      name: data.name ?? null,
      role: data.role ?? null,
    };
  } catch {
    return null;
  }
}
