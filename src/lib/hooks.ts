"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "./api/client";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: api.categories, staleTime: Infinity });
}

export function useDistricts() {
  return useQuery({
    queryKey: ["regions", "district"],
    queryFn: () => api.regions("district"),
    staleTime: Infinity,
  });
}

export function useActiveCategory(slug: string) {
  const { data } = useCategories();
  return data?.find((c) => c.slug === slug);
}
