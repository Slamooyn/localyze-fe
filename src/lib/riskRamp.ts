// Flood-risk choropleth ramp (spec 2A.1: low opacity, blue→red).
// Single source for the maplibre fill layer and the map legend gradient.

export const FLOOD_RAMP_STOPS: [level: number, color: string][] = [
  [1, "#3B82F6"], // level 1 — low (blue)
  [3, "#8B5CF6"], // level 3 — medium (violet midpoint)
  [5, "#DC2626"], // level 5 — high (red)
];

export const FLOOD_FILL_OPACITY = 0.25;

export const FLOOD_RAMP_CSS = `linear-gradient(90deg, ${FLOOD_RAMP_STOPS.map(
  ([, c]) => c,
).join(", ")})`;
