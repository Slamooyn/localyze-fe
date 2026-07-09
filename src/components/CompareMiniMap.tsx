"use client";

import { useEffect, useRef } from "react";
import { type MapRef, Marker } from "react-map-gl/maplibre";

import type { Analysis } from "@/lib/api/types";
import { VERDICT_HEX } from "@/lib/verdict";
import MapCanvas from "./MapCanvas";

export function CompareMiniMap({ analyses }: { analyses: Analysis[] }) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!analyses.length || !mapRef.current) return;
    if (analyses.length === 1) {
      const a = analyses[0];
      mapRef.current.easeTo({ center: [a.location.lng, a.location.lat], zoom: 13 });
      return;
    }
    let minLng = 180, minLat = 90, maxLng = -180, maxLat = -90;
    for (const a of analyses) {
      minLng = Math.min(minLng, a.location.lng);
      maxLng = Math.max(maxLng, a.location.lng);
      minLat = Math.min(minLat, a.location.lat);
      maxLat = Math.max(maxLat, a.location.lat);
    }
    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 80, duration: 600, maxZoom: 14 },
    );
  }, [analyses]);

  return (
    <MapCanvas ref={mapRef}>
      {analyses.map((a, i) => (
        <Marker key={a.id} longitude={a.location.lng} latitude={a.location.lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow"
              style={{ background: VERDICT_HEX[a.score.verdict] }}
            >
              {i + 1}
            </span>
          </div>
        </Marker>
      ))}
    </MapCanvas>
  );
}
