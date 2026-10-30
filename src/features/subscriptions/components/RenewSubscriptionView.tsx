"use client";

import React, { useState } from "react";
import {
  ArrowRight,
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
  // Form States
  const [selectedOffice, setSelectedOffice] = useState(
    subscription?.firm.name ||
      "مكتب د. خالد بن عبد العزيز العجلان للمحاماة والاستشارات (ترخيص: 38/412)"
  );
  const [resolutionOption, setResolutionOption] = useState<"scheduled" | "override">("scheduled");
  const [selectedPlan, setSelectedPlan] = useState("الباقة الذهبية - 12,000 ر.س / سنوياً (الأكثر طلباً)");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [startDate, setStartDate] = useState("15 نوفمبر 2024");
  const [endDate, setEndDate] = useState("14 نوفمبر 2025");
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "manual" | "gateway">("transfer");
  const [referenceNumber, setReferenceNumber] = useState("TRX-BNK-982341-SA");
  const [bankAccount, setBankAccount] = useState("مصرف الراجحي - الحساب الرئيسي لمنصة الجودي");
  const [depositDate, setDepositDate] = useState("24 أكتوبر 2024");
  const [activationState, setActivationState] = useState<"pending" | "active">("pending");
  const [notifySmsEmail, setNotifySmsEmail] = useState(true);
  const [logAuditAction, setLogAuditAction] = useState(true);
  const [notes, setNotes] = useState(
    "تم الاتفاق هاتفياً مع المشرف الإداري للمكتب، وتم استلام تأكيد التحويل من الإدارة المالية واعتماد الخصم السنوي."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("تم حفظ وتجديد الاشتراك بنجاح");
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    }, 600);
  };

  return (
    <div
      className="flex flex-col gap-6 w-full font-['Cairo'] pb-12 animate-in fade-in duration-200"
      dir="rtl"
      data-node-id="1:6544"
      data-name="إضافة اشتراك / تجديد اشتراك المكتب"
    >
      {/* Main Identity & Command Banner (Figma 1:6547) */}
      <div
        className="bg-white dark:bg-[#1e1c1a] flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full gap-4"
        data-node-id="1:6547"
      >
        <div className="flex flex-col items-start text-right">
          <h1 className="font-['Cairo'] font-bold text-[28px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
            إضافة اشتراك / تجديد اشتراك المكتب
          </h1>
          <p className="font-['Cairo'] font-normal text-[14px] text-[#514537] dark:text-[#a89f91] mt-0.5 leading-[22px]">
            تسجيل اشتراك لمكتب محاماة بعد الاتفاق على الباقة والتحقق من تفاصيل الدفع.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="bg-white dark:bg-[#2c2621] hover:bg-[#faf9f7] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e4e2de] dark:border-[#38332c] px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
          data-node-id="1:6550"
        >
          <span>العودة </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Dynamic Form (2 Columns Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" data-node-id="1:6563">
        {/* SECTION A: بيانات المكتب والباقة القانونية (7 Cols on Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-6" data-node-id="1:6564">
          {/* Card 1: الخطوة 1 من 3 */}
          <div className="bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eeea] dark:border-[#2f2a24]">
              <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                الخطوة 1 من 3
              </span>
              <h2 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                بيانات المكتب والباقة القانونية
              </h2>
            </div>

            {/* Field 1: Office Selection */}
            <div className="space-y-1.5" data-node-id="1:6572">
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <span className="text-[#ba1a1a]">*</span>
                <span>المكتب المعتمد</span>
              </label>
              <div className="relative">
                <select
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  className="w-full h-11 px-3 pe-10 bg-white dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] text-[13px] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
                >
                  <option value="مكتب د. خالد بن عبد العزيز العجلان للمحاماة والاستشارات (ترخيص: 38/412)">
                    مكتب د. خالد بن عبد العزيز العجلان للمحاماة والاستشارات (ترخيص: 38/412)
                  </option>
                  <option value="شركة التميمي ومشاركوه للمحاماة (ترخيص: 104/39)">
                    شركة التميمي ومشاركوه للمحاماة (ترخيص: 104/39)
                  </option>
                  <option value="مكتب د. راشد الشريف للمحاماة (ترخيص: 218/41)">
                    مكتب د. راشد الشريف للمحاماة (ترخيص: 218/41)
                  </option>
                </select>
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c6402] pointer-events-none" />
              </div>

              {/* Notice Box: Active Subscription Resolution */}
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
                      المكتب لديه اشتراك ساري (الباقة الأساسية - ينتهي في 15 نوفمبر 2024).{" "}
                    </span>
                    يرجى مراجعة ما إذا كان المطلوب هو ترقية الباقة الحالية من شاشة ملف المكتب أو إنشاء فترة اشتراك إضافية مجدولة تبدأ بعد انتهاء الفترة الحالية مباشرة.
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#fde68a] dark:border-[#5c4217] text-[12px]">
                  <label
                    onClick={() => setResolutionOption("scheduled")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      اعتماد هذا الاشتراك كفترة اشتراك جديدة مجدولة تبدأ عند انتهاء الاشتراك الحالي (موصى به)
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
                    <span className="text-[#514537] dark:text-[#d1c9bd]">
                      تجاوز واستبدال فوري وإلغاء الأيام المتبقية من الباقة الحالية
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
                <span>باقة الاشتراك المراد تخصيصها</span>
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full h-11 px-3 bg-white dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] text-[13px] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
              >
                <option value="الباقة الذهبية - 12,000 ر.س / سنوياً (الأكثر طلباً)">
                  الباقة الذهبية - 12,000 ر.س / سنوياً (الأكثر طلباً)
                </option>
                <option value="الباقة المخصصة - 24,500 ر.س / سنوياً">
                  الباقة المخصصة - 24,500 ر.س / سنوياً
                </option>
                <option value="الباقة الفضية - 9,200 ر.س / سنوياً">
                  الباقة الفضية - 9,200 ر.س / سنوياً
                </option>
                <option value="الباقة الأساسية - 5,400 ر.س / سنوياً">
                  الباقة الأساسية - 5,400 ر.س / سنوياً
                </option>
              </select>
            </div>

            {/* Field 3: Billing Cycle Pills */}
            <div className="space-y-1.5" data-node-id="1:6618">
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <span className="text-[#ba1a1a]">*</span>
                <span>دورة ومدة الاشتراك</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Annual */}
                <div
                  onClick={() => setBillingCycle("annual")}
                  className={`p-3.5 rounded-[4px] border flex items-center justify-between cursor-pointer transition-all ${
                    billingCycle === "annual"
                      ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                      : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
                  }`}
                >
                  <div className="text-right">
                    <div className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      سنوي (12 شهراً)
                    </div>
                    <div className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-0.5">
                      خصم 15% مشمول تلقائياً
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#fbbf24] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                      وفّر 2,000 ر.س
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
                      : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
                  }`}
                >
                  <div className="text-right">
                    <div className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      شهري (1 شهر)
                    </div>
                    <div className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-0.5">
                      فوترة متجددة شهرياً
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

            {/* Dates Row (Field 4 & 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24]">
              {/* Field 4: Start Date */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  <span className="text-[#ba1a1a]">*</span>
                  <span>تاريخ بداية الاشتراك</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] text-[13px] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#837565] pointer-events-none" />
                </div>
                <span className="text-[11px] text-[#837565] block">
                  يبدأ فور انتهاء الاشتراك القائم
                </span>
              </div>

              {/* Field 5: End Date (Calculated) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#fbbf24] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                    محسوب آلياً
                  </span>
                  <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    تاريخ نهاية الفترة وموعد التجديد
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] text-[13px] shadow-2xs"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#837565] pointer-events-none" />
                </div>
                <span className="text-[11px] text-[#837565] block">
                  محسوب آلياً بناءً على دورة الفوترة السنوية (قابل للتعديل الاستثنائي)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: الخطوة 3 من 3 (حالة وتفعيل الاشتراك والحماية) */}
          <div className="bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eeea] dark:border-[#2f2a24]">
              <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                الخطوة 3 من 3
              </span>
              <h2 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                حالة وتفعيل الاشتراك والحماية
              </h2>
            </div>

            {/* Option 1: قيد الانتظار */}
            <div
              onClick={() => setActivationState("pending")}
              className={`p-3.5 rounded-[4px] border cursor-pointer transition-all flex items-start gap-3 ${
                activationState === "pending"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40"
                  : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
              }`}
            >
              <div className="pt-0.5">
                <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5">
                  {activationState === "pending" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    قيد الانتظار (في انتظار المطابقة والتدقيق المالي)
                  </span>
                  <span className="bg-[#fffbeb] text-[#b45309] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    معلق للتدقيق
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  لن يتم تفعيل صلاحيات الباقة حتى تؤكد الإدارة المالية ومسؤول المراجعة استلام وقيد الحوالة البنكية.
                </p>
              </div>
            </div>

            {/* Option 2: نشط (تفعيل فوري) */}
            <div
              onClick={() => setActivationState("active")}
              className={`p-3.5 rounded-[4px] border cursor-pointer transition-all flex items-start gap-3 ${
                activationState === "active"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40"
                  : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
              }`}
            >
              <div className="pt-0.5">
                <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5">
                  {activationState === "active" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    نشط (تفعيل فوري معتمد ومباشر)
                  </span>
                  <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    فوري
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  يتطلب إقرار المشرف بصحة استلام المبلغ ومطابقته كلياً، سيتم منح التراخيص وتفعيل حسابات الفريق القانوني فوراً.
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-3.5 rounded-[4px] space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySmsEmail}
                  onChange={(e) => setNotifySmsEmail(e.target.checked)}
                  className="rounded-[3px] text-[#9c6402] focus:ring-[#9c6402] size-4"
                />
                <span className="text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] font-medium">
                  إرسال إشعار فوري لمدير المكتب عبر البريد الإلكتروني والرسائل النصية SMS بتسجيل بيانات الاشتراك ورقم الفاتورة المبدئية.
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
                  توثيق العملية في سجل التدقيق الأمني والحركات (Audit Log) تحت اسم المشرف الحالي (م. عبد العزيز بن فهد).
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION B: البيانات والعمليات المالية (5 Cols on Desktop) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eeea] dark:border-[#2f2a24]">
            <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
              الخطوة 2 من 3
            </span>
            <h2 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
              البيانات والعمليات المالية
            </h2>
          </div>

          {/* Total Amount */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>قيمة المبلغ الإجمالي الشامل</span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value="12,000"
                className="w-full h-11 px-3 ps-20 font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-[#faf9f7] dark:bg-[#25221e] rounded-[4px] border border-[#e4e2de] dark:border-[#38332c]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#837565] font-semibold bg-[#f0eeea] dark:bg-[#38332c] px-2 py-0.5 rounded-[2px]">
                ريال (SAR)
              </span>
            </div>
            <div className="text-[11px] text-[#837565] bg-[#f5f3ef] dark:bg-[#2c2621] p-1.5 rounded-[2px] text-center">
              الأساس: 10,434.78 ر.س + ضريبة القيمة المضافة (15%): 1,565.22 ر.س
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>طريقة الدفع المعتمدة</span>
            </label>
            <div className="space-y-1.5">
              <label
                onClick={() => setPaymentMethod("transfer")}
                className={`p-2.5 rounded-[4px] border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "transfer"
                    ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                    : "border-[#e4e2de] dark:border-[#38332c]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#9c6402]" />
                  <span className="text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    تحويل بنكي مباشر (محدد)
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
                    : "border-[#e4e2de] dark:border-[#38332c]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#837565]" />
                  <span className="text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    دفع يدوي موثق / شيك مصدق
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
                    : "border-[#e4e2de] dark:border-[#38332c]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#837565]" />
                  <span className="text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    بوابة الدفع الإلكترونية (Mada / Visa)
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
              <span>رقم العملية أو المرجع البنكي</span>
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full h-10 px-3 font-mono text-[13px] bg-white dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
            />
          </div>

          {/* Bank Account */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>الحساب المحول إليه / بنك المنصة</span>
            </label>
            <select
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] text-[12px] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
            >
              <option value="مصرف الراجحي - الحساب الرئيسي لمنصة الجودي">
                مصرف الراجحي - الحساب الرئيسي لمنصة الجودي
              </option>
              <option value="البنك الأهلي السعودي - حساب الاشتراكات">
                البنك الأهلي السعودي - حساب الاشتراكات
              </option>
            </select>
          </div>

          {/* Deposit Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>تاريخ الدفع / الإيداع</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={depositDate}
                onChange={(e) => setDepositDate(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] text-[13px] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#837565] pointer-events-none" />
            </div>
          </div>

          {/* File Upload / Receipt */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span className="text-[#ba1a1a]">*</span>
              <span>إشعار التحويل البنكي / سند القبض</span>
            </label>
            <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[4px] border border-[#e4e2de] dark:border-[#38332c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 hover:text-[#dc2626] text-[#837565] transition-colors cursor-pointer"
                  title="حذف الملف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-[#9c6402] text-[#837565] transition-colors cursor-pointer"
                  title="استبدال الملف"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <div className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1 justify-end">
                    <span>سند_تحويل_مكتب_العجلان.pdf</span>
                    <Check className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  <span className="text-[10px] text-[#837565] block">
                    1.4 MB • تم إرفاق الملف بنجاح وتدقيق الحجم
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
              ملاحظات وتوثيق إداري داخلي
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border border-[#d6c4b1]/60 dark:border-[#38332c] text-[12px] leading-relaxed shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9c6402] resize-none"
            />
            <span className="text-[10px] text-[#837565] block">
              هذه الملاحظات مخصصة فقط لمشرفي النظام ولن تظهر في حساب المكتب.
            </span>
          </div>
        </div>
      </div>

      {/* Floating Sticky Action Bar */}
      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[12px] text-[#514537] dark:text-[#a89f91]">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>سيتم إنشاء قيد اشتراك جديد برقم تسلسلي تلقائي فور الحفظ دون سحب رصيد آلي</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] text-[#514537] dark:text-[#a89f91] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            حفظ كمسودة
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-[#9c6402] hover:bg-[#825200] text-white px-6 py-2 rounded-[6px] font-bold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الاشتراك</span>
          </button>
        </div>
      </DashboardStickyActionBar>
    </div>
  );
}
