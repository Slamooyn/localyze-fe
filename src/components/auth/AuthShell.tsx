import Link from "next/link";

import { LogoBadge, Wordmark } from "@/components/Logo";
import { ScoreDial } from "@/components/ScoreDial";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Wordmark />
          </Link>
          {children}
          <p className="mt-8 text-center text-xs text-slate-400">
            Demo build — tanpa verifikasi email atau reset password.
          </p>
        </div>
      </div>

      {/* navy panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-b from-navy to-navy-800 lg:block">
        <div className="flex h-full flex-col justify-between p-12 text-white">
          <Link href="/">
            <Wordmark onNavy className="text-lg" />
          </Link>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/95 p-3 shadow-lg">
                <ScoreDial score={84} verdict="prime" size={96} label="" />
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300">Contoh skor lokasi</p>
                <p className="text-2xl font-semibold">Kebayoran Baru</p>
                <p className="text-sm text-blue-200/70">Demand kuat · kompetisi ringan</p>
              </div>
            </div>
            <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">
              Berhenti menebak lokasi. Mulai menghitungnya.
            </h2>
            <p className="max-w-sm text-blue-100/70">
              Satu skor 0–100 dengan verdict dan bukti per faktor — untuk keputusan ekspansi yang
              bisa kamu pertanggungjawabkan.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-200/50">
            <LogoBadge size={16} />
            Franchise Location Intelligence · pilot Jakarta Selatan
          </div>
        </div>
      </div>
    </div>
  );
}
