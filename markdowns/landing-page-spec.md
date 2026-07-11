# Localyze — Landing Page Spec v3 (Glowy Waves + Dashboard Reveal)

> **Status:** MVP spec v3 · **Updated:** 2026-07-09 · **Owner:** Moym
> **Route:** `/` (SSG) · CTA → `/register` · Stack: Next.js + Tailwind + Framer Motion (tanpa GSAP)
> **Perubahan dari v2:** CinematicHero (GSAP) DIHAPUS — diganti **GlowyWavesHero** (canvas waves reaktif mouse) + **ContainerScroll** (dashboard reveal). Landing jadi lebih ringan: tanpa pinning panjang, tanpa GSAP.
> Komponen referensi: `markdowns/reference/glowy-waves-hero-reference.tsx` dan `markdowns/reference/container-scroll-reference.tsx` (keduanya berisi catatan adaptasi inline).

---

## 1. Tujuan & Alur

Landing menjawab berurutan: *apa ini → seperti apa produknya → apa yang saya dapat → bagaimana cara pakainya → kenapa angkanya bisa dipercaya* → daftar.

```
/  →  CTA "Coba demo gratis"  →  /register  ("Sudah punya akun? Masuk" → /login)
   →  sukses  →  /app?lat=-6.2264&lng=106.8531&category=coffee-grab-go&analyze=1
```

## 2. Prinsip

1. **Show, don't tell** — hero canvas hidup, dashboard reveal pakai tampilan asli, rumus ditampilkan terbuka.
2. **Interaktif ≠ berat** — 100% hidup tanpa backend (`src/landing/sample-locations.json`); tanpa GSAP/Three.js/video/carousel lib; LCP < 2.5s; widget berat lazy.
3. **Satu CTA** — semua tombol primer → `/register`.
4. **Motion mengikuti design-craft-guidelines.md** (Framer Motion + motion tokens); `prefers-reduced-motion` dihormati di setiap section.
5. Ritme visual: hero terang dengan waves biru → reveal card navy → section terang/slate berselang → CTA final navy.

## 3. Identitas Visual

```
Palet     : primary #1D4ED8 · primary-bright #2563EB · accent-cyan #22D3EE
            navy #0B1B3B–#172554 (card reveal & CTA final) · verdict colors = app
CSS vars  : definisikan shadcn-style vars di globals.css KHUSUS untuk kebutuhan
            canvas hero — --background (white), --muted (slate-100),
            --primary (#1D4ED8), --accent (#22D3EE), --secondary (#0D9488),
            --foreground (slate-900). Canvas membaca vars ini saat menggambar waves.
Font      : Inter; headline semibold tracking-tight; skor tabular-nums
Logo      : public/logo-localyze.png (navbar, footer, favicon, OG)
```

## 4. Struktur Halaman

### S1 — Hero: GlowyWavesHero (adaptasi)
Basis: `reference/glowy-waves-hero-reference.tsx` — canvas fullscreen dengan 5 garis gelombang glowing (warna dari CSS vars brand) yang bereaksi terhadap mouse, konten center stagger-in Framer Motion.

Adaptasi konten (WAJIB):
- Badge pill atas: ikon `MapPin` (bukan Sparkles) + "Franchise location intelligence".
- Headline: "Berhenti menebak lokasi. " + span gradient "Mulai menghitungnya." (gradient from-primary via-primary/60 to-foreground/80 — sudah ada di komponen).
- Subhead: "Localyze menganalisis kompetitor, demografi, dan potensi pasar di titik mana pun — jadi satu skor yang bisa kamu pertanggungjawabkan."
- CTA primer (Button solid rounded-full): "Coba demo gratis →" → `/register`; CTA outline: "Masuk" → `/login`. **Button shadcn DIGANTI** komponen Button milik sendiri dengan styling setara (project bukan shadcn).
- `highlightPills` → "Skor explainable" · "Snapshot Jakarta Selatan" · "Tanpa kartu kredit".
- `heroStats` (grid 3 kolom bawah, ini trust strip-nya) → "2.300+ / Titik grid dianalisis" · "400+ / Kompetitor terpetakan" · "<1 dtk / Waktu ke insight".
- Reduced motion: gambar satu frame waves statis lalu hentikan RAF (perbaikan dari komponen asli yang tetap looping).
- Navbar landing fixed di atas hero (transparan → solid saat scroll).

### S2 — Dashboard reveal: ContainerScroll (adaptasi)
Basis: `reference/container-scroll-reference.tsx` — kartu besar miring 20° yang menegak + membesar mengikuti scroll (aha moment "ini produknya").

