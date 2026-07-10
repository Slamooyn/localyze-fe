# Localyze — Design Craft Guidelines (Motion & Polish)

> **Status:** Addendum wajib untuk semua pekerjaan FE (app & landing) · **Created:** 2026-07-09 · **Owner:** Moym
> **Filosofi:** taste ala Emil Kowalski (vaul, sonner, "Animations on the Web") — animasi yang halus, cepat, dan punya alasan. Impeccable design = detail kecil yang benar semua, bukan efek besar.
> Dokumen ini melengkapi `mvp-feature-spec.md` §3 (tokens) dan berlaku di atas semua milestone prompt FE & landing.

---

## 1. Filosofi Motion

1. **Setiap animasi harus punya tugas**: orientasi (dari mana elemen datang), feedback (aksi diterima), atau kontinuitas (state berubah tanpa lompatan). Kalau tidak ada tugas → jangan dianimasikan.
2. **Cepat dan tenang.** UI yang terasa premium itu terasa *instan*; animasi hanya menghaluskan, bukan memperlambat. Tidak ada durasi > 500ms di app.
3. **Animasi masuk sekali saja.** Data refresh/re-fetch TIDAK memicu ulang animasi masuk — hanya first mount per view. Dashboard yang berkedip setiap query terasa murahan.
4. **`prefers-reduced-motion`** selalu dihormati: transisi jadi fade singkat atau langsung.

## 2. Motion Tokens (pakai persis ini)

```ts
// src/lib/motion.ts — satu-satunya sumber nilai motion
export const dur = { fast: 0.15, base: 0.2, slow: 0.3, drawer: 0.4 };          // detik
export const easeOutExpo = [0.32, 0.72, 0, 1];   // entrance & drawer (kurva vaul)
export const easeInOut  = [0.45, 0, 0.55, 1];    // perpindahan posisi/layout
export const spring     = { type: "spring", stiffness: 400, damping: 35 };
// spring HANYA untuk elemen yang mengikuti gesture (drag pin tray, swipe toast)
```

Aturan pemakaian:

| Kasus | Resep |
|---|---|
| Hover/active/focus | CSS transition `150ms ease` — bukan Framer |
| Elemen masuk (card, dropdown, panel) | opacity 0→1 + translateY 4–8px ATAU scale 0.98→1, `dur.base`, easeOutExpo |
| Elemen keluar | resep sama, durasi **0.8×** lebih cepat dari masuk |
| Dropdown/popover/menu | scale dari `transform-origin` sisi trigger (menu muncul *dari* tombolnya) |
| Stagger list | delay 30–40ms antar item, maksimal 6 item pertama saja |
| Drawer/dialog | overlay fade + panel slide, `dur.drawer`, easeOutExpo |

## 3. Aturan Teknis (tidak bisa ditawar)

- **Animate hanya `transform` dan `opacity`.** Jangan pernah animate width/height/top/left/margin (reflow → jank). Expand/collapse pakai Framer `height: "auto"` (dia yang mengukur) atau grid-template-rows trick.
- Semua animasi **interruptible** — Framer Motion menangani ini; jangan tulis setTimeout chain manual.
- `will-change` hanya saat dibutuhkan, dilepas setelahnya (Framer otomatis).
- Angka yang berubah (KPI, skor): transisi **sekali** dengan count-up singkat (≤600ms) atau crossfade blur-up 2px — jangan berdetak setiap refetch (bandingkan nilai lama vs baru dulu).

## 4. Micro-interactions per Komponen

| Komponen | Perilaku |
|---|---|
| **Button** | hover: bg shift 150ms; active: `scale(0.97)` 100ms; loading: label crossfade ke spinner (lebar tombol dikunci — tanpa layout shift) |
| **KpiCard** | mount: fade+rise stagger 30ms antar card; nilai baru: count-up 500ms sekali; delta chip fade-in setelah angka selesai |
| **ScoreDial** | stroke-dashoffset terisi 600ms easeOutExpo, sekali per analisis baru; angka tengah count-up sinkron dengan dial |
| **FactorRow** | expand: height auto + chevron rotate 200ms; konten dalam fade 150ms delay 50ms |
| **Sidebar collapse** | width transition 300ms easeInOut; label fade-out 100ms *sebelum* width mengecil; ikon tidak bergeser |
| **Dropdown (CategorySwitcher, UserMenu)** | scale 0.98→1 + fade dari origin trigger, 150ms; keluar 120ms |
| **GlobalSearch (⌘K)** | overlay fade 150ms + panel scale 0.98→1; hasil muncul tanpa stagger (kecepatan > drama) |
| **Toast** | pakai **sonner** apa adanya — jangan restyle perilakunya, cukup token warna |
| **Sheet/Drawer & dialog konfirmasi** | pakai **vaul** untuk sheet; dialog kecil pakai resep drawer di §2 |
| **Pin peta** | muncul: scale 0→1 easeOutExpo dari titik jatuh + radius ring mekar (scale + fade); pin drag pakai `spring` |
| **Skeleton** | shimmer halus (opacity pulse 1.5s), bentuk = layout final persis (tanpa shift saat data masuk) |
| **CompareTray** | slide-up dari bawah saat item pertama masuk; chip baru masuk dengan spring kecil |

**Pengecualian library:** `sonner` dan `vaul` (karya Emil, headless & kecil) **diizinkan** meski aturan umum "tanpa component library" — justru dipakai sebagai referensi rasa. Selain dua itu tetap bangun sendiri.

## 5. Polish Checklist (impeccable design)

Typography & layout:
- Grid 4px untuk semua spacing; tidak ada nilai ganjil ad-hoc.
- Headline `tracking-tight`, `text-wrap: balance`; body `text-wrap: pretty`.
- Semua angka data `tabular-nums`; satuan (km², jiwa) lebih kecil & muted dari angkanya.
- Hierarki lewat weight + warna (primary/secondary/muted), bukan ukuran font berlebihan.

Surface & depth:
- Border `1px slate-200/60` + `shadow-sm` — satu layer, tidak ada drop shadow tebal.
- Hover card: border menguat (bukan shadow membesar).
- Radius konsisten: kontrol 8px, card 16px — tidak ada nilai ketiga.

Detail interaksi:
- `focus-visible` ring 2px offset 2px di SEMUA elemen interaktif (warna primary).
- Cursor benar (`pointer` hanya untuk yang benar-benar klik-able), `select-none` pada label kontrol.
- `::selection` diberi warna brand muda.
- Ikon hanya 16px atau 20px, `stroke-width` seragam (lucide default 2).
- Empty state dirancang (ilustrasi/ikon + copy + aksi) — bukan area kosong.
- Optical alignment: ikon dalam tombol digeser manual bila perlu supaya *terlihat* center.

## 6. Definition of Done (per milestone FE)

Sebelum menandai milestone selesai: (1) tidak ada layout shift saat loading→loaded (bandingkan skeleton vs final), (2) semua animasi tetap benar saat di-spam klik (interruptible), (3) `prefers-reduced-motion` dicek manual, (4) satu pass zoom-out 50% — komposisi & alignment masih rapi, (5) satu pass keyboard-only — semua alur utama bisa diselesaikan.
