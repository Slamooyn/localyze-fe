# Localyze — Frontend MVP Feature Spec (v2 — Analytical Dashboard)

> **Status:** MVP spec v2 · **Updated:** 2026-07-09 · **Owner:** Moym
> **Perubahan besar dari v1:** (1) layout app berubah dari "peta full-screen + panel melayang" menjadi **analytical dashboard profesional** (sidebar + KPI cards + card grid), (2) ada **auth**: user harus register/login sebelum masuk dashboard, (3) logo resmi: `src/app/image copy.png`.
> **Stack:** Next.js 14 (App Router) · Tailwind CSS · MapLibre GL JS + OSM (tanpa token) · Zustand · TanStack Query · Framer Motion
> **Backend:** `http://localhost:8000/api/v1` — kontrak di `localyze-be/markdowns/api-contract.md` (termasuk auth)

---

## 1. Alur User (end-to-end)

```
Landing (/)  →  klik "Coba demo"  →  /register (atau /login jika sudah punya akun)
             →  sukses auth  →  /app (analytical dashboard, auto-run analisis demo Tebet)
```

- Semua route `/app/*` dilindungi route guard: tanpa token → redirect `/login?next=…`.
- Tombol **"Masuk sebagai akun demo"** di halaman login (kredensial seed `demo@localyze.id` / `demo1234`) — supaya reviewer portfolio bisa masuk tanpa registrasi.

## 2. Prinsip Desain

Referensi visual: dashboard SaaS analitik modern (sidebar navy gelap + konten terang, KPI stat cards berjajar, chart cards dalam grid — gaya COMBEN/enterprise dashboard).

1. **Verdict first, angka kedua.** Band verdict selalu lebih menonjol dari skor numerik.
2. **Setiap angka bisa di-drill-down** — field `evidence` dari API dirender apa adanya.
3. **Dashboard-first, peta sebagai card utama** (bukan full-screen). Peta tetap interaksi primer, tapi hidup di dalam grid bersama KPI dan breakdown.
4. **Jujur soal data.** Badge "modeled", banner confidence rendah, tanggal snapshot selalu tampil.
5. **Komparatif secara default.**

## 3. Design Tokens

```
Brand (dari logo image copy.png — pin biru gradasi + navy):
  primary        #1D4ED8 (blue-700)
  primary-bright #2563EB
  navy           #0B1B3B → #172554 (sidebar & auth panel; satu-satunya gradasi diizinkan)
  accent-cyan    #22D3EE (highlight kecil, active nav indicator)

Verdict colors:
  prime #16A34A · strong #0D9488 · conditional #D97706 · avoid #DC2626
  (masing-masing dengan bg -50 untuk badge/card tint)

Surface app: bg konten #F8FAFC (slate-50), card putih rounded-2xl shadow-sm border slate-200/60
Sidebar: navy, teks slate-300, item aktif: bg white/10 + indikator kiri accent-cyan, ikon lucide
Typography: Inter · headline semibold tracking-tight · skor tabular-nums
Delta chip: hijau ↑ / merah ↓ (gaya KPI card enterprise)

Logo asset:
  Sumber: src/app/image copy.png (disediakan Moym)
  → salin/rename ke public/logo-localyze.png — SEMUA pemakaian logo merujuk file ini
    (sidebar, halaman auth, landing navbar, favicon, OG image)
  Background logo putih → di sidebar navy beri container putih rounded-xl padding kecil.
```

## 4. Struktur Route

```
/                        → Landing (SSG)                    ← landing-page-spec.md
/register  /login        → Auth pages (layout sendiri)
/app                     → Dashboard Analisis (layar utama)
/app/discovery           → Location Discovery
/app/compare?ids=…       → Comparison
/app/history             → Riwayat
/app/settings/outlets    → Outlet & CSV import
```

## 5. App Shell (semua `/app/*`)

- **Sidebar kiri** (260px, collapsible → 72px ikon-only, persist localStorage): logo + wordmark "Localyze" di atas; nav: Dashboard, Discovery, Compare, History, Outlets, (divider), Settings; badge count kecil di Compare saat tray terisi; tombol collapse di bawah.
- **Topbar** (sticky, bg white, border-b): global search lokasi (persis `GET /geocode`, shortcut ⌘K, hasil dropdown → pilih = pindah ke `/app` + analyze); **CategorySwitcher** (dropdown kategori franchise, konteks global); chip coverage "Jakarta Selatan"; bell notifikasi (placeholder, dot saja); avatar + nama user (dari `GET /auth/me`) → menu: Settings, Logout.
- **Page header** per halaman: judul besar + subtitle satu kalimat (pola "Dashboard Agent Lifecycle / ringkasan…").

## 6. Layar 1 — Dashboard Analisis (`/app`)

**Pertanyaan bisnis:** "Lokasi X layak atau tidak untuk kategori saya?"

### Layout (atas → bawah)
1. **Page header**: "Dashboard Analisis Lokasi" + subtitle + tombol kanan: "Simpan analisis" & "+ Bandingkan".
2. **KPI stat cards row** (6 card, ikon berwarna soft-bg di kiri — gaya stat card enterprise):
   | Card | Isi | Catatan |
   |---|---|---|
   | Localyze Score | angka besar + delta vs rata-rata kota | ikon gauge |
   | Verdict | badge besar prime/strong/conditional/avoid | warna verdict |
   | Kompetitor dalam radius | count + "X efektif (decay)" | ikon store |
   | Kepadatan penduduk | jiwa/km² + persentil chip | ikon users |
   | Confidence | % + label (Tinggi/Sedang/Rendah) | <70% → amber |
   | Kanibalisasi | −X poin / "Tidak ada" | hanya merah jika >0 |
