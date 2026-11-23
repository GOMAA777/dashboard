"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWebsiteTheme,
  fetchWebsiteSeo,
  fetchWebsiteHero,
  fetchWebsiteFeatures,
} from "@/lib/api/website";

export const WEBSITE_SETTINGS_QUERY_KEYS = {
  all: ["website-settings"] as const,
  theme: () => [...WEBSITE_SETTINGS_QUERY_KEYS.all, "theme"] as const,
  seo: () => [...WEBSITE_SETTINGS_QUERY_KEYS.all, "seo"] as const,
  hero: () => [...WEBSITE_SETTINGS_QUERY_KEYS.all, "hero"] as const,
  features: () => [...WEBSITE_SETTINGS_QUERY_KEYS.all, "features"] as const,
};

export function useWebsiteThemeQuery() {
  return useQuery({
    queryKey: WEBSITE_SETTINGS_QUERY_KEYS.theme(),
    queryFn: () => fetchWebsiteTheme(),
  });
}

export function useWebsiteSeoQuery() {
  return useQuery({
    queryKey: WEBSITE_SETTINGS_QUERY_KEYS.seo(),
    queryFn: () => fetchWebsiteSeo(),
  });
}

export function useWebsiteHeroQuery() {
  return useQuery({
    queryKey: WEBSITE_SETTINGS_QUERY_KEYS.hero(),
    queryFn: () => fetchWebsiteHero(),
  });
}

export function useWebsiteFeaturesQuery() {
  return useQuery({
    queryKey: WEBSITE_SETTINGS_QUERY_KEYS.features(),
    queryFn: () => fetchWebsiteFeatures(),
  });
}

export function invalidateWebsiteSettingsQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  section?: "theme" | "seo" | "hero" | "features"
) {
  if (section && section in WEBSITE_SETTINGS_QUERY_KEYS) {
    return queryClient.invalidateQueries({
      queryKey: WEBSITE_SETTINGS_QUERY_KEYS[section](),
    });
  }
  return queryClient.invalidateQueries({
    queryKey: WEBSITE_SETTINGS_QUERY_KEYS.all,
  });
}

export function prefetchWebsiteSettingsQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: WEBSITE_SETTINGS_QUERY_KEYS.theme(),
      queryFn: () => fetchWebsiteTheme(),
    }),
    queryClient.prefetchQuery({
      queryKey: WEBSITE_SETTINGS_QUERY_KEYS.hero(),
      queryFn: () => fetchWebsiteHero(),
    }),
  ]);
}
