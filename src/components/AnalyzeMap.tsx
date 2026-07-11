"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Layer,
  type MapLayerMouseEvent,
  type MapRef,
  Marker,
  Source,
} from "react-map-gl/maplibre";

import type { GeoJSONFC, LatLng, RiskChoroplethFC } from "@/lib/api/types";
import { circlePolygon } from "@/lib/format";
import { FLOOD_FILL_OPACITY, FLOOD_RAMP_STOPS } from "@/lib/riskRamp";
import { useAppStore } from "@/lib/store";
import { AnchorPin } from "./mapPins";
import MapCanvas from "./MapCanvas";

interface Props {
  target: LatLng | null;
  radius: number;
  competitors?: { place_id: number; lat: number; lng: number; decay_weight: number; is_chain: boolean; name: string }[];
  anchors?: GeoJSONFC | null;
  outlets?: GeoJSONFC | null;
  floodRisk?: RiskChoroplethFC | null;
  onMapClick: (lat: number, lng: number) => void;
  onTargetDrag: (lat: number, lng: number) => void;
}

const RINGS = [
  { r: 1000, dash: undefined, opacity: 0.6, width: 2 },
  { r: 2000, dash: [2, 2], opacity: 0.4, width: 1.5 },
  { r: 5000, dash: [1, 3], opacity: 0.2, width: 1.5 },
];

export function AnalyzeMap({
  target,
  radius,
  competitors,
  anchors,
  outlets,
  floodRisk,
  onMapClick,
  onTargetDrag,
}: Props) {
  const mapRef = useRef<MapRef>(null);
  const loadedRef = useRef(false);
  const hovered = useAppStore((s) => s.hoveredCompetitorId);
  const setHovered = useAppStore((s) => s.setHoveredCompetitor);

  const flyToTarget = () => {
    if (target && loadedRef.current && mapRef.current) {
      mapRef.current.easeTo({
        center: [target.lng, target.lat],
        duration: 700,
        zoom: 14,
        padding: 40,
      });
    }
  };

  useEffect(flyToTarget, [target]);

  const handleClick = (e: MapLayerMouseEvent) => onMapClick(e.lngLat.lat, e.lngLat.lng);

  return (
    <MapCanvas
      ref={mapRef}
      onClick={handleClick}
      cursor="crosshair"
      onLoad={() => {
        loadedRef.current = true;
        flyToTarget();
      }}
    >
      {/* flood-risk choropleth (Phase 2) — under rings & markers */}
      {floodRisk && (
        <Source id="flood-risk" type="geojson" data={floodRisk}>
          <Layer
            id="flood-risk-fill"
            type="fill"
            paint={{
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "level"],
                ...FLOOD_RAMP_STOPS.flat(),
              ],
              "fill-opacity": FLOOD_FILL_OPACITY,
            }}
          />
        </Source>
      )}

      {/* radius rings */}
      {target &&
        RINGS.map((ring) => (
          <Source
            key={ring.r}
            id={`ring-${ring.r}`}
            type="geojson"
            data={circlePolygon(target.lng, target.lat, ring.r)}
          >
            <Layer
              id={`ring-line-${ring.r}`}
              type="line"
              paint={{
                "line-color": "#1D4ED8",
                "line-width": ring.width,
                "line-opacity": ring.opacity,
                ...(ring.dash ? { "line-dasharray": ring.dash } : {}),
              }}
            />
          </Source>
        ))}

      {/* anchors */}
      {anchors?.features.map((f, i) => (
        <Marker
          key={`anchor-${i}`}
          longitude={f.geometry.coordinates[0]}
          latitude={f.geometry.coordinates[1]}
          anchor="center"
        >
          <AnchorPin type={(f.properties.anchor_type as string) ?? "office"} name={f.properties.name as string} />
        </Marker>
      ))}

      {/* user outlets */}
      {outlets?.features.map((f, i) => (
        <Marker
          key={`outlet-${i}`}
          longitude={f.geometry.coordinates[0]}
          latitude={f.geometry.coordinates[1]}
          anchor="center"
        >
          <div
            className="h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-dark ring-2 ring-brand-dark/40"
            title={(f.properties.name as string) ?? "Outlet"}
          />
        </Marker>
      ))}

      {/* competitors (size ∝ decay weight) */}
      {competitors?.map((c) => {
        const size = 9 + c.decay_weight * 16;
        const active = hovered === c.place_id;
        return (
          <Marker key={c.place_id} longitude={c.lng} latitude={c.lat} anchor="center">
            <div
              onMouseEnter={() => setHovered(c.place_id)}
              onMouseLeave={() => setHovered(null)}
              title={c.name}
              className="rounded-full border-2 border-white transition-transform"
              style={{
                width: active ? size + 6 : size,
                height: active ? size + 6 : size,
                background: c.is_chain ? "#B91C1C" : "#EF4444",
                boxShadow: active ? "0 0 0 3px rgba(220,38,38,0.35)" : "0 1px 3px rgba(0,0,0,0.3)",
                zIndex: active ? 10 : 1,
              }}
            />
          </Marker>
        );
      })}

      {/* target pin (draggable) */}
      {target && (
        <Marker
          longitude={target.lng}
          latitude={target.lat}
          anchor="bottom"
          draggable
          onDragEnd={(e) => onTargetDrag(e.lngLat.lat, e.lngLat.lng)}
        >
          <TargetPin />
        </Marker>
      )}
    </MapCanvas>
  );
}

function TargetPin() {
  return (
    <motion.svg
      width="30"
      height="40"
      viewBox="0 0 30 40"
      className="cursor-grab drop-shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      style={{ transformOrigin: "50% 100%" }}
    >
      <path
        d="M15 0C7 0 1 6 1 13.5 1 24 15 40 15 40s14-16 14-26.5C29 6 23 0 15 0Z"
        fill="#1D4ED8"
      />
      <circle cx="15" cy="13.5" r="5" fill="#fff" />
    </motion.svg>
  );
}
