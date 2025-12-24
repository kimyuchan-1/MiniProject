'use client'

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

interface Crosswalk {
    cw_uid: string;
    sido: string;
    sigungu: string;
    address: string;
    crosswalk_lat: number;
    crosswalk_lon: number;
    hasSignal: boolean;
}

function validateCrosswalkData(data: unknown): data is Crosswalk[] {
    return Array.isArray(data) && data.every(item => 
        typeof item === 'object' && 
        item !== null &&
        'cw_uid' in item &&
        'hasSignal' in item &&
        typeof item.hasSignal === 'boolean' &&
        'crosswalk_lat' in item &&
        'crosswalk_lon' in item &&
        typeof item.crosswalk_lat === 'number' &&
        typeof item.crosswalk_lon === 'number'
    );
}

const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    let size = 'small';
    
    if (count < 10) {
        size = 'small';
    } else if (count < 100) {
        size = 'medium';
    } else {
        size = 'large';
    }
    
    return L.divIcon({
        html: `<div><span>${count}</span></div>`,
        className: `custom-marker-cluster custom-marker-cluster-${size}`,
        iconSize: L.point(50, 50, true),
    });
};

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
      width:18px;height:18px;
      border-radius:9999px;
      background:#ef4444;
      border:2px solid white;
      box-shadow:0 1px 6px rgba(0,0,0,.35);
      position:relative;
    ">
      <div style="
        position:absolute;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:8px;height:2px;
        background:white;
        border-radius:1px;
      "></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
});

function BoundsFetcher({ onData, onLoading }: { onData: (rows: Crosswalk[]) => void; onLoading: (v: boolean) => void }) {
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

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const json = await res.json();

                if (!validateCrosswalkData(json)) {
                    throw new Error('Invalid data format received from API');
                }

                onData(json);
            } catch (err) {
                console.error("[MapView] Error:", err);
                onData([]); 
            } finally {
                onLoading(false);
            }
        },
    });

    return null;
}

export default function MapView() {
    const [rows, setRows] = useState<Crosswalk[]>([]);
    const [loading, setLoading] = useState(false);

    const center = useMemo<[number, number]>(() => [37.5665, 126.978], []);

    return (
        <section className="relative w-full">
            <style jsx global>{`
                /* 지도 모노톤 스타일 */
                .map-grayscale {
                    filter: grayscale(100%) contrast(120%) brightness(110%);
                }
                
                .custom-marker-cluster {
                    background-color: #3b82f6;
                    border: 3px solid white;
                    border-radius: 50%;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .custom-marker-cluster div {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                
                .custom-marker-cluster span {
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                    line-height: 1;
                }
                
                .custom-marker-cluster-small {
                    width: 40px;
                    height: 40px;
                    background-color: #3b82f6;
                }
                
                .custom-marker-cluster-small span {
                    font-size: 14px;
                }
                
                .custom-marker-cluster-medium {
                    width: 50px;
                    height: 50px;
                    background-color: #2563eb;
                }
                
                .custom-marker-cluster-medium span {
                    font-size: 16px;
                }
                
                .custom-marker-cluster-large {
                    width: 60px;
                    height: 60px;
                    background-color: #1d4ed8;
                }
                
                .custom-marker-cluster-large span {
                    font-size: 18px;
                }
            `}</style>
            <div className="relative h-[70vh] min-h-130 w-full overflow-hidden rounded-2xl border bg-white shadow">
                <MapContainer center={center} zoom={12} className="h-full w-full">
                    {/* 안정적인 OpenStreetMap 타일 + CSS 필터로 모노톤 처리 */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <BoundsFetcher onData={setRows} onLoading={setLoading} />

                    <MarkerClusterGroup 
                        chunkedLoading
                        iconCreateFunction={createClusterCustomIcon}
                        maxClusterRadius={60}
                        spiderfyOnMaxZoom={true}
                        showCoverageOnHover={false}
                        zoomToBoundsOnClick={true}
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
                <div className="pointer-events-none absolute left-3 bottom-3 z-999 rounded-xl border bg-white/90 p-3 text-xs shadow" role="img" aria-label="지도 범례">
                    <div className="mb-2 font-semibold text-slate-800">범례</div>
                    <div className="flex items-center gap-2" role="listitem">
                        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white shadow" aria-hidden="true" />
                        100m 내 신호등 있음
                    </div>
                    <div className="mt-1 flex items-center gap-2" role="listitem">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white shadow" aria-hidden="true" />
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