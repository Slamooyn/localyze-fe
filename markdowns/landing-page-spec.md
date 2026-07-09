# Localyze — Landing Page Spec v2 (Interaktif)

> **Status:** MVP spec v2 · **Updated:** 2026-07-09 · **Owner:** Moym
> **Route:** `/` (SSG) · CTA → `/register` (auth wajib sebelum masuk dashboard `/app`)
> **Stack:** Next.js + Tailwind + Framer Motion + MapLibre
> **Perubahan dari v1:** struktur baru (What you get + Tutorial sneak peek), section **Metodologi & Rumus** untuk kredibilitas, CTA sekarang menuju register/login (bukan langsung app), logo resmi `public/logo-localyze.png` (dari `src/app/image copy.png`).

---

## 1. Tujuan & Alur

Landing menjawab 4 pertanyaan berurutan sambil scroll: *apa ini → apa yang saya dapat → seperti apa produknya → kenapa saya harus percaya angkanya* — lalu satu ajakan: daftar & coba demo.

```
/  →  CTA "Coba demo gratis"  →  /register  (link "Sudah punya akun? Masuk" → /login)
   →  sukses  →  /app?lat=-6.2264&lng=106.8531&category=coffee-grab-go&analyze=1
```

## 2. Prinsip

1. **Show, don't tell** — klaim didemokan lewat widget interaktif, bukan screenshot mati.
2. **Interaktif ≠ berat** — semua widget client-side dengan data sample di-embed (`src/landing/sample-locations.json`). Landing hidup 100% tanpa backend.
3. **Satu CTA** — semua tombol primer menuju `/register`.
4. **Motion bermakna** + hormati `prefers-reduced-motion` (fallback stepper statis).
5. **Aturan keras:** tanpa Three.js/video/carousel lib; LCP < 2.5s; widget berat lazy (`next/dynamic ssr:false`).

## 3. Identitas Visual

```
Hero & CTA-final bg : navy #0B1B3B → #172554 (gradasi hanya di sini)
Aksen               : blue-600 #2563EB · cyan-400 #22D3EE (glow pin, indikator)
Verdict colors      : sama dengan app (konsistensi produk)
Section terang      : white / slate-50 berselang-seling — ritme scroll jelas
Font                : Inter; headline semibold tracking-tight; skor tabular-nums
Logo                : public/logo-localyze.png (background putih → di navy pakai
                      container putih rounded-xl; favicon & OG dari file yang sama)
```

## 4. Struktur Halaman

### S1 — Hero (interaktif)
- Navbar: logo + "Cara kerja · Fitur · Metodologi" (anchor) + tombol "Masuk" (`/login`) + "Coba demo" (`/register`). Transparan di atas → solid saat scroll.
- Kiri: headline **"Berhenti menebak lokasi. Mulai menghitungnya."** + subhead + CTA primer "Coba demo gratis →" (`/register`) + secondary "Lihat cara kerjanya ↓".
- Kanan: **MiniMap interaktif** — peta Jaksel kecil, 3 titik kandidat berdenyut; klik → pin jatuh, radius ring mekar, ScoreDial mini count-up + verdict badge. Produk didemokan dalam 10 detik, sebelum register.
- Trust strip: 3 stat count-up — "2.300+ titik grid dianalisis · 400+ kompetitor terpetakan · 3 kategori franchise".

### S2 — What you get (grid benefit, scroll reveal)
Headline: "Satu dashboard, semua yang kamu butuhkan sebelum tanda tangan sewa."
6 kartu (ikon + judul + 1 kalimat + micro-visual hover):
1. **Localyze Score** — skor 0–100 yang bisa dipertanggungjawabkan, bukan feeling.
2. **Peta kompetitor radius 1/2/5 km** — tekanan kompetitif berbobot jarak.
3. **Profil demografi area** — kepadatan, usia, daya beli per kelurahan.
4. **Location Discovery** — "tunjukkan 10 titik terbaik di kecamatan ini."
5. **Perbandingan lokasi** — Tebet vs BSD, faktor per faktor.
6. **Cannibalization guard** — pastikan cabang baru tidak memakan cabang lama.
Kartu 1–3 badge "Core", 4–6 badge "Pro insight". Hover: tilt halus + ikon animasi.

### S3 — Tutorial sneak peek (scrollytelling product tour)
Headline: "Seperti ini rasanya memakai Localyze."
Scrollytelling 4 langkah — teks step sticky kiri, kanan **mockup dashboard hidup** (komponen app asli di-render dengan data sample, dibungkus frame browser chrome tipis — BUKAN screenshot):
1. **Pilih kategori & titik** — kursor animasi memilih "Kopi Grab-and-Go", klik peta, pin + rings muncul.
2. **Baca dashboard-nya** — KPI cards terisi count-up, ScoreDial mengisi 0→72, FactorRow muncul berurutan dengan contribution badge (+12.9 / −10.4).
3. **Temukan titik terbaik** — panel berganti ke Discovery: heatmap menyala + Top-10 list slide-in.
4. **Bandingkan & putuskan** — dua kolom skor, faktor pemenang di-highlight, verdict final stamp.
Fallback reduced-motion: stepper 4 tab manual. Di akhir: CTA sekunder "Daftar & jalankan analisis pertamamu →".

