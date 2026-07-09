"use client";

import { useEffect, useRef } from "react";
import { Layer, type MapRef, Marker, Source } from "react-map-gl/maplibre";

import type { DiscoveryResponse } from "@/lib/api/types";
import { useAppStore } from "@/lib/store";
import { VERDICT_HEX } from "@/lib/verdict";
import MapCanvas from "./MapCanvas";

export function DiscoveryMap({
  data,
  onPick,
}: {
  data: DiscoveryResponse | undefined;
  onPick: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<MapRef>(null);
  const hoveredCell = useAppStore((s) => s.hoveredCellId);
  const setHoveredCell = useAppStore((s) => s.setHoveredCell);

  useEffect(() => {
    if (!data?.heatmap.features.length || !mapRef.current) return;
    let minLng = 180,
      minLat = 90,
      maxLng = -180,
      maxLat = -90;
    for (const f of data.heatmap.features) {
      const [lng, lat] = f.geometry.coordinates;
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: { top: 60, bottom: 60, left: 60, right: 60 }, duration: 700 },
    );
  }, [data]);

  return (
    <MapCanvas ref={mapRef}>
      {data && (
        <Source id="heatmap" type="geojson" data={data.heatmap}>
          <Layer
            id="heatmap-cells"
            type="circle"
            paint={{
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 6, 14, 12],
              "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "score"],
                40, VERDICT_HEX.avoid,
                55, VERDICT_HEX.conditional,
                70, VERDICT_HEX.strong,
                85, VERDICT_HEX.prime,
              ],
              "circle-opacity": 0.5,
              "circle-blur": 0.3,
            }}
          />
        </Source>
      )}

      {data?.top_locations.map((t) => {
        const active = hoveredCell === t.cell_id;
        return (
          <Marker
            key={t.cell_id}
            longitude={t.centroid.lng}
            latitude={t.centroid.lat}
            anchor="center"
          >
            <button
              onMouseEnter={() => setHoveredCell(t.cell_id)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => onPick(t.centroid.lat, t.centroid.lng)}
              className="flex items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-md transition-transform"
              style={{
                width: active ? 30 : 24,
                height: active ? 30 : 24,
                background: VERDICT_HEX[t.verdict],
                zIndex: active ? 10 : 1,
              }}
              title={`#${t.rank} ${t.region_name} — ${t.score_composite.toFixed(0)}`}
            >
              {t.rank}
            </button>
          </Marker>
        );
      })}
    </MapCanvas>
  );
}
