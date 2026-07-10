# Prompt Claude Code — Localyze Frontend App (v2 — Analytical Dashboard)

> Copy-paste prompt di bawah ini ke Claude Code dari root repo `localyze-fe`.
> Prasyarat: backend `localyze-be` sudah jalan di `http://localhost:8000` (M1–M7, termasuk auth).

---

```
Kamu adalah frontend engineer + UI craftsperson (gunakan skill UIUXProMax) untuk
Localyze — Franchise Location Intelligence Platform. Target user: executive /
expansion manager. Referensi kualitas visual: dashboard SaaS analitik enterprise
modern (sidebar navy gelap + konten terang, KPI stat cards, chart cards dalam grid) —
setara produk komersial, bukan tugas kuliah.

## LANGKAH PERTAMA (WAJIB)
Baca spec ini sampai selesai sebelum menulis kode:
1. markdowns/mvp-feature-spec.md (v2) — app shell, KPI cards, layar, flows, auth pages,
   design tokens, component inventory
2. markdowns/tech-`stack-frontend.md — stack final + struktur route
3. ../localyze-be/markdowns/api-contract.md — semua shape request/response TERMASUK §0 Auth
4. markdowns/design-craft-guidelines.md — WAJIB: filosofi motion & polish ala Emil
   Kowalski (motion tokens, micro-interactions per komponen, polish checklist).
   Buat src/lib/motion.ts dari §2 dokumen itu di M1 dan pakai di semua animasi.
   sonner (toast) & vaul (sheet/drawer) diizinkan — selain itu tetap tanpa lib komponen.
Catatan: landing page (/) BUKAN scope prompt ini — dikerjakan terpisah via
claude-code-prompt-landing.md. Sediakan / sebagai redirect sementara ke /login.
breakdown.*.factors[].evidence dari API sudah kalimat siap-render — jangan disusun ulang.

## LOGO (WAJIB)
File logo resmi ada di src/app/image copy.png. Langkah pertama M1: salin ke
public/logo-localyze.png dan generate favicon dari file itu. SEMUA logo (sidebar,
auth pages, favicon) merujuk public/logo-localyze.png. Background logo putih —
di sidebar navy bungkus container putih rounded-xl. JANGAN generate logo sendiri.

## TECH STACK (fixed, jangan diganti)
- Next.js 14 App Router + TypeScript strict, Tailwind CSS
- MapLibre GL JS + react-map-gl, tiles OSM gratis (tanpa token/API key)
- TanStack Query (fetching), Zustand + persist (auth token, compare tray, kategori,
  sidebar collapse), Framer Motion (transisi halus, jangan berlebihan)
- Ikon: lucide-react. Font: Inter (next/font). TANPA component library berat —
  bangun komponen sendiri sesuai inventory spec §12.

## API CLIENT & AUTH
- src/lib/api/types.ts manual 1:1 dari api-contract.md; satu client fetch dengan
  NEXT_PUBLIC_API_URL + interceptor Authorization: Bearer dari Zustand.
- Respons 401 → clear token → redirect /login?next=<path>.
- Route guard semua /app/*: tanpa token → /login.

## URUTAN PENGERJAAN (commit per milestone)
M1. Scaffold + logo + design tokens (§3 spec sebagai Tailwind theme) + APP SHELL:
    Sidebar navy collapsible (logo, nav 6 item + indikator aktif cyan, collapse btn),
    Topbar (GlobalSearch ⌘K, CategorySwitcher, chip coverage, bell placeholder,
    UserMenu), PageHeader. Routing 5 halaman /app/* + /register /login shells +
    / redirect. Shell harus sudah terlihat kelas enterprise di milestone ini.
M2. Auth: halaman register & login (layout split — form kiri, panel navy kanan
    dengan logo + tagline), tombol "Masuk sebagai akun demo" (demo@localyze.id/
    demo1234), validasi inline, error states, redirect ?next, guard aktif.
M3. Dashboard Analisis (/app) — layar inti: KPI stat cards row 6 card (ikon soft-bg,
    delta chip, skeleton state) + Card Peta (pin draggable, radius rings 1/2/5km via
    segmented control, layer toggles) + Card Score Breakdown (ScoreDial, PillarBars,
    FactorBreakdown expandable sampai evidence, ModeledBadge, ConfidenceChip) +
    auto-analyze dari ?lat&lng&analyze=1. Empty/loading/OUT_OF_COVERAGE/error states
    per card sesuai spec §6.
M4. Grid bawah /app: CompetitorTable (hover row ↔ highlight pin dua arah, pin ukuran
    ∝ exp(-distance_m/decay_tau_m)) + DemographicCard (bar usia, sumber data) +
    TeaserCard Phase 2 locked + CannibalizationCard (muncul bila penalty > 0).
M5. Discovery (/app/discovery): KPI row kecil + card heatmap + card Top-10 ranked
    list + hover sync + klik → /app?lat&lng&analyze=1.
M6. Compare (CompareTray global ≤3 + /app/compare kolom side-by-side + highlight
    factor_winners) + History (tabel, inline rename → PATCH, filter verdict).
M7. Outlets (/app/settings/outlets): CsvDropzone → laporan import + skipped rows,
    daftar outlet, toggle layer peta global. Lalu polish pass: transisi, focus
    states, kontras, tsc + ESLint clean.

## QUALITY BAR (UIUXProMax + design-craft-guidelines.md)
- Ikuti motion tokens & resep micro-interaction per komponen di design-craft-guidelines.md
  §2-§4: animate hanya transform/opacity, entrance easeOutExpo, exit 0.8x lebih cepat,
  animasi masuk sekali saja (refetch tidak memicu ulang), reduced-motion dihormati.
- Definition of Done tiap milestone = §6 dokumen itu (no layout shift, interruptible,
  keyboard pass, zoom-out pass).
- Verdict SELALU badge teks + warna, tidak pernah warna saja.
- Angka skor tabular-nums; skeleton per card = layout final persis.
- Semua state URL-addressable (?lat&lng&category) — demo harus bisa di-deep-link.
- Desktop-first 1280+; sidebar collapsed harus tetap usable di 1024.
- Komponen kecil terisolasi, nama sesuai inventory spec §12.

## DEMO ACCEPTANCE (alur video demo, cek manual di akhir)
1. Buka / → redirect /login → klik "Masuk sebagai akun demo" → mendarat di /app
   dan dashboard TERISI (2 analisis contoh dari seed, KPI + breakdown render).
2. Ketik "Tebet" di GlobalSearch → analisis jalan → 6 KPI cards + breakdown
   ter-update <2 dtk, breakdown bisa expand sampai evidence.
3. Drag pin 500m → skor berubah tanpa flicker; ganti radius via segmented control.
4. /app/discovery Kebayoran Baru → heatmap + top-10 → klik rank 1 → /app auto-analyze.
5. Tambah 2 lokasi ke tray → /app/compare → factor winners ter-highlight.
6. Import CSV outlet → analisis dekat outlet → KPI Kanibalisasi merah + card muncul,
   composite turun.
7. Logout → /app diblokir → login ulang → riwayat masih ada.

Kerjakan M1 sekarang. Setelah tiap milestone: screenshot + ringkasan sebelum lanjut.
```
