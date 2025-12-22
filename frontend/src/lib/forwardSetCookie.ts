import type { NextResponse } from "next/server";

export function forwardSetCookie(res: NextResponse, upstreamHeaders: unknown) {
    if (!upstreamHeaders) {
        return;
    }

    const anyHeader = upstreamHeaders as any;

    if (typeof anyHeader.getSetCookie === "function") {
        const cookies: string[] = anyHeader.getSetCookie();
        for (const c of cookies) {
            res.headers.append("Set-Cookie", c);
        }
        return;
    }

    if (typeof anyHeader.get === "function") {
        const cookie = anyHeader.get("Set-Cookie");
        if (cookie) {
            res.headers.append("Set-Cookie", cookie);
        }
        return;
    }

    const cookie = (upstreamHeaders as any)["set-cookie"] ?? (upstreamHeaders as any)["Set-Cookie"];
    if (!cookie) {
        return;
    }

    if (Array.isArray(cookie)) {
        for  (const c of cookie) {
            res.headers.append("Set-Cookie", c);
        }
    } else {
        res.headers.append("Set-Cookie", cookie);
    
    }

}