### S4 — Metodologi & Rumus ("Kenapa kamu bisa percaya angkanya")
Bagian kredibilitas — tampilkan rumus asli, bukan jargon:

- **Formula utama** (render besar, styled HTML/SVG — tanpa lib KaTeX):
  `Score = w_D · Demand + w_C · Competition − P_kanibalisasi`
  Hover/tap tiap term → highlight + tooltip penjelasan satu kalimat (`w_D` = bobot sesuai kategori franchise-mu, dst).
- **Tiga kartu penjelasan** dengan micro-viz animasi:
  1. *Distance decay* — `bobot = e^(−d/τ)` + grafik kurva kecil animasi: kompetitor 200 m ≈ 0.72, di 2 km ≈ 0.04. Copy: "Kami tidak menghitung kompetitor. Kami menghitung tekanan kompetitif."
  2. *Normalisasi persentil* — mini histogram: "8 kompetitor itu sepi di Sudirman, jenuh di area residensial — semua angka dibandingkan dengan distribusi kotanya."
  3. *Verdict band + confidence* — "72 vs 74 itu noise. Kami kasih verdict, bukan presisi palsu — plus tingkat keyakinan data."
- **WeightPlayground** (interaktif, jantung section ini): 3 slider (bobot Demand↔Kompetisi, τ jarak, penalti kanibalisasi) → skor & verdict sample dihitung ulang real-time client-side (`src/landing/scoring-mini.ts`, port murni formula). Intro copy: "Tidak percaya skornya? Bagus. Geser sendiri bobotnya."
- Baris transparansi (kecil, jujur): "Data demo: snapshot Jakarta Selatan · demografi BPS + modeled · metodologi terbuka."

### S5 — Untuk siapa
3 kartu persona: Franchise HQ · Business development · Investor — satu kalimat use case masing-masing.

### S6 — CTA final + FAQ mini
Bg navy: headline "Lokasi berikutnya, dihitung." + tombol "Coba demo gratis" (`/register`) + ghost "Masuk" (`/login`). FAQ accordion 4 item: Apakah gratis? (ya, demo build) · Data dari mana? · Kota apa saja? (pilot Jaksel) · Apakah skor bisa dipercaya? (link scroll balik ke S4).
Footer: logo, "Dibuat oleh Moym", GitHub/LinkedIn.

## 5. Komponen

`LandingNavbar` · `MiniMap` · `ScoreDialMini` · `CountUpStat` · `BenefitCard` · `ScrollStep` (scrollytelling) · `BrowserFrame` (chrome tipis pembungkus mockup) · `FormulaHero` (rumus + hover terms) · `DecayCurve` · `PercentileHisto` · `WeightPlayground` · `PersonaCard` · `FaqAccordion`
Data & logic: `src/landing/sample-locations.json` · `src/landing/scoring-mini.ts` (pure, unit-tested)
Reuse dari app: `ScoreDial`, `FactorRow`, `VerdictBadge`, `KpiCard` (dipakai di S3 mockup — WAJIB reuse, bukan tiruan).

## 6. Copywriting (draft final, Bahasa Indonesia)

- Headline: "Berhenti menebak lokasi. Mulai menghitungnya."
- Subhead: "Localyze menganalisis kompetitor, demografi, dan potensi pasar jadi satu skor yang bisa kamu pertanggungjawabkan ke siapa pun."
- S2 intro: "Satu dashboard, semua yang kamu butuhkan sebelum tanda tangan sewa."
- S3 intro: "Seperti ini rasanya memakai Localyze."
- S4 intro: "Skor kami bukan black box. Ini rumusnya."
- CTA: "Coba demo gratis — cukup daftar, tanpa kartu kredit."

## 7. Performa & Aksesibilitas

- SSG semua section; hanya widget interaktif yang client component + lazy.
- MiniMap & mockup S3: placeholder blur sebelum siap; IntersectionObserver untuk trigger animasi.
- `prefers-reduced-motion`: scrollytelling → stepper, count-up → angka langsung.
- Keyboard: semua interaksi bisa tab/enter; kontras navy AA; formula punya penjelasan teks (bukan hanya hover).
- Target Lighthouse mobile: Performance ≥ 90 · Accessibility ≥ 95 · SEO ≥ 95 (meta OG + title/desc).
