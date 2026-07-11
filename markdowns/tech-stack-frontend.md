# Localyze Frontend — Rekomendasi Framework & Tech Stack

> **Status:** Decision record · **Created:** 2026-07-08 · **Owner:** Moym
> **Keputusan:** Next.js 14 (App Router) + Tailwind CSS + MapLibre GL JS

---

## 1. Rekomendasi: Next.js 14

Satu app Next.js untuk **dua kebutuhan sekaligus**: landing page marketing (`/`) dan aplikasi dashboard (`/app/...`). Ini alasan terkuatnya — alternatif SPA murni (Vite) akan memaksa landing page jadi project terpisah atau kehilangan SEO/SSG.

1. **Landing + app dalam satu codebase.** Landing di-render statis (SSG) → cepat, SEO-friendly, bisa di-share sebagai portfolio link. App tetap client-heavy (peta) — App Router menangani keduanya tanpa konfigurasi aneh.
2. **File-based routing + layouts** cocok dengan struktur 5 layar app + landing yang punya layout beda total (landing tanpa TopBar app).
3. **Ekosistem peta React matang**: `react-map-gl` bekerja mulus dengan MapLibre di Next (dynamic import, `ssr: false` untuk canvas peta).
4. **Deep-linking** (`?lat&lng&category`) adalah kebutuhan spec — router Next menanganinya first-class, penting untuk demo.
5. **Standar industri** — untuk portfolio piece, Next.js adalah stack yang paling dikenali reviewer/recruiter.

## 2. Alternatif yang Dipertimbangkan

| Framework | Kekuatan | Kenapa tidak dipilih |
|---|---|---|
| **Vite + React (SPA)** | Setup paling ringan, dev server tercepat | Tidak ada SSG untuk landing (SEO & share preview jelek); routing & code-split manual. Layak hanya jika landing dipisah project |
| **Nuxt 3 (Vue)** | DX bagus, setara Next | Ekosistem peta & component React lebih luas; nilai portfolio React > Vue di market |
| **SvelteKit** | Bundle kecil, animasi enak | Ekosistem lebih kecil (react-map-gl tidak ada padanan sematang itu); kurang umum di lowongan |
| **Remix** | Data loading elegan | Nilai tambahnya di server-heavy CRUD; app kita client-heavy (peta) — tidak memanfaatkan kekuatannya |

## 3. Stack Lengkap (final)

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js 14, App Router, TypeScript strict | landing = SSG, app = client components |
| Styling | Tailwind CSS | design tokens dari `mvp-feature-spec.md` §2 sebagai theme |
| Peta | **MapLibre GL JS** + react-map-gl | gratis, tanpa token/API key — krusial untuk full local dev. (Mapbox GL butuh token + billing; hanya pertimbangkan saat production) |
| Tiles | OSM raster / style demo MapLibre | tanpa key |
| Data fetching | TanStack Query | cache per koordinat, retry, loading states |
| Client state | Zustand (+ persist) | compare tray, kategori aktif, layer toggles |
| Animasi | **Framer Motion** | semua animasi landing (hero canvas via RAF sendiri, ContainerScroll via useScroll) & app; TANPA GSAP |
| Angka animasi | CountUp kecil buatan sendiri / `animate` Framer | untuk stat counters landing |
| Ikon | lucide-react | |
| Font | Inter (next/font) | tabular-nums untuk skor |
| Chart kecil | SVG buatan sendiri (ScoreDial, PillarBar) | tanpa chart library — komponen kecil, kontrol penuh |
| Lint | ESLint + tsc | |

Tidak dipakai (sengaja): component library berat (MUI/AntD — ini portfolio piece, komponen dibangun sendiri), Redux (Zustand cukup), Three.js (godaan landing 3D — tolak: berat, merusak LCP, lihat `landing-page-spec.md` §aturan).

## 4. Struktur Route Final

```
/                → Landing page (SSG, layout marketing)     ← lihat landing-page-spec.md
/app             → Analyze (peta + ScorePanel)
/app/discovery   → Location Discovery
/app/compare     → Comparison
/app/history     → Riwayat
/app/settings/outlets → Outlet & CSV import
```
