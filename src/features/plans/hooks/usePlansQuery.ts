"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlans,
  fetchPlansStats,
  fetchPlanById,
  fetchPlanSubscribers,
} from "@/lib/api/plans";

export const PLANS_QUERY_KEYS = {
  all: ["plans"] as const,
  lists: () => [...PLANS_QUERY_KEYS.all, "list"] as const,
  list: (query?: Record<string, unknown>) =>
    [...PLANS_QUERY_KEYS.lists(), query ?? {}] as const,
  stats: () => [...PLANS_QUERY_KEYS.all, "stats"] as const,
  details: () => [...PLANS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...PLANS_QUERY_KEYS.details(), String(id)] as const,
  subscribers: (planId: string | number) =>
    [...PLANS_QUERY_KEYS.all, "subscribers", String(planId)] as const,
};

export function usePlansQuery(query?: Record<string, unknown>) {
  return useQuery({
    queryKey: PLANS_QUERY_KEYS.list(query),
    queryFn: () => fetchPlans(),
  });
}

export function usePlansStatsQuery() {
  return useQuery({
    queryKey: PLANS_QUERY_KEYS.stats(),
    queryFn: () => fetchPlansStats(),
  });
}

export function usePlanDetailQuery(planId: string | number | null | undefined) {
  return useQuery({
    queryKey: PLANS_QUERY_KEYS.detail(planId || ""),
    queryFn: () => fetchPlanById(planId!),
    enabled: Boolean(planId),
  });
}

export function usePlanSubscribersQuery(planId: string | number | null | undefined) {
  return useQuery({
    queryKey: PLANS_QUERY_KEYS.subscribers(planId || ""),
    queryFn: () => fetchPlanSubscribers(planId!),
    enabled: Boolean(planId),
  });
}

export function invalidatePlansQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: PLANS_QUERY_KEYS.all,
  });
}

export function prefetchPlansQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: PLANS_QUERY_KEYS.list(),
      queryFn: () => fetchPlans(),
    }),
    queryClient.prefetchQuery({
      queryKey: PLANS_QUERY_KEYS.stats(),
      queryFn: () => fetchPlansStats(),
    }),
  ]);
}
