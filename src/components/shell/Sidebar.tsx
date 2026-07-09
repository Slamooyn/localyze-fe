"use client";

import {
  Compass,
  History,
  LayoutDashboard,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Settings,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoBadge } from "@/components/Logo";
import { useAppStore } from "@/lib/store";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: boolean;
}

const NAV: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/discovery", label: "Discovery", icon: Compass },
  { href: "/app/compare", label: "Compare", icon: Scale, badge: true },
  { href: "/app/history", label: "History", icon: History },
  { href: "/app/settings/outlets", label: "Outlets", icon: Store },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggle = useAppStore((s) => s.toggleSidebar);
  const compareCount = useAppStore((s) => s.compareIds.length);

  return (
    <aside
      className={`flex shrink-0 flex-col bg-gradient-to-b from-navy to-navy-800 text-slate-300 transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      <div className={`flex h-[60px] items-center gap-2.5 px-4 ${collapsed ? "justify-center" : ""}`}>
        <LogoBadge size={collapsed ? 26 : 24} />
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-white">Localyze</span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-accent-cyan" />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.badge && compareCount > 0 && (
                <span
                  className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-cyan px-1 text-[10px] font-bold text-navy ${
                    collapsed ? "absolute right-1 top-1" : "ml-auto"
                  }`}
                >
                  {compareCount}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t border-white/10" />

        <Link
          href="/app/settings/outlets"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </nav>

      <button
        onClick={toggle}
        className={`m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-[18px] w-[18px]" />
        ) : (
          <>
            <PanelLeftClose className="h-[18px] w-[18px]" /> <span>Ciutkan</span>
          </>
        )}
      </button>
    </aside>
  );
}
