"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchServerInfo, fetchSystemUpdate } from "@/lib/api/settings";

export const UTILITY_QUERY_KEYS = {
  all: ["utility"] as const,
  serverInfo: () => [...UTILITY_QUERY_KEYS.all, "server-info"] as const,
  systemUpdate: () => [...UTILITY_QUERY_KEYS.all, "system-update"] as const,
};

export function useServerInfoQuery() {
  return useQuery({
    queryKey: UTILITY_QUERY_KEYS.serverInfo(),
    queryFn: () => fetchServerInfo(),
  });
}

export function useSystemUpdateQuery() {
  return useQuery({
    queryKey: UTILITY_QUERY_KEYS.systemUpdate(),
    queryFn: () => fetchSystemUpdate(),
  });
}

export function invalidateUtilityQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: UTILITY_QUERY_KEYS.all,
  });
}
