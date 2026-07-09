"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  // --- auth ---
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;

  // --- app context ---
  categorySlug: string;
  setCategory: (slug: string) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  compareIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;

  showOutlets: boolean;
  toggleOutlets: () => void;

  hoveredCompetitorId: number | null;
  setHoveredCompetitor: (id: number | null) => void;

  hoveredCellId: number | null;
  setHoveredCell: (id: number | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),

      categorySlug: "coffee-grab-go",
      setCategory: (slug) => set({ categorySlug: slug }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      compareIds: [],
      addToCompare: (id) =>
        set((s) =>
          s.compareIds.includes(id) || s.compareIds.length >= 3
            ? s
            : { compareIds: [...s.compareIds, id] },
        ),
      removeFromCompare: (id) =>
        set((s) => ({ compareIds: s.compareIds.filter((x) => x !== id) })),
      clearCompare: () => set({ compareIds: [] }),

      showOutlets: true,
      toggleOutlets: () => set((s) => ({ showOutlets: !s.showOutlets })),

      hoveredCompetitorId: null,
      setHoveredCompetitor: (id) => set({ hoveredCompetitorId: id }),

      hoveredCellId: null,
      setHoveredCell: (id) => set({ hoveredCellId: id }),
    }),
    {
      name: "localyze-ui",
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        categorySlug: s.categorySlug,
        sidebarCollapsed: s.sidebarCollapsed,
        compareIds: s.compareIds,
        showOutlets: s.showOutlets,
      }),
    },
  ),
);
