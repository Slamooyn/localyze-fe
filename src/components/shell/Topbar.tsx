"use client";

import { Bell, MapPin } from "lucide-react";

import { CategorySwitcher } from "@/components/CategorySwitcher";
import { GlobalSearch } from "./GlobalSearch";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-5">
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 lg:inline-flex">
          <MapPin className="h-3.5 w-3.5 text-brand" />
          Jakarta Selatan
        </span>
        <CategorySwitcher />
        <button
          className="relative rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Notifikasi"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-cyan" />
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <UserMenu />
      </div>
    </header>
  );
}
