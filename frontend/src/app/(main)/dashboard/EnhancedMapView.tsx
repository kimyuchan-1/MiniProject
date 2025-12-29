'use client'

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useMemo } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CrosswalkMarkerWithPopup } from "@/components/map/CrosswalkMarkerWithPopup";

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

function BoundsFetcher({ onData, onLoading }: { 
    onData: (rows: Crosswalk[]) => void; 
    onLoading: (v: boolean) => void;
}) {
    useMapEvents({
        moveend: async (e) => {
            const map = e.target;
            
            // 지도가 제대로 초기화되었는지 확인
            if (!map || !map.getBounds) {
                console.warn('[EnhancedMapView] Map not properly initialized');
                return;
            }

            try {
                const bound = map.getBounds();
                const bounds = `${bound.getSouth()},${bound.getWest()},${bound.getNorth()},${bound.getEast()}`;

                onLoading(true);

                // 횡단보도 데이터 로드
                const crosswalkRes = await fetch(
                    `/api/map/crosswalks?bounds=${encodeURIComponent(bounds)}`,
                    { cache: "no-store" }
                );

                if (!crosswalkRes.ok) {
                    throw new Error(`Crosswalk API Error: ${crosswalkRes.status}`);
                }

                const crosswalkJson = await crosswalkRes.json();

                if (!validateCrosswalkData(crosswalkJson)) {
                    throw new Error('Invalid crosswalk data format received from API');
                }

                onData(crosswalkJson);

            } catch (err) {
                console.error("[EnhancedMapView] Error:", err);
                onData([]); 
            } finally {
                onLoading(false);
            }
        },
    });

    return null;
}

interface EnhancedMapViewProps {
    className?: string;
    onCrosswalkClick?: (crosswalk: Crosswalk) => void;
}

export default function EnhancedMapView({ className, onCrosswalkClick }: EnhancedMapViewProps) {
    const [rows, setRows] = useState<Crosswalk[]>([]);
    const [loading, setLoading] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    const center = useMemo<[number, number]>(() => [37.5665, 126.978], []);

    const handleCrosswalkClick = (crosswalk: Crosswalk) => {
        console.log('[EnhancedMapView] Crosswalk clicked:', crosswalk);
        onCrosswalkClick?.(crosswalk);
    };

    return (
        <section className={`relative w-full ${className || ''}`}>
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
                <MapContainer 
                    center={center} 
                    zoom={12} 
                    className="h-full w-full"
                    whenReady={() => {
                        console.log('[EnhancedMapView] MapContainer ready');
                        setMapReady(true);
                    }}
                >
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
                        {rows.map((crosswalk) => (
                            <CrosswalkMarkerWithPopup
                                key={crosswalk.cw_uid}
                                crosswalk={crosswalk}
                                onMarkerClick={handleCrosswalkClick}
                            />
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

                {/* 개선된 범례 */}
                <div className="pointer-events-none absolute left-3 bottom-3 z-999 rounded-xl border bg-white/90 p-3 text-xs shadow" role="img" aria-label="지도 범례">
                    <div className="mb-2 font-semibold text-slate-800">범례</div>
                    <div className="flex items-center gap-2 mb-1" role="listitem">
                        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white shadow" aria-hidden="true" />
                        신호등 있음 (안전)
                    </div>
                    <div className="flex items-center gap-2 mb-2" role="listitem">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white shadow" aria-hidden="true" />
                        신호등 없음 (주의)
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                        💡 마커를 클릭하면 상세 정보를 확인할 수 있습니다
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                <div className="flex items-center gap-4">
                    <span>표시된 횡단보도: <span className="font-semibold">{rows.length}</span></span>
                </div>
                <div className="text-xs text-slate-500">
                    지도를 이동하면 현재 화면 영역만 불러옵니다 | 
                    <span className="ml-1 text-blue-600">마커 클릭시 상세 정보 확인</span>
                </div>
            </div>
        </section>
    );
}