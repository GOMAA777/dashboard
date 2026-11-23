"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubscriptions,
  fetchSubscriptionsStats,
  fetchSubscriptionById,
  fetchSubscriptionLimitsBreakdown,
} from "@/lib/api/subscriptions";
import type { SubscriptionListParams } from "@/features/subscriptions/types/subscription.types";
import { QUERY_KEYS } from "@/lib/query-keys";

export const SUBSCRIPTIONS_QUERY_KEYS = {
  all: QUERY_KEYS.subscriptions.all,
  lists: () => QUERY_KEYS.subscriptions.lists(),
  list: (params?: SubscriptionListParams) =>
    QUERY_KEYS.subscriptions.list(params as Record<string, unknown>),
  stats: () => QUERY_KEYS.subscriptions.stats(),
  details: () => QUERY_KEYS.subscriptions.details(),
  detail: (id: string | number) => QUERY_KEYS.subscriptions.detail(id),
  limits: (id: string | number) => QUERY_KEYS.subscriptions.limits(id),
};

export function useSubscriptionsQuery(params: SubscriptionListParams = {}) {
  return useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.list(params),
    queryFn: () => fetchSubscriptions(params),
  });
}

export function useSubscriptionsStatsQuery() {
  return useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.stats(),
    queryFn: () => fetchSubscriptionsStats(),
  });
}

export function useSubscriptionDetailQuery(id: string | number | null | undefined) {
  return useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.detail(id || ""),
    queryFn: () => fetchSubscriptionById(id!),
    enabled: Boolean(id),
  });
}

export function useSubscriptionLimitsQuery(id: string | number | null | undefined) {
  return useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.limits(id || ""),
    queryFn: () => fetchSubscriptionLimitsBreakdown(id!),
    enabled: Boolean(id),
  });
}

export function invalidateSubscriptionsQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.all,
  });
}

export function prefetchSubscriptionsQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: SUBSCRIPTIONS_QUERY_KEYS.list({ tab: "all", page: 1, per_page: 5 }),
      queryFn: () => fetchSubscriptions({ tab: "all", page: 1, per_page: 5 }),
    }),
    queryClient.prefetchQuery({
      queryKey: SUBSCRIPTIONS_QUERY_KEYS.stats(),
      queryFn: () => fetchSubscriptionsStats(),
    }),
  ]);
}
