# Prompt Claude Code — Localyze Landing Page (v2)

> Copy-paste prompt di bawah ini ke Claude Code dari root repo `localyze-fe`.
> **Jalankan SETELAH app selesai (M1–M7 prompt frontend)** — landing me-reuse komponen app (ScoreDial, FactorRow, VerdictBadge, KpiCard) dan design tokens.

---

```
Kamu adalah frontend engineer + motion designer (gunakan skill UIUXProMax) yang
membangun landing page Localyze. Ini first impression portfolio — kualitas setara
landing SaaS modern (referensi rasa: Linear, Resend, Vercel), identitas Localyze
(navy + pin biru dari logo).

## LANGKAH PERTAMA (WAJIB)
1. Baca markdowns/landing-page-spec.md (v2) sampai selesai — struktur S1-S6,
   copywriting, dan aturan performa TIDAK boleh diubah tanpa alasan kuat.
2. Inventaris komponen app yang di-reuse: ScoreDial, FactorRow, VerdictBadge,
   KpiCard, tokens Tailwind. Landing WAJIB reuse, bukan membuat tiruan.
3. Logo: public/logo-localyze.png (sudah ada dari milestone app; sumber asli
   src/app/image copy.png). Navbar, footer, OG image pakai file ini.

## ATURAN KERAS
- Landing 100% hidup tanpa backend: data dari src/landing/sample-locations.json.
- CTA primer SELALU → /register; tombol "Masuk" → /login. Ganti / redirect
  sementara (dari milestone app) dengan halaman landing ini.
- Framer Motion untuk semua animasi; tiap animasi punya varian reduced-motion.
- Tanpa Three.js, video, carousel lib, KaTeX. LCP < 2.5s. Widget berat
  (MiniMap, mockup S3, WeightPlayground) via next/dynamic ssr:false + placeholder.
- Copywriting pakai draft spec §6 (Bahasa Indonesia).

## URUTAN PENGERJAAN (commit per milestone)
L1. Halaman utuh statis: LandingNavbar (transparan→solid, tombol Masuk + Coba demo)
    + Hero S1 (headline, CTA → /register, layout 2 kolom, placeholder MiniMap)
    + S2 What you get (6 BenefitCard, badge Core/Pro insight) + shell S3-S6 dengan
    copywriting final + FaqAccordion + footer. Rapi & responsive dulu, interaktif belum.
L2. Hero interaktif: MiniMap (MapLibre, gestures off, 3 titik berdenyut, klik →
    pin + radius rings + ScoreDialMini count-up + verdict) + CountUpStat trust strip
    (trigger inview) + hover micro-visual BenefitCard S2.
L3. S3 Tutorial sneak peek (scrollytelling product tour): teks step sticky kiri,
    kanan mockup dashboard HIDUP dalam BrowserFrame — 4 fase sesuai spec (pilih
    kategori & titik → KPI + dial + FactorRow terisi → Discovery heatmap + top-10 →
    compare battle + verdict stamp). Gunakan komponen app asli dengan data sample.
    Fallback reduced-motion: stepper 4 tab.
L4. S4 Metodologi & Rumus: FormulaHero (Score = w_D·Demand + w_C·Competition − P,
    hover term → tooltip penjelasan) + 3 kartu micro-viz (DecayCurve animasi
    e^(-d/τ), PercentileHisto, verdict band + confidence) + WeightPlayground
    (3 slider → scoring-mini.ts pure function → dial + verdict real-time; unit test
    scoring-mini). Lalu audit akhir: Lighthouse (Perf ≥90, A11y ≥95, SEO ≥95),
    keyboard nav, reduced-motion, meta OG + favicon.

## ACCEPTANCE (alur review manual)
1. Backend MATI → buka / → semua section hidup, tanpa error console.
2. Klik titik MiniMap → pin, ring, count-up, verdict <1 dtk.
3. Scroll S3 pelan → 4 fase tour runtut; reduced-motion → stepper.
4. Hover term rumus S4 → tooltip; geser slider → skor & verdict berubah masuk akal
   (bobot kompetisi naik di lokasi padat → skor turun).
5. Klik "Coba demo gratis" → /register; setelah daftar → /app auto-analyze Tebet.
   Klik "Masuk" → /login → akun demo → dashboard terisi.
6. Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

Kerjakan L1 sekarang. Setelah tiap milestone: screenshot + ringkasan sebelum lanjut.
```
