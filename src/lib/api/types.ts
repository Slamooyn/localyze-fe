// Types mirrored 1:1 from localyze-be/markdowns/api-contract.md

export type Verdict = "prime" | "strong" | "conditional" | "avoid";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}
export interface AuthResponse {
  token: string;
  user: AuthUser;
}
export interface MeResponse extends AuthUser {
  created_at: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  default_radius_m: number;
  decay_tau_m: number;
  pillar_weights: { demand: number; competition: number };
}

export interface Region {
  id: number;
  bps_code: string | null;
  name: string;
  level: "city" | "district" | "subdistrict";
  parent_id: number | null;
}

export interface Demographics {
  region: { id: number; name: string; level: string };
  population: number;
  density_per_km2: number;
  age_distribution: Record<string, number>;
  purchasing_power_index: number | null;
  is_modeled: boolean;
  data_year: number;
  source: string;
}

export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
  type: "region" | "place";
  region_id: number | null;
}

export interface Factor {
  key: string;
  label: string;
  raw_value: number | null;
  unit: string;
  percentile: number;
  weight: number;
  contribution: number;
  evidence: string;
  is_modeled?: boolean;
}

export interface CompetitorInRadius {
  place_id: number;
  name: string;
  distance_m: number;
  decay_weight: number;
  is_chain: boolean;
  lat: number;
  lng: number;
}

export interface AffectedOutlet {
  outlet_id: number | null;
  name: string | null;
  distance_m: number;
  overlap_pct: number;
}

// --- Phase 2 Wave 2A: score modifiers (phase2-backend-spec.md §2) ---

export type Hazard = "flood" | "earthquake" | "landslide";

export interface HazardDetail {
  hazard: Hazard;
  level: number; // 1..5
  evidence: string;
  mitigation: string | null; // filled for level >= 3
}

export interface DisasterModifier {
  penalty: number; // 0..10 points subtracted from composite
  hazards: HazardDetail[];
  source: string; // e.g. "InaRISK 2025" | "modeled-v1"
}

export interface SynergyOpportunity {
  type: string; // anchor/place type, e.g. "office"
  count: number;
  nearest_m: number;
  weight_sum: number;
  evidence: string;
  opportunity: string;
}

export interface SynergyModifier {
  bonus: number; // 0..max_bonus points added to composite
  opportunities: SynergyOpportunity[];
}

/** New in Phase 2 — analyses created before it don't have this block.
 * Always guard renders with `breakdown.modifiers?.…`. */
export interface Modifiers {
  disaster?: DisasterModifier | null;
  synergy?: SynergyModifier | null;
}

export interface RegionRisk {
  hazard: Hazard;
  level: number;
  source: string;
  data_year: number;
}

export interface Breakdown {
  demand: { score: number; factors: Factor[] };
  competition: {
    score: number;
    factors: Factor[];
    competitors_in_radius: CompetitorInRadius[];
  };
  cannibalization: { penalty: number; affected_outlets: AffectedOutlet[] };
  /** Optional — absent on pre-Phase-2 analyses. */
  modifiers?: Modifiers;
  data_completeness: {
    demographics_available: boolean;
    purchasing_power_modeled: boolean;
    competitor_snapshot_date: string | null;
  };
}

export interface Score {
  composite: number;
  demand: number;
  competition: number;
  cannibalization_penalty: number;
  verdict: Verdict;
  confidence: number;
}

export interface Analysis {
  id: string;
  name: string | null;
  location: LatLng;
  region: { id: number; name: string } | null;
  category: { slug: string; name: string };
  radius_m: number;
  score: Score;
  breakdown: Breakdown;
  created_at: string;
}

export interface AnalysisSummary {
  id: string;
  name: string | null;
  location: LatLng;
  category: { slug: string; name: string };
  radius_m: number;
  score: { composite: number; verdict: Verdict; confidence: number };
  created_at: string;
}

export interface CompareResponse {
  analyses: Analysis[];
  deltas: {
    best_composite: string;
    factor_winners: Record<string, string>;
  };
}

export interface TopLocation {
  rank: number;
  cell_id: number;
  centroid: LatLng;
  region_name: string;
  score_composite: number;
  score_demand: number;
  score_competition: number;
  verdict: Verdict;
}

export interface DiscoveryResponse {
  top_locations: TopLocation[];
  heatmap: GeoJSONFC;
  computed_at: string;
}

export interface OutletImportReport {
  import_batch: string;
  imported: number;
  skipped: { row: number; reason: string }[];
}

/** GET /risks/choropleth?hazard=… — district polygons with hazard `level` 1..5. */
export type RiskChoroplethFC = GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  { level: number } & Record<string, unknown>
>;

// --- GeoJSON ---
export interface GeoJSONFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Record<string, unknown>;
}
export interface GeoJSONFC {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface AnalyzeRequest {
  lat: number;
  lng: number;
  category_slug: string;
  radius_m?: number | null;
  include_cannibalization?: boolean;
  name?: string | null;
}
