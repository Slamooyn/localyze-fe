"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { forwardRef, type ReactNode } from "react";
import Map, { type MapLayerMouseEvent, type MapRef, NavigationControl } from "react-map-gl/maplibre";

import { JAKSEL_VIEW, MAP_STYLE } from "@/lib/mapStyle";

interface Props {
  onClick?: (e: MapLayerMouseEvent) => void;
  onMouseMove?: (e: MapLayerMouseEvent) => void;
  interactiveLayerIds?: string[];
  children?: ReactNode;
  cursor?: string;
}

const MapCanvas = forwardRef<MapRef, Props>(function MapCanvas(
  { onClick, onMouseMove, interactiveLayerIds, children, cursor },
  ref,
) {
  return (
    <Map
      ref={ref}
      initialViewState={JAKSEL_VIEW}
      mapStyle={MAP_STYLE}
      style={{ width: "100%", height: "100%" }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      interactiveLayerIds={interactiveLayerIds}
      cursor={cursor}
      attributionControl={true}
      maxBounds={[
        [106.6, -6.5],
        [107.0, -6.05],
      ]}
    >
      <NavigationControl position="bottom-right" showCompass={false} />
      {children}
    </Map>
  );
});

export default MapCanvas;
