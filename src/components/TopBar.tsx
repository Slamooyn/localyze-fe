"use client";

import { Compass, History, MapPin, Scale, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CategorySwitcher } from "./CategorySwitcher";
import { Wordmark } from "./Logo";
import { useAppStore } from "@/lib/store";

const NAV = [
  { href: "/app", label: "Analyze", icon: MapPin, exact: true },
  { href: "/app/discovery", label: "Discovery", icon: Compass },
  { href: "/app/compare", label: "Compare", icon: Scale },
  { href: "/app/history", label: "History", icon: History },
];

export function TopBar() {
  const pathname = usePathname();
  const compareCount = useAppStore((s) => s.compareIds.length);

  return (
    <header className="flex h-[var(--topbar-h)] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
      <div className="flex items-center gap-6">
        <Link href="/app" className="shrink-0">
          <Wordmark className="text-[17px]" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {label === "Compare" && compareCount > 0 && (
                  <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                    {compareCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <CategorySwitcher />
        <Link
          href="/app/settings/outlets"
          className={`rounded-lg p-2 transition ${
            pathname.startsWith("/app/settings")
              ? "bg-brand/10 text-brand"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
          aria-label="Pengaturan outlet"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
