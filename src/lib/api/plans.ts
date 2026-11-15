"use client";

import { apiRequest } from "./http";
import type {
  ApiEnvelope,
  Paginated,
  ApiPlanStats,
  ApiPlanItem,
  CreatePlanPayload,
  UpdatePlanPayload,
  UpdatePlanStatusPayload,
  ApiPlanSubscriber,
} from "./types";
import type { PricingPlanItem } from "@/features/plans/types/plan.types";

export type {
  ApiPlanStats,
  ApiPlanItem,
  CreatePlanPayload,
  UpdatePlanPayload,
  UpdatePlanStatusPayload,
  ApiPlanSubscriber,
};

const LOCAL_PLANS_KEY = "aljudy_custom_plans_registry_v1";

export const UNLIMITED_VIP_PLAN: PricingPlanItem = {
  id: "unlimited",
  name: "غير محدود",
  code: "PLAN-VIP-UNLIMITED",
  description: "باقة مخصصة لكبار العملاء والمكاتب الخاصة بصلاحيات كاملة وغير محدودة للنظام وبدون أي قيود أو فترات انتهاء.",
  badge: "صلاحيات كاملة",
  badgeColor: "#9c6402",
  type: "unlimited",
  monthlyPrice: 0,
  annualPrice: 0,
  yearlyDiscountPercent: 0,
  subscribedFirmsCount: 0,
  sharePercentage: "",
  isActive: true,
  isPopular: false,
  isEnterprise: true,
  colorTheme: "#9c6402",
  limits: {
    lawyers: "غير محدود: المحامين والمستشارين",
    cases: "غير محدود: القضايا والمعاملات النشطة",
    agents: "غير محدود: الوكلاء والمفوضين",
    assistants: "غير محدود: المساعدين والمحاسبين",
    clients: "غير محدود: العملاء والشركات",
    documents: "غير محدود: المستندات والوثائق",
    storage: "غير محدود: المساحة السحابية",
    support: "دعم فني استشاري فوري VIP شامل",
    integration: "ربط حكومي شامل (ناجز، زاتكا) و API مخصص",
  },
  features: [
    { id: "1", title: "صلاحيات كاملة وغير محدودة للنظام", isIncluded: true },
    { id: "2", title: "ربط مباشر فوري مع منصة ناجز ووزارة العدل", isIncluded: true },
    { id: "3", title: "الفوترة الإلكترونية ZATCA المرحلة 2 المتقدمة", isIncluded: true },
    { id: "4", title: "ذكاء قضائي وتحليلات متقدمة غير محدودة", isIncluded: true },
    { id: "5", title: "مدير حساب استشاري مخصص VIP على مدار الساعة", isIncluded: true },
    { id: "6", title: "تكامل API كامل بدون أي قيود استخدام", isIncluded: true },
  ],
};

export function getLocalCustomPlans(): PricingPlanItem[] {
  if (typeof window === "undefined") return [UNLIMITED_VIP_PLAN];
  try {
    const raw = localStorage.getItem(LOCAL_PLANS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];

    // Deduplicate by ID and name to clean up any past test artifacts
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const deduplicated: PricingPlanItem[] = [];

    // Ensure UNLIMITED_VIP_PLAN is included
    const combined = [...list];
    if (!combined.some((p) => p.id === "unlimited" || p.name === "غير محدود")) {
      combined.push(UNLIMITED_VIP_PLAN);
    }

    for (const item of combined as PricingPlanItem[]) {
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
    return [UNLIMITED_VIP_PLAN];
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

/**
 * 01. إحصائيات الباقات والـ MRR
 * GET /admin/plans/stats
 */
export async function fetchPlansStats() {
  return apiRequest<ApiEnvelope<ApiPlanStats> | ApiPlanStats>(
    "/admin/plans/stats",
    { method: "GET" }
  );
}

/**
 * 02. استعراض كافة الباقات والأسعار
 * GET /admin/plans
 */
export async function fetchPlans() {
  return apiRequest<
    ApiEnvelope<Paginated<ApiPlanItem> | ApiPlanItem[]> | Paginated<ApiPlanItem> | ApiPlanItem[]
  >("/admin/plans", { method: "GET" });
}

/**
 * 03. إنشاء باقة اشتراك جديدة (4 خطوات فيجما)
 * POST /admin/plans
 */
export async function createPlan(body: CreatePlanPayload | Record<string, unknown>) {
  return apiRequest<ApiEnvelope<ApiPlanItem> | ApiPlanItem>(
    "/admin/plans",
    {
      method: "POST",
      body,
    }
  );
}

/**
 * 04. تفاصيل الباقة المحددة
 * GET /admin/plans/{{plan_id}}
 */
export async function fetchPlanById(planId: string | number) {
  return apiRequest<ApiEnvelope<ApiPlanItem> | ApiPlanItem>(
    `/admin/plans/${planId}`,
    { method: "GET" }
  );
}

/**
 * 05. تعديل بيانات الباقة والأسعار
 * PUT /admin/plans/{{plan_id}}
 */
export async function updatePlan(
  planId: string | number,
  body: UpdatePlanPayload | Record<string, unknown>
) {
  return apiRequest<ApiEnvelope<ApiPlanItem> | ApiPlanItem>(
    `/admin/plans/${planId}`,
    {
      method: "PUT",
      body,
    }
  );
}

/**
 * 06. تغيير حالة الباقة (تفعيل / تعطيل الباقة)
 * PATCH /admin/plans/{{plan_id}}/status
 */
export async function updatePlanStatus(
  planId: string | number,
  status: "active" | "disabled" | "inactive" | string
) {
  const safeStatus = status === "inactive" || status === "suspended" ? "disabled" : status;
  return apiRequest<ApiEnvelope<unknown> | unknown>(
    `/admin/plans/${planId}/status`,
    {
      method: "PATCH",
      body: { status: safeStatus },
    }
  );
}

/**
 * 07. استعراض المكاتب المشتركة في هذه الباقة
 * GET /admin/plans/{{plan_id}}/subscribers
 */
export async function fetchPlanSubscribers(planId: string | number) {
  return apiRequest<
    ApiEnvelope<Paginated<ApiPlanSubscriber> | ApiPlanSubscriber[]> | Paginated<ApiPlanSubscriber> | ApiPlanSubscriber[]
  >(`/admin/plans/${planId}/subscribers`, { method: "GET" });
}

/**
 * 08. حذف الباقة (مع فحص منع الحذف إذا وجد مشتركون)
 * DELETE /admin/plans/{{plan_id}}
 */
export async function deletePlan(planId: string | number) {
  return apiRequest<ApiEnvelope<unknown> | unknown>(
    `/admin/plans/${planId}`,
    { method: "DELETE" }
  );
}

