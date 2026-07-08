# Localyze — Frontend MVP Feature Spec

> **Status:** MVP spec · **Created:** 2026-07-08 · **Owner:** Moym
> **Stack:** Next.js 14 (App Router) · Tailwind CSS · **MapLibre GL JS** + OSM tiles (gratis, tanpa token — ideal untuk local dev) · Zustand (state) · TanStack Query (data fetching)
> **Backend:** `http://localhost:8000/api/v1` — kontrak lengkap di `localyze-be/markdowns/api-contract.md`

---

## 1. Positioning & Prinsip Desain

Localyze adalah executive tool: user-nya expansion manager yang butuh keputusan, bukan data mentah. Setiap layar menjawab satu pertanyaan bisnis.

1. **Verdict first, angka kedua.** Band (`prime/strong/conditional/avoid`) selalu lebih menonjol daripada skor numerik. Skor 72 vs 74 itu noise — jangan dorong user membandingkan desimal.
2. **Setiap angka bisa di-drill-down.** Skor tanpa `evidence` tidak boleh tampil. Field `evidence` dari API sudah berbentuk kalimat siap render.
3. **Peta adalah kanvas utama.** Semua alur dimulai dan berakhir di peta; panel analisis melayang di atasnya, bukan halaman terpisah.
4. **Jujur soal data.** `is_modeled: true` → badge "modeled"; `confidence < 0.7` → banner peringatan. Kredibilitas adalah fitur.
5. **Komparatif secara default.** Keputusan ekspansi selalu "Tebet atau BSD?", bukan "Tebet ya/tidak?".

---

## 2. Design Tokens

```
Verdict colors (satu-satunya pemakaian warna semantik besar):
  prime        #16A34A (green-600)   bg: green-50
  strong       #0D9488 (teal-600)    bg: teal-50
  conditional  #D97706 (amber-600)   bg: amber-50
  avoid        #DC2626 (red-600)     bg: red-50

Brand:
  primary      #1D4ED8 (blue-700)  — dari logo Localyze (pin biru)
  primary-dark #172554 (blue-950)  — navy logo

Logo asset (disediakan Moym, WAJIB ada sebelum M1 FE):
  public/logo-localyze.png   — logo utama (pin L + titik), dipakai TopBar & landing navbar
  favicon                    — digenerate dari file yang sama (crop square)
  Catatan: background logo putih — untuk TopBar/navbar terang pakai langsung;
  untuk hero navy landing, minta versi transparan atau beri container putih rounded.

Peta:
  competitor pin   merah, ukuran ∝ decay_weight
  anchor pin       biru, ikon per anchor_type (office/mall/campus/station/school/hospital)
  user outlet pin  navy dengan ring
  radius rings     1km solid 60%, 2km dashed 40%, 5km dashed 20%
  heatmap          ramp green→amber→red mengikuti skor (invert: skor tinggi = green)

Typography: Inter · angka skor pakai tabular-nums.
```

---

## 3. Struktur Halaman

```
/                        → Landing page marketing (SSG)     ← spec terpisah: landing-page-spec.md
/app                     → Analyze (peta full-screen + panel)   ← layar utama
/app/discovery           → Location Discovery (grid heatmap + ranked list)
/app/compare?ids=a,b,c   → Comparison view
/app/history             → Riwayat analisis tersimpan
/app/settings/outlets    → Import & kelola outlet sendiri (CSV)
```

Topbar persisten (hanya di `/app/*`): logo, nav 4 item, category switcher global (dropdown kategori franchise — mengubah konteks semua halaman). Landing (`/`) punya layout & navbar sendiri.

---

## 4. Layar 1 — Analyze (`/app`)

**Pertanyaan bisnis:** "Lokasi X layak atau tidak untuk kategori saya?"

### Layout
Peta full-viewport. Search bar mengambang kiri-atas. Setelah analisis: `ScorePanel` slide-in dari kanan (420 px, collapsible).

### Flow utama (happy path)
1. User pilih kategori di topbar (default: kategori terakhir, persist di localStorage).
2. Ketik di search bar → `GET /geocode` (debounce 300 ms) → pilih hasil, ATAU klik langsung di peta → `GET /reverse-geocode`.
3. Pin target jatuh + radius rings render → `POST /analyses` otomatis → skeleton di panel (<1 dtk target).
4. Bersamaan: `GET /places` (competitor + anchor) → pin overlay dalam radius.
5. `ScorePanel` terisi. User bisa drag pin → re-analyze otomatis (debounce 500 ms).

