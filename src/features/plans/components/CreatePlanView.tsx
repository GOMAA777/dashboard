"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  Check,
  CheckCircle2,
  Sparkles,
  Edit,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem, PlanLimitsData } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import {
  createPlan,
  updatePlan,
  fetchPlanById,
  saveLocalCustomPlan,
} from "@/lib/api/plans";
import { mapPlanFromApi } from "@/lib/api/mappers";
import { extractFieldErrors } from "@/lib/api/field-errors";
import { ApiError } from "@/lib/api/http";

interface CreatePlanViewProps {
  onBack: () => void;
  onSuccess: (savedPlan: PricingPlanItem) => void;
  planToEdit?: PricingPlanItem | null;
  mode?: "create" | "edit";
}

function inferPlanCategory(plan?: PricingPlanItem | null): string {
  if (!plan) return "";
  if (plan.isEnterprise || plan.id === "enterprise" || plan.name?.includes("المخصصة")) return "enterprise";
  if (plan.id === "gold" || plan.name?.includes("الذهبية") || plan.name?.includes("الشركات")) return "corporate";
  if (plan.id === "silver" || plan.name?.includes("الفضية") || plan.name?.includes("المتوسطة")) return "growth";
  if (plan.id === "basic" || plan.name?.includes("الأساسية") || plan.name?.includes("الناشئة")) return "starter";
  return "growth";
}

function extractLimitValue(str?: unknown): number | string {
  if (str === undefined || str === null || str === "") return "";
  if (typeof str === "number") return str >= 0 ? str : 0;
  const s = String(str);
  const match = s.replace(/,/g, "").match(/\d+/);
  if (match) {
    const num = Number(match[0]);
    return Number.isFinite(num) && num >= 0 ? num : "";
  }
  return "";
}

function inferSupportSla(plan?: PricingPlanItem | null): string {
  if (!plan) return "";
  const sup = plan.limits?.support || "";
  if (sup.includes("VIP") || sup.includes("فائقة") || sup.includes("على مدار الساعة")) return "vip";
  if (sup.includes("أولوية") || sup.includes("متقدم")) return "priority";
  if (sup.includes("قياسي") || sup.includes("24")) return "standard";
  return "standard";
}

/** Map UI SLA codes to API support_level strings (Postman contract). */
function supportLevelForApi(code: string): string {
  if (code === "vip") return "دعم مباشر ذو أولوية فائقة (VIP SLA)";
  if (code === "priority") return "دعم فني قياسي ذو أولوية";
  if (code === "standard") return "دعم فني قياسي (خلال 24 ساعة)";
  return code || "دعم فني قياسي (خلال 24 ساعة)";
}

/** Map UI status to API status values. */
function statusForApi(uiStatus: string, isDraft: boolean): string {
  if (isDraft || uiStatus === "draft" || uiStatus === "private") return "inactive";
  if (uiStatus === "disabled" || uiStatus === "inactive") return "inactive";
  return "active";
}

function inferFeatures(plan?: PricingPlanItem | null) {
  if (!plan) {
    return {
      vipSla: false,
      accountManager: false,
      kpiReports: false,
      zatcaV2: true,
    };
  }
  const sup = plan.limits?.support || "";
  const isVip = sup.includes("VIP") || sup.includes("فائقة");
  const hasManager = Boolean(
    plan.features?.some(
      (f) =>
        (f.title.includes("مدير حساب") || f.title.includes("Account Manager")) &&
        f.isIncluded
    )
  );
  const hasKpi = Boolean(
    plan.features?.some(
      (f) =>
        (f.title.includes("مؤشرات") || f.title.includes("تقارير") || f.title.includes("KPI")) &&
        f.isIncluded
    )
  );
  const hasZatca = Boolean(
    plan.features?.some(
      (f) =>
        (f.title.includes("ZATCA") || f.title.includes("الفوترة الإلكترونية")) &&
        f.isIncluded
    )
  );

  return {
    vipSla: isVip,
    accountManager: hasManager || isVip,
    kpiReports: hasKpi || plan.id === "gold" || plan.id === "silver",
    zatcaV2: hasZatca !== false,
  };
}

