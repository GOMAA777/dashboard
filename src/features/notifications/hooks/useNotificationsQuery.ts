"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAnnouncements,
  fetchAnnouncementsStats,
  fetchAnnouncementById,
} from "@/lib/api/announcements";
import type { AnnouncementsListParams } from "@/lib/api/types";

export const NOTIFICATIONS_QUERY_KEYS = {
  all: ["announcements"] as const,
  lists: () => [...NOTIFICATIONS_QUERY_KEYS.all, "list"] as const,
  list: (params?: AnnouncementsListParams) =>
    [...NOTIFICATIONS_QUERY_KEYS.lists(), params ?? {}] as const,
  stats: () => [...NOTIFICATIONS_QUERY_KEYS.all, "stats"] as const,
  details: () => [...NOTIFICATIONS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...NOTIFICATIONS_QUERY_KEYS.details(), String(id)] as const,
};

export function useAnnouncementsQuery(params: AnnouncementsListParams = {}) {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.list(params),
    queryFn: () => fetchAnnouncements(params),
  });
}

export function useAnnouncementsStatsQuery() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.stats(),
    queryFn: () => fetchAnnouncementsStats(),
  });
}

export function useAnnouncementDetailQuery(id: string | number | null | undefined) {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.detail(id || ""),
    queryFn: () => fetchAnnouncementById(id!),
    enabled: Boolean(id),
  });
}

export function invalidateNotificationsQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: NOTIFICATIONS_QUERY_KEYS.all,
  });
}

export function prefetchNotificationsQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.list({ page: 1, per_page: 5 }),
      queryFn: () => fetchAnnouncements({ page: 1, per_page: 5 }),
    }),
    queryClient.prefetchQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.stats(),
      queryFn: () => fetchAnnouncementsStats(),
    }),
  ]);
}
