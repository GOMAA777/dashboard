"use client";

import { apiRequest } from "./http";

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
