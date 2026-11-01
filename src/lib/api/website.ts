"use client";

import { apiRequest } from "./http";

export async function fetchWebsiteTheme() {
  return apiRequest("/admin/website/theme", { method: "GET" });
}

export async function updateWebsiteTheme(body: Record<string, unknown>) {
  return apiRequest("/admin/website/theme", { method: "POST", body });
}

export async function fetchWebsiteSeo() {
  return apiRequest("/admin/website/seo", { method: "GET" });
}

export async function updateWebsiteSeo(body: Record<string, unknown>) {
  return apiRequest("/admin/website/seo", { method: "POST", body });
}

export async function fetchWebsiteHero() {
  return apiRequest("/admin/website/hero", { method: "GET" });
}

export async function updateWebsiteHero(body: Record<string, unknown>) {
  return apiRequest("/admin/website/hero", { method: "POST", body });
}

export async function fetchWebsiteFeatures() {
  return apiRequest("/admin/website/sections/features", { method: "GET" });
}

export async function createWebsiteFeature(body: Record<string, unknown>) {
  return apiRequest("/admin/website/sections/features", {
    method: "POST",
    body,
  });
}

export async function toggleWebsiteItem(itemId: string | number) {
  return apiRequest(`/admin/website/items/${itemId}/toggle`, {
    method: "PATCH",
  });
}

export async function deleteWebsiteItem(itemId: string | number) {
  return apiRequest(`/admin/website/items/${itemId}`, { method: "DELETE" });
}
