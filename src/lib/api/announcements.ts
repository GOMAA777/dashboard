"use client";

import { apiRequest } from "./http";

export async function fetchAnnouncements() {
  return apiRequest("/admin/announcements", { method: "GET" });
}

export async function createAnnouncement(body: Record<string, unknown>) {
  return apiRequest("/admin/announcements", { method: "POST", body });
}

export async function fetchAnnouncementById(id: string | number) {
  return apiRequest(`/admin/announcements/${id}`, { method: "GET" });
}

export async function deleteAnnouncement(id: string | number) {
  return apiRequest(`/admin/announcements/${id}`, { method: "DELETE" });
}