3. **Grid utama** (12 kolom):
   - **Card Peta** (col-span-7, tinggi ~520px): MapLibre — pin target draggable, radius rings 1/2/5km, pin kompetitor (ukuran ∝ bobot decay), pin anchor (ikon per tipe), pin outlet sendiri (toggle). Header card: judul + segmented control radius (1/2/5 km) + toggle layer. Klik peta = pindah titik analisis (re-run, debounce 500ms).
   - **Card Score Breakdown** (col-span-5): ScoreDial (donut 0–100 segmen band) + PillarBars (Demand/Competition + bobot) + strip merah penalty jika ada + **FactorBreakdown**: baris faktor dengan contribution badge (+12.9 / −10.4), expand → evidence + raw value + percentile bar; badge "modeled" bila perlu.
4. **Grid bawah** (3 card):
   - **CompetitorList** — tabel: nama, brand, chain badge, jarak, bobot decay; hover row ↔ highlight pin (dua arah); sort by jarak.
   - **Demographic Profile** — dari `GET /regions/{id}/demographics`: bar usia horizontal, kepadatan, purchasing power (+ badge modeled), sumber & tahun data.
   - **Phase 2 Teaser** — 3 item locked (Disaster risk, Economic lifecycle, Foot traffic) dengan ikon gembok, tooltip "Segera hadir".

### Flow
1. Masuk `/app` pertama kali (atau dengan `?lat&lng&analyze=1` dari landing/discovery) → auto `POST /analyses` → KPI + cards terisi.
2. Tanpa query param & tanpa analisis sebelumnya → **empty state**: KPI cards menampilkan "—", card peta menampilkan overlay CTA "Cari lokasi atau klik peta" + 3 chip contoh lokasi.
3. Ganti kategori di topbar → re-run analisis di titik yang sama.
4. States: loading = skeleton per card (bukan spinner satu layar); `OUT_OF_COVERAGE` = toast + polygon coverage; error = retry inline per card.

## 7. Layar 2 — Location Discovery (`/app/discovery`)

Header + filter bar (kategori — ikut topbar; dropdown kecamatan dari `GET /regions?level=district`; tombol Terapkan). Grid: **Card peta heatmap** (col-span-8, circle layer warna = skor) + **Card "Top 10 Lokasi"** (col-span-4, ranked list: rank, nama area, skor, verdict badge, tombol "Analisis →"). Hover sync dua arah. Klik → `/app?lat&lng&analyze=1`. Footer card: "Grid dihitung {computed_at}". KPI row kecil di atas: sel dianalisis, skor tertinggi, rata-rata kecamatan, sel verdict prime.

## 8. Layar 3 — Comparison (`/app/compare?ids=…`)

CompareTray global (chip bar di bawah, ≤3). Halaman: peta mini semua kandidat (fit bounds) + tabel kolom side-by-side per analisis: verdict, komposit, pilar, tiap faktor — baris pemenang di-highlight hijau (dari `deltas.factor_winners`). Tombol "Export memo" = teaser disabled (Phase 2).

## 9. Layar 4 — History (`/app/history`)

Card tabel: nama (inline edit → PATCH), kategori, verdict badge, skor, tanggal; aksi: buka, bandingkan, hapus. Search & filter verdict. Empty state → CTA ke `/app`.

## 10. Layar 5 — Outlets (`/app/settings/outlets`)

Card dropzone CSV (`name,lat,lng,address`) → `POST /outlets/import` → hasil import + tabel skipped rows; card daftar outlet + toggle "Tampilkan di peta" (global, persist); hapus per batch. Copy edukasi kanibalisasi.

## 11. Auth Pages (`/register`, `/login`)

- **Layout split**: kiri form (max-w-md), kanan panel navy dengan logo + tagline + mock mini ScoreDial (dekoratif, statis). Mobile: form saja.
- **Register**: nama, email, password (min 8) → `POST /auth/register` → auto-login → redirect `next` atau `/app?lat=-6.2264&lng=106.8531&category=coffee-grab-go&analyze=1` (demo run pertama).
- **Login**: email + password → `POST /auth/login`; tombol sekunder **"Masuk sebagai akun demo"** (isi kredensial demo otomatis lalu submit).
- Token JWT disimpan di Zustand + localStorage; axios/fetch interceptor menyisipkan `Authorization: Bearer`. 401 dari API → clear token → redirect `/login`.
- Validasi inline, error state jelas ("Email sudah terdaftar", "Kredensial salah"). Tanpa lupa-password/verifikasi email (out of scope MVP — tulis di UI footer kecil "Demo build").

## 12. Komponen Inventory

Shell: `Sidebar` · `SidebarItem` · `Topbar` · `GlobalSearch` · `CategorySwitcher` · `UserMenu` · `PageHeader`
Dashboard: `KpiCard` · `DeltaChip` · `MapCard` (MapLibre wrapper) · `RadiusControl` · `LayerToggle` · `PinLayer` · `HeatmapLayer` · `ScoreDial` · `PillarBar` · `FactorRow` · `PercentileBar` · `ModeledBadge` · `ConfidenceChip` · `VerdictBadge` · `CompetitorTable` · `DemographicCard` · `TeaserCard` · `CannibalizationCard`
Lainnya: `CompareTray` · `CompareColumn` · `DiscoveryList` · `CsvDropzone` · `EmptyState` · `SkeletonCard` · `AuthLayout` · `AuthForm`

## 13. Non-Functional

- Time-to-insight <1.5 dtk (data lokal); skeleton per card, tanpa layout shift.
- Desktop-first 1280+; sidebar collapse membuat 1024 usable; mobile out of scope.
- State URL-addressable (`?lat&lng&category`) untuk demo deep-link.
- `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`.
- Aksesibilitas: verdict = warna + teks selalu; focus states; kontras sidebar AA.
