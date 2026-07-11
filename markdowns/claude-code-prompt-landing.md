# Prompt Claude Code — Localyze Landing Page (v4: Glowy Waves + Dashboard Reveal)

> Copy-paste prompt di bawah ini ke Claude Code dari root repo `localyze-fe`.
> **Jalankan SETELAH app selesai (M1–M7 prompt frontend)** — landing me-reuse komponen app dan design tokens. GSAP TIDAK dipakai lagi (versi cinematic hero lama sudah dibatalkan).

---

```
Kamu adalah frontend engineer + motion designer (gunakan skill UIUXProMax) yang
membangun landing page Localyze. Kualitas setara landing SaaS modern: hero canvas
hidup, dashboard reveal, lalu section bersih dan tenang ala Emil Kowalski.

## LANGKAH PERTAMA (WAJIB)
1. Baca markdowns/landing-page-spec.md (v3) sampai selesai — struktur S1-S7,
   catatan adaptasi, copywriting, aturan performa.
2. Baca markdowns/design-craft-guidelines.md — berlaku untuk semua section.
3. Buka dua komponen referensi (keduanya berisi catatan adaptasi inline):
   - markdowns/reference/glowy-waves-hero-reference.tsx
   - markdowns/reference/container-scroll-reference.tsx
   (markdowns/reference/cinematic-hero-reference.tsx = ARSIP, jangan dipakai.)
4. Inventaris komponen app yang di-reuse: ScoreDial, FactorRow, VerdictBadge, KpiCard.
5. Logo: public/logo-localyze.png.

## ATURAN KERAS
- Landing 100% hidup tanpa backend (src/landing/sample-locations.json).
- CTA primer SELALU → /register; "Masuk" → /login. Ganti / redirect sementara
  dengan halaman landing ini.
- Tanpa GSAP, Three.js, video, carousel lib, KaTeX, dan TANPA shadcn CLI —
  komponen referensi memakai Button shadcn: ganti dengan komponen Button milik
  sendiri (varian solid & outline, rounded-full).
- Framer Motion + motion tokens untuk semua animasi; reduced-motion di tiap section.
- Copywriting pakai spec §6.

## URUTAN PENGERJAAN (commit per milestone)
L1. Fondasi + section statis: LandingNavbar (fixed, transparan→solid) + Button
    sendiri + definisikan CSS vars canvas di globals.css (--background --muted
    --primary --accent --secondary --foreground → palet Localyze, lihat spec §3)
    + S3 What you get (6 BenefitCard) + S6 persona + S7 CTA final + FaqAccordion
    + footer + shell S2/S4/S5 dengan copywriting final. Responsive & rapi.
L2. INTEGRASI DUA KOMPONEN REFERENSI:
    a. Salin glowy-waves-hero-reference.tsx → src/components/landing/glowy-waves-hero.tsx,
       adaptasi sesuai spec §S1: badge MapPin "Franchise location intelligence",
       headline + span gradient, subhead, CTA → /register & /login (Button sendiri),
       pills & stats Localyze. Perbaikan wajib: reduced-motion → render satu frame
       lalu stop RAF; pause RAF saat tab hidden (visibilitychange) dan saat hero
       keluar viewport (IntersectionObserver).
    b. Salin container-scroll-reference.tsx → src/components/landing/container-scroll.tsx,
       adaptasi sesuai spec §S2: title "Seperti ini dashboard-nya.", isi kartu
       next/image public/screenshots/dashboard.png (placeholder navy + logo bila
       file belum ada), warna kartu navy brand (#0B1B3B bg, #172554 border),
       reduced-motion → kartu tegak statis, pangkas tinggi section bila ada
       scroll kosong.
    c. Rakit halaman /: Navbar → S1 hero → S2 reveal → S3 → shell S4/S5 → S6 → S7.
       Pastikan transisi hero→reveal mulus (tanpa gap putih aneh antar canvas
       dan section berikutnya).
L3. S4 Tutorial sneak peek (scrollytelling Framer): teks sticky kiri, mockup
    dashboard hidup dalam BrowserFrame kanan, 4 fase sesuai spec; fallback stepper
    untuk reduced-motion. + scroll reveal & hover micro-visual S3.
L4. S5 Metodologi & Rumus: FormulaHero (hover term → tooltip) + DecayCurve +
    PercentileHisto + verdict band + WeightPlayground (scoring-mini.ts pure +
    unit test). Lalu audit akhir: Lighthouse mobile & desktop (Perf ≥90, A11y ≥95,
    SEO ≥95), keyboard nav, reduced-motion penuh, meta OG + favicon, cek RAF
    canvas berhenti saat navigasi keluar / (tidak ada memory leak).

## ACCEPTANCE (alur review manual)
1. Backend MATI → buka / → semua section hidup, tanpa error console.
2. Hero: waves bergerak halus & bereaksi ke mouse; headline stagger-in; stats grid
   tampil. Pindah tab lalu kembali → animasi tidak menumpuk/lompat.
3. Scroll ke S2 → kartu dashboard menegak dari 20° dengan mulus; screenshot/
   placeholder tajam, tidak gepeng.
4. Aktifkan reduced-motion → hero jadi frame statis, kartu S2 tegak, S4 jadi
   stepper — semua konten tetap terbaca & CTA berfungsi.
5. Klik "Coba demo gratis" → /register; setelah daftar → /app auto-analyze Tebet.
6. S5: hover term rumus → tooltip; geser slider → skor & verdict berubah masuk akal.
7. Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

CATATAN PASCA-BUILD: setelah app + landing jadi, ambil screenshot /app (akun demo,
analisis Tebet terisi) → simpan public/screenshots/dashboard.png → cek S2 memakai
screenshot asli, bukan placeholder.

Kerjakan L1 sekarang. Setelah tiap milestone: screenshot + ringkasan sebelum lanjut.
```
