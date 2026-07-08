import type {
  Analysis,
  AnalysisSummary,
  AnalyzeRequest,
  Category,
  CompareResponse,
  Demographics,
  DiscoveryResponse,
  GeocodeResult,
  GeoJSONFC,
  OutletImportReport,
  Region,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    let code = "ERROR";
    let message = res.statusText;
    try {
      const body = await res.json();
      const detail = body?.detail;
      if (detail && typeof detail === "object") {
        code = detail.code ?? code;
        message = detail.message ?? message;
      } else if (typeof detail === "string") {
        message = detail;
      }
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, code, message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  categories: () => req<Category[]>("/categories"),
  regions: (level?: string) =>
    req<Region[]>(`/regions${level ? `?level=${level}` : ""}`),
  demographics: (regionId: number) =>
    req<Demographics>(`/regions/${regionId}/demographics`),
  geocode: (q: string) => req<GeocodeResult[]>(`/geocode?q=${encodeURIComponent(q)}`),
  reverseGeocode: (lat: number, lng: number) =>
    req<{ region_id: number; name: string; level: string; address_approx: string }>(
      `/reverse-geocode?lat=${lat}&lng=${lng}`,
    ),
  places: (p: {
    lat: number;
    lng: number;
    radius_m: number;
    category_id?: number;
    place_type: "competitor" | "anchor";
  }) => {
    const q = new URLSearchParams({
      lat: String(p.lat),
      lng: String(p.lng),
      radius_m: String(p.radius_m),
      place_type: p.place_type,
    });
    if (p.category_id != null) q.set("category_id", String(p.category_id));
    return req<GeoJSONFC>(`/places?${q.toString()}`);
  },
  analyze: (body: AnalyzeRequest) =>
    req<Analysis>("/analyses", { method: "POST", body: JSON.stringify(body) }),
  getAnalysis: (id: string) => req<Analysis>(`/analyses/${id}`),
  listAnalyses: (limit = 50) => req<AnalysisSummary[]>(`/analyses?limit=${limit}`),
  patchAnalysis: (id: string, name: string) =>
    req<Analysis>(`/analyses/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  deleteAnalysis: (id: string) =>
    req<void>(`/analyses/${id}`, { method: "DELETE" }),
  compare: (ids: string[]) =>
    req<CompareResponse>(`/analyses/compare?ids=${ids.join(",")}`),
  discovery: (categorySlug: string, regionId: number, limit = 10) =>
    req<DiscoveryResponse>(
      `/discovery?category_slug=${categorySlug}&region_id=${regionId}&limit=${limit}`,
    ),
  importOutlets: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<OutletImportReport>("/outlets/import", { method: "POST", body: fd });
  },
  listOutlets: () => req<GeoJSONFC>("/outlets"),
  deleteOutlets: (batch?: string) =>
    req<{ deleted: number }>(`/outlets${batch ? `?import_batch=${batch}` : ""}`, {
      method: "DELETE",
    }),
};
