"use client";

import { apiRequest } from "./http";
import type { PricingPlanItem } from "@/features/plans/types/plan.types";

const LOCAL_PLANS_KEY = "aljudy_custom_plans_registry_v1";

export function getLocalCustomPlans(): PricingPlanItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_PLANS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Deduplicate by ID and name to clean up any past test artifacts
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const deduplicated: PricingPlanItem[] = [];

    for (const item of parsed as PricingPlanItem[]) {
      if (!item || !item.id) continue;
      const idKey = String(item.id);
      const nameKey = (item.name || "").trim();
      if (seenIds.has(idKey) || (nameKey && seenNames.has(nameKey))) {
        continue;
      }
      seenIds.add(idKey);
      if (nameKey) seenNames.add(nameKey);
      deduplicated.push(item);
    }

    return deduplicated;
  } catch {
    return [];
  }
}

export function saveLocalCustomPlan(
  plan: PricingPlanItem,
  oldId?: string | number,
  oldName?: string
): void {
  if (typeof window === "undefined" || !plan) return;
  try {
    const existing = getLocalCustomPlans();
    const targetIdStr = String(plan.id);
    const oldIdStr = oldId !== undefined && oldId !== null ? String(oldId) : undefined;
    const oldNameStr = oldName ? oldName.trim() : undefined;

    const filtered = existing.filter((p) => {
      const pIdStr = String(p.id);
      if (pIdStr === targetIdStr) return false;
      if (oldIdStr && pIdStr === oldIdStr) return false;
      if (p.name === plan.name) return false;
      if (oldNameStr && p.name === oldNameStr) return false;
      return true;
    });

    const updated = [plan, ...filtered];
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
}

export function removeLocalCustomPlan(planId: string | number): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalCustomPlans();
    const filtered = existing.filter((p) => String(p.id) !== String(planId));
    localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(filtered));
  } catch {
    // Ignore
  }
}

export async function fetchPlansStats() {
  return apiRequest("/admin/plans/stats", { method: "GET" });
}

export async function fetchPlans() {
  return apiRequest("/admin/plans", { method: "GET" });
}

export async function fetchPlanById(planId: string | number) {
  return apiRequest(`/admin/plans/${planId}`, { method: "GET" });
}

export async function createPlan(body: Record<string, unknown>) {
  return apiRequest("/admin/plans", { method: "POST", body });
}

export async function updatePlan(planId: string | number, body: Record<string, unknown>) {
  return apiRequest(`/admin/plans/${planId}`, { method: "PUT", body });
}

export async function updatePlanStatus(planId: string | number, status: string) {
  return apiRequest(`/admin/plans/${planId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function fetchPlanSubscribers(planId: string | number) {
  return apiRequest(`/admin/plans/${planId}/subscribers`, { method: "GET" });
}

export async function deletePlan(planId: string | number) {
  return apiRequest(`/admin/plans/${planId}`, { method: "DELETE" });
}

