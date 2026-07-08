# Localyze — Landing Page Spec (Interaktif)

> **Status:** MVP spec · **Created:** 2026-07-08 · **Owner:** Moym
> **Route:** `/` (SSG) · app di `/app` · Stack: Next.js + Tailwind + Framer Motion + MapLibre
> **Tujuan:** (1) menjelaskan Localyze dalam <30 detik scroll, (2) mendorong klik "Coba demo", (3) jadi showpiece portfolio — interaktif, bukan brosur statis.

---

## 1. Prinsip

1. **Show, don't tell.** Setiap klaim ("skor explainable", "temukan lokasi terbaik") didemokan lewat widget interaktif mini di landing itu sendiri — bukan screenshot.
2. **Interaktif ≠ berat.** Semua interaksi client-side dengan data sample yang di-embed (JSON statis di bundle). Landing TIDAK memanggil API backend — harus tetap hidup walau backend mati.
3. **Satu CTA.** Semua jalan menuju "Coba demo" → `/app?lat=-6.2264&lng=106.8531&category=coffee-grab-go&analyze=1` (deep-link demo Tebet).
4. **Motion punya makna.** Animasi menjelaskan cara kerja produk (pin → radius → skor), bukan dekorasi. Semua motion hormati `prefers-reduced-motion`.
5. **Aturan keras:** tanpa Three.js/WebGL selain peta, tanpa video autoplay, LCP < 2.5 dtk, hero interaktif di-lazy-load setelah first paint.

## 2. Identitas Visual

Turunan dari logo `public/logo-localyze.png` (pin biru gradasi → navy; huruf L + titik navy):

```
bg hero        : navy #0B1B3B → #172554 (satu-satunya tempat gradasi diizinkan)
aksen          : blue-600 #2563EB, cyan-400 #22D3EE (glow pin)
verdict colors : sama dengan app (green/teal/amber/red) — konsistensi produk
teks hero      : putih; body section terang: slate-900 di bg white/slate-50
font           : Inter; headline tracking-tight font-semibold
```

Bagian hero gelap (navy), sisa halaman terang berselang-seling — ritme scroll jelas.

## 3. Struktur Halaman (atas → bawah)

### S1 — Hero (interaktif)
- Kiri: logo kecil, headline **"Berhenti menebak lokasi. Mulai menghitungnya."**, subhead satu kalimat (value prop), CTA primer "Coba demo →" + CTA sekunder "Lihat cara kerjanya ↓" (smooth scroll ke S3).
- Kanan (≥lg) / bawah (mobile): **MiniMap interaktif** — MapLibre kecil (Jaksel, gestures dinonaktifkan kecuali klik) dengan 3 titik kandidat berdenyut. Klik titik → pin jatuh, radius ring beranimasi keluar, ScoreDial mini muncul dengan angka count-up + verdict badge. Data dari `landing/sample-locations.json` (3 lokasi × skor + 3 faktor teratas). Ini demo produk sungguhan dalam 10 detik.
- Trust strip bawah hero: 3 stat count-up saat masuk viewport — "2.300+ titik grid dianalisis · 400+ kompetitor terpetakan · 3 kategori franchise" (angka dari seed, jujur).

### S2 — Problem (scroll reveal)
Dua kartu kontras side-by-side, fade+slide saat masuk viewport:
- "Cara lama": ilustrasi feeling/survei — "2 minggu survei, keputusan tetap pakai insting."
- "Dengan Localyze": skor + evidence — "1 menit, keputusan dengan angka yang bisa dipertanggungjawabkan."

### S3 — How it works (scroll-driven, bagian paling interaktif)
Tiga langkah dengan **scrollytelling**: teks step di kiri (sticky), panel visual kanan berubah mengikuti scroll progress (Framer Motion `useScroll`):
1. **Pilih titik** — kursor animasi klik peta, pin jatuh, radius rings mekar (1/2/5 km).
2. **Baca skornya** — ScoreDial terisi 0→72, breakdown rows muncul satu-satu dengan contribution badge (+12.9 hijau, −10.4 merah) — pakai komponen `FactorRow` yang SAMA dengan app (reuse, bukan tiruan).
3. **Bandingkan & putuskan** — dua kolom skor bertarung, faktor pemenang di-highlight, verdict badge final.

Fallback `prefers-reduced-motion`: tiga panel statis dengan stepper klik manual.

### S4 — Feature grid: "5 lensa analisis"
Grid 5 kartu hover-interactive (tilt halus + ikon animasi saat hover): Market saturation, Demographics (keduanya badge "Live di MVP") + Disaster risk, Economic lifecycle, Economic synergy (badge "Segera hadir", opacity lebih rendah). Jujur soal apa yang sudah jadi — sama seperti teaser di app.

### S5 — Interactive playground: "Coba logikanya"
Widget **WeightPlayground**: 3 slider (Demand vs Kompetisi, τ jarak, penalti kanibalisasi) yang menghitung ulang skor sample secara client-side (fungsi scoring mini di TS — port sederhana dari formula backend, ±20 baris) dan ScoreDial + verdict berubah real-time. Pesan yang tersampaikan: *skor ini transparan dan explainable, bukan black box.* Ini section yang membuat orang inget.

### S6 — Untuk siapa
3 kartu persona singkat: Franchise HQ, Business development, Investor/VC — masing-masing satu kalimat use case.

### S7 — CTA final
Bg navy, headline "Lokasi berikutnya, dihitung." + tombol demo besar + secondary link ke GitHub repo (portfolio!). Footer minimal: logo, "Dibuat oleh Moym", link GitHub/LinkedIn.

## 4. Komponen Baru

`LandingLayout` (tanpa TopBar app; navbar sendiri: logo + "Cara kerja / Fitur / Demo") · `MiniMap` · `ScoreDialMini` (reuse ScoreDial dengan prop size) · `CountUpStat` · `ScrollStep` (scrollytelling wrapper) · `WeightPlayground` · `FeatureCard` · `PersonaCard` · `LandingNavbar` (transparan di hero → solid saat scroll)

Data: `src/landing/sample-locations.json` + `src/landing/scoring-mini.ts` (fungsi murni, unit-testable).

## 5. Copywriting (draft siap pakai, Bahasa Indonesia)

- Headline: "Berhenti menebak lokasi. Mulai menghitungnya."
- Subhead: "Localyze menganalisis kepadatan kompetitor, demografi, dan potensi pasar dalam satu skor yang bisa kamu pertanggungjawabkan ke siapa pun."
- S2: "Ekspansi franchise gagal paling sering karena satu hal: lokasi yang dipilih pakai perasaan."
- S3 intro: "Dari titik di peta ke keputusan — dalam tiga langkah."
- S5 intro: "Tidak percaya skornya? Bagus. Geser sendiri bobotnya."
- CTA: "Coba demo — tanpa daftar, tanpa kartu kredit."

## 6. Performa & Aksesibilitas

- MiniMap & WeightPlayground: `next/dynamic` `ssr:false`, load setelah hero text ter-paint; placeholder blur statis sebelum peta siap.
- Semua section server-rendered (SSG); hanya widget interaktif yang client component.
- `prefers-reduced-motion`: matikan parallax/scrollytelling → versi stepper statis.
- Semua interaksi bisa keyboard; kontras teks di navy min AA; angka skor `tabular-nums`.
- Target Lighthouse: Performance ≥ 90, A11y ≥ 95 (dicek di acceptance).
