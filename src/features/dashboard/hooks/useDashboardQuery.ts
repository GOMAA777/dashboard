"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loadFullDashboardData, type FullDashboardState } from "@/lib/api/dashboard";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useDashboardQuery() {
  return useQuery<FullDashboardState>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => loadFullDashboardData(),
  });
}

export function prefetchDashboardQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => loadFullDashboardData(),
  });
}
