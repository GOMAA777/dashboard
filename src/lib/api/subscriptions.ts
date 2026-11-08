"use client";

import { apiRequest } from "./http";
import type {
  SubscriptionListParams,
  SubscriptionsStatsResponse,
  SubscriptionsListResponse,
  SubscriptionDetailResponse,
  RejectSubscriptionPayload,
  RenewSubscriptionPayload,
  UpgradeSubscriptionPayload,
  CancelSubscriptionPayload,
  UpdateSubscriptionStatusPayload,
} from "@/features/subscriptions/types/subscription.types";

export async function fetchSubscriptionsStats(): Promise<SubscriptionsStatsResponse> {
  return apiRequest<SubscriptionsStatsResponse>("/admin/subscriptions/stats", { method: "GET" });
}

export type CustomOfferPayload = {
  offer_name?: string;
  is_custom_offer?: boolean | number;
  extra_lawyers?: number;
  extra_cases?: number;
  extra_storage_gb?: number;
  extra_clients?: number;
  extra_power_of_attorney?: number;
  extra_assistants?: number;
  custom_price?: number | string;
  discount_amount?: number | string;
  custom_features?: string[];
  custom_notes?: string;
  offer_expires_at?: string;
};

export async function fetchSubscriptions(
  params: SubscriptionListParams = {}
): Promise<SubscriptionsListResponse> {
  return apiRequest<SubscriptionsListResponse>("/admin/subscriptions", {
    method: "GET",
    query: {
      tab: params.tab || "all",
      page: params.page || 1,
      ...(params.per_page ? { per_page: params.per_page } : {}),
      ...(params.is_custom_offer != null
        ? { is_custom_offer: params.is_custom_offer ? 1 : 0 }
        : {}),
      ...(params.status && params.status !== "all" ? { status: params.status } : {}),
      ...(params.plan && params.plan !== "all" ? { plan: params.plan } : {}),
      ...(params.search && params.search.trim() ? { search: params.search.trim() } : {}),
    },
  });
}

export async function fetchSubscriptionById(
  id: string | number
): Promise<SubscriptionDetailResponse> {
  return apiRequest<SubscriptionDetailResponse>(`/admin/subscriptions/${id}`, { method: "GET" });
}

export async function applyCustomOffer(
  subscriptionId: string | number,
  body: CustomOfferPayload
) {
  return apiRequest(`/admin/subscriptions/${subscriptionId}/custom-offer`, {
    method: "POST",
    body: {
      ...body,
      is_custom_offer: body.is_custom_offer !== false ? 1 : 0,
    },
  });
}

export async function fetchSubscriptionLimitsBreakdown(
  subscriptionId: string | number
) {
  return apiRequest(
    `/admin/subscriptions/${subscriptionId}/limits-breakdown`,
    { method: "GET" }
  );
}

export async function removeCustomOffer(subscriptionId: string | number) {
  return apiRequest(`/admin/subscriptions/${subscriptionId}/custom-offer`, {
    method: "DELETE",
  });
}

export async function approveSubscription(id: string | number) {
  return apiRequest(`/admin/subscriptions/${id}/approve`, { method: "POST" });
}

export async function rejectSubscription(
  id: string | number,
  reason: string | RejectSubscriptionPayload
) {
  const body = typeof reason === "string" ? { reason } : reason;
  return apiRequest(`/admin/subscriptions/${id}/reject`, {
    method: "POST",
    body,
  });
}

export async function renewSubscription(
  id: string | number,
  body: RenewSubscriptionPayload = {}
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
  body: UpgradeSubscriptionPayload
) {
  return apiRequest(`/admin/subscriptions/${id}/upgrade`, {
    method: "POST",
    body: {
      new_plan_id: body.new_plan_id,
      billing_cycle: body.billing_cycle || "yearly",
    },
  });
}

export async function cancelSubscription(
  id: string | number,
  reason: string | CancelSubscriptionPayload
) {
  const body = typeof reason === "string" ? { reason } : reason;
  return apiRequest(`/admin/subscriptions/${id}/cancel`, {
    method: "POST",
    body,
  });
}

export async function updateSubscriptionStatus(
  id: string | number,
  status: string | UpdateSubscriptionStatusPayload
) {
  const body = typeof status === "string" ? { status } : status;
  return apiRequest(`/admin/subscriptions/${id}/status`, {
    method: "PATCH",
    body,
  });
}
