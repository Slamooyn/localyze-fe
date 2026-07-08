# Prompt Claude Code — Localyze Landing Page

> Copy-paste prompt di bawah ini ke Claude Code dari root repo `localyze-fe`.
> **Jalankan SETELAH app selesai (M1–M6 prompt frontend)** — landing me-reuse komponen app (ScoreDial, FactorRow, VerdictBadge) dan design tokens yang sudah ada.

---

```
Kamu adalah frontend engineer + motion designer (gunakan skill UIUXProMax) yang membangun
landing page Localyze. Ini halaman yang menentukan first impression portfolio — kualitas
harus setara landing page SaaS modern (referensi rasa: Linear, Resend, Vercel), tapi
dengan identitas Localyze (navy + pin biru dari logo).

## LANGKAH PERTAMA (WAJIB)
1. Baca markdowns/landing-page-spec.md sampai selesai — struktur S1-S7, copywriting,
   dan aturan performa TIDAK boleh diubah tanpa alasan kuat.
2. Baca markdowns/tech-stack-frontend.md §4 — landing di /, app di /app.
3. Inventaris komponen app yang akan di-reuse: ScoreDial, FactorRow, VerdictBadge,
   design tokens Tailwind. Landing HARUS reuse, bukan membuat tiruan.

## ATURAN KERAS
- Landing 100% hidup tanpa backend: semua data dari src/landing/sample-locations.json.
- Framer Motion untuk semua animasi; setiap animasi punya varian reduced-motion.
- Tanpa Three.js, tanpa video, tanpa library carousel. LCP < 2.5s.
- Widget berat (MiniMap, WeightPlayground) via next/dynamic ssr:false + placeholder.
- Copywriting pakai draft di spec §5 (Bahasa Indonesia).

## URUTAN PENGERJAAN (commit per milestone)
L1. LandingLayout + LandingNavbar (transparan→solid saat scroll) + Hero S1 versi statis
    (headline, CTA ke /app deep-link demo, layout dua kolom) + section shells S2-S7
    dengan copywriting final + CTA final + footer. Halaman sudah utuh & rapi TANPA
    interaktivitas. Cek responsive mobile.
L2. Interaktif hero: MiniMap (MapLibre, gestures off, 3 titik kandidat berdenyut,
    klik → pin + radius rings animasi + ScoreDialMini count-up + verdict badge) +
    CountUpStat trust strip (trigger saat inview). Data: sample-locations.json.
L3. Scrollytelling S3 (useScroll, teks sticky kiri, panel kanan 3 fase: pin jatuh →
    dial terisi + FactorRow muncul berurutan → compare battle) + fallback stepper
    statis untuk reduced-motion + scroll reveal S2 & S4 (feature cards hover tilt).
L4. WeightPlayground S5: 3 slider → scoring-mini.ts (port murni formula:
    composite = wd*demand + wc*compete − penalty, decay exp(-d/τ)) → dial + verdict
    update real-time. Unit test scoring-mini. Lalu audit akhir: Lighthouse
    (Performance ≥90, A11y ≥95), keyboard nav, reduced-motion, meta tags OG +
    favicon dari logo.

## ACCEPTANCE (alur review manual)
1. Buka / tanpa backend jalan → semua section hidup, tidak ada error console.
2. Klik titik di MiniMap → pin, ring, count-up skor, verdict — dalam <1 detik.
3. Scroll S3 pelan → tiga fase bercerita runtut; dengan reduced-motion → stepper.
4. Geser slider S5 → skor & verdict berubah masuk akal (naikkan bobot kompetisi
   di lokasi padat → skor turun).
5. Klik CTA → mendarat di /app dengan analisis Tebet berjalan otomatis.
6. Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.

Kerjakan L1 sekarang. Setelah tiap milestone: screenshot + ringkasan sebelum lanjut.
```
