import { NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";
import { forwardSetCookie } from "@/lib/forwardSetCookie";
import axios from "axios";

export async function POST(req: Request) { 
    const cookie = req.headers.get("cookie") ?? "";

    try {
        const upstream = await backendClient.post(
            "/api/auth/signout",
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookie,
                },
                validateStatus: () => true,
            }
                
        );

        const res = NextResponse.json({ok:upstream.status >= 200 && upstream.status < 300}, {status: upstream.status});

        forwardSetCookie(res, upstream.headers);

        if (!upstream.headers?.['set-cookie']) {
            res.headers.append(
                'set-cookie',
                'JSESSIONID=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
            );
        }
        return res;
    } catch(err:any) {
        if (axios.isAxiosError(err)) {
            return NextResponse.json(
                {message: "Upstream error", detail: err.message},
                {status: 502}
            );
        }
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
