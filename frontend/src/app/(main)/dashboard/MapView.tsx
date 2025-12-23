'use client'

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

type CW = {
    cw_uid: string;
    sido: string;
    sigungu: string;
    address: string;
    crosswalk_lat: number;
    crosswalk_lon: number;
    hasSignal: boolean;
}

const iconHas = L.divIcon({
  className: "",
  html: `
    <div style="
      width:18px;height:18px;
      border-radius:9999px;
      background:#22c55e;
      border:2px solid white;
      box-shadow:0 1px 6px rgba(0,0,0,.35);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
});

const iconNone = L.divIcon({
  className: "",
  html: `
    <div style="
      width:0;height:0;
      border-left:10px solid transparent;
      border-right:10px solid transparent;
      border-top:18px solid #ef4444;
      filter: drop-shadow(0 1px 4px rgba(0,0,0,.35));
    "></div>
  `,
  iconSize: [20, 18],
  iconAnchor: [10, 18],
  popupAnchor: [0, -14],
});

function BoundsFetcher({ onData, onLoading }: { onData: (rows: CW[]) => void; onLoading: (v: boolean) => void }) {
    useMapEvents({
        moveend: async (e) => {
            const map = e.target;
            const bound = map.getBounds();
            const bounds = `${bound.getSouth()},${bound.getWest()},${bound.getNorth()},${bound.getEast()}`;

            onLoading(true);

            try {
                const res = await fetch(
                    `/api/map/crosswalks?bounds=${encodeURIComponent(bounds)}`,
                    { cache: "no-store" }
                );

                let json: unknown;

                try {
                    json = await res.json();
                } catch {
                    console.error("[MapView] invalid JSON response");
                    onData([]); 
                    return;
                }

                if (!res.ok) {
                    console.error("[MapView] API error:", json);
                    onData([]); 
                    return;
                }

                if (!Array.isArray(json)) {
                    console.error("[MapView] response is not array:", json);
                    onData([]); 
                    return;
                }

                onData(json as CW[]);
            } catch (err) {
                console.error("[MapView] fetch failed:", err);
                onData([]); 
            } finally {
                onLoading(false);
            }
        },
    });

    return null;
}

export default function MapView() {
    const [rows, setRows] = useState<CW[]>([]);
    const [loading, setLoading] = useState(false);

    const center = useMemo<[number, number]>(() => [37.5665, 126.978], []);

    return (
        <section className="relative w-full">
            <div className="relative h-[70vh] min-h-130 w-full overflow-hidden rounded-2xl border bg-white shadow">
                <MapContainer center={center} zoom={12} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <BoundsFetcher onData={setRows} onLoading={setLoading} />

                    <MarkerClusterGroup chunkedLoading
                        // 옵션: 너무 일찍 풀리지 않게
                        // disableClusteringAtZoom={16}
                        // 옵션: 클러스터 반경(값 클수록 더 잘 뭉침)
                        // maxClusterRadius={50} 
                    >
                    {rows.map((cw) => (
                        <Marker
                            key={cw.cw_uid}
                            position={[cw.crosswalk_lat, cw.crosswalk_lon]}
                            icon={cw.hasSignal ? iconHas : iconNone}
                        >
                            <Popup>
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold">횡단보도</div>
                                    <div className="text-sm">{cw.address}</div>
                                    <div className="text-xs text-slate-600">
                                        {cw.sido} {cw.sigungu}
                                    </div>
                                    <div className="text-xs">
                                        신호등:{" "}
                                        <span
                                            className={
                                                cw.hasSignal
                                                    ? "font-semibold text-emerald-600"
                                                    : "font-semibold text-red-600"
                                            }
                                        >
                                            {cw.hasSignal ? "있음(100m 내)" : "없음(100m 내)"}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    </MarkerClusterGroup>
                </MapContainer>

                {/* 로딩 뱃지 */}
                <div
                    className={[
                        "pointer-events-none absolute right-3 top-3 z-999 rounded-full border bg-white/90 px-3 py-1 text-xs shadow transition-opacity",
                        loading ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                >
                    불러오는 중…
                </div>

                {/* 범례 */}
                <div className="pointer-events-none absolute left-3 bottom-3 z-999 rounded-xl border bg-white/90 p-3 text-xs shadow">
                    <div className="mb-2 font-semibold text-slate-800">범례</div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white shadow" />
                        100m 내 신호등 있음
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white shadow" />
                        100m 내 신호등 없음
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                <div>표시된 횡단보도: <span className="font-semibold">{rows.length}</span></div>
                <div className="text-xs text-slate-500">지도를 이동하면 현재 화면 영역만 불러온다</div>
            </div>
        </section>
    );
}