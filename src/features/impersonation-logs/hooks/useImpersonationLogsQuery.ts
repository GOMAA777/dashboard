"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchImpersonationLogs,
  type ImpersonationLogsParams,
} from "@/lib/api/impersonation";

export const IMPERSONATION_LOGS_QUERY_KEYS = {
  all: ["impersonation-logs"] as const,
  lists: () => [...IMPERSONATION_LOGS_QUERY_KEYS.all, "list"] as const,
  list: (params?: ImpersonationLogsParams) =>
    [...IMPERSONATION_LOGS_QUERY_KEYS.lists(), params ?? {}] as const,
};

export function useImpersonationLogsQuery(params: ImpersonationLogsParams = {}) {
  return useQuery({
    queryKey: IMPERSONATION_LOGS_QUERY_KEYS.list(params),
    queryFn: () => fetchImpersonationLogs(params),
  });
}

export function prefetchImpersonationLogsQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: IMPERSONATION_LOGS_QUERY_KEYS.list({ page: 1, per_page: 10 }),
    queryFn: () => fetchImpersonationLogs({ page: 1, per_page: 10 }),
  });
}
