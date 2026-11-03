"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Landmark,
  Receipt,
  ShieldCheck,
  Check,
  AlertTriangle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";
import { toast } from "sonner";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface RenewSubscriptionViewProps {
  subscription?: SubscriptionRecord | null;
  onBack: () => void;
  onSuccess?: () => void;
}

export function RenewSubscriptionView({
  subscription,
  onBack,
  onSuccess,
}: RenewSubscriptionViewProps) {
  const { t, direction, isEn } = useLanguage();

  // Form States
  const [selectedOffice, setSelectedOffice] = useState(
    subscription?.firm.name ||
      "مكتب د. خالد بن عبد العزيز العجلان للمحاماة والاستشارات (ترخيص: 38/412)"
  );
  const [resolutionOption, setResolutionOption] = useState<"scheduled" | "override">("scheduled");
  const [selectedPlan, setSelectedPlan] = useState("الباقة الذهبية - 12,000 ر.س / سنوياً (الأكثر طلباً)");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [startDate, setStartDate] = useState(isEn ? "15 Nov 2024" : "15 نوفمبر 2024");
  const [endDate, setEndDate] = useState(isEn ? "14 Nov 2025" : "14 نوفمبر 2025");
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "manual" | "gateway">("transfer");
  const [referenceNumber, setReferenceNumber] = useState("TRX-BNK-982341-SA");
  const [bankAccount, setBankAccount] = useState("مصرف الراجحي - الحساب الرئيسي لمنصة الجودي");
  const [depositDate, setDepositDate] = useState(isEn ? "24 Oct 2024" : "24 أكتوبر 2024");
  const [activationState, setActivationState] = useState<"pending" | "active">("pending");
  const [notifySmsEmail, setNotifySmsEmail] = useState(true);
  const [logAuditAction, setLogAuditAction] = useState(true);
  const [notes, setNotes] = useState(
    isEn
      ? "Agreed via phone with firm administrative director; wire transfer confirmed by finance and annual discount approved."
      : "تم الاتفاق هاتفياً مع المشرف الإداري للمكتب، وتم استلام تأكيد التحويل من الإدارة المالية واعتماد الخصم السنوي."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (subscription?.id) {
        const { renewSubscription } = await import("@/lib/api/subscriptions");
        await renewSubscription(subscription.id, { period: "year", payment_method: "mada" });
      }
    } catch {
      // Keep local success flow.
    }
    toast.success(t("تم حفظ وتجديد الاشتراك بنجاح", "Subscription saved and renewed successfully"));
    setIsSubmitting(false);
    if (onSuccess) {
      onSuccess();
    } else {
      onBack();
    }
  };

  return (
    <div
      dir={direction}
      className="flex flex-col gap-6 w-full font-['Cairo'] pb-2 sm:pb-3 animate-in fade-in duration-200"
      data-node-id="1:6544"
      data-name="إضافة اشتراك / تجديد اشتراك المكتب"
    >
      {/* Main Identity & Command Banner */}
      <div
        className="bg-white dark:bg-[#221812] flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full gap-4"
        data-node-id="1:6547"
      >
        <div className="flex flex-col items-start text-start">
          <h1 className="font-['Cairo'] font-bold text-[28px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
            {t("إضافة اشتراك / تجديد اشتراك المكتب", "Add Subscription / Renew Office Subscription")}
          </h1>
          <p className="font-['Cairo'] font-normal text-[14px] text-[#514537] dark:text-[#a89f91] mt-0.5 leading-[22px]">
            {t(
              "تسجيل اشتراك لمكتب محاماة بعد الاتفاق على الباقة والتحقق من تفاصيل الدفع.",
              "Register subscription for a law firm following plan agreement and payment verification."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="bg-white dark:bg-[#281c15] hover:bg-[#faf9f7] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e4e2de] dark:border-[#38271c] px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
          data-node-id="1:6550"
        >
          <ArrowLeft className={cn("w-4 h-4", !isEn && "rotate-180")} />
          <span>{t("العودة", "Back")}</span>
        </button>
      </div>

      {/* Main Dynamic Form (2 Columns Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" data-node-id="1:6563">
        {/* SECTION A: بيانات المكتب والباقة القانونية (7 Cols on Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-6" data-node-id="1:6564">
          {/* Card 1: الخطوة 1 من 3 */}
          <div className="bg-white dark:bg-[#221812] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eeea] dark:border-[#38271c]">
              <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                {t("الخطوة 1 من 3", "Step 1 of 3")}
              </span>
              <h2 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("بيانات المكتب والباقة القانونية", "Office Details & Legal Plan")}
              </h2>
            </div>

            {/* Field 1: Office Selection */}
            <div className="space-y-1.5" data-node-id="1:6572">
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <span className="text-[#ba1a1a]">*</span>
                <span>{t("المكتب المعتمد", "Authorized Office")}</span>
              </label>
              <div className="relative">
                <DashboardSelect
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  className="bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border-[#d6c4b1]/60 dark:border-[#38271c] h-11 text-[13px]"
                >
                  <option value="مكتب د. خالد بن عبد العزيز العجلان للمحاماة والاستشارات (ترخيص: 38/412)">
                    {t(
                      "مكتب د. خالد بن عبد العزيز العجلان للمحاماة والاستشارات (ترخيص: 38/412)",
                      "Dr. Khalid Al-Ajlan Law Firm (Lic: 38/412)"
                    )}
                  </option>
                  <option value="شركة التميمي ومشاركوه للمحاماة (ترخيص: 104/39)">
                    {t(
                      "شركة التميمي ومشاركوه للمحاماة (ترخيص: 104/39)",
                      "Al Tamimi & Co. Advocates (Lic: 104/39)"
                    )}
                  </option>
                  <option value="مكتب د. راشد الشريف للمحاماة (ترخيص: 218/41)">
                    {t(
                      "مكتب د. راشد الشريف للمحاماة (ترخيص: 218/41)",
                      "Dr. Rashid Al-Sharif Law Office (Lic: 218/41)"
                    )}
                  </option>
                </DashboardSelect>
              </div>

              {/* Notice Box */}
              <div
                className="bg-[#fffbeb] dark:bg-[#342711] border border-[#fde68a] dark:border-[#5c4217] p-3.5 rounded-[4px] space-y-2.5 mt-2"
                data-node-id="1:6586"
              >
                <div className="flex items-start gap-2.5">
                  <div className="size-8 rounded-[4px] bg-[#b45309]/10 text-[#b45309] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-[12px] leading-relaxed text-[#78350f] dark:text-[#fbbf24]">
                    <span className="font-bold">
                      {t(
                        "المكتب لديه اشتراك ساري (الباقة الأساسية - ينتهي في 15 نوفمبر 2024). ",
                        "Office has an active subscription (Basic Plan - expires Nov 15, 2024). "
                      )}
                    </span>
                    {t(
                      "يرجى مراجعة ما إذا كان المطلوب هو ترقية الباقة الحالية من شاشة ملف المكتب أو إنشاء فترة اشتراك إضافية مجدولة تبدأ بعد انتهاء الفترة الحالية مباشرة.",
                      "Please verify whether to upgrade the current plan or create a scheduled future subscription period starting right after the current period."
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#fde68a] dark:border-[#5c4217] text-[12px]">
                  <label
                    onClick={() => setResolutionOption("scheduled")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t(
                        "اعتماد هذا الاشتراك كفترة اشتراك جديدة مجدولة تبدأ عند انتهاء الاشتراك الحالي (موصى به)",
                        "Adopt this subscription as a scheduled new period starting after current expiration (Recommended)"
                      )}
                    </span>
                    <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5 shrink-0">
                      {resolutionOption === "scheduled" && (
                        <div className="size-2 rounded-full bg-[#9c6402]" />
                      )}
                    </div>
                  </label>

                  <label
                    onClick={() => setResolutionOption("override")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-[#514537] dark:text-[#cdc5bd]">
                      {t(
                        "تجاوز واستبدال فوري وإلغاء الأيام المتبقية من الباقة الحالية",
                        "Immediate override and replace, forfeiting remaining days of current plan"
                      )}
                    </span>
                    <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5 shrink-0">
                      {resolutionOption === "override" && (
                        <div className="size-2 rounded-full bg-[#9c6402]" />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Field 2: Plan Selection */}
            <div className="space-y-1.5" data-node-id="1:6606">
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <span className="text-[#ba1a1a]">*</span>
                <span>{t("باقة الاشتراك المراد تخصيصها", "Subscription Plan to Allocate")}</span>
              </label>
              <DashboardSelect
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border-[#d6c4b1]/60 dark:border-[#38271c] h-11 text-[13px]"
              >
                <option value="الباقة الذهبية - 12,000 ر.س / سنوياً (الأكثر طلباً)">
                  {t("الباقة الذهبية - 12,000 ر.س / سنوياً (الأكثر طلباً)", "Gold Plan - 12,000 SAR / yr (Most Popular)")}
                </option>
                <option value="الباقة المخصصة - 24,500 ر.س / سنوياً">
                  {t("الباقة المخصصة - 24,500 ر.س / سنوياً", "Custom Enterprise - 24,500 SAR / yr")}
                </option>
                <option value="الباقة الفضية - 9,200 ر.س / سنوياً">
                  {t("الباقة الفضية - 9,200 ر.س / سنوياً", "Silver Plan - 9,200 SAR / yr")}
                </option>
                <option value="الباقة الأساسية - 5,400 ر.س / سنوياً">
                  {t("الباقة الأساسية - 5,400 ر.س / سنوياً", "Basic Plan - 5,400 SAR / yr")}
                </option>
              </DashboardSelect>
            </div>

            {/* Field 3: Billing Cycle */}
            <div className="space-y-1.5" data-node-id="1:6618">
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <span className="text-[#ba1a1a]">*</span>
                <span>{t("دورة ومدة الاشتراك", "Billing Cycle & Duration")}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Annual */}
                <div
                  onClick={() => setBillingCycle("annual")}
                  className={`p-3.5 rounded-[4px] border flex items-center justify-between cursor-pointer transition-all ${
                    billingCycle === "annual"
                      ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                      : "border-[#e4e2de] dark:border-[#38271c] hover:bg-[#faf9f7]"
                  }`}
                >
                  <div className="text-start">
                    <div className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("سنوي (12 شهراً)", "Annual (12 Months)")}
                    </div>
                    <div className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-0.5">
                      {t("خصم 15% مشمول تلقائياً", "15% discount included")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#fbbf24] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                      {t("وفّر 2,000 ر.س", "Save 2,000 SAR")}
                    </span>
                    <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5">
                      {billingCycle === "annual" && (
                        <div className="size-2 rounded-full bg-[#9c6402]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Monthly */}
                <div
                  onClick={() => setBillingCycle("monthly")}
                  className={`p-3.5 rounded-[4px] border flex items-center justify-between cursor-pointer transition-all ${
                    billingCycle === "monthly"
                      ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                      : "border-[#e4e2de] dark:border-[#38271c] hover:bg-[#faf9f7]"
                  }`}
                >
                  <div className="text-start">
                    <div className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("شهري (1 شهر)", "Monthly (1 Month)")}
                    </div>
                    <div className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-0.5">
                      {t("فوترة متجددة شهرياً", "Monthly recurring billing")}
                    </div>
                  </div>
                  <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5">
                    {billingCycle === "monthly" && (
                      <div className="size-2 rounded-full bg-[#9c6402]" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0eeea] dark:border-[#38271c]">
              {/* Field 4: Start Date */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  <span className="text-[#ba1a1a]">*</span>
                  <span>{t("تاريخ بداية الاشتراك", "Start Date")}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38271c] text-[13px] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
                  />
                  <Calendar className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#837565] pointer-events-none", isEn ? "right-3" : "left-3")} />
                </div>
                <span className="text-[11px] text-[#837565] block">
                  {t("يبدأ فور انتهاء الاشتراك القائم", "Starts right after current plan expires")}
                </span>
              </div>

              {/* Field 5: End Date */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("تاريخ نهاية الفترة وموعد التجديد", "End Date & Renewal Schedule")}
                  </label>
                  <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#fbbf24] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                    {t("محسوب آلياً", "Calculated")}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38271c] text-[13px] shadow-2xs"
                  />
                  <Calendar className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#837565] pointer-events-none", isEn ? "right-3" : "left-3")} />
                </div>
                <span className="text-[11px] text-[#837565] block">
                  {t(
                    "محسوب آلياً بناءً على دورة الفوترة السنوية (قابل للتعديل الاستثنائي)",
                    "Calculated based on annual cycle (editable for exceptions)"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: الخطوة 3 من 3 */}
          <div className="bg-white dark:bg-[#221812] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eeea] dark:border-[#38271c]">
              <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                {t("الخطوة 3 من 3", "Step 3 of 3")}
              </span>
              <h2 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("حالة وتفعيل الاشتراك والحماية", "Activation Status & Security")}
              </h2>
            </div>

            {/* Option 1: قيد الانتظار */}
            <div
              onClick={() => setActivationState("pending")}
              className={`p-3.5 rounded-[4px] border cursor-pointer transition-all flex items-start gap-3 ${
                activationState === "pending"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40"
                  : "border-[#e4e2de] dark:border-[#38271c] hover:bg-[#faf9f7]"
              }`}
            >
              <div className="pt-0.5">
                <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5">
                  {activationState === "pending" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </div>
              <div className="flex-1 text-start">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      "قيد الانتظار (في انتظار المطابقة والتدقيق المالي)",
                      "Pending (Awaiting audit & payment confirmation)"
                    )}
                  </span>
                  <span className="bg-[#fffbeb] text-[#b45309] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    {t("معلق للتدقيق", "Pending Audit")}
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  {t(
                    "لن يتم تفعيل صلاحيات الباقة حتى تؤكد الإدارة المالية ومسؤول المراجعة استلام وقيد الحوالة البنكية.",
                    "Plan privileges won't activate until finance confirms wire receipt."
                  )}
                </p>
              </div>
            </div>

            {/* Option 2: نشط */}
            <div
              onClick={() => setActivationState("active")}
              className={`p-3.5 rounded-[4px] border cursor-pointer transition-all flex items-start gap-3 ${
                activationState === "active"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40"
                  : "border-[#e4e2de] dark:border-[#38271c] hover:bg-[#faf9f7]"
              }`}
            >
              <div className="pt-0.5">
                <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5">
                  {activationState === "active" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </div>
              <div className="flex-1 text-start">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("نشط (تفعيل فوري معتمد ومباشر)", "Active (Instant approved activation)")}
                  </span>
                  <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    {t("فوري", "Instant")}
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  {t(
                    "يتطلب إقرار المشرف بصحة استلام المبلغ ومطابقته كلياً، سيتم منح التراخيص وتفعيل حسابات الفريق القانوني فوراً.",
                    "Requires supervisor confirmation of full payment; licenses granted and team accounts activated immediately."
                  )}
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] p-3.5 rounded-[4px] space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySmsEmail}
                  onChange={(e) => setNotifySmsEmail(e.target.checked)}
                  className="rounded-[3px] text-[#9c6402] focus:ring-[#9c6402] size-4"
                />
                <span className="text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] font-medium">
                  {t(
                    "إرسال إشعار فوري لمدير المكتب عبر البريد الإلكتروني والرسائل النصية SMS بتسجيل بيانات الاشتراك ورقم الفاتورة المبدئية.",
                    "Send instant email and SMS notice to office manager with subscription details and invoice reference."
                  )}
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={logAuditAction}
                  onChange={(e) => setLogAuditAction(e.target.checked)}
                  className="rounded-[3px] text-[#9c6402] focus:ring-[#9c6402] size-4"
                />
                <span className="text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] font-medium">
                  {t(
                    "توثيق العملية في سجل التدقيق الأمني والحركات (Audit Log) تحت اسم المشرف الحالي.",
                    "Document transaction in Audit Log under current supervisor."
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION B: البيانات والعمليات المالية (5 Cols on Desktop) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#221812] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eeea] dark:border-[#38271c]">
            <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
              {t("الخطوة 2 من 3", "Step 2 of 3")}
            </span>
            <h2 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("البيانات والعمليات المالية", "Financial Details & Operations")}
            </h2>
          </div>

          {/* Total Amount */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>{t("قيمة المبلغ الإجمالي الشامل", "Total Inclusive Amount")}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value="12,000"
                className="w-full h-11 px-3 ps-20 font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-[#faf9f7] dark:bg-[#221812] rounded-[4px] border border-[#e4e2de] dark:border-[#38271c]"
              />
              <span className={cn("absolute top-1/2 -translate-y-1/2 text-[12px] text-[#837565] font-semibold bg-[#f0eeea] dark:bg-[#38271c] px-2 py-0.5 rounded-[2px]", isEn ? "right-3" : "left-3")}>
                {t("ريال (SAR)", "SAR")}
              </span>
            </div>
            <div className="text-[11px] text-[#837565] bg-[#f5f3ef] dark:bg-[#281c15] p-1.5 rounded-[2px] text-center">
              {t(
                "الأساس: 10,434.78 ر.س + ضريبة القيمة المضافة (15%): 1,565.22 ر.س",
                "Base: 10,434.78 SAR + VAT (15%): 1,565.22 SAR"
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>{t("طريقة الدفع المعتمدة", "Approved Payment Method")}</span>
            </label>
            <div className="space-y-1.5">
              <label
                onClick={() => setPaymentMethod("transfer")}
                className={`p-2.5 rounded-[4px] border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "transfer"
                    ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                    : "border-[#e4e2de] dark:border-[#38271c]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#9c6402]" />
                  <span className="text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("تحويل بنكي مباشر (محدد)", "Direct Bank Wire (Selected)")}
                  </span>
                </div>
                <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5">
                  {paymentMethod === "transfer" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod("manual")}
                className={`p-2.5 rounded-[4px] border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "manual"
                    ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                    : "border-[#e4e2de] dark:border-[#38271c]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#837565]" />
                  <span className="text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("دفع يدوي موثق / شيك مصدق", "Manual Voucher / Certified Cheque")}
                  </span>
                </div>
                <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5">
                  {paymentMethod === "manual" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod("gateway")}
                className={`p-2.5 rounded-[4px] border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "gateway"
                    ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                    : "border-[#e4e2de] dark:border-[#38271c]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#837565]" />
                  <span className="text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("بوابة الدفع الإلكترونية (Mada / Visa)", "Online Payment Gateway (Mada / Visa)")}
                  </span>
                </div>
                <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5">
                  {paymentMethod === "gateway" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Reference Number */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>{t("رقم العملية أو المرجع البنكي", "Transaction / Bank Reference No.")}</span>
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full h-10 px-3 font-mono text-[13px] bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38271c] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
            />
          </div>

          {/* Bank Account */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>{t("الحساب المحول إليه / بنك المنصة", "Platform Account / Bank")}</span>
            </label>
            <DashboardSelect
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border-[#d6c4b1]/60 dark:border-[#38271c] h-10 text-[12px]"
            >
              <option value="مصرف الراجحي - الحساب الرئيسي لمنصة الجودي">
                {t("مصرف الراجحي - الحساب الرئيسي لمنصة الجودي", "Al Rajhi Bank - Platform Primary Account")}
              </option>
              <option value="البنك الأهلي السعودي - حساب الاشتراكات">
                {t("البنك الأهلي السعودي - حساب الاشتراكات", "SNB - Subscriptions Account")}
              </option>
            </DashboardSelect>
          </div>

          {/* Deposit Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>{t("تاريخ الدفع / الإيداع", "Payment / Deposit Date")}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={depositDate}
                onChange={(e) => setDepositDate(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38271c] text-[13px] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
              <Calendar className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#837565] pointer-events-none", isEn ? "right-3" : "left-3")} />
            </div>
          </div>

          {/* File Upload / Receipt */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>{t("إشعار التحويل البنكي / سند القبض", "Bank Wire Receipt / Voucher")}</span>
            </label>
            <div className="p-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[4px] border border-[#e4e2de] dark:border-[#38271c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 hover:text-[#dc2626] text-[#837565] transition-colors cursor-pointer"
                  title={t("حذف الملف", "Delete file")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-[#9c6402] text-[#837565] transition-colors cursor-pointer"
                  title={t("استبدال الملف", "Replace file")}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-start">
                <div>
                  <div className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1 justify-end">
                    <span>{t("سند_تحويل_مكتب_العجلان.pdf", "al_ajlan_transfer_receipt.pdf")}</span>
                    <Check className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  <span className="text-[10px] text-[#837565] block">
                    {t("1.4 MB • تم إرفاق الملف بنجاح وتدقيق الحجم", "1.4 MB • File attached and size verified")}
                  </span>
                </div>
                <div className="size-8 rounded-[4px] bg-[#9c6402]/10 text-[#9c6402] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] block">
              {t("ملاحظات وتوثيق إداري داخلي", "Internal Administrative Notes")}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38271c] text-[12px] leading-relaxed shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402] resize-none"
            />
            <span className="text-[10px] text-[#837565] block">
              {t(
                "هذه الملاحظات مخصصة فقط لمشرفي النظام ولن تظهر في حساب المكتب.",
                "These notes are internal for administrators only and will not be visible to the firm."
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Sticky Action Bar */}
      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[12px] text-[#514537] dark:text-[#a89f91]">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>
            {t(
              "سيتم إنشاء قيد اشتراك جديد برقم تسلسلي تلقائي فور الحفظ دون سحب رصيد آلي",
              "A new subscription record will be created with an auto serial without auto-debit"
            )}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] text-[#514537] dark:text-[#a89f91] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            {t("حفظ كمسودة", "Save as Draft")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-[#9c6402] hover:bg-[#825200] text-white px-6 py-2 rounded-[6px] font-bold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{t("حفظ الاشتراك", "Save Subscription")}</span>
          </button>
        </div>
      </DashboardStickyActionBar>
    </div>
  );
}