# Prompt Claude Code — Localyze Frontend

> Copy-paste prompt di bawah ini ke Claude Code, dijalankan dari root repo `localyze-fe`.
> Prasyarat: backend `localyze-be` sudah jalan di `http://localhost:8000` (lihat README backend).

---

```
Kamu adalah frontend engineer + UI craftsperson (gunakan skill UIUXProMax) untuk
Localyze — Franchise Location Intelligence Platform. Target user: executive /
expansion manager. Kualitas visual harus setara produk SaaS komersial, bukan tugas kuliah.

## LANGKAH PERTAMA (WAJIB)
Baca spec ini sampai selesai sebelum menulis kode:
1. markdowns/mvp-feature-spec.md — layar, flow, komponen, design tokens, states
2. markdowns/tech-stack-frontend.md — stack final + struktur route (/app prefix)
3. ../localyze-be/markdowns/api-contract.md — seluruh shape request/response
Catatan: landing page (/) BUKAN scope prompt ini — dikerjakan terpisah via
claude-code-prompt-landing.md setelah app selesai. Sediakan / sebagai placeholder
redirect ke /app untuk sementara.
Spec adalah source of truth. breakdown.*.factors[].evidence dari API sudah berupa
kalimat siap-render — jangan menyusun ulang kalimat di FE.

## TECH STACK (fixed, jangan diganti)
- Next.js 14 App Router + TypeScript strict, Tailwind CSS
- MapLibre GL JS + react-map-gl, tiles OSM gratis (tanpa token/API key apa pun)
- TanStack Query (fetching + cache), Zustand (compare tray, kategori aktif, UI state)
- Ikon: lucide-react. Font: Inter. TIDAK pakai component library berat (bangun sendiri
  komponen kecil dengan Tailwind — ini portfolio piece).

## API TYPES
Buat src/lib/api/types.ts manual 1:1 dari api-contract.md (Analysis, Breakdown, Factor,
DiscoveryResponse, dst). Semua fetch lewat satu client (src/lib/api/client.ts) dengan
NEXT_PUBLIC_API_URL.

## URUTAN PENGERJAAN (commit per milestone)
M1. Scaffold + design tokens (verdict colors & brand colors dari spec §2 sebagai
    Tailwind theme) + TopBar + CategorySwitcher + routing 5 halaman app di bawah
    prefix /app (+ / redirect sementara ke /app) + MapCanvas render peta
    Jakarta Selatan.
M2. Layar Analyze inti: LocationSearch (debounce geocode) + klik peta + pin + radius
    rings + POST /analyses + ScorePanel LENGKAP sesuai spec §4 (VerdictHeader,
    ScoreDial, PillarBars, FactorBreakdown expandable dengan evidence, ModeledBadge,
    ConfidenceChip). Semua states: empty (dengan 3 chip contoh lokasi), loading
    skeleton, OUT_OF_COVERAGE, error.
M3. Overlay places: pin kompetitor (ukuran ∝ decay weight — hitung di FE:
    exp(-distance_m / decay_tau_m kategori dari GET /categories)) + anchor (ikon per tipe) +
    CompetitorList ↔ hover highlight dua arah + drag pin re-analyze (debounce 500ms).
M4. Location Discovery: heatmap circle layer + Top-10 ranked list + hover sync +
    klik → deep-link ke /app dengan auto-analyze (?lat&lng&analyze=1).
M5. Compare: CompareTray global (≤3, Zustand + persist) + /app/compare kolom
    side-by-side + highlight factor_winners dari deltas.
M6. History (inline rename → PATCH) + /app/settings/outlets (CsvDropzone → import report,
    skipped rows dengan alasan; toggle layer outlet di peta) + CannibalizationCard
    di ScorePanel + 3 kartu teaser Phase 2 locked (spec §9).

## QUALITY BAR (UIUXProMax standard)
- Verdict SELALU badge teks + warna, tidak pernah warna saja (aksesibilitas).
- Angka skor pakai tabular-nums; transisi panel/hover halus (150-200ms); tanpa layout shift.
- Semua state URL-addressable (?lat&lng&category) — demo harus bisa di-deep-link.
- Desktop-first 1280+; komponen kecil, terisolasi, diberi nama sesuai inventory spec §10.
- Logo Localyze: public/logo-localyze.png → TopBar + favicon. Jika file belum ada,
  buat placeholder teks "Localyze" + ingatkan user, JANGAN generate logo sendiri.
- ESLint + tsc clean di setiap milestone.

## DEMO ACCEPTANCE (cek manual di akhir, ini alur video demo)
1. Buka /app → pilih "Kopi Grab-and-Go" → ketik "Tebet" → panel muncul <2 dtk dengan
   verdict + breakdown yang bisa di-expand sampai evidence.
2. Drag pin 500m → skor berubah, tanpa flicker.
3. /app/discovery Kebayoran Baru → heatmap + top-10 → klik rank 1 → kembali ke /app
   dengan analisis penuh otomatis.
4. Tambah 2 lokasi ke tray → /app/compare → factor winners ter-highlight.
5. Import CSV outlet → analisis dekat outlet → CannibalizationCard muncul dan
   composite turun.

Kerjakan M1 sekarang. Setelah tiap milestone, screenshot/ringkas hasil sebelum lanjut.
```