export function CreatePlanView({
  onBack,
  onSuccess,
  planToEdit,
  mode = "create",
}: CreatePlanViewProps) {
  const { t, isEn } = useLanguage();
  const isEditMode = mode === "edit" || Boolean(planToEdit);

  // 1. Basic Info
  const [name, setName] = useState(planToEdit?.name || "");
  const [category, setCategory] = useState(() => inferPlanCategory(planToEdit));
  const [description, setDescription] = useState(planToEdit?.description || "");
  const [badge, setBadge] = useState(() => planToEdit?.badge || "");
  const [badgeColor, setBadgeColor] = useState(() => planToEdit?.badgeColor || "#d97706");
  const [status, setStatus] = useState<"active" | "draft" | "private">(() =>
    planToEdit ? (planToEdit.isActive ? "active" : "draft") : "active"
  );
  const [colorTheme, setColorTheme] = useState(() =>
    planToEdit?.colorTheme ||
    (planToEdit?.id === "gold"
      ? "#9c6402"
      : planToEdit?.id === "basic"
      ? "#1e40af"
      : planToEdit?.id === "silver"
      ? "#475569"
      : "#9c6402")
  );
  const [isPopular, setIsPopular] = useState(() => Boolean(planToEdit?.isPopular));

  // 2. Pricing & Cycles (All created plans are paid commercial plans)
  const [billingCycle, setBillingCycle] = useState(() =>
    planToEdit ? (planToEdit.annualPrice ? "annual" : "monthly") : ""
  );
  const [vatOption, setVatOption] = useState(() => (planToEdit ? "inclusive" : ""));
  const [monthlyPrice, setMonthlyPrice] = useState<number | string>(() => {
    if (!planToEdit) return "";
    return planToEdit.monthlyPrice ?? "";
  });
  const [annualPrice, setAnnualPrice] = useState<number | string>(() => {
    if (!planToEdit) return "";
    return planToEdit.annualPrice ?? "";
  });
  const [yearlyDiscountPercent, setYearlyDiscountPercent] = useState<number | string>(() => {
    if (!planToEdit) return "";
    return planToEdit.yearlyDiscountPercent !== undefined
      ? planToEdit.yearlyDiscountPercent
      : "";
  });

  // 3. Limits & Quotas
  const [lawyersLimit, setLawyersLimit] = useState<number | string>(() =>
    planToEdit ? extractLimitValue(planToEdit.limits?.lawyers) : ""
  );
  const [casesLimit, setCasesLimit] = useState<number | string>(() =>
    planToEdit ? extractLimitValue(planToEdit.limits?.cases) : ""
  );
  const [agentsLimit, setAgentsLimit] = useState<number | string>(() =>
    planToEdit ? extractLimitValue(planToEdit.limits?.agents) : ""
  );
  const [clientsLimit, setClientsLimit] = useState<number | string>(() =>
    planToEdit ? extractLimitValue(planToEdit.limits?.clients) : ""
  );
  const [storageLimit, setStorageLimit] = useState<number | string>(() =>
    planToEdit ? extractLimitValue(planToEdit.limits?.storage) : ""
  );
  const [assistantsLimit, setAssistantsLimit] = useState<number | string>(() =>
    planToEdit ? extractLimitValue(planToEdit.limits?.assistants) : ""
  );
  const [documentsLimit, setDocumentsLimit] = useState<number | string>(() =>
    planToEdit ? extractLimitValue(planToEdit.limits?.documents) : ""
  );

  // 4. SLA & Features
  const [supportSla, setSupportSla] = useState(() => inferSupportSla(planToEdit));
  const [features, setFeatures] = useState(() => inferFeatures(planToEdit));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingIsDraft, setPendingIsDraft] = useState(false);

  // Sync state if planToEdit changes
  useEffect(() => {
    if (planToEdit) {
      setName(planToEdit.name || "");
      setCategory(inferPlanCategory(planToEdit));
      setDescription(planToEdit.description || "");
      setBadge(planToEdit.badge || "");
      setBadgeColor(planToEdit.badgeColor || "#d97706");
      setStatus(planToEdit.isActive ? "active" : "draft");
      setColorTheme(
        planToEdit.colorTheme ||
          (planToEdit.id === "gold"
            ? "#9c6402"
            : planToEdit.id === "basic"
            ? "#1e40af"
            : planToEdit.id === "silver"
            ? "#475569"
            : "#9c6402")
      );
      setIsPopular(Boolean(planToEdit.isPopular));
      setBillingCycle(planToEdit.annualPrice ? "annual" : "monthly");
      setVatOption("inclusive");
      setMonthlyPrice(planToEdit.monthlyPrice);
      setAnnualPrice(planToEdit.annualPrice || "");
      setYearlyDiscountPercent(
        planToEdit.yearlyDiscountPercent !== undefined
          ? planToEdit.yearlyDiscountPercent
          : ""
      );
      setLawyersLimit(extractLimitValue(planToEdit.limits?.lawyers));
      setCasesLimit(extractLimitValue(planToEdit.limits?.cases));
      setAgentsLimit(extractLimitValue(planToEdit.limits?.agents));
      setClientsLimit(extractLimitValue(planToEdit.limits?.clients));
      setStorageLimit(extractLimitValue(planToEdit.limits?.storage));
      setAssistantsLimit(extractLimitValue(planToEdit.limits?.assistants));
      setDocumentsLimit(extractLimitValue(planToEdit.limits?.documents));
      setSupportSla(inferSupportSla(planToEdit));
      setFeatures(inferFeatures(planToEdit));
    }
  }, [planToEdit]);

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStrictNumberChange = (
    setter: React.Dispatch<React.SetStateAction<number | string>>,
    maxVal?: number
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;
      // Convert Arabic-Indic numerals (٠-٩) and strip all letters, symbols, minuses, spaces
      const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
      raw = raw
        .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
        .replace(/\D/g, "")
        .trim();

      if (raw === "") {
        setter("");
        return;
      }

      const num = Number(raw);
      if (Number.isFinite(num) && num >= 0) {
        if (maxVal !== undefined && num > maxVal) {
          setter(maxVal);
        } else {
          setter(num);
        }
      }
    };
  };

  const handleMonthlyPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    raw = raw
      .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
      .replace(/\D/g, "")
      .trim();

    if (raw === "") {
      setMonthlyPrice("");
      return;
    }

    const num = Number(raw);
    if (Number.isFinite(num) && num >= 0) {
      setMonthlyPrice(num);
      const disc = yearlyDiscountPercent !== "" ? Number(yearlyDiscountPercent) : 0;
      if (disc > 0 && disc < 100) {
        setAnnualPrice(Math.round(num * 12 * (1 - disc / 100)));
      }
    }
  };

  const handleAnnualPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    raw = raw
      .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
      .replace(/\D/g, "")
      .trim();

    if (raw === "") {
      setAnnualPrice("");
      return;
    }

    const num = Number(raw);
    if (Number.isFinite(num) && num >= 0) {
      setAnnualPrice(num);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    raw = raw
      .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
      .replace(/\D/g, "")
      .trim();

    if (raw === "") {
      setYearlyDiscountPercent("");
      return;
    }

    let num = Number(raw);
    if (Number.isFinite(num) && num >= 0) {
      if (num > 100) num = 100;
      setYearlyDiscountPercent(num);

      const m = monthlyPrice !== "" ? Number(monthlyPrice) : 0;
      if (m > 0 && num < 100) {
        setAnnualPrice(Math.round(m * 12 * (1 - num / 100)));
      }
    }
  };

  const hasDiscount = (() => {
    if (yearlyDiscountPercent !== "" && Number(yearlyDiscountPercent) > 0) {
      return true;
    }
    const m = monthlyPrice !== "" ? Number(monthlyPrice) : 0;
    const a = annualPrice !== "" ? Number(annualPrice) : 0;
    return m > 0 && a > 0 && a < m * 12;
  })();

  const previewAnnualPrice = (() => {
    if (annualPrice !== "" && Number(annualPrice) > 0) {
      return Number(annualPrice);
    }
    const m = monthlyPrice !== "" ? Number(monthlyPrice) : 0;
    const disc = yearlyDiscountPercent !== "" ? Number(yearlyDiscountPercent) : 0;
    if (m > 0 && disc > 0) {
      return Math.round(m * 12 * (1 - disc / 100));
    }
    if (m > 0) return m * 12;
    return 0;
  })();

  const previewMonthlyPrice = (() => {
    if (monthlyPrice !== "" && Number(monthlyPrice) > 0) {
      return Number(monthlyPrice);
    }
    const a = annualPrice !== "" ? Number(annualPrice) : 0;
    if (a > 0) return Math.round(a / 12);
    return null;
  })();

  const getLimitText = (
    val: number | string,
    unitAr: string,
    unitEn: string,
    fallbackText?: string
  ) => {
    if (val === "" || val === undefined) {
      return fallbackText || t("غير محدد بعد", "Not specified yet");
    }
    const num = Number(val);
    if (!Number.isFinite(num) || num < 0) {
      return fallbackText || t("غير محدد بعد", "Not specified yet");
    }
    return `${num.toLocaleString()} ${t(unitAr, unitEn)}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = t("اسم الباقة مطلوب", "Plan name is required");
    }
    if (!description.trim()) {
      newErrors.description = t("الوصف التعريفي مطلوب", "Description is required");
    }
    const numMonthly = monthlyPrice === "" ? NaN : Number(monthlyPrice);
    if (isNaN(numMonthly) || numMonthly <= 0) {
      newErrors.monthly_price = t("السعر الشهري مطلوب ويجب أن يكون أكبر من 0", "Monthly price is required and must be greater than 0");
    }
    const numAnnual = annualPrice === "" ? NaN : Number(annualPrice);
    if (isNaN(numAnnual) || numAnnual <= 0) {
      newErrors.yearly_price = t("السعر السنوي مطلوب ويجب أن يكون أكبر من 0", "Annual price is required and must be greater than 0");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiateSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(t("يرجى ملء الحقول الإلزامية بشكل صحيح", "Please fill required fields properly"));
      return;
    }
    setPendingIsDraft(isDraft);
    setIsConfirmDialogOpen(true);
  };

  const executeSave = async () => {
    setIsSubmitting(true);
    const isDraft = pendingIsDraft;

    const numMonthly = monthlyPrice === "" ? 0 : Number(monthlyPrice) || 0;
    const numAnnual = annualPrice === "" ? 0 : Number(annualPrice) || 0;
    const numLawyers = lawyersLimit === "" ? 0 : Math.max(0, Number(lawyersLimit) || 0);
    const numCases = casesLimit === "" ? 0 : Math.max(0, Number(casesLimit) || 0);
    const numAgents = agentsLimit === "" ? 0 : Math.max(0, Number(agentsLimit) || 0);
    const numAssistants = assistantsLimit === "" ? 0 : Math.max(0, Number(assistantsLimit) || 0);
    const numClients = clientsLimit === "" ? 0 : Math.max(0, Number(clientsLimit) || 0);
    const numDocuments = documentsLimit === "" ? 0 : Math.max(0, Number(documentsLimit) || 0);
    const numStorage = storageLimit === "" ? 0 : Math.max(0, Number(storageLimit) || 0);

    const activeFeatures: string[] = [];
    if (features.accountManager) activeFeatures.push("مدير حساب قانوني معتمد شخصي");
    if (features.kpiReports) activeFeatures.push("تقارير الذكاء القضائي ومؤشرات الأداء المالي (KPIs)");
    if (features.zatcaV2) activeFeatures.push("فوترة إلكترونية متوافقة كلياً (ZATCA Phase 2)");
    activeFeatures.push("ربط تكاملي فوري مع بوابة ناجز ومساند");
    if (features.vipSla) activeFeatures.push("دعم مباشر ذو أولوية فائقة (VIP)");

    const calculatedDiscount =
      yearlyDiscountPercent !== ""
        ? Number(yearlyDiscountPercent)
        : numMonthly > 0 && numAnnual > 0
          ? Math.max(
              0,
              Math.round(((numMonthly * 12 - numAnnual) / (numMonthly * 12)) * 100)
            )
          : 0;

    const payload: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim(),
      type: "paid",
      monthly_price: numMonthly,
      yearly_price: numAnnual,
      yearly_discount_percent: calculatedDiscount,
      max_lawyers: numLawyers,
      max_cases: numCases,
      max_power_of_attorney: numAgents,
      max_assistants: numAssistants,
      max_clients: numClients,
      max_documents: numDocuments,
      storage_limit_gb: numStorage,
      support_level: supportLevelForApi(supportSla),
      features: activeFeatures,
      is_popular: isPopular,
      status: statusForApi(status, isDraft),
    };
    if (badge.trim()) {
      payload.badge = badge.trim();
      payload.badge_color = badgeColor || "#d97706";
    }

    let savedPlan: PricingPlanItem = {
      id: planToEdit ? planToEdit.id : `plan-${Date.now()}`,
      name: name.trim(),
      code: planToEdit
        ? planToEdit.code
        : `CODE: PLAN-${(name.trim().slice(0, 3) || "NEW").toUpperCase()}-01`,
      description: description.trim(),
      badge: badge.trim() || undefined,
      badgeColor: badgeColor || undefined,
      type: "paid",
      monthlyPrice: numMonthly,
      annualPrice: numAnnual,
      yearlyDiscountPercent: calculatedDiscount || undefined,
      annualNote:
        numAnnual > 0
          ? t(
              `ما يعادل ${Math.round(numAnnual / 12)} ر.س / شهرياً عند الدفع السنوي`,
              `Equivalent to ${Math.round(numAnnual / 12)} SAR / month paid annually`
            )
          : planToEdit?.annualNote || t("لا يوجد اشتراك سنوي محدد", "No annual subscription set"),
      subscribedFirmsCount: planToEdit ? planToEdit.subscribedFirmsCount : 0,
      sharePercentage: planToEdit ? planToEdit.sharePercentage : t("0% (باقة جديدة)", "0% (New Plan)"),
      isActive: !isDraft && status === "active",
      isPopular,
      isEnterprise: planToEdit ? planToEdit.isEnterprise : false,
      colorTheme,
      limits: {
        lawyers:
          lawyersLimit !== "" && Number(lawyersLimit) >= 0
            ? `${Number(lawyersLimit).toLocaleString()} ${t("محامين ومستشارين", "lawyers & consultants")}`
            : t("غير محدد", "Not specified"),
        cases:
          casesLimit !== "" && Number(casesLimit) >= 0
            ? `${Number(casesLimit).toLocaleString()} ${t("قضية نشطة", "active cases")}`
            : t("غير محدد", "Not specified"),
        agents:
          agentsLimit !== "" && Number(agentsLimit) >= 0
            ? `${Number(agentsLimit).toLocaleString()} ${t("وكلاء شرعيين", "legal agents")}`
            : t("غير محدد", "Not specified"),
        assistants:
          assistantsLimit !== "" && Number(assistantsLimit) >= 0
            ? `${Number(assistantsLimit).toLocaleString()} ${t("مساعدين ومحاسبين", "assistants & accountants")}`
            : t("غير محدد", "Not specified"),
        clients:
          clientsLimit !== "" && Number(clientsLimit) >= 0
            ? `${Number(clientsLimit).toLocaleString()} ${t("عميل وموكل", "clients")}`
            : t("غير محدد", "Not specified"),
        documents:
          documentsLimit !== "" && Number(documentsLimit) >= 0
            ? `${Number(documentsLimit).toLocaleString()} ${t("مستند ووثيقة", "documents")}`
            : t("غير محدد", "Not specified"),
        storage:
          storageLimit !== "" && Number(storageLimit) >= 0
            ? `${Number(storageLimit).toLocaleString()} GB ${t("مساحة تخزين سحابية", "cloud storage")}`
            : t("غير محدد", "Not specified"),
        support:
          supportSla === "vip" || features.vipSla
            ? t("دعم مباشر ذو أولوية فائقة (VIP)", "Direct VIP Priority Support")
            : supportSla === "priority"
            ? t("دعم فني قياسي ذو أولوية", "Priority Standard Support")
            : t("دعم فني قياسي (خلال 24 ساعة)", "Standard Support (within 24h)"),
      },
      features: planToEdit?.features || [
        { id: "1", title: t("دعم فني وتقني معتمد", "Certified Technical Support"), isIncluded: true },
        { id: "2", title: t("الربط التلقائي المباشر مع منصة ناجز", "Najiz Direct Integration"), isIncluded: true },
        { id: "3", title: t("الفوترة الإلكترونية المرحلة الثانية ZATCA", "ZATCA Phase 2 E-Invoicing"), isIncluded: features.zatcaV2 },
        { id: "4", title: t("تقارير مؤشرات الأداء والتحليلات", "KPI Reports & Analytics"), isIncluded: features.kpiReports },
        { id: "5", title: t("مدير حساب قانوني معتمد", "Dedicated Legal Account Manager"), isIncluded: features.accountManager },
      ],
    };

    try {
      const response =
        isEditMode && planToEdit
          ? await updatePlan(planToEdit.id, payload)
          : await createPlan(payload);

      const responseData = ((response as { data?: Record<string, unknown> })?.data ||
        response) as Record<string, unknown>;
      let mapped = mapPlanFromApi(responseData);
      const persistedId = planToEdit?.id || mapped.id;

      // Re-read from API so list/details match what was actually stored.
      if (persistedId) {
        try {
          const fresh = await fetchPlanById(persistedId);
          const freshData = ((fresh as { data?: Record<string, unknown> })?.data ||
            fresh) as Record<string, unknown>;
          if (freshData && (freshData.id || freshData.name)) {
            mapped = mapPlanFromApi(freshData);
          }
        } catch {
          // Keep mapped response if detail fetch fails.
        }
      }

      if (mapped?.id || persistedId) {
        const mergedLimits: PlanLimitsData = {
          ...savedPlan.limits,
          ...(mapped.limits || {}),
          lawyers: mapped.limits?.lawyers && mapped.limits.lawyers !== "—" ? mapped.limits.lawyers : savedPlan.limits.lawyers,
          cases: mapped.limits?.cases && mapped.limits.cases !== "—" ? mapped.limits.cases : savedPlan.limits.cases,
          agents: mapped.limits?.agents && mapped.limits.agents !== "—" ? mapped.limits.agents : savedPlan.limits.agents,
          assistants: mapped.limits?.assistants && mapped.limits.assistants !== "—" ? mapped.limits.assistants : savedPlan.limits.assistants,
          clients: mapped.limits?.clients && mapped.limits.clients !== "—" ? mapped.limits.clients : savedPlan.limits.clients,
          documents: mapped.limits?.documents && mapped.limits.documents !== "—" ? mapped.limits.documents : savedPlan.limits.documents,
          storage: mapped.limits?.storage && mapped.limits.storage !== "—" ? mapped.limits.storage : savedPlan.limits.storage,
          support: mapped.limits?.support && mapped.limits.support !== "—" ? mapped.limits.support : savedPlan.limits.support,
        };
        savedPlan = {
          ...savedPlan,
          ...mapped,
          limits: mergedLimits,
          id: String(persistedId || mapped.id),
          type: "paid",
          monthlyPrice: Number(mapped.monthlyPrice ?? numMonthly),
          annualPrice: Number(mapped.annualPrice ?? numAnnual),
          yearlyDiscountPercent:
            calculatedDiscount > 0
              ? calculatedDiscount
              : mapped.yearlyDiscountPercent ?? savedPlan.yearlyDiscountPercent,
          colorTheme,
        };
      }

      if (calculatedDiscount > 0) {
        savedPlan.yearlyDiscountPercent = calculatedDiscount;
      }

      if (isEditMode && planToEdit) {
        savedPlan.id = planToEdit.id;
        if (planToEdit.code) savedPlan.code = planToEdit.code;
      }

      saveLocalCustomPlan(savedPlan, planToEdit?.id, planToEdit?.name);
      setIsConfirmDialogOpen(false);
      onSuccess(savedPlan);
      toast.success(
        isEditMode
          ? t(
              `تم تحديث بيانات باقة "${name.trim()}" بنجاح.`,
              `Plan "${name.trim()}" updated successfully.`
            )
          : isDraft
          ? t(
              `تم حفظ مسودة الباقة "${name.trim()}" بنجاح.`,
              `Draft plan "${name.trim()}" saved successfully.`
            )
          : t(
              `تم إنشاء باقة "${name.trim()}" وإتاحتها للاشتراك بنجاح!`,
              `Plan "${name.trim()}" created and published successfully!`
            )
      );
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.status === 400 || err.status === 422)) {
        const fieldErrs = extractFieldErrors(err.body);
        setErrors((prev) => ({ ...prev, ...fieldErrs }));
        toast.error(
          err.message ||
            t(
              "يرجى مراجعة بيانات الباقة وتصحيح الأخطاء الموضحة",
              "Please review inputs and fix errors"
            )
        );
      } else {
        const message =
          err instanceof Error
            ? err.message
            : t(
                "تعذر حفظ الباقة على الخادم. تحقق من البيانات وحاول مرة أخرى.",
                "Failed to save the plan on the server. Check the data and try again."
              );
        toast.error(message);
      }
      setIsConfirmDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full flex flex-col gap-6 font-['Cairo',sans-serif]"
      data-node-id="1:3035"
    >
      {/* 1. Top Header Bar */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        {/* Right / Start: Title & Subtitle */}
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-2">
            {isEditMode && (
              <span className="p-1 rounded bg-[#9c6402]/10 text-[#9c6402] dark:text-[#e29d38]">
                <Edit className="size-5" />
              </span>
            )}
            <h1 className="text-[24px] sm:text-[26px] leading-[34px] sm:leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEditMode
                ? t(`تعديل باقة: ${planToEdit?.name || name}`, `Edit Plan: ${planToEdit?.name || name}`)
                : t("إنشاء باقة اشتراك جديدة", "Create New Subscription Plan")}
            </h1>
          </div>
          <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] leading-[20px] font-normal mt-1">
            {isEditMode
              ? t(
                  "قم بتعديل الأسعار والمزايا ودورات الفوترة والحدود التشغيلية للباقة وحفظ التحديثات للمشتركين.",
                  "Modify pricing, billing intervals, quotas, and features for this plan and save updates for subscribers."
                )
              : t(
                  "حدد السعر ومدة الاشتراك وحدود الاستخدام والمميزات المتاحة للمكتب وفق معايير الحوكمة المالية والأمنية.",
                  "Configure pricing, billing intervals, resource quotas, and features according to financial and security governance."
                )}
          </p>
        </div>

        {/* Left / End: Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="bg-white dark:bg-[#2d1f16] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#4d3627] text-[#1b1c1a] dark:text-[#fdfbf7] px-4 py-2 rounded-[4px] text-[14px] font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowRight className={cn("size-[15px] stroke-[2.5]", isEn && "rotate-180")} />
          <span>{t("العودة", "Back")}</span>
        </button>
      </div>

      {/* 2. Main Two-Column Layout (Form on Right 70%, Live Preview Card on Left 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* ======================================================== */}
        {/* RIGHT COLUMN: 4-Step Configuration Form (8 Cols) */}
        {/* ======================================================== */}
        <form
          onSubmit={(e) => handleInitiateSubmit(e, false)}
          className="lg:col-span-8 flex flex-col gap-6 w-full"
        >
          {/* STEP 1: البيانات الأساسية للباقة */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-5">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 dark:bg-[#281c15] rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "1" : "١"}
                </div>
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("البيانات الأساسية للباقة", "Basic Plan Details")}
                  </h2>
                </div>
              </div>
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] shrink-0">
                {t("خطوة 1 من 4", "Step 1 of 4")}
              </span>
            </div>

            {/* Input: اسم الباقة */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("اسم الباقة", "Plan Name")}{" "}
                <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className={cn(
                  "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] px-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none",
                  errors.name && "border-red-500 focus:border-red-500"
                )}
                placeholder={t(
                  "أدخل مسمى الباقة القانونية (مثال: الباقة الفضية، باقة الشركات المتقدمة، باقة الممارس القانوني)",
                  "Enter legal plan name (e.g. Silver Plan, Enterprise Legal, Solo Practitioner)"
                )}
              />
              {errors.name && (
                <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Dropdown: تصنيف وشريحة الباقة (DROP MENU) */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("تصنيف وشريحة الباقة", "Plan Category & Legal Tier")}{" "}
                <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <DashboardSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t(
                  "اختر تصنيف الباقة والشريحة المستهدفة من مكاتب المحاماة...",
                  "Select plan category and target law firm tier..."
                )}
              >
                <option value="" disabled>
                  {t(
                    "اختر تصنيف الباقة والشريحة المستهدفة من مكاتب المحاماة...",
                    "Select plan category and target law firm tier..."
                  )}
                </option>
                <option value="starter">
                  {t(
                    "باقة المحامين المستقلين والمكاتب الناشئة",
                    "Solo Lawyers & Emerging Law Practices"
                  )}
                </option>
                <option value="growth">
                  {t(
                    "باقة المكاتب القانونية المتوسطة ومتعددة التخصصات",
                    "Mid-sized & Full-service Legal Firms"
                  )}
                </option>
                <option value="corporate">
                  {t(
                    "باقة الشركات المهنية الكبرى والاستشارات الدولية",
                    "Large Professional Partnerships & Corporate Counsel"
                  )}
                </option>
                <option value="enterprise">
                  {t(
                    "باقة الإدارات القانونية والجهات الخاصة المتكاملة",
                    "In-House Legal Departments & Enterprise"
                  )}
                </option>
              </DashboardSelect>
              <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd]">
                {t(
                  "يحدد هذا التصنيف طريقة فرز الباقة في صفحة الأسعار وعروض التسويق الموجهة للمحامين.",
                  "Categorizes the plan on public pricing matrices and targeted marketing segments."
                )}
              </span>
            </div>

            {/* Input: الوصف التعريفي المعتمد */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("الوصف التعريفي المعتمد", "Approved Description")}{" "}
                <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                }}
                className={cn(
                  "w-full bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] p-[12px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none resize-none",
                  errors.description && "border-red-500 focus:border-red-500"
                )}
                placeholder={t(
                  "اكتب وصفاً مفصلاً يوضح الفئة المستهدفة من مكاتب المحاماة، ونطاق العمل القضائي، وأبرز المزايا التنافسية المشمولة في هذه الباقة...",
                  "Write a detailed description explaining the target legal offices, judicial scope, and key competitive features included in this plan..."
                )}
              />
              {errors.description && (
                <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Status Dropdown & Plan Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] pt-[2px]">
              {/* Dropdown: حالة الباقة والظهور للمشتركين (DROP MENU) */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("حالة الباقة والظهور للمشتركين", "Plan Status & Client Visibility")}
                </label>
                <DashboardSelect
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "active" | "draft" | "private")
                  }
                  placeholder={t(
                    "اختر حالة تفعيل الباقة وطريقة ظهورها للعملاء...",
                    "Select plan activation status and visibility..."
                  )}
                >
                  <option value="active">
                    {t(
                      "مفعلة ومتاحة للاشتراك المباشر الفوري",
                      "Active & Publicly Available for Subscription"
                    )}
                  </option>
                  <option value="draft">
                    {t(
                      "مسودة معلقة للمراجعة والاعتماد الداخلي",
                      "Pending Draft for Internal Review & Approval"
                    )}
                  </option>
                  <option value="private">
                    {t(
                      "باقة خاصة حصرية (تظهر فقط عبر رابط تعاقدي مخصص)",
                      "Private Exclusive Plan (Contractual Link Only)"
                    )}
                  </option>
                </DashboardSelect>
              </div>

              {/* وسام الباقة الترويجي (Badge) */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("وسام الباقة الترويجي (Badge)", "Plan Badge")}
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] px-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  placeholder={t("مثال: فئة التميز الذهبية، الأكثر اختياراً", "e.g. Gold Excellence, Most Popular")}
                />
              </div>
            </div>

            {/* تمييز الباقة كـ "الأكثر اختياراً" Switch */}
            <div className="bg-[#f5f3ef]/70 dark:bg-[#281c15] rounded-[6px] p-[14px] flex items-center justify-between mt-[2px]">
              <div className="flex items-center gap-[10px]">
                <Sparkles className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
                <div className="flex flex-col text-start">
                  <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      'تمييز الباقة كـ "الأكثر اختياراً" (Most Popular)',
                      'Highlight plan as "Most Popular"'
                    )}
                  </span>
                  <span className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "سيظهر وسم ذهبي بارز أعلى بطاقة الباقة، وتكون هي الخيار المقترح افتراضياً في الفترة التجريبية مع إمكانية تجربة أي باقة أخرى أو تخصيص باقة للمكتب.",
                      "A prominent golden badge will appear on top of the plan card, recommended by default for trials while allowing any other plan or custom plan."
                    )}
                  </span>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setIsPopular(!isPopular)}
                className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPopular
                    ? "bg-[#10b981] dark:bg-[#10b981]"
                    : "bg-[#d1ccc4] dark:bg-[#38271c]"
                }`}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-[20px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    isPopular
                      ? isEn
                        ? "translate-x-5"
                        : "-translate-x-5"
                      : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* STEP 2: السعر ودورات الفوترة */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-5">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 dark:bg-[#281c15] rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "2" : "٢"}
                </div>
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("السعر ودورات الفوترة", "Pricing & Billing Cycles")}
                  </h2>
                  <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "تحديد دورات الفوترة، الأسعار الشهرية والسنوية، والخصومات المعتمدة للباقة المدفوعة",
                      "Define billing cycles, monthly & annual pricing, and approved discounts for the paid plan"
                    )}
                  </p>
                </div>
              </div>
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] shrink-0">
                {t("خطوة 2 من 4", "Step 2 of 4")}
              </span>
            </div>

            {/* Dropdown: دورة الفوترة المعتمدة (DROP MENU) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("دورة الفوترة الأساسية المعتمدة", "Approved Default Billing Cycle")}
                </label>
                <DashboardSelect
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  placeholder={t(
                    "اختر دورة الفوترة المعتمدة وطريقة تجديد الاشتراك للمكتب...",
                    "Select default billing cycle and subscription renewal mode..."
                  )}
                >
                  <option value="" disabled>
                    {t(
                      "اختر دورة الفوترة المعتمدة وطريقة تجديد الاشتراك للمكتب...",
                      "Select default billing cycle and subscription renewal mode..."
                    )}
                  </option>
                  <option value="annual">
                    {t(
                      "فوترة سنوية موصى بها (دفعة واحدة مع خصم تشجيعي)",
                      "Annual Billing (Recommended - Single payment with discount)"
                    )}
                  </option>
                  <option value="monthly">
                    {t(
                      "فوترة شهرية مرنة (تجديد دوري كل 30 يوماً)",
                      "Flexible Monthly Billing (Renews every 30 days)"
                    )}
                  </option>
                </DashboardSelect>
              </div>

              {/* Dropdown: احتساب ضريبة القيمة المضافة (DROP MENU) */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t(
                    "طريقة احتساب ضريبة القيمة المضافة ZATCA (15%)",
                    "ZATCA VAT (15%) Handling Mode"
                  )}
                </label>
                <DashboardSelect
                  value={vatOption}
                  onChange={(e) => setVatOption(e.target.value)}
                  placeholder={t(
                    "اختر طريقة احتساب الضريبة في الفاتورة الإلكترونية...",
                    "Select tax calculation method for e-invoicing..."
                  )}
                >
                  <option value="" disabled>
                    {t(
                      "اختر طريقة احتساب الضريبة في الفاتورة الإلكترونية...",
                      "Select tax calculation method for e-invoicing..."
                    )}
                  </option>
                  <option value="exclusive">
                    {t(
                      "الأسعار غير شاملة الضريبة (تضاف 15% تلقائياً عند السداد وإصدار الفاتورة)",
                      "Prices exclude VAT (15% added automatically at checkout)"
                    )}
                  </option>
                  <option value="inclusive">
                    {t(
                      "الأسعار شاملة ضريبة القيمة المضافة 15% المعتمدة من هيئة الزكاة",
                      "Prices inclusive of 15% VAT approved by ZATCA"
                    )}
                  </option>
                </DashboardSelect>
              </div>
            </div>

            {/* حقول أسعار الدورات الزمنية (Empty in create mode, populated in edit mode) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] pt-[2px]">
              {/* شهري */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("السعر الشهري", "Monthly Price")}{" "}
                  <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={monthlyPrice}
                    onChange={(e) => {
                      handleMonthlyPriceChange(e);
                      if (errors.monthly_price) setErrors((prev) => ({ ...prev, monthly_price: "" }));
                    }}
                    placeholder={t(
                      "أدخل قيمة الاشتراك الشهري بالريال السعودي (مثال: 499)",
                      "Enter monthly subscription fee in SAR (e.g. 499)"
                    )}
                    className={cn(
                      "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed",
                      errors.monthly_price && "border-red-500 focus:border-red-500"
                    )}
                  />
                  <span className="text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("ر.س", "SAR")}
                  </span>
                </div>
                {errors.monthly_price && (
                  <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
                    {errors.monthly_price}
                  </p>
                )}
              </div>

              {/* سنوي */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("السعر السنوي (موصى به)", "Annual Price (Recommended)")}{" "}
                  <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={annualPrice}
                    onChange={(e) => {
                      handleAnnualPriceChange(e);
                      if (errors.yearly_price) setErrors((prev) => ({ ...prev, yearly_price: "" }));
                    }}
                    placeholder={t(
                      "أدخل قيمة الاشتراك السنوي الإجمالي بعد الخصم التشجيعي (مثال: 4990)",
                      "Enter total annual fee after discount (e.g. 4990)"
                    )}
                    className={cn(
                      "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed",
                      errors.yearly_price && "border-red-500 focus:border-red-500"
                    )}
                  />
                  <span className="text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("ر.س", "SAR")}
                  </span>
                </div>
                {errors.yearly_price && (
                  <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
                    {errors.yearly_price}
                  </p>
                )}
              </div>

              {/* نسبة الخصم السنوي */}
              <div className="flex flex-col gap-[6px] text-start md:col-span-2">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("نسبة الخصم التشجيعي للاشتراك السنوي (%)", "Annual Discount Incentive (%)")}
                </label>
                <div className="relative max-w-[280px]">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={yearlyDiscountPercent}
                    onChange={handleDiscountChange}
                    placeholder={t("خصم", "Discount")}
                    className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <span className="text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: حدود الاستخدام والموارد السحابية */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-5">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 dark:bg-[#281c15] rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "3" : "٣"}
                </div>
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("حدود الاستخدام والموارد السحابية", "Usage Limits & Cloud Quotas")}
                  </h2>
                  <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "الضوابط التشغيلية لكل مكتب: أدخل القيمة العددية المصرح بها (أرقام فقط تبدأ من صفر)",
                      "Operational quotas per office: enter allowed numeric count (numbers only starting from 0)"
                    )}
                  </p>
                </div>
              </div>
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] shrink-0">
                {t("خطوة 3 من 4", "Step 3 of 4")}
              </span>
            </div>

            {/* 6 Limit Inputs in 3x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
              {/* 1. المحامون والمستشارون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("المحامون والمستشارون", "Lawyers & Consultants")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={lawyersLimit}
                    onChange={handleStrictNumberChange(setLawyersLimit)}
                    placeholder={t(
                      "أدخل العدد المسموح به (مثال: 10)",
                      "Allowed count (e.g. 10)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[12px] pe-[54px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("محامٍ", "seats")}
                  </span>
                </div>
              </div>

              {/* 2. القضايا والمعاملات النشطة */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("القضايا والمعاملات النشطة", "Active Cases & Matters")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={casesLimit}
                    onChange={handleStrictNumberChange(setCasesLimit)}
                    placeholder={t(
                      "الحد الأقصى للقضايا (مثال: 500)",
                      "Max active cases (e.g. 500)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[12px] pe-[54px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("قضية", "cases")}
                  </span>
                </div>
              </div>

              {/* 3. الوكلاء والمفوضون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الوكلاء والمفوضون", "Agents & Representatives")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={agentsLimit}
                    onChange={handleStrictNumberChange(setAgentsLimit)}
                    placeholder={t(
                      "حد الوكلاء الشرعيين (مثال: 15)",
                      "Max POA agents (e.g. 15)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[12px] pe-[54px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("وكيل", "agents")}
                  </span>
                </div>
              </div>

              {/* 4. الموكلون والشركات */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الموكلون والشركات", "Clients & Companies")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={clientsLimit}
                    onChange={handleStrictNumberChange(setClientsLimit)}
                    placeholder={t(
                      "سجلات الموكلين (مثال: 2000)",
                      "Max clients (e.g. 2000)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[12px] pe-[54px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("عميل", "clients")}
                  </span>
                </div>
              </div>

              {/* 5. المساحة السحابية */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("المساحة السحابية (GB)", "Cloud Storage (GB)")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={storageLimit}
                    onChange={handleStrictNumberChange(setStorageLimit)}
                    placeholder={t(
                      "سعة التخزين بالجيجابايت (مثال: 100)",
                      "Storage in GB (e.g. 100)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[12px] pe-[54px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    GB
                  </span>
                </div>
              </div>

              {/* 6. المساعدون والمحاسبون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("المساعدون والمحاسبون", "Assistants & Accountants")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={assistantsLimit}
                    onChange={handleStrictNumberChange(setAssistantsLimit)}
                    placeholder={t(
                      "حسابات المساعدين (مثال: 20)",
                      "Assistants count (e.g. 20)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[12px] pe-[54px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("مستخدم", "users")}
                  </span>
                </div>
              </div>

              {/* 7. المستندات والوثائق */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("المستندات والوثائق", "Documents & Files")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={documentsLimit}
                    onChange={handleStrictNumberChange(setDocumentsLimit)}
                    placeholder={t(
                      "سجلات المستندات (مثال: 5000)",
                      "Max documents (e.g. 5000)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[12px] pe-[54px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("مستند", "docs")}
                  </span>
                </div>
              </div>
            </div>

            {/* Dropdown: مستوى الدعم الفني وسرعة الاستجابة SLA (DROP MENU) */}
            <div className="flex flex-col gap-[6px] text-start pt-[4px]">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t(
                  "مستوى اتفاقية الخدمة والدعم الفني (SLA)",
                  "Service Level Agreement (SLA) & Support Tier"
                )}
              </label>
              <DashboardSelect
                value={supportSla}
                onChange={(e) => {
                  setSupportSla(e.target.value);
                  if (e.target.value === "vip") {
                    setFeatures((prev) => ({
                      ...prev,
                      vipSla: true,
                      accountManager: true,
                    }));
                  }
                }}
                placeholder={t(
                  "اختر مستوى اتفاقية الدعم الفني وسرعة الاستجابة المعتمدة للباقة...",
                  "Select approved SLA support level and response speed..."
                )}
              >
                <option value="" disabled>
                  {t(
                    "اختر مستوى اتفاقية الدعم الفني وسرعة الاستجابة المعتمدة للباقة...",
                    "Select approved SLA support level and response speed..."
                  )}
                </option>
                <option value="vip">
                  {t(
                    "دعم VIP فائق الأولوية خلال ساعتين مع مدير حساب مخصص",
                    "VIP Priority SLA within 2 Hours + Dedicated Legal Account Manager"
                  )}
                </option>
                <option value="priority">
                  {t(
                    "دعم فني متقدم خلال 6 ساعات عبر الهاتف والبريد المباشر",
                    "Priority Support within 6 Hours via Phone & Direct Email"
                  )}
                </option>
                <option value="standard">
                  {t(
                    "دعم فني قياسي خلال 24 ساعة عبر نظام التذاكر الموحد",
                    "Standard Support within 24 Hours via Unified Ticketing"
                  )}
                </option>
              </DashboardSelect>
              <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd]">
                {t(
                  "يحدد سرعة الرد وحق التصعيد التشغيلي عند حدوث أعطال أو تزامن الجلسات القضائية العاجلة.",
                  "Defines turnaround time and operational escalation during urgent court proceedings."
                )}
              </span>
            </div>
          </div>

          {/* STEP 4: المميزات المتقدمة وتكاملات المنظومة */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-5">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 dark:bg-[#281c15] rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "4" : "٤"}
                </div>
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      "المميزات المتقدمة وتكاملات المنظومة",
                      "Advanced Features & Integrations"
                    )}
                  </h2>
                  <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "الصلاحيات والخدمات التقنية النوعية الممنوحة لمشتركي الباقة",
                      "Qualitative permissions and technical services provided to subscribers"
                    )}
                  </p>
                </div>
              </div>
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] shrink-0">
                {t("خطوة 4 من 4", "Step 4 of 4")}
              </span>
            </div>

            {/* 4 Feature Checkboxes */}
            <div className="flex flex-col gap-[12px]">
              {/* Feature 1 */}
              <div
                onClick={() => toggleFeature("vipSla")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  features.vipSla
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#f5f3ef]/60 dark:bg-[#281c15]"
                    : "border-[#eae8e4] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="flex items-center gap-[12px]">
                  <input
                    type="checkbox"
                    checked={features.vipSla}
                    onChange={() => toggleFeature("vipSla")}
                    className="size-[16px] accent-[#9c6402]"
                  />
                  <div className="flex flex-col text-start">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t(
                          "دعم فني واستجابة بأولوية قصوى (VIP SLA)",
                          "Priority Technical Support (VIP SLA)"
                        )}
                      </span>
                      <span className="bg-[#fff8e1] dark:bg-[#2d1f16] text-[#b76e00] dark:text-[#f3c27e] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        {t("خلال ساعتين", "Within 2 Hours")}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                      {t(
                        "قناة تواصل هاتفية وتذاكر مباشرة مع مدراء العمليات التقنية لضمان عدم تعطل الجلسات القضائية.",
                        "Dedicated hotline and ticketing directly with ops managers to ensure court deadlines are met."
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                onClick={() => toggleFeature("accountManager")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  features.accountManager
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#f5f3ef]/60 dark:bg-[#281c15]"
                    : "border-[#eae8e4] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="flex items-center gap-[12px]">
                  <input
                    type="checkbox"
                    checked={features.accountManager}
                    onChange={() => toggleFeature("accountManager")}
                    className="size-[16px] accent-[#9c6402]"
                  />
                  <div className="flex flex-col text-start">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t(
                          "مدير حساب قانوني معتمد",
                          "Certified Legal Account Manager"
                        )}
                      </span>
                      <span className="bg-[#ffddb6]/40 dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#f3c27e] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        {t("شخصي", "Personal")}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                      {t(
                        "مستشار مخصص لتهيئة بيانات المكتب وتدريب طاقم المحامين والإشراف على الترحيل من الأنظمة القديمة.",
                        "Dedicated advisor to onboard firm data, train lawyers, and manage legacy system migration."
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                onClick={() => toggleFeature("kpiReports")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  features.kpiReports
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#f5f3ef]/60 dark:bg-[#281c15]"
                    : "border-[#eae8e4] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="flex items-center gap-[12px]">
                  <input
                    type="checkbox"
                    checked={features.kpiReports}
                    onChange={() => toggleFeature("kpiReports")}
                    className="size-[16px] accent-[#9c6402]"
                  />
                  <div className="flex flex-col text-start">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t(
                          "تقارير الذكاء القضائي ومؤشرات الأداء المالي (KPIs)",
                          "Judicial Intelligence & Financial KPI Reports"
                        )}
                      </span>
                      <span className="bg-[#f0eeea] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        {t("متقدم", "Advanced")}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                      {t(
                        "تحليل ربحية القضايا، قياس سرعة إنجاز المحامين، ومحاكاة التدفقات النقدية للأتعاب والمطالبات.",
                        "Profitability analytics, clearance speed benchmarks, and cash flow simulations for receivables."
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div
                onClick={() => toggleFeature("zatcaV2")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  features.zatcaV2
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#f5f3ef]/60 dark:bg-[#281c15]"
                    : "border-[#eae8e4] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="flex items-center gap-[12px]">
                  <input
                    type="checkbox"
                    checked={features.zatcaV2}
                    onChange={() => toggleFeature("zatcaV2")}
                    className="size-[16px] accent-[#9c6402]"
                  />
                  <div className="flex flex-col text-start">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t(
                          "فوترة إلكترونية متوافقة كلياً مع منصة فاتورة (المرحلة الثانية)",
                          "ZATCA Phase 2 Compliant E-Invoicing Integration"
                        )}
                      </span>
                      <span className="bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        ZATCA V2
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                      {t(
                        "إصدار الفواتير الضريبية وتضمين رمز الاستجابة السريع وتشفير XML والربط مع منظومة الضريبة تلقائياً.",
                        "Tax invoice generation, embedded cryptographic QR code, and automated integration."
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-4 sm:p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[12px] text-[#514537] dark:text-[#cdc5bd]">
              <CheckCircle2 className="size-[14px] text-[#9c6402] dark:text-[#e29d38]" />
              <span>
                {t(
                  "كافة الحقول المشار إليها بعلامة (*) إلزامية لضمان سلامة التكامل مع المحاسبة والفوترة.",
                  "All fields marked with (*) are required for accounting and billing compliance."
                )}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] px-5 py-2.5 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("إلغاء", "Cancel")}
              </button>

              <button
                type="button"
                onClick={(e) => handleInitiateSubmit(e, true)}
                disabled={isSubmitting}
                className="bg-white dark:bg-[#2d1f16] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#4d3627] text-[#514537] dark:text-[#cdc5bd] px-5 py-2.5 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("حفظ كمسودة", "Save as Draft")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#c9862b] text-white dark:text-[#1c140f] px-7 py-2.5 rounded-[4px] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="size-[14px] animate-spin" />
                ) : (
                  <Check className="size-[14px] stroke-[2.5]" />
                )}
                <span>
                  {isSubmitting
                    ? t("جاري الحفظ...", "Saving...")
                    : isEditMode
                    ? t("حفظ التعديلات", "Save Changes")
                    : t("حفظ وتفعيل الباقة", "Save & Publish Plan")}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* ======================================================== */}
        {/* LEFT COLUMN: Live Preview Card (4 Cols in 12-col grid) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 sticky top-6 flex flex-col gap-3">
          {/* Preview Header */}
          <div className="flex items-center gap-2 text-[#514537] dark:text-[#cdc5bd] text-[13px] font-bold text-start px-1">
            <Eye className="size-[15px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>{t("معاينة بطاقة الباقة الحية", "Plan Card Live Preview")}</span>
          </div>

          {/* Live Interactive Card */}
          <div className="bg-white dark:bg-[#221812] rounded-[12px] p-5 sm:p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] border-2 border-[#9c6402] dark:border-[#e29d38] flex flex-col gap-4 text-start">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                {status === "active"
                  ? t("● مفعلة للطلب", "● Active for Orders")
                  : status === "private"
                  ? t("● باقة خاصة", "● Private Plan")
                  : t("● مسودة معلقة", "● Pending Draft")}
              </span>
              <span className="bg-[#ffddb6] dark:bg-[#38271c] text-[#7b4e00] dark:text-[#f3c27e] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                {category === "corporate"
                  ? t("★ الشركات الكبرى", "★ Enterprise Tier")
                  : category === "growth"
                  ? t("★ المكاتب المتوسطة", "★ Mid-sized Tier")
                  : category === "starter"
                  ? t("★ المكاتب الناشئة", "★ Emerging Tier")
                  : t("★ فئة التميز العدلي", "★ Legal Excellence")}
              </span>
            </div>

            {/* Plan Title & Subtitle */}
            <div className="flex flex-col gap-[4px]">
              <h3 className="text-[22px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {name.trim() || t("اسم الباقة الجديدة", "New Plan Name")}
              </h3>
              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px]">
                {description.trim() ||
                  t(
                    "سيظهر هنا الوصف التعريفي المفصل للباقة فور كتابته في النموذج...",
                    "Detailed plan description will appear here as you type in the form..."
                  )}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] p-[16px] flex flex-col">
              <div className="flex items-baseline gap-[6px] justify-between">
                <div className="flex items-baseline gap-[6px]">
                  <span className="text-[34px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
                    {previewMonthlyPrice !== null ? previewMonthlyPrice.toLocaleString() : "--"}
                  </span>
                  <span className="text-[12px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                    {t("ر.س / شهرياً", "SAR / month")}
                  </span>
                </div>
                {hasDiscount && (
                  <span className="bg-[#ecfdf5] border border-emerald-300 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#047857] dark:text-[#6ee7b7] text-[11px] font-bold px-[8px] py-[2px] rounded-full shadow-2xs">
                    {t("خصم", "Discount")}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] mt-[6px]">
                {previewAnnualPrice > 0
                  ? hasDiscount
                    ? t(
                        `أو ${previewAnnualPrice.toLocaleString()} ر.س عند السداد السنوي (خصم)`,
                        `or ${previewAnnualPrice.toLocaleString()} SAR billed annually (discount)`
                      )
                    : t(
                        `أو ${previewAnnualPrice.toLocaleString()} ر.س عند السداد السنوي`,
                        `or ${previewAnnualPrice.toLocaleString()} SAR billed annually`
                      )
                  : t("أو -- ر.س عند السداد السنوي", "or -- SAR billed annually")}
              </span>
            </div>

            {/* Quotas */}
            <div className="flex flex-col gap-[8px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] border-t border-[#f0eeea] dark:border-[#38271c] pt-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("المحامون والمستشارون:", "Lawyers & Consultants:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    lawyersLimit,
                    "محامٍ",
                    "lawyers",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("القضايا والمعاملات النشطة:", "Active Cases & Matters:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    casesLimit,
                    "قضية",
                    "cases",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("الوكلاء والمفوضون:", "Agents & POA:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    agentsLimit,
                    "وكيل",
                    "agents",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("الموكلون والشركات:", "Clients & Companies:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    clientsLimit,
                    "عميل",
                    "clients",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("المساحة السحابية (GB):", "Cloud Storage (GB):")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    storageLimit,
                    "GB",
                    "GB",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("المساعدون والمحاسبون:", "Assistants & Accountants:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    assistantsLimit,
                    "مستخدم",
                    "users",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("المستندات والوثائق:", "Documents & Files:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    documentsLimit,
                    "مستند",
                    "docs",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
            </div>

            {/* Highlights */}
            <div className="flex flex-col gap-[6px] border-t border-[#f0eeea] dark:border-[#38271c] pt-[12px] text-[11px] text-[#514537] dark:text-[#cdc5bd]">
              <span className="font-bold text-[#837565] dark:text-[#cdc5bd]">
                {t("أبرز المميزات المضمنة:", "Key Features Included:")}
              </span>
              {features.zatcaV2 && (
                <div className="flex items-center gap-[6px]">
                  <Check className="size-[13px] text-[#059669] dark:text-[#6ee7b7]" />
                  <span>
                    {t(
                      "فوترة إلكترونية معتمدة (ZATCA V2)",
                      "Certified E-Invoicing (ZATCA V2)"
                    )}
                  </span>
                </div>
              )}
              {(features.vipSla || supportSla === "vip") && (
                <div className="flex items-center gap-[6px]">
                  <Check className="size-[13px] text-[#059669] dark:text-[#6ee7b7]" />
                  <span>
                    {t(
                      "دعم فني فائق الأولوية ومدير مخصص",
                      "Priority Support & Dedicated Account Manager"
                    )}
                  </span>
                </div>
              )}
              {features.accountManager && (
                <div className="flex items-center gap-[6px]">
                  <Check className="size-[13px] text-[#059669] dark:text-[#6ee7b7]" />
                  <span>
                    {t("مدير حساب قانوني معتمد", "Certified Legal Account Manager")}
                  </span>
                </div>
              )}
              {features.kpiReports && (
                <div className="flex items-center gap-[6px]">
                  <Check className="size-[13px] text-[#059669] dark:text-[#6ee7b7]" />
                  <span>
                    {t(
                      "تقارير الذكاء القضائي والمالي",
                      "Judicial Intelligence & Financial Reports"
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              type="button"
              disabled
              className="w-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] py-[10px] rounded-[4px] text-[13px] font-bold shadow-xs flex items-center justify-center gap-[6px] opacity-90 cursor-default"
            >
              <ArrowLeft className={cn("size-[14px]", isEn && "rotate-180")} />
              <span>
                {isEditMode
                  ? t("حفظ التعديلات على الباقة", "Save Plan Modifications")
                  : t("اشتراك في هذه الباقة", "Subscribe to this Plan")}
              </span>
            </button>
          </div>
        </div>
      </div>

      <LuxuryAlertDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => !isSubmitting && setIsConfirmDialogOpen(false)}
        onConfirm={executeSave}
        isLoading={isSubmitting}
        variant="info"
        title={
          isEditMode
            ? t("تأكيد تعديل بيانات الباقة والأسعار", "Confirm Plan & Pricing Update")
            : t("تأكيد إنشاء باقة الاشتراك", "Confirm Subscription Plan Creation")
        }
        description={
          isEditMode
            ? t(
                `هل أنت متأكد من حفظ التعديلات على باقة "${name.trim()}"؟ سيتم تحديث أسعارها وحدودها التشغيلية في النظام فوراً.`,
                `Are you sure you want to update "${name.trim()}"? Pricing and resource limits will be updated immediately.`
              )
            : t(
                `هل أنت متأكد من إنشاء وحفظ الباقة "${name.trim()}" في النظام وإتاحتها للاشتراك؟`,
                `Are you sure you want to create and publish "${name.trim()}" in the system?`
              )
        }
        confirmLabel={
          isSubmitting
            ? t("جاري الحفظ...", "Saving...")
            : isEditMode
            ? t("تأكيد التعديل", "Confirm Edit")
            : t("تأكيد الإنشاء", "Confirm Create")
        }
        cancelLabel={t("تراجع", "Cancel")}
        itemDetails={{
          name: name.trim(),
          email: `${monthlyPrice || 0} ر.س / شهرياً - ${annualPrice || 0} ر.س / سنوياً`,
        }}
      />
    </div>
  );
}
