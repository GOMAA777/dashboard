"use client";

import { create } from "zustand";

export type DraftType =
  | "notifications"
  | "plans"
  | "roles"
  | "staff"
  | "subscriptions"
  | "settings";

export interface DraftItem {
  id: string;
  type: DraftType;
  typeLabelAr: string;
  typeLabelEn: string;
  title: string;
  summary: string;
  targetUrl: string;
  badge?: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface DraftsState {
  drafts: DraftItem[];
  initialized: boolean;
  init: () => void;
  saveDraft: (
    item: {
      id?: string;
      type: DraftType;
      typeLabelAr?: string;
      typeLabelEn?: string;
      title: string;
      summary?: string;
      targetUrl: string;
      badge?: string;
      data: Record<string, unknown>;
    }
  ) => DraftItem;
  deleteDraft: (id: string) => void;
  clearAllDrafts: () => void;
  getDraft: (id: string) => DraftItem | undefined;
}

const STORAGE_KEY = "aljoudy_dashboard_unified_drafts";

const TYPE_CONFIG: Record<
  DraftType,
  { labelAr: string; labelEn: string; defaultTarget: string }
> = {
  notifications: {
    labelAr: "إشعار وتنبيه",
    labelEn: "Notification",
    defaultTarget: "/notifications?view=new",
  },
  plans: {
    labelAr: "باقة تسعير",
    labelEn: "Pricing Plan",
    defaultTarget: "/plans?action=create",
  },
  roles: {
    labelAr: "دور وصلاحيات",
    labelEn: "Role & Permissions",
    defaultTarget: "/permissions?action=new-role",
  },
  staff: {
    labelAr: "موظف وطاقم",
    labelEn: "Staff Member",
    defaultTarget: "/permissions?action=new-employee",
  },
  subscriptions: {
    labelAr: "اشتراك مكتب",
    labelEn: "Subscription",
    defaultTarget: "/subscriptions?action=new",
  },
  settings: {
    labelAr: "إعدادات النظام",
    labelEn: "System Settings",
    defaultTarget: "/settings/general",
  },
};

const SEED_DRAFTS: DraftItem[] = [
  {
    id: "draft-notif-seed-01",
    type: "notifications",
    typeLabelAr: "إشعار وتنبيه",
    typeLabelEn: "Notification",
    title: "تنبيه تحديث متطلبات الربط مع منصة ناجز العدلية",
    summary: "مسودة إشعار موجه لكافة مكاتب المحاماة لتحديث شهادات المصادقة قبل نهاية الشهر.",
    targetUrl: "/notifications?view=new&draftId=draft-notif-seed-01",
    badge: "هام",
    data: {
      title: "تنبيه تحديث متطلبات الربط مع منصة ناجز العدلية",
      description: "نحيطكم علماً بضرورة تجديد مفاتيح الربط البرمجي API مع بوابة ناجز لضمان استمرارية التزامن اللحظي.",
      audienceType: "all",
      actionUrl: "https://najiz.sa",
      categoryBadge: "الأمان والامتثال العدلي",
      actionButtonText: "مراجعة إعدادات الربط",
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "draft-plan-seed-02",
    type: "plans",
    typeLabelAr: "باقة تسعير",
    typeLabelEn: "Pricing Plan",
    title: "باقة الشركات القانونية الكبرى (Enterprise Gold)",
    summary: "مسودة باقة مخصصة تضم محامين غير محدودين مع ربط فوترة ZATCA المتقدمة.",
    targetUrl: "/plans?draftId=draft-plan-seed-02",
    badge: "باقة سنوية",
    data: {
      name: "باقة الشركات القانونية الكبرى (Enterprise Gold)",
      description: "باقة متكاملة للمكاتب الكبرى مع مدير حساب VIP وربط منصة ناجز.",
      monthlyPrice: 3499,
      annualPrice: 34990,
      yearlyDiscountPercent: 17,
      lawyersLimit: "50",
      casesLimit: "1000",
      supportSla: "vip",
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

function readStorage(): DraftItem[] {
  if (typeof window === "undefined") return SEED_DRAFTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DRAFTS));
      return SEED_DRAFTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_DRAFTS;
  } catch {
    return SEED_DRAFTS;
  }
}

function writeStorage(items: DraftItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("aljoudy-drafts-changed"));
  } catch {
    // Ignore storage quota or disabled errors
  }
}

export const useDraftsStore = create<DraftsState>((set, get) => ({
  drafts: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    const items = readStorage();
    set({ drafts: items, initialized: true });

    if (typeof window !== "undefined") {
      const handleStorage = () => {
        set({ drafts: readStorage() });
      };
      window.addEventListener("aljoudy-drafts-changed", handleStorage);
      window.addEventListener("storage", handleStorage);
    }
  },

  saveDraft: (item) => {
    const current = get().drafts.length === 0 && !get().initialized ? readStorage() : get().drafts;
    const nowIso = new Date().toISOString();
    const config = TYPE_CONFIG[item.type];

    const draftId = item.id || `draft_${item.type}_${Date.now()}`;
    const existingIndex = current.findIndex((d) => d.id === draftId);

    const fullItem: DraftItem = {
      id: draftId,
      type: item.type,
      typeLabelAr: item.typeLabelAr || config?.labelAr || "مسودة",
      typeLabelEn: item.typeLabelEn || config?.labelEn || "Draft",
      title: item.title?.trim() || (item.typeLabelAr ? `مسودة ${item.typeLabelAr}` : "مسودة جديدة"),
      summary: item.summary?.trim() || "تم حفظ بيانات النموذج كمسودة في النظام.",
      targetUrl: item.targetUrl || config?.defaultTarget || "/drafts",
      badge: item.badge,
      data: item.data || {},
      createdAt: existingIndex >= 0 ? current[existingIndex].createdAt : nowIso,
      updatedAt: nowIso,
    };

    let nextDrafts: DraftItem[];
    if (existingIndex >= 0) {
      nextDrafts = [...current];
      nextDrafts[existingIndex] = fullItem;
    } else {
      nextDrafts = [fullItem, ...current];
    }

    writeStorage(nextDrafts);
    set({ drafts: nextDrafts, initialized: true });
    return fullItem;
  },

  deleteDraft: (id: string) => {
    const current = get().drafts.length === 0 && !get().initialized ? readStorage() : get().drafts;
    const filtered = current.filter((d) => d.id !== id);
    writeStorage(filtered);
    set({ drafts: filtered, initialized: true });
  },

  clearAllDrafts: () => {
    writeStorage([]);
    set({ drafts: [], initialized: true });
  },

  getDraft: (id: string) => {
    const list = get().drafts.length === 0 ? readStorage() : get().drafts;
    return list.find((d) => d.id === id);
  },
}));

/**
 * Universal shortcut for saving any draft from any view
 */
export function saveUnifiedDraft(item: {
  id?: string;
  type: DraftType;
  typeLabelAr?: string;
  typeLabelEn?: string;
  title: string;
  summary?: string;
  targetUrl: string;
  badge?: string;
  data: Record<string, unknown>;
}) {
  return useDraftsStore.getState().saveDraft(item);
}