### Komponen `ScorePanel` (atas → bawah)
1. **VerdictHeader** — badge verdict besar + skor komposit + confidence chip. Jika `confidence < 0.7`: banner amber "Data terbatas di area ini".
2. **ScoreDial** — donut 0–100 dengan segmen band berwarna.
3. **PillarBars** — dua bar (Demand / Competition) dengan bobot pilar tertera; cannibalization penalty tampil sebagai strip merah pengurang jika > 0.
4. **FactorBreakdown** — daftar faktor dari `breakdown.*.factors`: label, contribution badge (`+12.9` hijau / `−10.4` merah), expand → `evidence` + `raw_value` + persentil bar. Faktor `is_modeled` diberi badge "modeled".
5. **CompetitorList** — dari `breakdown.competition.competitors_in_radius`, sorted by distance; hover item ↔ highlight pin di peta (sinkron dua arah).
6. **CannibalizationCard** — hanya render jika `penalty > 0`: outlet terdampak + `overlap_pct`.
7. **ActionBar** — "Simpan" (PATCH name), "Bandingkan" (tambah ke compare tray), "Analisis ulang radius…" (pilihan 1/2/5 km).

### States
- **Empty**: ilustrasi + copy "Cari lokasi atau klik peta untuk mulai" + 3 chip contoh lokasi (deep-link demo).
- **Loading**: skeleton panel, pin pulse.
- **OUT_OF_COVERAGE (422)**: toast + polygon coverage di-highlight di peta.
- **Error**: retry inline, jangan kosongkan panel yang sudah terisi.

---

## 5. Layar 2 — Location Discovery (`/app/discovery`)

**Pertanyaan bisnis:** "Di mana saya harus buka outlet berikutnya?" — fitur pamungkas demo.

### Layout
Peta 65% kiri + panel ranked list 35% kanan.

### Flow
1. Pilih kategori (topbar) + kecamatan (`GET /regions?level=district`) → `GET /discovery`.
2. Heatmap render (circle layer, warna = skor) + Top-10 list di panel: rank, nama area, skor, verdict badge.
3. Hover list item ↔ highlight sel di peta (dua arah).
4. Klik item/sel → navigasi ke `/app` dengan koordinat centroid → auto-run analisis penuh (via query param `?lat&lng&analyze=1`).
5. Footer panel: "Skor grid dihitung 2026-07-01" (dari `computed_at`) — kejujuran snapshot.

---

## 6. Layar 3 — Comparison (`/app/compare?ids=…`)

**Pertanyaan bisnis:** "Tebet atau BSD?"

- **Compare tray**: chip mengambang bawah layar (global) menampung ≤3 analisis; tombol "Bandingkan" aktif saat ≥2.
- Layout kolom side-by-side (2–3 kolom). Baris: VerdictHeader mini → skor komposit → pilar → tiap faktor.
- Data dari `GET /analyses/compare` — gunakan `deltas.factor_winners`: nilai terbaik per baris diberi highlight hijau + ikon trofi kecil.
- Peta mini di atas menampilkan semua pin kandidat sekaligus (fit bounds).
- Tombol "Jadikan keputusan" → placeholder Phase 2 (export memo PDF) — tampilkan sebagai teaser disabled dengan tooltip.

---

## 7. Layar 4 — History (`/app/history`)

Tabel sederhana: nama (inline editable → PATCH), kategori, verdict badge, skor, tanggal. Aksi: buka di peta, tambah ke compare tray, hapus. Empty state mengarahkan ke `/app`.

---

## 8. Layar 5 — Outlet Settings (`/app/settings/outlets`)

1. Dropzone CSV (`name,lat,lng,address`) → `POST /outlets/import` → hasil: imported count + tabel skipped rows dengan alasan.
2. Daftar outlet aktif + toggle "Tampilkan outlet saya di peta" (layer global, persist localStorage).
3. Hapus per batch atau semua.
4. Copy edukasi singkat: "Outlet kamu dipakai untuk menghitung risiko kanibalisasi antar cabang."

---

## 9. Fitur Phase 2 sebagai Teaser (penting untuk portfolio)

Di `ScorePanel` bawah, render 3 kartu locked (ikon gembok, opacity 60%): "Disaster risk", "Economic lifecycle", "Foot traffic". Tooltip: "Segera hadir". Menunjukkan visi produk tanpa membangunnya — jangan dihilangkan.

---

## 10. Komponen Inventory (ringkas)

`TopBar` · `CategorySwitcher` · `LocationSearch` · `MapCanvas` (MapLibre wrapper) · `RadiusRings` · `PlacePin` / `PinLayer` · `HeatmapLayer` · `ScorePanel` · `VerdictBadge` · `ScoreDial` · `PillarBar` · `FactorRow` · `PercentileBar` · `ModeledBadge` · `ConfidenceChip` · `CompetitorList` · `CannibalizationCard` · `CompareTray` · `CompareColumn` · `DiscoveryList` · `CsvDropzone` · `EmptyState` · `SkeletonPanel`

---

## 11. Non-Functional (local dev)

- Target time-to-insight: <1.5 dtk dari klik peta sampai panel terisi (data lokal, harusnya mudah).
- Responsive: desktop-first (1280+); tablet minimal usable; mobile out of scope MVP.
- Semua state URL-addressable (`?lat&lng&category`) supaya demo bisa di-deep-link.
- `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`.
- Aksesibilitas dasar: verdict tidak hanya warna (selalu ada label teks), focus states, alt text.
