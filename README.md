# Localyze Frontend

Next.js 14 (App Router) + Tailwind + MapLibre GL. Executive-first UI for franchise
location intelligence. Talks to the Localyze backend at `NEXT_PUBLIC_API_URL`.

## Run

```bash
npm install
cp .env.local.example .env.local   # or create .env.local (see below)
npm run dev                        # http://localhost:3000  (redirects to /app)
```

Requires the backend running at `http://localhost:8000` (see `../localyze-be/README.md`).

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Routes (v2 — auth + analytical dashboard)

```
/                       → Landing page (interactive, works without backend)
/register  /login       → Auth (split layout; "Masuk sebagai akun demo" button)
/app                    → Dashboard: 6 KPI cards + map + score breakdown + grid
/app/discovery          → Location Discovery: score heatmap + top-10
/app/compare?ids=a,b,c  → side-by-side comparison
/app/history            → saved analyses (search, verdict filter, inline rename)
/app/settings/outlets   → CSV outlet import + map layer toggle
```

`/app/*` is auth-guarded (redirects to `/login?next=…`). The token is stored in
Zustand + localStorage and sent as `Authorization: Bearer` on every request; a 401
clears it and bounces to login. Demo account: `demo@localyze.id` / `demo1234`
(pre-seeded with a prime + an avoid analysis and 3 outlets).

## Stack

- **Next.js 14** App Router, TypeScript strict, Tailwind (design tokens = verdict + brand colors)
- **MapLibre GL** + react-map-gl, CARTO light raster tiles (no API key)
- **TanStack Query** (fetch/cache), **Zustand** + persist (category, compare tray, layers)
- **Framer Motion** (panel transitions), **lucide-react** icons
- Small SVG components built in-house (ScoreDial, PillarBar, PercentileBar) — no chart lib

## Notes / deviations

- **Inter** is loaded via a runtime `<link>` in the root layout (with a system-ui
  fallback) instead of `next/font/google`, to avoid a build-time font download.
- All key state is URL-addressable (`/app?lat&lng&category`) so demos are deep-linkable.
- Verdict is always shown as text **and** color (accessibility); scores use `tabular-nums`.

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```
