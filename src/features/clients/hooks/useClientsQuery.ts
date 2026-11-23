"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFirms,
  fetchFirmsStats,
  fetchFirmById,
  type FirmsListParams,
} from "@/lib/api/firms";
export { usePlansQuery } from "@/features/plans/hooks/usePlansQuery";

export const CLIENTS_QUERY_KEYS = {
  all: ["firms"] as const,
  lists: () => [...CLIENTS_QUERY_KEYS.all, "list"] as const,
  list: (params?: FirmsListParams) =>
    [...CLIENTS_QUERY_KEYS.lists(), params ?? {}] as const,
  stats: () => [...CLIENTS_QUERY_KEYS.all, "stats"] as const,
  details: () => [...CLIENTS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...CLIENTS_QUERY_KEYS.details(), String(id)] as const,
};

export function useFirmsQuery(params: FirmsListParams = { status: "all", page: 1, per_page: 100 }) {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEYS.list(params),
    queryFn: () => fetchFirms(params),
  });
}

export function useFirmStatsQuery() {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEYS.stats(),
    queryFn: () => fetchFirmsStats(),
  });
}

export function useFirmDetailQuery(firmId: string | number | null | undefined) {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEYS.detail(firmId || ""),
    queryFn: () => fetchFirmById(firmId!),
    enabled: Boolean(firmId),
  });
}

export function invalidateClientsQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: CLIENTS_QUERY_KEYS.all,
  });
}

export function prefetchClientsQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: CLIENTS_QUERY_KEYS.list({ status: "all", page: 1, per_page: 100 }),
      queryFn: () => fetchFirms({ status: "all", page: 1, per_page: 100 }),
    }),
    queryClient.prefetchQuery({
      queryKey: CLIENTS_QUERY_KEYS.stats(),
      queryFn: () => fetchFirmsStats(),
    }),
  ]);
}
