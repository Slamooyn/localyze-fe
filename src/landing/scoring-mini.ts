// Pure client-side port of the backend scoring formula (scoring-algorithm.md §1).
// Used by the landing page so it stays 100% alive without the backend.
import type { Verdict } from "@/lib/api/types";
import samples from "./sample-locations.json";

export interface SampleFactor {
  key: string;
  label: string;
  raw_value: number;
  unit: string;
  percentile: number;
  weight: number;
  contribution: number;
  evidence: string;
  is_modeled?: boolean;
}

export interface SampleLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  competitor_distances_m: number[];
  factors: SampleFactor[];
}

export const SAMPLE_LOCATIONS = samples as SampleLocation[];

export const DEFAULTS = { demandWeight: 0.55, tau: 600, penalty: 0 };
const PRESSURE_SCALE = 12;

export function clamp(v: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, v));
}

export function decay(distanceM: number, tau: number): number {
  return Math.exp(-distanceM / tau);
}

export function pressure(distances: number[], tau: number): number {
  return distances.reduce((sum, d) => sum + decay(d, tau), 0);
}

export function competitionScore(distances: number[], tau: number): number {
  return clamp(100 - pressure(distances, tau) * PRESSURE_SCALE);
}

export function composite(
  demand: number,
  competition: number,
  demandWeight: number,
  penalty = 0,
): number {
  const wc = 1 - demandWeight;
  return clamp(demandWeight * demand + wc * competition - penalty);
}

export function verdictFromScore(score: number): Verdict {
  if (score >= 80) return "prime";
  if (score >= 65) return "strong";
  if (score >= 50) return "conditional";
  return "avoid";
}

export interface ScoredLocation {
  composite: number;
  demand: number;
  competition: number;
  verdict: Verdict;
}

export function scoreLocation(
  loc: SampleLocation,
  opts: { demandWeight?: number; tau?: number; penalty?: number } = {},
): ScoredLocation {
  const demandWeight = opts.demandWeight ?? DEFAULTS.demandWeight;
  const tau = opts.tau ?? DEFAULTS.tau;
  const penalty = opts.penalty ?? DEFAULTS.penalty;
  const competition = competitionScore(loc.competitor_distances_m, tau);
  const comp = composite(loc.demand, competition, demandWeight, penalty);
  return {
    composite: comp,
    demand: loc.demand,
    competition,
    verdict: verdictFromScore(comp),
  };
}
