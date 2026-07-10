"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useRef, useState } from "react";
import Map, { Layer, type MapRef, Marker, Source } from "react-map-gl/maplibre";

import { ScoreDial } from "@/components/ScoreDial";
import { VerdictBadge } from "@/components/VerdictBadge";
import { circlePolygon } from "@/lib/format";
import { MAP_STYLE } from "@/lib/mapStyle";
import { SAMPLE_LOCATIONS, scoreLocation } from "@/landing/scoring-mini";

export function MiniMap() {
  const mapRef = useRef<MapRef>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = SAMPLE_LOCATIONS.find((l) => l.id === selectedId) ?? null;
  const scored = selected ? scoreLocation(selected) : null;

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:h-[420px]">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 106.818, latitude: -6.252, zoom: 11.6 }}
        mapStyle={MAP_STYLE}
        interactive={false}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        {selected && (
          <Source id="mini-ring" type="geojson" data={circlePolygon(selected.lng, selected.lat, 800)}>
            <Layer
              id="mini-ring-line"
              type="line"
              paint={{ "line-color": "#2563EB", "line-width": 2, "line-opacity": 0.7 }}
            />
          </Source>
        )}
        {SAMPLE_LOCATIONS.map((loc) => {
          const active = loc.id === selectedId;
          return (
            <Marker key={loc.id} longitude={loc.lng} latitude={loc.lat} anchor="center">
              <button
                onClick={() => setSelectedId(loc.id)}
                aria-label={`Analisis ${loc.name}`}
                className="relative flex h-5 w-5 items-center justify-center"
              >
                {!active && (
                  <span className="absolute inline-flex h-full w-full animate-pin-pulse rounded-full bg-cyan-400/60" />
                )}
                <span
                  className={`relative inline-flex rounded-full border-2 border-white ${
                    active ? "h-4 w-4 bg-brand" : "h-3 w-3 bg-cyan-400"
                  }`}
                />
              </button>
            </Marker>
          );
        })}
      </Map>

      {/* Instruction / result overlay */}
      {!scored ? (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow">
          Klik titik berdenyut → lihat skornya dalam 10 detik
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
          <ScoreDial score={scored.composite} verdict={scored.verdict} size={84} label="" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{selected!.name}</p>
            <div className="mt-1">
              <VerdictBadge verdict={scored.verdict} size="sm" showSubtitle />
            </div>
            <p className="tnum mt-1 text-[11px] text-slate-400">
              Demand {scored.demand.toFixed(0)} · Kompetisi {scored.competition.toFixed(0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
