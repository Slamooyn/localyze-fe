# Prompt Claude Code — Phase 2 Frontend (Wave 2A)

> Copy-paste dari root repo `localyze-fe`. Prasyarat: app MVP selesai DAN backend Phase 2 (P1–P4) sudah jalan di `localhost:8000`.

---

```
Kamu melanjutkan frontend Localyze yang sudah jadi (Next.js analytical dashboard).
Sekarang implementasi Phase 2 Wave 2A: Disaster Risk card + map layer, Economic
Synergy card, dan Export Memo PDF. Gunakan skill UIUXProMax.

## LANGKAH PERTAMA (WAJIB)
1. Baca markdowns/phase2-feature-spec.md §2 & §4 — UX tiap fitur dan aturan desain.
2. Baca ../localyze-be/markdowns/phase2-backend-spec.md §2-3 — kontrak
   breakdown.modifiers dan endpoint baru; update src/lib/api/types.ts 1:1
   (modifiers OPTIONAL — analisis lama tidak memilikinya, guard di semua render).
3. Ikuti pola existing: card grid dashboard, FactorRow + evidence, motion tokens
   dari design-craft-guidelines.md. JANGAN menciptakan pola UI baru.

## URUTAN PENGERJAAN (commit per milestone)
F1. DisasterRiskCard: ganti teaser locked "Disaster risk" → card aktif (animasi
    unlock sekali: fade locked → konten). Isi: badge level per hazard (1-2 hijau,
    3 amber, 4-5 merah — SELALU dengan teks level, bukan warna saja), penalty
    poin di header, mitigation line untuk hazard level ≥3, sumber & tahun.
    KPI "Kanibalisasi" di-rename "Penalti" dan menggabungkan kanibalisasi +
    disaster (tooltip breakdown keduanya). Empty/missing-data state: "Data risiko
    belum tersedia untuk area ini".
F2. Map layer risiko: toggle "Risiko banjir" di MapCard → fetch
    GET /risks/choropleth?hazard=flood sekali (cache TanStack) → fill layer
    choropleth kecamatan (opacity 0.25, ramp biru→merah, legend kecil di pojok).
    Layer mati secara default; state toggle persist (Zustand).
F3. SynergyCard: ganti teaser "Economic synergy" → card aktif: bonus poin +
    top-3 peluang (ikon lucide per tipe, jarak, kalimat opportunity), expandable
    evidence pola FactorRow. Bila bonus 0 → tampilkan "Belum ada sinergi menonjol
    dalam radius" (bukan card kosong).
F4. Export memo: aktifkan tombol "Export memo" di header Dashboard (menu ⋯) dan
    di Compare (memo perbandingan via /analyses/compare/memo). Klik → loading
    state di tombol (label crossfade, lebar terkunci) → download blob PDF dengan
    filename dari header Content-Disposition. Error → toast sonner. Teaser
    "Export memo" yang lama di Compare dihapus (sudah jadi fitur nyata).
    Lalu polish pass: teaser tersisa (foot traffic dll) tetap locked, tsc +
    ESLint clean, cek analisis LAMA (tanpa modifiers) tetap terender tanpa error.

## ACCEPTANCE
1. Analisis Tebet → DisasterRiskCard & SynergyCard terisi; KPI Penalti
   menggabungkan dua sumber dengan tooltip.
2. Toggle "Risiko banjir" → choropleth muncul dengan legend; toggle persist
   setelah reload.
3. Export memo dari dashboard → PDF terdownload & terbuka; dari Compare (2 lokasi)
   → memo perbandingan.
4. Buka analisis lama dari History (dibuat sebelum Phase 2) → tidak ada error,
   card modifier menampilkan state "data belum tersedia".
5. Reduced-motion: animasi unlock jadi tampil langsung; semua tetap berfungsi.

Kerjakan F1 sekarang. Screenshot + ringkasan tiap milestone sebelum lanjut.
```