- `titleComponent`: "Seperti ini dashboard-nya." (h2) + satu kalimat kecil "Peta, skor, dan bukti — dalam satu layar."
- Isi kartu: **screenshot dashboard asli** `public/screenshots/dashboard.png` via next/image (diambil dari `/app` akun demo setelah app jadi; sementara belum ada → placeholder navy + logo + teks "Dashboard preview").
- Ganti warna hardware kartu: border `#172554`, bg `#0B1B3B` (navy brand, bukan abu #6C6C6C/#222222).
- Reduced motion: kartu tampil tegak statis (tanpa rotasi).
- Tinggi section dipangkas dari referensi bila terasa terlalu panjang (60rem mobile / 80rem desktop boleh diturunkan sampai terasa pas — jangan ada scroll kosong).

### S3 — What you get
"Satu dashboard, semua yang kamu butuhkan sebelum tanda tangan sewa." — 6 BenefitCard (hover micro-visual): Localyze Score, Peta kompetitor 1/2/5 km, Profil demografi, Location Discovery, Perbandingan lokasi, Cannibalization guard. Badge "Core" (1–3) / "Pro insight" (4–6).

### S4 — Tutorial sneak peek (scrollytelling)
"Seperti ini rasanya memakai Localyze." — teks step sticky kiri, kanan mockup dashboard hidup dalam `BrowserFrame` (komponen app asli + data sample), 4 fase: (1) pilih kategori & titik → pin + rings; (2) KPI cards + ScoreDial 0→72 + FactorRow muncul berurutan; (3) Discovery: heatmap + Top-10; (4) Compare: dua kolom, faktor pemenang di-highlight, verdict stamp. Fallback reduced-motion: stepper 4 tab. CTA sekunder di akhir.

### S5 — Metodologi & Rumus ("Skor kami bukan black box. Ini rumusnya.")
- `FormulaHero`: `Score = w_D · Demand + w_C · Competition − P_kanibalisasi` — hover/tap term → tooltip penjelasan.
- 3 kartu micro-viz: DecayCurve (`bobot = e^(−d/τ)`, kurva animasi, "kami menghitung tekanan kompetitif, bukan jumlah kompetitor"), PercentileHisto (normalisasi vs distribusi kota), Verdict band + confidence ("72 vs 74 itu noise").
- `WeightPlayground`: 3 slider (bobot Demand↔Kompetisi, τ, penalti kanibalisasi) → skor & verdict sample dihitung ulang real-time via `src/landing/scoring-mini.ts` (pure, unit-tested). Intro: "Tidak percaya skornya? Bagus. Geser sendiri bobotnya."
- Baris transparansi: "Data demo: snapshot Jakarta Selatan · demografi BPS + modeled · metodologi terbuka."

### S6 — Untuk siapa
3 PersonaCard: Franchise HQ · Business development · Investor — satu kalimat use case.

### S7 — CTA final + FAQ
Bg navy: "Lokasi berikutnya, dihitung." + "Coba demo gratis" (`/register`) + ghost "Masuk". FaqAccordion 4 item (gratis? · data dari mana? · kota apa saja? · skor bisa dipercaya? → link ke S5). Footer: logo, "Dibuat oleh Moym", GitHub/LinkedIn.

## 5. Komponen

`LandingNavbar` · `GlowyWavesHero` (adaptasi referensi) · `ContainerScroll` + `DashboardRevealCard` (adaptasi referensi) · `Button` (sendiri, varian solid/outline rounded-full) · `CountUpStat` · `BenefitCard` · `ScrollStep` · `BrowserFrame` · `FormulaHero` · `DecayCurve` · `PercentileHisto` · `WeightPlayground` · `PersonaCard` · `FaqAccordion`
Data & logic: `src/landing/sample-locations.json` · `src/landing/scoring-mini.ts`
Reuse dari app: `ScoreDial`, `FactorRow`, `VerdictBadge`, `KpiCard` (S4) — WAJIB reuse, bukan tiruan.
Asset: `public/screenshots/dashboard.png` (S2).

## 6. Copywriting (final, Bahasa Indonesia)

- Headline: "Berhenti menebak lokasi. **Mulai menghitungnya.**" (span gradient)
- Subhead: lihat S1 di atas.
- S2: "Seperti ini dashboard-nya." / "Peta, skor, dan bukti — dalam satu layar."
- S3 intro: "Satu dashboard, semua yang kamu butuhkan sebelum tanda tangan sewa."
- S4 intro: "Seperti ini rasanya memakai Localyze."
- S5 intro: "Skor kami bukan black box. Ini rumusnya."
- CTA: "Coba demo gratis — cukup daftar, tanpa kartu kredit."

## 7. Performa & Aksesibilitas

- Canvas hero: RAF loop pause saat tab hidden (`visibilitychange`) & saat hero keluar viewport (IntersectionObserver); reduced-motion → satu frame statis.
- SSG semua section; hero canvas & widget interaktif client + `next/dynamic ssr:false` dengan placeholder (headline tetap server-rendered untuk LCP).
- Screenshot S2 pakai `next/image` dengan `sizes` benar; prioritas rendah (below fold).
- Keyboard-navigable semua; kontras AA; formula punya penjelasan teks permanen (bukan hanya hover).
- Target Lighthouse mobile: Performance ≥ 90 · Accessibility ≥ 95 · SEO ≥ 95.
