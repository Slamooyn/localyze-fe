import type { StyleSpecification } from "maplibre-gl";

// Clean, light basemap from CARTO raster tiles — free, no API key (spec: OSM/demo
// tiles, no token). Executive-first look to match the app's positioning.
export const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#eaeef2" } },
    { id: "carto", type: "raster", source: "carto" },
  ],
};

export const JAKSEL_VIEW = { longitude: 106.802, latitude: -6.28, zoom: 12 };
