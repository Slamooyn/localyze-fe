# Localyze Frontend — Index Dokumentasi

> Diperbarui: 2026-07-08

1. **`tech-stack-frontend.md`** — decision record framework: Next.js 14 + Tailwind + MapLibre (kenapa, dan alternatif yang ditolak) + struktur route final (`/` landing, `/app/*` aplikasi).
2. **`mvp-feature-spec.md` (v2)** — spec app sebagai analytical dashboard: shell sidebar navy + KPI cards, 5 layar `/app/*`, auth pages (register/login + akun demo), flows, states, component inventory. Logo resmi: `src/app/image copy.png` → `public/logo-localyze.png`.
3. **`landing-page-spec.md` (v3)** — spec landing interaktif (`/`): GlowyWavesHero (canvas reaktif mouse) + ContainerScroll dashboard reveal (referensi di `markdowns/reference/`), What you get, tutorial sneak peek, Metodologi & Rumus + WeightPlayground, CTA → register. Tanpa GSAP; `cinematic-hero-reference.tsx` = arsip.
4. **`design-craft-guidelines.md`** — addendum wajib: filosofi motion & polish ala Emil Kowalski (motion tokens `src/lib/motion.ts`, micro-interactions per komponen, polish checklist, definition of done).
5. **`claude-code-prompt-frontend.md`** — prompt Claude Code untuk app (M1–M7).
6. **`claude-code-prompt-landing.md`** — prompt Claude Code untuk landing (L1–L4), dijalankan setelah app selesai.
7. **`phase2-feature-spec.md`** — prioritisasi & UX Phase 2 (Wave 2A: disaster risk, synergy, export memo; Wave 2B; parked).
8. **`claude-code-prompt-phase2-frontend.md`** — prompt Phase 2 FE (F1–F4), setelah backend Phase 2 jalan.

Kontrak API mengikuti `../localyze-be/markdowns/api-contract.md`. Urutan eksekusi keseluruhan: lihat `../development-playbook.md` di root project.
