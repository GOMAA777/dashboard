"use client";

import { apiRequest } from "./http";
import type { ApiEnvelope, FirmListItem, Paginated } from "./types";

export type FirmsListParams = {
  status?: string;
  page?: number;
  per_page?: number;
  search?: string;
  city?: string;
  plan?: string;
};

function unwrapList(payload: unknown): FirmListItem[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as FirmListItem[];
  if (typeof payload !== "object") return [];

  const obj = payload as Paginated<FirmListItem> & ApiEnvelope<FirmListItem[]>;
  if (Array.isArray(obj.data)) return obj.data;
  if (Array.isArray(obj.items)) return obj.items;
  if (obj.data && typeof obj.data === "object") {
    const nested = obj.data as Paginated<FirmListItem>;
    if (Array.isArray(nested.data)) return nested.data;
    if (Array.isArray(nested.items)) return nested.items;
  }
  return [];
}

export async function fetchFirmsStats() {
  return apiRequest<ApiEnvelope<Record<string, unknown>> | Record<string, unknown>>(
    "/admin/firms/stats",
    { method: "GET" }
  );
}

export async function fetchFirms(params: FirmsListParams = {}) {
  const response = await apiRequest<
    ApiEnvelope<Paginated<FirmListItem> | FirmListItem[]> | Paginated<FirmListItem> | FirmListItem[]
  >("/admin/firms", {
    method: "GET",
    query: {
      status: params.status || "all",
      page: params.page || 1,
      per_page: params.per_page || 10,
      search: params.search,
      city: params.city,
      plan: params.plan,
    },
  });

  return {
    raw: response,
    items: unwrapList(response),
  };
}

export async function fetchFirmById(firmId: string | number) {
  return apiRequest<ApiEnvelope<FirmListItem> | FirmListItem>(
    `/admin/firms/${firmId}`,
    { method: "GET" }
  );
}

export async function createFirm(body: Record<string, unknown> | FormData) {
  return apiRequest("/admin/firms", { method: "POST", body });
}

export async function updateFirm(
  firmId: string | number,
  body: Record<string, unknown> | FormData
) {
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    if (!body.has("_method")) {
      body.append("_method", "PUT");
    }
    return apiRequest(`/admin/firms/${firmId}`, { method: "POST", body });
  }
  return apiRequest(`/admin/firms/${firmId}`, { method: "PUT", body });
}

export async function updateFirmStatus(
  firmId: string | number,
  status: string,
  reason?: string
) {
  return apiRequest(`/admin/firms/${firmId}/status`, {
    method: "PATCH",
    body: { status, reason },
  });
}

export async function deleteFirm(firmId: string | number) {
  return apiRequest(`/admin/firms/${firmId}`, { method: "DELETE" });
}

export async function addFirmNote(firmId: string | number, note: string) {
  return apiRequest(`/admin/firms/${firmId}/notes`, {
    method: "POST",
    body: { note },
  });
}
