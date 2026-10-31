"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  Check,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";

interface CreatePlanViewProps {
  onBack: () => void;
  onSuccess: (newPlan: PricingPlanItem) => void;
}

export function CreatePlanView({ onBack, onSuccess }: CreatePlanViewProps) {
  // 1. Basic Info
  const [name, setName] = useState("باقة التميز العدلي");
  const [description, setDescription] = useState(
    "مخصصة للمكاتب والشركات المهنية القانونية التي تتطلب تواصلاً فورياً مع بوابة ناجز وإدارة دقيقة للأفرع وفريق العمل."
  );
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [colorTheme, setColorTheme] = useState("#9c6402");
  const [isPopular, setIsPopular] = useState(false);

  // 2. Pricing & Cycles
  const [pricingModel, setPricingModel] = useState<"paid" | "trial">("paid");
  const [monthlyPrice, setMonthlyPrice] = useState(549);
  const [annualPrice, setAnnualPrice] = useState(5290);

  // 3. Limits
  const [lawyersLimit, setLawyersLimit] = useState(8);
  const [casesLimit, setCasesLimit] = useState(350);
  const [agentsLimit, setAgentsLimit] = useState(10);
  const [clientsLimit, setClientsLimit] = useState(2000);
  const [storageLimit, setStorageLimit] = useState(50);
  const [assistantsLimit, setAssistantsLimit] = useState(15);

  // 4. Features
  const [features, setFeatures] = useState({
    vipSla: true,
    accountManager: true,
    kpiReports: true,
    zatcaV2: true,
  });

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("يرجى إدخال اسم الباقة");
      return;
    }

    const newPlan: PricingPlanItem = {
      id: `plan-${Date.now()}`,
      name,
      code: `CODE: PLAN-${name.slice(0, 3).toUpperCase()}-01`,
      description,
      monthlyPrice: Number(monthlyPrice) || 0,
      annualPrice: Number(annualPrice) || 0,
      annualNote: `ما يعادل ${Math.round(annualPrice / 12)} ر.س / شهرياً عند الدفع السنوي`,
      subscribedFirmsCount: 0,
      sharePercentage: "0% (باقة جديدة)",
      isActive: !isDraft && status === "active",
      isPopular,
      colorTheme,
      limits: {
        lawyers:
          lawyersLimit === -1
            ? "غير محدود: المحامين"
            : `${lawyersLimit} محامين ومستشارين`,
        cases:
          casesLimit === -1
            ? "غير محدود: القضايا"
            : `${casesLimit} قضية نشطة`,
        agents:
          agentsLimit === -1
            ? "غير محدود: الوكلاء"
            : `${agentsLimit} وكلاء شرعيين`,
        clients:
          clientsLimit === -1
            ? "غير محدود: العملاء"
            : `${clientsLimit.toLocaleString()} عميل وموكل`,
        storage:
          storageLimit === -1
            ? "غير محدود: التخزين"
            : `${storageLimit} GB مساحة تخزين سحابية`,
        support: features.vipSla
          ? "دعم فني واستجابة بأولوية قصوى (VIP SLA)"
          : "دعم فني قياسي",
      },
    };

    onSuccess(newPlan);
    toast.success(
      isDraft
        ? `تم حفظ مسودة الباقة "${name}" بنجاح.`
        : `تم إنشاء باقة "${name}" وإتاحتها للاشتراك بنجاح!`
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
          <h1 className="text-[24px] sm:text-[26px] leading-[34px] sm:leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            إنشاء باقة اشتراك جديدة
          </h1>
          <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] leading-[20px] font-normal mt-1">
            حدد السعر ومدة الاشتراك وحدود الاستخدام والمميزات المتاحة للمكتب وفق معايير الحوكمة المالية والأمنية.
          </p>
        </div>

        {/* Left / End: Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="bg-white dark:bg-[#2d1f16] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#4d3627] text-[#1b1c1a] dark:text-[#fdfbf7] px-4 py-2 rounded-[4px] text-[14px] font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowRight className="size-[15px] stroke-[2.5]" />
          <span>العودة</span>
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
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                خطوة 1 من 4
              </span>
              <div className="flex items-center gap-[10px]">
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                    البيانات الأساسية للباقة
                  </h2>
                  <p className="text-[11px] text-[#514537]">
                    تعريف هوية الباقة ومسماها القانوني ومستوى تموضعها في السوق العدلي
                  </p>
                </div>
                <div className="size-[28px] rounded-full bg-[#9c6402] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                  ١
                </div>
              </div>
            </div>

            {/* Input: اسم الباقة */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                اسم الباقة <span className="text-[#9c6402] font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] px-[14px] text-[14px] text-[#1b1c1a] focus:outline-none"
                placeholder="مثال: باقة التميز العدلي"
              />
            </div>

            {/* Input: الوصف التعريفي المعتمد */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                الوصف التعريفي المعتمد <span className="text-[#9c6402] font-bold">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] p-[12px] text-[13px] text-[#1b1c1a] focus:outline-none resize-none"
                placeholder="مخصصة للمكاتب والشركات المهنية القانونية التي تتطلب تواصلاً فورياً..."
              />
            </div>

            {/* Status & Color Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] pt-[4px]">
              {/* حالة الباقة والظهور */}
              <div className="flex flex-col gap-[8px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a]">
                  حالة الباقة والظهور
                </label>
                <div className="flex items-center gap-[12px]">
                  <label className="flex items-center gap-[6px] cursor-pointer">
                    <input
                      type="radio"
                      name="planStatus"
                      checked={status === "active"}
                      onChange={() => setStatus("active")}
                      className="accent-[#9c6402]"
                    />
                    <span className="text-[13px] text-[#1b1c1a] font-medium">مفعلة ومتاحة</span>
                  </label>
                  <label className="flex items-center gap-[6px] cursor-pointer">
                    <input
                      type="radio"
                      name="planStatus"
                      checked={status === "draft"}
                      onChange={() => setStatus("draft")}
                      className="accent-[#9c6402]"
                    />
                    <span className="text-[13px] text-[#514537] font-medium">مسودة معلقة</span>
                  </label>
                </div>
              </div>

              {/* لون وتمييز هوية الباقة */}
              <div className="flex flex-col gap-[8px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a]">
                  لون وتمييز هوية الباقة
                </label>
                <div className="flex items-center gap-[8px]">
                  {["#9c6402", "#1b7340", "#1e40af", "#475569"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorTheme(color)}
                      className={`size-[26px] rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        colorTheme === color ? "scale-115 ring-2 ring-offset-2 ring-[#9c6402]" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {colorTheme === color && <Check className="size-[13px] text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* تمييز الباقة كـ "الأكثر اختياراً" Switch */}
            <div className="bg-[#f5f3ef]/70 rounded-[6px] p-[14px] flex items-center justify-between mt-[4px]">
              <div className="flex items-center gap-[10px]">
                <Sparkles className="size-[18px] text-[#9c6402]" />
                <div className="flex flex-col text-start">
                  <span className="text-[13px] font-bold text-[#1b1c1a]">
                    تمييز الباقة كـ &quot;الأكثر اختياراً&quot; (Most Popular)
                  </span>
                  <span className="text-[11px] text-[#514537]">
                    سيظهر وسم ذهبي بارز أعلى بطاقة الباقة في بوابة العملاء والموقع التسويقي.
                  </span>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setIsPopular(!isPopular)}
                className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPopular ? "bg-[#9c6402]" : "bg-[#d1ccc4]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-[20px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isPopular ? "-translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* STEP 2: السعر ودورات الفوترة */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                خطوة 2 من 4
              </span>
              <div className="flex items-center gap-[10px]">
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                    السعر ودورات الفوترة
                  </h2>
                  <p className="text-[11px] text-[#514537]">
                    تحديد نوع التسعير، الدورات المتاحة، والخصومات المعتمدة لضمان التدفق النقدي
                  </p>
                </div>
                <div className="size-[28px] rounded-full bg-[#9c6402] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                  ٢
                </div>
              </div>
            </div>

            {/* نوع النموذج المالي */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              <label
                onClick={() => setPricingModel("paid")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  pricingModel === "paid"
                    ? "border-[#9c6402] bg-[#f5f3ef] ring-1 ring-[#9c6402]"
                    : "border-[#eae8e4] hover:bg-[#faf9f7]"
                }`}
              >
                <div className="flex flex-col text-start">
                  <span className="text-[13px] font-bold text-[#1b1c1a]">باقة تجارية مدفوعة</span>
                  <span className="text-[11px] text-[#514537]">تتطلب اشتراكاً دورياً ودفعات مؤتمتة عبر مدى وسداد وفيزا</span>
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
                    ? "border-[#9c6402] bg-[#f5f3ef] ring-1 ring-[#9c6402]"
                    : "border-[#eae8e4] hover:bg-[#faf9f7]"
                }`}
              >
                <div className="flex flex-col text-start">
                  <span className="text-[13px] font-bold text-[#1b1c1a]">باقة تجريبية / مجانية (0 ر.س)</span>
                  <span className="text-[11px] text-[#514537]">فترة استكشافية محدودة الأجل للمحامين الجدد والناشئين</span>
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

            {/* حقول أسعار الدورات الزمنية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] pt-[4px]">
              {/* شهري */}
              <div className="flex flex-col gap-[6px] text-start">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#837565] bg-[#eae8e4] px-[6px] py-[2px] rounded-[2px]">
                    الدورة الأساسية
                  </span>
                  <label className="text-[13px] font-semibold text-[#1b1c1a]">شهري</label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] font-bold text-[#837565] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    ر.س
                  </span>
                </div>
                <span className="text-[11px] text-[#837565]">فاتورة تجدد كل 30 يوماً</span>
              </div>

              {/* سنوي */}
              <div className="flex flex-col gap-[6px] text-start">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#047857] bg-[#ecfdf5] px-[6px] py-[2px] rounded-[2px]">
                    شهران مجاناً
                  </span>
                  <label className="text-[13px] font-semibold text-[#1b1c1a]">
                    سنوي (موصى به)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={annualPrice}
                    onChange={(e) => setAnnualPrice(Number(e.target.value))}
                    className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[14px] text-[14px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] font-bold text-[#837565] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    ر.س
                  </span>
                </div>
                <span className="text-[11px] text-[#047857] font-semibold">
                  ما يعادل {Math.round(annualPrice / 12)} ر.س / شهرياً بالادخار هنا
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: حدود الاستخدام والموارد السحابية */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                خطوة 3 من 4
              </span>
              <div className="flex items-center gap-[10px]">
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                    حدود الاستخدام والموارد السحابية
                  </h2>
                  <p className="text-[11px] text-[#514537]">
                    الضوابط التشغيلية لكل مكتب: أدخل القيمة العددية، أو أدخل (-1) لتعيين استخدام غير محدود
                  </p>
                </div>
                <div className="size-[28px] rounded-full bg-[#9c6402] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                  ٣
                </div>
              </div>
            </div>

            {/* Note banner */}
            <div className="bg-[#fff8e1] border-r-3 border-[#9c6402] rounded-[4px] p-[10px] flex items-center gap-[8px] text-[11px] text-[#7b4e00] font-semibold">
              <Info className="size-[14px] shrink-0" />
              <span>ملاحظة نظامية: تعيين القيمة (-1) يمنح &quot;غير محدود&quot; لكافة الموارد المحددة ويتم التمييز بدقة في تراخيص الهيئة السعودية للمحامين.</span>
            </div>

            {/* 6 Limit Inputs in 3x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
              {/* 1. المحامون والمستشارون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a]">المحامون والمستشارون</label>
                <div className="relative">
                  <input
                    type="number"
                    value={lawyersLimit}
                    onChange={(e) => setLawyersLimit(Number(e.target.value))}
                    className="w-full h-[40px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    محامٍ
                  </span>
                </div>
                <span className="text-[10px] text-[#837565]">حسابات مراجعة مخصصة</span>
              </div>

              {/* 2. القضايا والمعاملات النشطة */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a]">القضايا والمعاملات النشطة</label>
                <div className="relative">
                  <input
                    type="number"
                    value={casesLimit}
                    onChange={(e) => setCasesLimit(Number(e.target.value))}
                    className="w-full h-[40px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    قضية
                  </span>
                </div>
                <span className="text-[10px] text-[#837565]">مفتوحة وقيد الترافع</span>
              </div>

              {/* 3. الوكلاء والمفوضون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a]">الوكلاء والمفوضون</label>
                <div className="relative">
                  <input
                    type="number"
                    value={agentsLimit}
                    onChange={(e) => setAgentsLimit(Number(e.target.value))}
                    className="w-full h-[40px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    وكيل
                  </span>
                </div>
                <span className="text-[10px] text-[#837565]">وكالات إلكترونية مرتبطة</span>
              </div>

              {/* 4. الموكلون والشركات */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a]">الموكلون والشركات</label>
                <div className="relative">
                  <input
                    type="number"
                    value={clientsLimit}
                    onChange={(e) => setClientsLimit(Number(e.target.value))}
                    className="w-full h-[40px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    عميل
                  </span>
                </div>
                <span className="text-[10px] text-[#837565]">سجلات وعلاقات رقمية</span>
              </div>

              {/* 5. المساحة السحابية */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a]">المساحة السحابية (GB)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={storageLimit}
                    onChange={(e) => setStorageLimit(Number(e.target.value))}
                    className="w-full h-[40px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    GB
                  </span>
                </div>
                <span className="text-[10px] text-[#837565]">تخزين مشفر آمن داخل المملكة</span>
              </div>

              {/* 6. المساعدون والمحاسبون */}
              <div className="flex flex-col gap-[4px] text-start">
                <label className="text-[12px] font-bold text-[#1b1c1a]">المساعدون والمحاسبون</label>
                <div className="relative">
                  <input
                    type="number"
                    value={assistantsLimit}
                    onChange={(e) => setAssistantsLimit(Number(e.target.value))}
                    className="w-full h-[40px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[44px] pe-[12px] text-[13px] font-bold text-[#1b1c1a] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#837565] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    مستخدم
                  </span>
                </div>
                <span className="text-[10px] text-[#837565]">صلاحيات محددة وإدارية</span>
              </div>
            </div>
          </div>

          {/* STEP 4: المميزات المتقدمة وتكاملات المنظومة */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Step Header */}
            <div className="bg-[#f5f3ef]/50 rounded-[4px] px-[16px] py-[10px] flex items-center justify-between">
              <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                خطوة 4 من 4
              </span>
              <div className="flex items-center gap-[10px]">
                <div className="flex flex-col text-start">
                  <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                    المميزات المتقدمة وتكاملات المنظومة
                  </h2>
                  <p className="text-[11px] text-[#514537]">
                    الصلاحيات والخدمات التقنية النوعية الممنوحة لمشتركي الباقة
                  </p>
                </div>
                <div className="size-[28px] rounded-full bg-[#9c6402] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                  ٤
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
                    ? "border-[#9c6402] bg-[#f5f3ef]/60"
                    : "border-[#eae8e4] hover:bg-[#faf9f7]"
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
                      <span className="text-[13px] font-bold text-[#1b1c1a]">
                        دعم فني واستجابة بأولوية قصوى (VIP SLA)
                      </span>
                      <span className="bg-[#fff8e1] text-[#b76e00] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        خلال ساعتين
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537]">
                      قناة تواصل هاتفية وتذاكر مباشرة مع مدراء العمليات التقنية لضمان عدم تعطل الجلسات القضائية.
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                onClick={() => toggleFeature("accountManager")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  features.accountManager
                    ? "border-[#9c6402] bg-[#f5f3ef]/60"
                    : "border-[#eae8e4] hover:bg-[#faf9f7]"
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
                      <span className="text-[13px] font-bold text-[#1b1c1a]">
                        مدير حساب قانوني معتمد
                      </span>
                      <span className="bg-[#ffddb6]/40 text-[#9c6402] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        شخصي
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537]">
                      مستشار مخصص لتهيئة بيانات المكتب وتدريب طاقم المحامين والإشراف على الترحيل من الأنظمة القديمة.
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                onClick={() => toggleFeature("kpiReports")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  features.kpiReports
                    ? "border-[#9c6402] bg-[#f5f3ef]/60"
                    : "border-[#eae8e4] hover:bg-[#faf9f7]"
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
                      <span className="text-[13px] font-bold text-[#1b1c1a]">
                        تقارير الذكاء القضائي ومؤشرات الأداء المالي (KPIs)
                      </span>
                      <span className="bg-[#f0eeea] text-[#514537] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        متقدم
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537]">
                      تحليل ربحية القضايا، قياس سرعة إنجاز المحامين، ومحاكاة التدفقات النقدية للأتعاب والمطالبات.
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div
                onClick={() => toggleFeature("zatcaV2")}
                className={`p-[14px] rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                  features.zatcaV2
                    ? "border-[#9c6402] bg-[#f5f3ef]/60"
                    : "border-[#eae8e4] hover:bg-[#faf9f7]"
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
                      <span className="text-[13px] font-bold text-[#1b1c1a]">
                        فوترة إلكترونية متوافقة كلياً مع منصة فاتورة (المرحلة الثانية)
                      </span>
                      <span className="bg-[#e8f5e9] text-[#1b7340] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                        ZATCA V2
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537]">
                      إصدار الفواتير الضريبية وتضمين رمز الاستجابة السريع وتشفير XML والربط مع منظومة الضريبة تلقائياً.
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
              <span>كافة الحقول المشار إليها بعلامة (*) إلزامية لضمان سلامة التكامل مع المحاسبة والفوترة.</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onBack}
                className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] px-5 py-2.5 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="bg-white dark:bg-[#2d1f16] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#4d3627] text-[#514537] dark:text-[#cdc5bd] px-5 py-2.5 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                حفظ كمسودة
              </button>

              <button
                type="submit"
                className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#c9862b] text-white dark:text-[#1c140f] px-7 py-2.5 rounded-[4px] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="size-[14px] stroke-[2.5]" />
                <span>حفظ الباقة</span>
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
            <span>معاينة بطاقة الباقة</span>
          </div>

          {/* Live Interactive Card */}
          <div className="bg-white dark:bg-[#221812] rounded-[12px] p-5 sm:p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] border-2 border-[#9c6402] dark:border-[#e29d38] flex flex-col gap-4 text-start">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                ● مفعلة للطلب
              </span>
              <span className="bg-[#ffddb6] text-[#7b4e00] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                ★ فئة التميز العدلي
              </span>
            </div>

            {/* Plan Title & Subtitle */}
            <div className="flex flex-col gap-[4px]">
              <h3 className="text-[22px] font-extrabold text-[#1b1c1a]">
                {name || "اسم الباقة الجديدة"}
              </h3>
              <p className="text-[12px] text-[#514537] leading-[18px]">
                {description || "وصف مختصر لمميزات الباقة وشريحة المحامين المستهدفة..."}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#f5f3ef] rounded-[6px] p-[16px] flex flex-col">
              <div className="flex items-baseline gap-[6px]">
                <span className="text-[34px] font-extrabold text-[#1b1c1a] leading-none">
                  {monthlyPrice}
                </span>
                <span className="text-[12px] font-bold text-[#514537]">
                  ر.س / شهرياً
                </span>
              </div>
              <span className="text-[10px] text-[#837565] mt-[4px]">
                أو {annualPrice} ر.س عند السداد السنوي (وفر 16%)
              </span>
            </div>

            {/* Quotas */}
            <div className="flex flex-col gap-[8px] text-[12px] text-[#1b1c1a] border-t border-[#f0eeea] pt-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[#837565]">المحامون المرخصون:</span>
                <span className="font-bold">{lawyersLimit === -1 ? "غير محدود" : `${lawyersLimit} محامين`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565]">القضايا النشطة:</span>
                <span className="font-bold">{casesLimit === -1 ? "غير محدود" : `${casesLimit} قضية`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#837565]">التخزين السحابي:</span>
                <span className="font-bold">{storageLimit === -1 ? "غير محدود" : `${storageLimit} جيجابايت`}</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="flex flex-col gap-[6px] border-t border-[#f0eeea] pt-[12px] text-[11px] text-[#514537]">
              <span className="font-bold text-[#837565]">أبرز المميزات المضمنة:</span>
              {features.zatcaV2 && (
                <div className="flex items-center gap-[6px]">
                  <Check className="size-[13px] text-[#059669]" />
                  <span>فوترة إلكترونية معتمدة (ZATCA V2)</span>
                </div>
              )}
              {features.vipSla && (
                <div className="flex items-center gap-[6px]">
                  <Check className="size-[13px] text-[#059669]" />
                  <span>دعم فني فائق الأولوية ومدير مخصص</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              type="button"
              disabled
              className="w-full bg-[#9c6402] text-white py-[10px] rounded-[4px] text-[13px] font-bold shadow-xs flex items-center justify-center gap-[6px] opacity-90 cursor-default"
            >
              <ArrowLeft className="size-[14px] rtl:rotate-0 ltr:rotate-180" />
              <span>اشتراك في هذه الباقة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
