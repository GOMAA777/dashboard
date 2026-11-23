"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchGeneralSettings,
  fetchMailSettings,
  fetchCurrencies,
  fetchLanguages,
} from "@/lib/api/settings";

export const SETTINGS_QUERY_KEYS = {
  all: ["settings"] as const,
  general: () => [...SETTINGS_QUERY_KEYS.all, "general"] as const,
  mail: () => [...SETTINGS_QUERY_KEYS.all, "mail"] as const,
  currencies: () => [...SETTINGS_QUERY_KEYS.all, "currencies"] as const,
  languages: () => [...SETTINGS_QUERY_KEYS.all, "languages"] as const,
};

export function useGeneralSettingsQuery() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.general(),
    queryFn: () => fetchGeneralSettings(),
  });
}

export function useMailSettingsQuery() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.mail(),
    queryFn: () => fetchMailSettings(),
  });
}

export function useCurrenciesQuery() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.currencies(),
    queryFn: () => fetchCurrencies(),
  });
}

export function useLanguagesQuery() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.languages(),
    queryFn: () => fetchLanguages(),
  });
}

export function invalidateSettingsQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  section?: "general" | "mail" | "currencies" | "languages"
) {
  if (section && section in SETTINGS_QUERY_KEYS) {
    return queryClient.invalidateQueries({
      queryKey: SETTINGS_QUERY_KEYS[section](),
    });
  }
  return queryClient.invalidateQueries({
    queryKey: SETTINGS_QUERY_KEYS.all,
  });
}

export function prefetchSettingsQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: SETTINGS_QUERY_KEYS.general(),
      queryFn: () => fetchGeneralSettings(),
    }),
    queryClient.prefetchQuery({
      queryKey: SETTINGS_QUERY_KEYS.mail(),
      queryFn: () => fetchMailSettings(),
    }),
  ]);
}
