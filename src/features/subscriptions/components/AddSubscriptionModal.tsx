"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubscriptionSchema, CreateSubscriptionInput } from "../schemas/subscription.schemas";
import { X, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { createFirm } from "@/lib/api/firms";
import { ApiError } from "@/lib/api/http";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: CreateSubscriptionInput) => void;
}

export function AddSubscriptionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: AddSubscriptionModalProps) {
  const { t } = useLanguage();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<CreateSubscriptionInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      planName: "الباقة الذهبية",
      billingCycle: "سنوية",
      paymentMethod: "mada",
      city: "الرياض",
    },
  });

  if (!isOpen) return null;

  const onFormSubmit: SubmitHandler<CreateSubscriptionInput> = (values) => {
    setServerErrors({});
    setPendingValues(values);
    setShowConfirmDialog(true);
  };

  const handleExecuteCreate = async () => {
    if (!pendingValues) return;
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setServerErrors({});

    try {
      await createFirm({
        name: pendingValues.firmName,
        license_number: pendingValues.licenseNumber,
        city: pendingValues.city,
        owner_name: pendingValues.ownerName,
        email: pendingValues.email,
        phone: pendingValues.phone,
        plan_name: pendingValues.planName,
        plan_type: "paid",
        billing_cycle: pendingValues.billingCycle === "سنوية" ? "yearly" : "monthly",
        tax_number: pendingValues.taxNumber || undefined,
      });

      toast.success(t("تم تسجيل طلب الاشتراك بنجاح", "Subscription request registered successfully"));
      reset();
      onClose();
      onSubmitSuccess(pendingValues);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 422 && typeof err.body === "object" && err.body !== null) {
        const bodyObj = err.body as { errors?: Record<string, string[]> };
        if (bodyObj.errors) {
          const mappedErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(bodyObj.errors)) {
            if (msgs && msgs.length > 0) {
              mappedErrors[key] = msgs[0];
            }
          }
          setServerErrors(mappedErrors);
        }
      }
      const message = err instanceof Error ? err.message : t("حدث خطأ أثناء حفظ الاشتراك", "Error saving subscription");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ModalPortal isOpen={isOpen}>
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) onClose();
          }}
        >
          <div
            className="bg-white dark:bg-[#221812] rounded-[12px] shadow-2xl border border-[#f0eeea] dark:border-[#38271c] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 font-['Cairo']"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#f0eeea] dark:border-[#38271c] bg-[#faf9f7] dark:bg-[#221812]">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-[8px] bg-[#9c6402]/10 text-[#9c6402] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("إضافة اشتراك جديد", "Add New Subscription")}
                  </h2>
                  <p className="text-[12px] text-[#514537] dark:text-[#a89f91]">
                    {t(
                      "تسجيل مكتب محاماة وتعيين باقة الاشتراك ودورة الفوترة",
                      "Register law firm and assign subscription plan & billing cycle"
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="p-1 rounded-full text-[#837565] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Firm Name */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("اسم مكتب المحاماة *", "Law Firm Name *")}
                  </label>
                  <input
                    type="text"
                    {...register("firmName")}
                    placeholder={t("مكتب العجلان للمحاماة", "Al-Ajlan Law Firm")}
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                  />
                  {(errors.firmName || serverErrors.name) && (
                    <span className="text-[11px] text-[#dc2626] mt-1 block">
                      {errors.firmName?.message || serverErrors.name}
                    </span>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("رقم الترخيص العدلي *", "Ministry License Number *")}
                  </label>
                  <input
                    type="text"
                    {...register("licenseNumber")}
                    placeholder="38/412"
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                  />
                  {(errors.licenseNumber || serverErrors.license_number) && (
                    <span className="text-[11px] text-[#dc2626] mt-1 block">
                      {errors.licenseNumber?.message || serverErrors.license_number}
                    </span>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("المدينة الرئيسية *", "Main City *")}
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    placeholder={t("الرياض", "Riyadh")}
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                  />
                  {(errors.city || serverErrors.city) && (
                    <span className="text-[11px] text-[#dc2626] mt-1 block">
                      {errors.city?.message || serverErrors.city}
                    </span>
                  )}
                </div>

                {/* Owner/Director Name */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("اسم المدير المسؤول *", "Managing Director Name *")}
                  </label>
                  <input
                    type="text"
                    {...register("ownerName")}
                    placeholder={t("د. عبد الرحمن آل ناصر", "Dr. Abdulrahman Al-Nasser")}
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                  />
                  {(errors.ownerName || serverErrors.owner_name) && (
                    <span className="text-[11px] text-[#dc2626] mt-1 block">
                      {errors.ownerName?.message || serverErrors.owner_name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("البريد الإلكتروني المعتمد *", "Official Email *")}
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="info@lawfirm.sa"
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                  />
                  {(errors.email || serverErrors.email) && (
                    <span className="text-[11px] text-[#dc2626] mt-1 block">
                      {errors.email?.message || serverErrors.email}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("رقم الهاتف الموثق *", "Verified Phone Number *")}
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="+966 50 123 4567"
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                  />
                  {(errors.phone || serverErrors.phone) && (
                    <span className="text-[11px] text-[#dc2626] mt-1 block">
                      {errors.phone?.message || serverErrors.phone}
                    </span>
                  )}
                </div>

                {/* Plan Name */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("نوع الباقة *", "Plan Type *")}
                  </label>
                  <DashboardSelect
                    value={watch("planName")}
                    onChange={(e) => setValue("planName", e.target.value)}
                    className="h-10 rounded-[6px]"
                  >
                    <option value="الباقة المخصصة">{t("الباقة المخصصة (Custom - 24,500 ر.س)", "Enterprise Plan (Custom - 24,500 SAR)")}</option>
                    <option value="الباقة الذهبية">{t("الباقة الذهبية (12,000 ر.س)", "Gold Plan (12,000 SAR)")}</option>
                    <option value="الباقة الفضية">{t("الباقة الفضية (9,200 ر.س)", "Silver Plan (9,200 SAR)")}</option>
                    <option value="الباقة الأساسية">{t("الباقة الأساسية (5,400 ر.س)", "Basic Plan (5,400 SAR)")}</option>
                  </DashboardSelect>
                </div>

                {/* Billing Cycle */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("دورة الفوترة *", "Billing Cycle *")}
                  </label>
                  <DashboardSelect
                    value={watch("billingCycle")}
                    onChange={(e) => setValue("billingCycle", e.target.value as "سنوية" | "شهرية")}
                    className="h-10 rounded-[6px]"
                  >
                    <option value="سنوية">{t("سنوية (توفير 15%)", "Annual (Save 15%)")}</option>
                    <option value="شهرية">{t("شهرية", "Monthly")}</option>
                  </DashboardSelect>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("وسيلة الدفع *", "Payment Method *")}
                  </label>
                  <DashboardSelect
                    value={watch("paymentMethod")}
                    onChange={(e) => setValue("paymentMethod", e.target.value as "transfer" | "mada" | "visa" | "sadad")}
                    className="h-10 rounded-[6px]"
                  >
                    <option value="mada">{t("بطاقة مدى البنكية", "Mada Debit Card")}</option>
                    <option value="visa">VISA / Mastercard</option>
                    <option value="sadad">{t("نظام سداد للمدفوعات", "Sadad Payment System")}</option>
                    <option value="transfer">{t("تحويل بنكي مباشر", "Direct Bank Transfer")}</option>
                  </DashboardSelect>
                </div>

                {/* Tax Number */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("الرقم الضريبي للمكتب (ZATCA)", "Office Tax Number (ZATCA)")}
                  </label>
                  <input
                    type="text"
                    {...register("taxNumber")}
                    placeholder="301298457200003"
                    className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                  />
                  {serverErrors.tax_number && (
                    <span className="text-[11px] text-[#dc2626] mt-1 block">
                      {serverErrors.tax_number}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f0eeea] dark:border-[#38271c]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-[6px] text-[13px] font-semibold text-[#514537] dark:text-[#a89f91] hover:bg-[#f0eeea] dark:hover:bg-[#281c15] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {t("إلغاء", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#9c6402] hover:bg-[#825200] text-white px-5 py-2 rounded-[6px] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                  <span>{t("إنشاء وتفعيل الاشتراك", "Create & Activate Subscription")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>

      <LuxuryAlertDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleExecuteCreate}
        title={t("تأكيد تسجيل الاشتراك", "Confirm Subscription Registration")}
        description={t(
          `هل أنت متأكد من تسجيل واشتراك مكتب "${pendingValues?.firmName}" في ${pendingValues?.planName}؟`,
          `Are you sure you want to register and subscribe "${pendingValues?.firmName}" to ${pendingValues?.planName}?`
        )}
        confirmLabel={t("تأكيد التسجيل", "Confirm Registration")}
        cancelLabel={t("تراجع", "Cancel")}
        variant="info"
      />
    </>
  );
}
