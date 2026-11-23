"use client";

import { apiRequest } from "./http";
import type {
  ApiAnnouncement,
  AnnouncementsListParams,
  AnnouncementsStats,
  CreateAnnouncementPayload,
} from "./types";

export async function fetchAnnouncements(params: AnnouncementsListParams = {}) {
  const query: Record<string, string | number | undefined> = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.per_page !== undefined) query.per_page = params.per_page;
  if (params.search) query.search = params.search;
  if (params.status && params.status !== "all") query.status = params.status;
  if (params.audience && params.audience !== "all") query.audience = params.audience;

  return apiRequest<{
    status: boolean;
    data: {
      current_page: number;
      data: ApiAnnouncement[];
      total: number;
      per_page: number;
      last_page: number;
    } | ApiAnnouncement[];
  }>("/admin/announcements", {
    method: "GET",
    query: Object.keys(query).length > 0 ? query : undefined,
  });
}

export async function fetchAnnouncementsStats(): Promise<AnnouncementsStats> {
  try {
    const [allRes, sentRes, scheduledRes, draftRes] = await Promise.all([
      fetchAnnouncements({ per_page: 1 }).catch(() => null),
      fetchAnnouncements({ per_page: 1, status: "sent" }).catch(() => null),
      fetchAnnouncements({ per_page: 1, status: "scheduled" }).catch(() => null),
      fetchAnnouncements({ per_page: 1, status: "draft" }).catch(() => null),
    ]);

    const extractTotal = (res: unknown): number => {
      if (!res || typeof res !== "object") return 0;
      const data = (res as { data?: { total?: number } | unknown[] }).data;
      if (data && typeof data === "object" && "total" in data && typeof data.total === "number") {
        return data.total;
      }
      if (Array.isArray(data)) return data.length;
      return 0;
    };

    return {
      all: extractTotal(allRes),
      activeAndReceived: extractTotal(sentRes),
      scheduled: extractTotal(scheduledRes),
      drafts: extractTotal(draftRes),
    };
  } catch {
    return { all: 0, activeAndReceived: 0, scheduled: 0, drafts: 0 };
  }
}

export async function createAnnouncement(
  body: CreateAnnouncementPayload | FormData | Record<string, unknown>
) {
  return apiRequest<{
    status: boolean;
    message?: string;
    data: ApiAnnouncement;
  }>("/admin/announcements", {
    method: "POST",
    body,
  });
}

export async function fetchAnnouncementById(id: string | number) {
  return apiRequest<{
    status: boolean;
    data: ApiAnnouncement;
  }>(`/admin/announcements/${id}`, { method: "GET" });
}

export async function deleteAnnouncement(id: string | number) {
  return apiRequest<{
    status: boolean;
    message?: string;
  }>(`/admin/announcements/${id}`, { method: "DELETE" });
}
