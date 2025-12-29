import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CrosswalkPopup } from './CrosswalkPopup';
import { useCrosswalkDetails, convertToEnhancedCrosswalk } from '@/hooks/useCrosswalkDetails';

interface CrosswalkMarkerWithPopupProps {
  crosswalk: any; // 기존 Crosswalk 타입
  onMarkerClick?: (crosswalk: any) => void;
  icon?: L.DivIcon;
}

// 기존 아이콘 (MapView에서 가져옴)
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

export function CrosswalkMarkerWithPopup({ crosswalk, onMarkerClick, icon }: CrosswalkMarkerWithPopupProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const enhancedCrosswalk = convertToEnhancedCrosswalk(crosswalk);
  
  const { data, nearbyAccidents, loading, error } = useCrosswalkDetails({
    crosswalk: popupOpen ? enhancedCrosswalk : null,
    enabled: popupOpen
  });

  const handleMarkerClick = () => {
    setPopupOpen(true);
    onMarkerClick?.(crosswalk);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  return (
    <Marker
      position={[crosswalk.crosswalk_lat, crosswalk.crosswalk_lon]}
      icon={icon ?? (crosswalk.hasSignal ? iconHas : iconNone)}
      eventHandlers={{
        click: handleMarkerClick
      }}
    >
      <Popup
        maxWidth={400}
        autoPan={false}
        autoPanPaddingTopLeft={[16, 80]}    
        autoPanPaddingBottomRight={[16, 16]}
        keepInView={true}
        className="enhanced-crosswalk-popup-container"
        eventHandlers={{
          remove: handlePopupClose
        }}
      >
        <div className="popup-content">
          {loading ? (
            <div className="loading-state p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">상세 정보를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="error-state p-4 text-center">
              <p className="text-sm text-red-600 mb-2">정보를 불러올 수 없습니다</p>
              <p className="text-xs text-gray-500">{error}</p>
              {/* 기본 정보라도 표시 */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800">횡단보도</h3>
                <p className="text-sm text-gray-600">{crosswalk.address}</p>
                <p className="text-xs text-gray-500">{crosswalk.sido} {crosswalk.sigungu}</p>
                <div className="mt-2">
                  <span className={`text-sm font-medium ${crosswalk.hasSignal ? 'text-green-600' : 'text-red-600'}`}>
                    신호등: {crosswalk.hasSignal ? '있음' : '없음'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <CrosswalkPopup 
              crosswalk={enhancedCrosswalk}
              nearbyAccidents={nearbyAccidents}
            />
          )}
        </div>

        <style jsx global>{`
          .enhanced-crosswalk-popup-container .leaflet-popup-content-wrapper {
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .enhanced-crosswalk-popup-container .leaflet-popup-content {
            margin: 0;
            padding: 0;
            width: auto !important;
          }
          
          .enhanced-crosswalk-popup-container .leaflet-popup-tip {
            background: white;
          }
          
          .popup-content {
            max-height: 250px;
            overflow-y: auto;
          }
          
          .loading-state, .error-state {
            min-width: 220px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </Popup>
    </Marker>
  );
}