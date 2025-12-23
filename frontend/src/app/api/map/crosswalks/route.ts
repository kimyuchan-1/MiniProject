import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

type Bounds = { south: number; west: number; north: number; east: number };

function parseBounds(str: string | null): Bounds | null {

    if (!str) return null;
    const [south, west, north, east] = str.split(",").map(Number);
    if ([south, west, north, east].some(Number.isNaN)) return null;
    return { south, west, north, east };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const bound = parseBounds(searchParams.get("bounds"));

    if (!bound) {
        return NextResponse.json({ error: "Invalid bounds" }, { status: 400 });
    }

    const { data: crosswalks, error: cwErr } = await supabase
        .from("CW")
        .select("cw_uid,crosswalk_lat,crosswalk_lon,signal,address,sido,sigungu")
        .gte("crosswalk_lat", bound.south)
        .lte("crosswalk_lat", bound.north)
        .gte("crosswalk_lon", bound.west)
        .lte("crosswalk_lon", bound.east)
        .range(0,4999)
        .range(5000,9999)
        .range(10000,14999)
        .range(15000,19999)
        .range(20000,24999)
        .range(25000,29999)
        .range(30000,34999)
        .range(35000,39999)
        .range(40000,44999)
        .range(45000,49999);

    if (cwErr) return NextResponse.json({ error: cwErr.message }, { status: 500 });
    if (!crosswalks?.length) return NextResponse.json([]);

    const out = crosswalks.map((cw) => ({
        cw_uid: cw.cw_uid,
        crosswalk_lat: Number(cw.crosswalk_lat),
        crosswalk_lon: Number(cw.crosswalk_lon),
        address: cw.address,
        sido: cw.sido,
        sigungu: cw.sigungu,
        hasSignal: Number(cw.signal) === 1, // ✅ 0/1 → boolean
    }));

    return NextResponse.json(out);
}
