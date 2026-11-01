"use client";

import { apiRequest } from "./http";

export async function fetchSubscriptionsStats() {
  return apiRequest("/admin/subscriptions/stats", { method: "GET" });
}

export async function fetchSubscriptions(params: {
  tab?: string;
  page?: number;
} = {}) {
  return apiRequest("/admin/subscriptions", {
    method: "GET",
    query: {
      tab: params.tab || "all",
      page: params.page || 1,
    },
  });
}

export async function fetchSubscriptionById(id: string | number) {
  return apiRequest(`/admin/subscriptions/${id}`, { method: "GET" });
}

export async function approveSubscription(id: string | number) {
  return apiRequest(`/admin/subscriptions/${id}/approve`, { method: "POST" });
}

export async function rejectSubscription(id: string | number, reason: string) {
  return apiRequest(`/admin/subscriptions/${id}/reject`, {
    method: "POST",
    body: { reason },
  });
}

export async function renewSubscription(
  id: string | number,
  body: { period?: string; payment_method?: string } = {}
) {
  return apiRequest(`/admin/subscriptions/${id}/renew`, {
    method: "POST",
    body: {
      period: body.period || "year",
      payment_method: body.payment_method || "mada",
    },
  });
}

export async function upgradeSubscription(
  id: string | number,
  body: { new_plan_id: number | string; billing_cycle?: string }
) {
  return apiRequest(`/admin/subscriptions/${id}/upgrade`, {
    method: "POST",
    body: {
      new_plan_id: body.new_plan_id,
      billing_cycle: body.billing_cycle || "yearly",
    },
  });
}

export async function cancelSubscription(id: string | number, reason: string) {
  return apiRequest(`/admin/subscriptions/${id}/cancel`, {
    method: "POST",
    body: { reason },
  });
}

export async function updateSubscriptionStatus(id: string | number, status: string) {
  return apiRequest(`/admin/subscriptions/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
