# Localyze — Phase 2 Feature Spec

> **Status:** Phase 2 planning · **Created:** 2026-07-11 · **Owner:** Moym
> **Prasyarat:** MVP (BE M1–M7, FE M1–M7, Landing L1–L4) selesai & acceptance hijau.
> Pasangan dokumen: `../../localyze-be/markdowns/phase2-backend-spec.md` (schema, scoring, API).

---

## 1. Prioritisasi (keputusan produk)

Fitur Phase 2 dari brief awal TIDAK setara — dipecah berdasarkan dua sumbu: *bisa dibangun dengan data yang sudah ada di snapshot lokal?* dan *menambah nilai demo/portfolio?*

### Wave 2A — dikerjakan sekarang (data sudah ada / mudah di-seed)
| Fitur | Kenapa sekarang | Sumber data |
|---|---|---|
| **1. Disaster Risk Assessment** | Teaser paling ditunggu; data risiko per kecamatan bisa di-seed dari InaRISK/BNPB (atau sintetis-realistis berlabel) | Seed statis per kecamatan |
| **2. Economic Synergy** | GRATIS — dihitung dari snapshot `places` yang sudah ada (bisnis komplementer dalam radius) | Data existing |
| **3. Export Executive Memo (PDF)** | Melengkapi alur eksekutif end-to-end; tombol teaser-nya sudah ada di Compare | Data analisis existing |

### Wave 2B — setelah 2A (butuh data modeled / upload user)
4. **Economic Lifecycle** — indeks fase ekonomi per kecamatan (modeled, dilabeli jujur).
5. **Accessibility & Infrastructure** — konektivitas transport dari anchor stasiun/halte + walkability proxy.
6. **Benchmarking** — upload CSV penjualan outlet → korelasi skor lokasi vs performa aktual (fitur riset paling menarik: memvalidasi scoring engine sendiri).

### Parked — jangan dikerjakan sampai ada data nyata
Foot traffic (butuh data pergerakan), Real estate intelligence (butuh data harga sewa), Saturation velocity (butuh snapshot time-series), Regulatory checklist (konten statis, bukan analitik — nilai rendah untuk portfolio).

---

## 2. Wave 2A — Spesifikasi UX

### 2A.1 Disaster Risk Assessment
**Konsep skor:** risiko TIDAK masuk pilar (bukan lawan demand/competition) — dia jadi **modifier**: `penalty_risk` 0..−10 poin terhadap komposit, dari hazard tertinggi kecamatan (banjir/gempa/longsor, level 1–5). Breakdown baru: blok `modifiers.disaster`.

UI:
- **Teaser "Disaster risk" di ScoreBreakdown → UNLOCKED** menjadi `DisasterRiskCard`: badge level per hazard (1–2 hijau, 3 amber, 4–5 merah), penalty poin, mitigasi satu kalimat per hazard level ≥3 ("Area rawan banjir level 4 — pertimbangkan lantai 2 / asuransi banjir"), sumber & tahun data.
- **Map layer baru** di MapCard: toggle "Risiko banjir" → choropleth kecamatan (opacity rendah, ramp biru→merah). Satu hazard dulu (banjir — paling relevan Jakarta); hazard lain cukup di card.
- KPI card Kanibalisasi digabung jadi KPI **"Penalti"** (kanibalisasi + risiko) bila keduanya aktif — jangan menambah KPI ketujuh.
- Discovery: skor grid ikut memperhitungkan penalti risiko (precompute ulang).

### 2A.2 Economic Synergy
**Konsep:** tiap kategori franchise punya peta kategori komplementer (di config BE): kopi ↔ kantor/coworking/kampus/gym; laundry ↔ kost/apartemen/kampus; minimarket ↔ perumahan/sekolah/stasiun. Synergy dihitung dari anchor & places dalam radius dengan decay yang sama → **bonus** 0..+5 poin + daftar peluang konkret.

UI:
- **Teaser "Economic synergy" → UNLOCKED** menjadi `SynergyCard`: bonus poin + top-3 peluang dengan kalimat actionable ("3 coworking space dalam 500 m — peluang partnership kopi B2B / voucher karyawan"), ikon per tipe, jarak.
- Breakdown blok `modifiers.synergy`; FactorRow pattern yang sama (evidence expandable).

### 2A.3 Export Executive Memo (PDF)
**Konsep:** satu klik → PDF 2 halaman siap kirim ke atasan/investor: halaman 1 = verdict besar + skor + ringkasan naratif otomatis (template kalimat dari breakdown, bukan LLM) + tabel faktor; halaman 2 = kompetitor terdekat, demografi, risk & synergy, disclaimer data. Header logo + tanggal + nama analis (user login).

UI:
- Tombol "Export memo" AKTIF di: header Dashboard Analisis (menu ⋯) dan Compare (memo perbandingan: tabel side-by-side + rekomendasi lokasi pemenang).
- Loading state di tombol (label crossfade, lebar terkunci); hasil = file download `localyze-memo-{nama}.pdf`.
- Naratif Bahasa Indonesia, konsisten dengan `evidence`.

---

## 3. Wave 2B — Ringkas (spec detail menyusul saat 2A selesai)

- **Economic Lifecycle:** indeks 0–100 per kecamatan (modeled dari proxy: pertumbuhan jumlah POI, kepadatan vs kapasitas) → label fase Growth/Maturity/Decline + badge "modeled" wajib. Masuk sebagai faktor demand kelima berbobot kecil (0.10), bukan pilar baru.
- **Accessibility:** jarak ke stasiun/halte terdekat (data anchor existing + seed halte TransJakarta) + kepadatan jalan proxy → faktor demand "aksesibilitas".
- **Benchmarking:** upload CSV `outlet_name,monthly_sales` → scatter skor-vs-penjualan + korelasi + insight ("outlet dengan skor <55 rata-rata penjualannya 30% di bawah median") → ini validasi empiris scoring engine, bahan case study paling kuat.

---

## 4. Aturan Desain (berlaku semua fitur Phase 2)

1. Fitur baru masuk lewat pola yang sudah ada: card di grid dashboard, blok baru di `breakdown`, FactorRow + evidence — JANGAN menciptakan pola UI baru.
2. Verdict bands TIDAK berubah; modifier hanya menggeser komposit (clamp 0–100).
3. Data modeled/sintetis selalu berlabel; sumber & tahun tampil di card.
4. Teaser yang belum dibangun (foot traffic, dsb.) tetap locked — jangan dihapus.
5. Motion & polish mengikuti `design-craft-guidelines.md`; unlock teaser dianimasikan sekali (fade dari locked → konten).
