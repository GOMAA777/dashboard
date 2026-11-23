export const OFFICE_ACTIVITY_CATEGORIES = [
  {
    id: "tech_support",
    labelAr: "دعم فني وحل مشكلة",
    labelEn: "Technical Support",
    badgeClass: "bg-[#fff6e8] text-[#9c6402] border-[#fde68a] dark:bg-[rgba(226,157,56,0.15)] dark:text-[#e29d38] dark:border-[#e29d38]/40",
  },
  {
    id: "client_training",
    labelAr: "تدريب وتوجيه العميل",
    labelEn: "Client Training & Guidance",
    badgeClass: "bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd] dark:bg-[#0c4a6e]/30 dark:text-[#7dd3fc] dark:border-[#0284c7]/40",
  },
  {
    id: "billing_subscription",
    labelAr: "مراجعة اشتراك وفواتير",
    labelEn: "Billing & Subscription Audit",
    badgeClass: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0] dark:bg-[#14532d]/30 dark:text-[#86efac] dark:border-[#22c55e]/40",
  },
  {
    id: "routine_maintenance",
    labelAr: "فحص وصيانة دورية",
    labelEn: "Routine Maintenance",
    badgeClass: "bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe] dark:bg-[#4c1d95]/30 dark:text-[#c4b5fd] dark:border-[#8b5cf6]/40",
  },
  {
    id: "official_client_request",
    labelAr: "طلب رسمي من العميل",
    labelEn: "Official Client Request",
    badgeClass: "bg-[#ffedd5] text-[#c2410c] border-[#fed7aa] dark:bg-[#7c2d12]/30 dark:text-[#fdba74] dark:border-[#f97316]/40",
  },
  {
    id: "admin_direct",
    labelAr: "دخول مباشر للمدير العام",
    labelEn: "Direct Admin Entry",
    badgeClass: "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1] dark:bg-[#1e293b]/60 dark:text-[#cbd5e1] dark:border-[#475569]/40",
  },
  {
    id: "other",
    labelAr: "أخرى",
    labelEn: "Other",
    badgeClass: "bg-[#f5f5f5] text-[#525252] border-[#e5e5e5] dark:bg-[#262626] dark:text-[#d4d4d4] dark:border-[#404040]",
  },
] as const;

export type OfficeActivityCategory = (typeof OFFICE_ACTIVITY_CATEGORIES)[number]["id"];

export function getActivityCategoryMeta(categoryId?: string | null) {
  if (!categoryId) return OFFICE_ACTIVITY_CATEGORIES[0];
  const found = OFFICE_ACTIVITY_CATEGORIES.find((c) => c.id === categoryId);
  if (found) return found;
  const foundByAr = OFFICE_ACTIVITY_CATEGORIES.find((c) => c.labelAr === categoryId);
  if (foundByAr) return foundByAr;
  return {
    id: "other" as const,
    labelAr: categoryId,
    labelEn: categoryId,
    badgeClass: "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1] dark:bg-[#1e293b] dark:text-[#cbd5e1] dark:border-[#475569]",
  };
}

export type OfficeActivityInput = {
  activityType?: string;
  reason?: string;
  ticketId?: string;
};
