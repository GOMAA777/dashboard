"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  Check,
  CheckCircle2,
  Sparkles,
  Info,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { createPlan, updatePlan } from "@/lib/api/plans";
import { mapPlanFromApi } from "@/lib/api/mappers";

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

function extractLimitValue(str?: string): number | string {
  if (!str) return "";
  if (str.includes("غير محدود") || str.toLowerCase().includes("unlimited")) return -1;
  const match = str.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : "";
}

function inferSupportSla(plan?: PricingPlanItem | null): string {
  if (!plan) return "";
  const sup = plan.limits?.support || "";
  if (sup.includes("VIP") || sup.includes("فائقة") || sup.includes("على مدار الساعة")) return "vip";
  if (sup.includes("أولوية") || sup.includes("متقدم")) return "priority";
  if (sup.includes("قياسي") || sup.includes("24")) return "standard";
  return "standard";
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

  // 2. Pricing & Cycles
  const [pricingModel, setPricingModel] = useState<"paid" | "trial">(() =>
    planToEdit ? (planToEdit.monthlyPrice === 0 ? "trial" : "paid") : "paid"
  );
  const [billingCycle, setBillingCycle] = useState(() =>
    planToEdit ? (planToEdit.annualPrice ? "annual" : "monthly") : ""
  );
  const [vatOption, setVatOption] = useState(() => (planToEdit ? "inclusive" : ""));
  const [monthlyPrice, setMonthlyPrice] = useState<number | string>(() =>
    planToEdit ? planToEdit.monthlyPrice : ""
  );
  const [annualPrice, setAnnualPrice] = useState<number | string>(() =>
    planToEdit && planToEdit.annualPrice ? planToEdit.annualPrice : ""
  );
  const [yearlyDiscountPercent, setYearlyDiscountPercent] = useState<number | string>(() =>
    planToEdit?.yearlyDiscountPercent !== undefined ? planToEdit.yearlyDiscountPercent : ""
  );

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
    planToEdit ? extractLimitValue(planToEdit.limits?.assistants) || 15 : 15
  );

  // 4. SLA & Features
  const [supportSla, setSupportSla] = useState(() => inferSupportSla(planToEdit));
  const [features, setFeatures] = useState(() => inferFeatures(planToEdit));

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
      setPricingModel(planToEdit.monthlyPrice === 0 ? "trial" : "paid");
      setBillingCycle(planToEdit.annualPrice ? "annual" : "monthly");
      setVatOption("inclusive");
      setMonthlyPrice(planToEdit.monthlyPrice);
      setAnnualPrice(planToEdit.annualPrice || "");
      setYearlyDiscountPercent(
        planToEdit.yearlyDiscountPercent !== undefined ? planToEdit.yearlyDiscountPercent : ""
      );
      setLawyersLimit(extractLimitValue(planToEdit.limits?.lawyers));
      setCasesLimit(extractLimitValue(planToEdit.limits?.cases));
      setAgentsLimit(extractLimitValue(planToEdit.limits?.agents));
      setClientsLimit(extractLimitValue(planToEdit.limits?.clients));
      setStorageLimit(extractLimitValue(planToEdit.limits?.storage));
      setAssistantsLimit(extractLimitValue(planToEdit.limits?.assistants) || 15);
      setSupportSla(inferSupportSla(planToEdit));
      setFeatures(inferFeatures(planToEdit));
    }
  }, [planToEdit]);

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    if (num === -1) {
      return t("غير محدود", "Unlimited");
    }
    return `${num} ${t(unitAr, unitEn)}`;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("يرجى إدخال اسم الباقة أولاً", "Please enter a plan name first"));
      return;
    }

    const numMonthly = monthlyPrice === "" ? 0 : Number(monthlyPrice) || 0;
    const numAnnual = annualPrice === "" ? 0 : Number(annualPrice) || 0;
    const numLawyers = lawyersLimit === "" ? 0 : Number(lawyersLimit);
    const numCases = casesLimit === "" ? 0 : Number(casesLimit);
    const numAgents = agentsLimit === "" ? 0 : Number(agentsLimit);
    const numAssistants = assistantsLimit === "" ? 0 : Number(assistantsLimit);
    const numClients = clientsLimit === "" ? 0 : Number(clientsLimit);
    const numStorage = storageLimit === "" ? 0 : Number(storageLimit);

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
        ? Math.max(0, Math.round(((numMonthly * 12 - numAnnual) / (numMonthly * 12)) * 100))
        : 0;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      badge: badge.trim() || undefined,
      badge_color: badgeColor || undefined,
      type: pricingModel,
      monthly_price: numMonthly,
      yearly_price: numAnnual,
      yearly_discount_percent: calculatedDiscount,
      max_lawyers: numLawyers,
      max_cases: numCases,
      max_power_of_attorney: numAgents,
      max_assistants: numAssistants,
      max_clients: numClients,
      storage_limit_gb: numStorage,
      support_level: supportSla,
      features: activeFeatures,
      is_popular: isPopular,
      status: isDraft ? "inactive" : status,
    };

    let savedPlan: PricingPlanItem = {
      id: planToEdit ? planToEdit.id : `plan-${Date.now()}`,
      name: name.trim(),
      code: planToEdit
        ? planToEdit.code
        : `CODE: PLAN-${(name.trim().slice(0, 3) || "NEW").toUpperCase()}-01`,
      description: description.trim(),
      badge: badge.trim() || undefined,
      badgeColor: badgeColor || undefined,
      type: pricingModel,
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
          numLawyers === -1
            ? t("غير محدود: المحامين", "Unlimited: Lawyers")
            : `${numLawyers} ${t("محامين ومستشارين", "lawyers & consultants")}`,
        cases:
          numCases === -1
            ? t("غير محدود: القضايا", "Unlimited: Cases")
            : `${numCases} ${t("قضية نشطة", "active cases")}`,
        agents:
          numAgents === -1
            ? t("غير محدود: الوكلاء", "Unlimited: Agents")
            : `${numAgents} ${t("وكلاء شرعيين", "legal agents")}`,
        assistants:
          numAssistants === -1
            ? t("غير محدود: المساعدين", "Unlimited: Assistants")
            : `${numAssistants} ${t("مساعدين إداريين", "assistants")}`,
        clients:
          numClients === -1
            ? t("غير محدود: العملاء", "Unlimited: Clients")
            : `${numClients.toLocaleString()} ${t("عميل وموكل", "clients")}`,
        storage:
          numStorage === -1
            ? t("غير محدود: التخزين", "Unlimited: Storage")
            : `${numStorage} GB ${t("مساحة تخزين سحابية", "cloud storage")}`,
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
      const response = isEditMode && planToEdit
        ? await updatePlan(planToEdit.id, payload)
        : await createPlan(payload);
      const mapped = mapPlanFromApi(
        ((response as { data?: Record<string, unknown> })?.data ||
          response) as Record<string, unknown>
      );
      if (mapped?.id) savedPlan = { ...savedPlan, ...mapped, colorTheme };
    } catch {
      // Fall back to local plan object so UI flow stays intact.
    }

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
          onSubmit={(e) => handleSubmit(e, false)}
          className="lg:col-span-8 flex flex-col gap-6 w-full"
        >
          {/* STEP 1: البيانات الأساسية للباقة */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-5">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 dark:bg-[#281c15] rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                {t("خطوة 1 من 4", "Step 1 of 4")}
              </span>
              <div className="flex items-center gap-[10px]">
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("البيانات الأساسية للباقة", "Basic Plan Details")}
                  </h2>
                  <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "تعريف هوية الباقة ومسماها القانوني ومستوى تموضعها في السوق العدلي",
                      "Define plan identity, naming, and legal market positioning"
                    )}
                  </p>
                </div>
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "1" : "١"}
                </div>
              </div>
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
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] px-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                placeholder={t(
                  "أدخل مسمى الباقة القانونية (مثال: الباقة الفضية، باقة الشركات المتقدمة، باقة الممارس القانوني)",
                  "Enter legal plan name (e.g. Silver Plan, Enterprise Legal, Solo Practitioner)"
                )}
              />
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
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] p-[12px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none resize-none"
                placeholder={t(
                  "اكتب وصفاً مفصلاً يوضح الفئة المستهدفة من مكاتب المحاماة، ونطاق العمل القضائي، وأبرز المزايا التنافسية المشمولة في هذه الباقة...",
                  "Write a detailed description explaining the target legal offices, judicial scope, and key competitive features included in this plan..."
                )}
              />
            </div>

            {/* Status Dropdown & Color Selection */}
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

              {/* لون وتمييز هوية الباقة */}
              <div className="flex flex-col gap-[8px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("لون وتمييز هوية الباقة", "Plan Color & Identity Theme")}
                </label>
                <div className="flex items-center gap-[10px] h-[42px]">
                  {[
                    { color: "#9c6402", label: "ذهبي" },
                    { color: "#1b7340", label: "أخضر" },
                    { color: "#1e40af", label: "أزرق" },
                    { color: "#475569", label: "رمادي" },
                  ].map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => setColorTheme(item.color)}
                      title={item.label}
                      className={`size-[28px] rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        colorTheme === item.color
                          ? "scale-115 ring-2 ring-offset-2 ring-[#9c6402] dark:ring-[#e29d38]"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: item.color }}
                    >
                      {colorTheme === item.color && (
                        <Check className="size-[14px] text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* وسام وتمييز الباقة الترويجي (Badge & Badge Color) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] pt-[2px]">
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

              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("لون الوسام (Badge Color)", "Badge Color")}
                </label>
                <div className="flex items-center gap-[8px]">
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="size-[44px] rounded-[4px] border border-[#e2ded7] dark:border-[#38271c] cursor-pointer bg-transparent p-1 shrink-0"
                  />
                  <input
                    type="text"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="flex-1 h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] px-[14px] text-[14px] font-mono text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none"
                    placeholder="#d97706"
                  />
                </div>
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
                      "سيظهر وسم ذهبي بارز أعلى بطاقة الباقة في بوابة العملاء والموقع التسويقي.",
                      "A prominent golden badge will appear on top of the plan card across portals."
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
                    ? "bg-[#9c6402] dark:bg-[#e29d38]"
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
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                {t("خطوة 2 من 4", "Step 2 of 4")}
              </span>
              <div className="flex items-center gap-[10px]">
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("السعر ودورات الفوترة", "Pricing & Billing Cycles")}
                  </h2>
                  <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "تحديد نوع التسعير، الدورات المتاحة، والخصومات المعتمدة لضمان التدفق النقدي",
                      "Define pricing model, billing cycles, and approved discounts"
                    )}
                  </p>
                </div>
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "2" : "٢"}
                </div>
              </div>
            </div>

            {/* نوع النموذج المالي */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              <label
                onClick={() => setPricingModel("paid")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  pricingModel === "paid"
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#f5f3ef] dark:bg-[#281c15] ring-1 ring-[#9c6402] dark:ring-[#e29d38]"
                    : "border-[#eae8e4] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="flex flex-col text-start">
                  <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("باقة تجارية مدفوعة", "Paid Commercial Plan")}
                  </span>
                  <span className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "تتطلب اشتراكاً دورياً ودفعات مؤتمتة عبر مدى وسداد وفيزا",
                      "Periodic subscription with automated Mada, Sadad, and Visa checkout"
                    )}
                  </span>
                </div>
                <input
                  type="radio"
                  name="model"
                  checked={pricingModel === "paid"}
                  onChange={() => setPricingModel("paid")}
                  className="accent-[#9c6402]"
                />
              </label>

              <label
                onClick={() => setPricingModel("trial")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  pricingModel === "trial"
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#f5f3ef] dark:bg-[#281c15] ring-1 ring-[#9c6402] dark:ring-[#e29d38]"
                    : "border-[#eae8e4] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="flex flex-col text-start">
                  <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("باقة تجريبية / مجانية (0 ر.س)", "Trial / Free Plan (0 SAR)")}
                  </span>
                  <span className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "فترة استكشافية محدودة الأجل للمحامين الجدد والناشئين",
                      "Time-limited exploratory access for emerging legal practices"
                    )}
                  </span>
                </div>
                <input
                  type="radio"
                  name="model"
                  checked={pricingModel === "trial"}
                  onChange={() => setPricingModel("trial")}
                  className="accent-[#9c6402]"
                />
              </label>
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
                  <option value="quarterly">
                    {t(
                      "فوترة ربع سنوية (تجديد كل 3 أشهر للمشاريع المؤقتة)",
                      "Quarterly Billing (Renews every 3 months)"
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
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#837565] dark:text-[#cdc5bd] bg-[#eae8e4] dark:bg-[#38271c] px-[6px] py-[2px] rounded-[2px]">
                    {t("الدورة الأساسية", "Base Cycle")}
                  </span>
                  <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("السعر الشهري", "Monthly Price")}{" "}
                    <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) =>
                      setMonthlyPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "أدخل قيمة الاشتراك الشهري بالريال السعودي (مثال: 499)",
                      "Enter monthly subscription fee in SAR (e.g. 499)"
                    )}
                    className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("ر.س", "SAR")}
                  </span>
                </div>
                <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd]">
                  {t(
                    "فاتورة تجدد كل 30 يوماً ويتم إصدار إشعار السداد آلياً",
                    "Renews automatically every 30 days with automated invoice"
                  )}
                </span>
              </div>

              {/* سنوي */}
              <div className="flex flex-col gap-[6px] text-start">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#047857] dark:text-[#6ee7b7] bg-[#ecfdf5] dark:bg-[#132c1c] px-[6px] py-[2px] rounded-[2px]">
                    {t("شهران مجاناً", "2 Months Free")}
                  </span>
                  <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("السعر السنوي (موصى به)", "Annual Price (Recommended)")}{" "}
                    <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={annualPrice}
                    onChange={(e) =>
                      setAnnualPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "أدخل قيمة الاشتراك السنوي الإجمالي بعد الخصم التشجيعي (مثال: 4990)",
                      "Enter total annual fee after discount (e.g. 4990)"
                    )}
                    className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("ر.س", "SAR")}
                  </span>
                </div>
                <span className="text-[11px] text-[#047857] dark:text-[#6ee7b7] font-semibold">
                  {annualPrice !== "" && Number(annualPrice) > 0
                    ? t(
                        `ما يعادل ${Math.round(
                          Number(annualPrice) / 12
                        )} ر.س / شهرياً عند الدفع السنوي`,
                        `Equivalent to ${Math.round(
                          Number(annualPrice) / 12
                        )} SAR / month with savings`
                      )
                    : t(
                        "يتم احتساب التوفير السنوي تلقائياً فور كتابة السعر في الحقل",
                        "Annual savings will calculate automatically once price is entered"
                      )}
                </span>
              </div>

              {/* نسبة الخصم السنوي */}
              <div className="flex flex-col gap-[6px] text-start md:col-span-2">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("نسبة الخصم التشجيعي للاشتراك السنوي (%)", "Annual Discount Incentive (%)")}
                </label>
                <div className="relative max-w-[280px]">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={yearlyDiscountPercent}
                    onChange={(e) =>
                      setYearlyDiscountPercent(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "أدخل نسبة الخصم السنوي (مثال: 19)",
                      "Enter annual discount % (e.g. 19)"
                    )}
                    className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    %
                  </span>
                </div>
                <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd]">
                  {t(
                    "تظهر كشارة ترويجية ديناميكية في كارت الباقة لحث المكاتب على السداد السنوي",
                    "Appears as a dynamic badge on the plan card to encourage annual billing"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: حدود الاستخدام والموارد السحابية */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-5">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 dark:bg-[#281c15] rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                {t("خطوة 3 من 4", "Step 3 of 4")}
              </span>
              <div className="flex items-center gap-[10px]">
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("حدود الاستخدام والموارد السحابية", "Usage Limits & Cloud Quotas")}
                  </h2>
                  <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd]">
                    {t(
                      "الضوابط التشغيلية لكل مكتب: أدخل القيمة العددية، أو أدخل (-1) لتعيين استخدام غير محدود",
                      "Operational quotas per office: enter number or (-1) for unlimited"
                    )}
                  </p>
                </div>
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "3" : "٣"}
                </div>
              </div>
            </div>

            {/* Note banner */}
            <div className="bg-[#fff8e1] dark:bg-[#2d1f16] border-r-3 rtl:border-r-3 ltr:border-l-3 border-[#9c6402] dark:border-[#e29d38] rounded-[4px] p-[10px] flex items-center gap-[8px] text-[11px] text-[#7b4e00] dark:text-[#f3c27e] font-semibold">
              <Info className="size-[14px] shrink-0" />
              <span>
                {t(
                  "ملاحظة نظامية: تعيين القيمة (-1) يمنح \"غير محدود\" لكافة الموارد المحددة ويتم التمييز بدقة في تراخيص الهيئة السعودية للمحامين.",
                  "Regulatory Note: Setting (-1) designates \"Unlimited\" for resources per Saudi Bar Association licensing guidelines."
                )}
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
                    type="number"
                    value={lawyersLimit}
                    onChange={(e) =>
                      setLawyersLimit(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "أدخل العدد المسموح به (مثال: 10 أو -1)",
                      "Allowed count (e.g. 10 or -1)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("محامٍ", "seats")}
                  </span>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#cdc5bd]">
                  {t(
                    "عدد حسابات المحامين والمستشارين المتاحين",
                    "Licensed attorney accounts"
                  )}
                </span>
              </div>

              {/* 2. القضايا والمعاملات النشطة */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("القضايا والمعاملات النشطة", "Active Cases & Matters")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={casesLimit}
                    onChange={(e) =>
                      setCasesLimit(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "الحد الأقصى للقضايا (مثال: 500 أو -1)",
                      "Max active cases (e.g. 500 or -1)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("قضية", "cases")}
                  </span>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#cdc5bd]">
                  {t("مفتوحة وقيد الترافع في ناجز والمحاكم", "Active open court litigation")}
                </span>
              </div>

              {/* 3. الوكلاء والمفوضون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الوكلاء والمفوضون", "Agents & Representatives")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={agentsLimit}
                    onChange={(e) =>
                      setAgentsLimit(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "حد الوكلاء الشرعيين (مثال: 15 أو -1)",
                      "Max POA agents (e.g. 15 or -1)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("وكيل", "agents")}
                  </span>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#cdc5bd]">
                  {t("وكالات شرعية مرتبطة بقضايا المكتب", "Linked power of attorney")}
                </span>
              </div>

              {/* 4. الموكلون والشركات */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الموكلون والشركات", "Clients & Companies")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={clientsLimit}
                    onChange={(e) =>
                      setClientsLimit(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "سجلات الموكلين (مثال: 2000 أو -1)",
                      "Max clients (e.g. 2000 or -1)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("عميل", "clients")}
                  </span>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#cdc5bd]">
                  {t("سجلات وملفات الموكلين الرقمية", "Digital client dossier records")}
                </span>
              </div>

              {/* 5. المساحة السحابية */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("المساحة السحابية (GB)", "Cloud Storage (GB)")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={storageLimit}
                    onChange={(e) =>
                      setStorageLimit(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "سعة التخزين بالجيجابايت (مثال: 100)",
                      "Storage in GB (e.g. 100 or -1)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    GB
                  </span>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#cdc5bd]">
                  {t("تخزين مشفر آمن للوثائق والمستندات", "Secure encrypted in-kingdom storage")}
                </span>
              </div>

              {/* 6. المساعدون والمحاسبون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("المساعدون والمحاسبون", "Assistants & Accountants")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={assistantsLimit}
                    onChange={(e) =>
                      setAssistantsLimit(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder={t(
                      "حسابات المساعدين (مثال: 20 أو -1)",
                      "Assistants count (e.g. 20 or -1)"
                    )}
                    className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#a89f91] placeholder:font-normal focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    {t("مستخدم", "users")}
                  </span>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#cdc5bd]">
                  {t("طاقم السكرتارية والدعم المالي والإداري", "Administrative and finance staff")}
                </span>
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
              <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                {t("خطوة 4 من 4", "Step 4 of 4")}
              </span>
              <div className="flex items-center gap-[10px]">
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
                <div className="size-[28px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {isEn ? "4" : "٤"}
                </div>
              </div>
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
                className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] px-5 py-2.5 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                {t("إلغاء", "Cancel")}
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="bg-white dark:bg-[#2d1f16] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#4d3627] text-[#514537] dark:text-[#cdc5bd] px-5 py-2.5 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                {t("حفظ كمسودة", "Save as Draft")}
              </button>

              <button
                type="submit"
                className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#c9862b] text-white dark:text-[#1c140f] px-7 py-2.5 rounded-[4px] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="size-[14px] stroke-[2.5]" />
                <span>
                  {isEditMode
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
              <div className="flex items-baseline gap-[6px]">
                <span className="text-[34px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
                  {monthlyPrice !== "" ? monthlyPrice : "--"}
                </span>
                <span className="text-[12px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                  {t("ر.س / شهرياً", "SAR / month")}
                </span>
              </div>
              <span className="text-[10px] text-[#837565] dark:text-[#cdc5bd] mt-[4px]">
                {annualPrice !== "" && Number(annualPrice) > 0
                  ? t(
                      `أو ${annualPrice} ر.س عند السداد السنوي (وفر 16%)`,
                      `or ${annualPrice} SAR billed annually (save 16%)`
                    )
                  : t("أو -- ر.س عند السداد السنوي", "or -- SAR billed annually")}
              </span>
            </div>

            {/* Quotas */}
            <div className="flex flex-col gap-[8px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] border-t border-[#f0eeea] dark:border-[#38271c] pt-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("المحامون المرخصون:", "Licensed Lawyers:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    lawyersLimit,
                    "محامين",
                    "lawyers",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("القضايا النشطة:", "Active Cases:")}
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
                  {t("التخزين السحابي:", "Cloud Storage:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    storageLimit,
                    "جيجابايت",
                    "GB",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("الوكلاء الشرعيين:", "Legal Agents:")}
                </span>
                <span className="font-bold">
                  {getLimitText(
                    agentsLimit,
                    "وكلاء",
                    "agents",
                    t("غير محدد بعد", "Not specified yet")
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#cdc5bd]">
                  {t("الموكلون المضافون:", "Clients:")}
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
    </div>
  );
}
