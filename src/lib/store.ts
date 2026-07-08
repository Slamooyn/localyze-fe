"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  categorySlug: string;
  setCategory: (slug: string) => void;

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
      categorySlug: "coffee-grab-go",
      setCategory: (slug) => set({ categorySlug: slug }),

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
        categorySlug: s.categorySlug,
        compareIds: s.compareIds,
        showOutlets: s.showOutlets,
      }),
    },
  ),
);
