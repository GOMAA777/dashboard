"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Building2, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { usePlansQuery } from "@/features/plans/hooks/usePlansQuery";
import { mapPlansResponse } from "@/lib/api/mappers";
import { createFirm, updateFirm, type FirmPlanType } from "@/lib/api/firms";
import { ApiError } from "@/lib/api/http";
import { unwrapData } from "@/lib/api/helpers";
import {
  getCreateSubscriptionSchema,
  toApiLandline,
  toApiMobile,
  type CreateSubscriptionInput,
} from "../schemas/subscription.schemas";

const PLAN_TYPES = new Set<FirmPlanType>([
  "trial",
  "basic",
  "professional",
  "enterprise",
  "paid",
]);

const API_FIELD_MAP: Record<string, keyof CreateSubscriptionInput> = {
  name: "firmName",
  license_number: "licenseNumber",
  city: "city",
  owner_name: "ownerName",
  email: "email",
  phone: "phone",
  landline: "landline",
  address: "address",
  password: "password",
  plan_id: "planId",
  plan_type: "planId",
  billing_cycle: "billingCycle",
  tax_number: "taxNumber",
};

const inputClass =
  "w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none disabled:opacity-60";

interface AddSubscriptionViewProps {
  onBack: () => void;
  onSuccess?: () => void;
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
        {label}
      </label>
      {children}
      {error ? <span className="text-[11px] text-[#dc2626] mt-1 block">{error}</span> : null}
    </div>
  );
}

function resolvePlanType(type?: string): FirmPlanType {
  const value = (type || "").toLowerCase();
  if (value === "free_trial") return "trial";
  if (PLAN_TYPES.has(value as FirmPlanType)) return value as FirmPlanType;
  return "paid";
}

function readCreatedFirmId(payload: unknown): string {
  const unwrapped = (unwrapData<Record<string, unknown>>(payload) || payload) as Record<string, unknown>;
  const firm = (unwrapped?.firm || unwrapped?.data || unwrapped) as Record<string, unknown>;
  const id = firm?.id ?? unwrapped?.id;
  return id == null ? "" : String(id);
}

function applyServerFieldErrors(
  body: unknown,
  setError: (name: keyof CreateSubscriptionInput, error: { type: string; message: string }) => void
) {
  if (typeof body !== "object" || body === null || !("errors" in body)) return false;
  const errors = (body as { errors?: unknown }).errors;
  if (typeof errors !== "object" || errors === null) return false;

  let applied = false;
  for (const [key, raw] of Object.entries(errors as Record<string, unknown>)) {
    const leaf = key.split(".").pop() || key;
    const field = API_FIELD_MAP[leaf];
    const message = Array.isArray(raw) ? String(raw[0] ?? "") : typeof raw === "string" ? raw : "";
    if (!field || !message) continue;
    setError(field, { type: "server", message });
    applied = true;
  }
  return applied;
}

export function AddSubscriptionView({ onBack, onSuccess }: AddSubscriptionViewProps) {
  const { t, direction, isEn } = useLanguage();
  const plansQuery = usePlansQuery();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<CreateSubscriptionInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submittingRef = useRef(false);

  const plans = useMemo(() => {
    if (!plansQuery.data) return [];
    const mapped = mapPlansResponse(plansQuery.data);
    const active = mapped.filter((plan) => plan.isActive);
    return active.length > 0 ? active : mapped;
  }, [plansQuery.data]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(getCreateSubscriptionSchema(isEn)),
    defaultValues: {
      firmName: "",
      licenseNumber: "",
      city: "",
      ownerName: "",
      email: "",
      phone: "",
      landline: "",
      address: "",
      password: "",
      planId: "",
      billingCycle: "yearly",
      taxNumber: "",
    },
  });

  const planId = watch("planId");
  const billingCycle = watch("billingCycle");

  useEffect(() => {
    if (planId || plans.length === 0) return;
    setValue("planId", plans[0].id);
  }, [planId, plans, setValue]);

  const selectedPlan = plans.find((plan) => plan.id === planId) ?? null;

  const onFormSubmit: SubmitHandler<CreateSubscriptionInput> = (values) => {
    const numericPlanId = Number(values.planId);
    if (!Number.isInteger(numericPlanId) || numericPlanId <= 0) {
      setError("planId", {
        type: "manual",
        message: t("معرّف الباقة القادم من الخادم غير صالح", "Plan id returned by the server is invalid"),
      });
      return;
    }
    setPendingValues(values);
    setShowConfirmDialog(true);
  };

  const handleExecuteCreate = async () => {
    if (!pendingValues || submittingRef.current) return;
    submittingRef.current = true;
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    const plan = plans.find((item) => item.id === pendingValues.planId);
    const taxNumber = pendingValues.taxNumber.trim();

    try {
      const created = await createFirm({
        name: pendingValues.firmName.trim(),
        license_number: pendingValues.licenseNumber.trim(),
        city: pendingValues.city.trim(),
        owner_name: pendingValues.ownerName.trim(),
        email: pendingValues.email.trim(),
        phone: toApiMobile(pendingValues.phone),
        landline: toApiLandline(pendingValues.landline),
        address: pendingValues.address.trim(),
        password: pendingValues.password,
        plan_id: Number(pendingValues.planId),
        plan_type: resolvePlanType(plan?.type),
        billing_cycle: pendingValues.billingCycle,
      });

      const firmId = readCreatedFirmId(created);
      let taxSaved = !taxNumber;
      if (taxNumber) {
        if (!firmId) {
          toast.error(
            t(
              "تم إنشاء الاشتراك، وتعذر ربط الرقم الضريبي لأن الخادم لم يُرجع رقم المكتب",
              "Subscription was created, but the tax number could not be saved because the server did not return an office id"
            )
          );
        } else {
          try {
            await updateFirm(firmId, {
              name: pendingValues.firmName.trim(),
              phone: toApiMobile(pendingValues.phone),
              city: pendingValues.city.trim(),
              tax_number: taxNumber,
            });
            taxSaved = true;
          } catch (taxError: unknown) {
            const taxMessage =
              taxError instanceof Error
                ? taxError.message
                : t("تعذر حفظ الرقم الضريبي", "Could not save the tax number");
            toast.error(
              t(
                `تم إنشاء الاشتراك، وتعذر حفظ الرقم الضريبي: ${taxMessage}`,
                `Subscription was created, but the tax number was not saved: ${taxMessage}`
              )
            );
          }
        }
      }

      if (taxSaved) {
        toast.success(t("تم تسجيل طلب الاشتراك بنجاح", "Subscription request registered successfully"));
      }
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      const status = err instanceof ApiError ? err.status : 0;
      const fieldsApplied =
        err instanceof ApiError && err.status === 422 && applyServerFieldErrors(err.body, setError);
      const raw = err instanceof Error ? err.message : "";
      const generic = !raw || raw.startsWith("API error");
      const message = fieldsApplied
        ? t("تحقق من الحقول وأعد المحاولة", "Check the fields and try again")
        : status === 403
          ? t("ليست لديك صلاحية لإضافة اشتراك", "You do not have permission to add a subscription")
          : status === 404
            ? t("تعذر العثور على مورد إنشاء الاشتراك", "Subscription creation resource was not found")
            : status === 500 && generic
              ? t("حدث خطأ في الخادم. حاول مرة أخرى.", "A server error occurred. Try again.")
              : raw || t("حدث خطأ أثناء حفظ الاشتراك", "Error saving subscription");
      toast.error(message);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const priceLabel = (() => {
    if (!selectedPlan) return "";
    const amount = billingCycle === "yearly" ? selectedPlan.annualPrice ?? selectedPlan.monthlyPrice : selectedPlan.monthlyPrice;
    const formatted = new Intl.NumberFormat(isEn ? "en-US" : "ar-SA", {
      maximumFractionDigits: 0,
    }).format(amount);
    return isEn ? `${formatted} SAR` : `${formatted} ر.س`;
  })();

  return (
    <div
      dir={direction}
      className="flex flex-col gap-6 w-full font-['Cairo'] pb-2 sm:pb-3 animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#221812] flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-[8px] bg-[#9c6402]/10 text-[#9c6402] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start text-start">
            <h1 className="font-['Cairo'] font-bold text-[28px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
              {t("إضافة اشتراك جديد", "Add New Subscription")}
            </h1>
            <p className="font-['Cairo'] font-normal text-[14px] text-[#514537] dark:text-[#a89f91] mt-0.5 leading-[22px]">
              {t(
                "تسجيل مكتب محاماة وتعيين باقة الاشتراك ودورة الفوترة",
                "Register a law firm and assign the subscription plan and billing cycle"
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-white dark:bg-[#281c15] hover:bg-[#faf9f7] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e4e2de] dark:border-[#38271c] px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className={cn("w-4 h-4", !isEn && "rotate-180")} />
          <span>{t("العودة", "Back")}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
        <section className="bg-white dark:bg-[#221812] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <h2 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] pb-3 mb-4 border-b border-[#f0eeea] dark:border-[#38271c]">
            {t("بيانات المكتب", "Office details")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t("اسم مكتب المحاماة *", "Law Firm Name *")} error={errors.firmName?.message}>
              <input
                type="text"
                {...register("firmName")}
                disabled={isSubmitting}
                placeholder={t("مكتب العجلان للمحاماة", "Al-Ajlan Law Firm")}
                className={inputClass}
              />
            </Field>
            <Field label={t("رقم الترخيص العدلي *", "Ministry License Number *")} error={errors.licenseNumber?.message}>
              <input
                type="text"
                {...register("licenseNumber")}
                disabled={isSubmitting}
                placeholder="38/412"
                className={inputClass}
              />
            </Field>
            <Field label={t("المدينة الرئيسية *", "Main City *")} error={errors.city?.message}>
              <input
                type="text"
                {...register("city")}
                disabled={isSubmitting}
                placeholder={t("الرياض", "Riyadh")}
                className={inputClass}
              />
            </Field>
            <Field label={t("اسم المدير المسؤول *", "Managing Director Name *")} error={errors.ownerName?.message}>
              <input
                type="text"
                {...register("ownerName")}
                disabled={isSubmitting}
                placeholder={t("د. عبد الرحمن آل ناصر", "Dr. Abdulrahman Al-Nasser")}
                className={inputClass}
              />
            </Field>
            <Field
              label={t("العنوان الوطني *", "National Address *")}
              error={errors.address?.message}
              className="md:col-span-2"
            >
              <input
                type="text"
                {...register("address")}
                disabled={isSubmitting}
                placeholder={t(
                  "طريق الملك فهد، حي الصحافة، برج النخبة - الطابق 14",
                  "King Fahd Road, Al-Sahafa, Al-Nokhba Tower - Floor 14"
                )}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="bg-white dark:bg-[#221812] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <h2 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] pb-3 mb-4 border-b border-[#f0eeea] dark:border-[#38271c]">
            {t("بيانات التواصل وحساب الدخول", "Contact and login")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t("البريد الإلكتروني المعتمد *", "Official Email *")} error={errors.email?.message}>
              <input
                type="email"
                {...register("email")}
                disabled={isSubmitting}
                placeholder="info@lawfirm.sa"
                className={inputClass}
                autoComplete="off"
              />
            </Field>
            <Field label={t("رقم الجوال الموثق *", "Verified Mobile Number *")} error={errors.phone?.message}>
              <input
                type="text"
                {...register("phone")}
                disabled={isSubmitting}
                placeholder="+966501234567"
                className={inputClass}
              />
            </Field>
            <Field label={t("الهاتف الأرضي للمكتب *", "Office Landline *")} error={errors.landline?.message}>
              <input
                type="text"
                {...register("landline")}
                disabled={isSubmitting}
                placeholder="0114829900"
                className={inputClass}
              />
            </Field>
            <Field label={t("كلمة مرور حساب المكتب *", "Office Account Password *")} error={errors.password?.message}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={isSubmitting}
                  placeholder={t("9 أحرف على الأقل مع رقم ورمز", "At least 9 characters, a digit and a symbol")}
                  autoComplete="new-password"
                  className={cn(inputClass, "pe-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 end-0 px-3 text-[#837565] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                  aria-label={showPassword ? t("إخفاء كلمة المرور", "Hide password") : t("إظهار كلمة المرور", "Show password")}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          </div>
        </section>

        <section className="bg-white dark:bg-[#221812] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <h2 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] pb-3 mb-4 border-b border-[#f0eeea] dark:border-[#38271c]">
            {t("الباقة والفوترة", "Plan and billing")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t("نوع الباقة *", "Plan *")} error={errors.planId?.message}>
              {plansQuery.isError ? (
                <button
                  type="button"
                  onClick={() => void plansQuery.refetch()}
                  className="w-full h-10 px-3 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] text-[13px] text-[#9c6402] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("تعذر تحميل الباقات، إعادة المحاولة", "Could not load plans, retry")}
                </button>
              ) : (
                <DashboardSelect
                  value={planId}
                  disabled={isSubmitting || plansQuery.isLoading || plans.length === 0}
                  onChange={(event) => setValue("planId", event.target.value, { shouldValidate: true })}
                  className="h-10 rounded-[6px]"
                >
                  {plansQuery.isLoading ? (
                    <option value="">{t("جاري تحميل الباقات...", "Loading plans...")}</option>
                  ) : plans.length === 0 ? (
                    <option value="">{t("لا توجد باقات متاحة", "No plans available")}</option>
                  ) : (
                    plans.map((plan) => {
                      const amount =
                        billingCycle === "yearly" ? plan.annualPrice ?? plan.monthlyPrice : plan.monthlyPrice;
                      const formatted = new Intl.NumberFormat(isEn ? "en-US" : "ar-SA", {
                        maximumFractionDigits: 0,
                      }).format(amount);
                      const price = isEn ? `${formatted} SAR` : `${formatted} ر.س`;
                      return (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} ({price})
                        </option>
                      );
                    })
                  )}
                </DashboardSelect>
              )}
              {priceLabel ? (
                <span className="text-[11px] text-[#837565] dark:text-[#a89f91] mt-1 block">
                  {billingCycle === "yearly"
                    ? t(`سعر الدورة السنوية: ${priceLabel}`, `Yearly price: ${priceLabel}`)
                    : t(`سعر الدورة الشهرية: ${priceLabel}`, `Monthly price: ${priceLabel}`)}
                </span>
              ) : null}
            </Field>
            <Field label={t("دورة الفوترة *", "Billing Cycle *")} error={errors.billingCycle?.message}>
              <DashboardSelect
                value={billingCycle}
                disabled={isSubmitting}
                onChange={(event) =>
                  setValue("billingCycle", event.target.value as "yearly" | "monthly", { shouldValidate: true })
                }
                className="h-10 rounded-[6px]"
              >
                <option value="yearly">{t("سنوية", "Yearly")}</option>
                <option value="monthly">{t("شهرية", "Monthly")}</option>
              </DashboardSelect>
            </Field>
            <Field label={t("الرقم الضريبي للمكتب (ZATCA)", "Office Tax Number (ZATCA)")} error={errors.taxNumber?.message}>
              <input
                type="text"
                {...register("taxNumber")}
                disabled={isSubmitting}
                placeholder="301298457200003"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <DashboardStickyActionBar>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end ms-auto">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-[6px] text-[13px] font-semibold text-[#514537] dark:text-[#a89f91] hover:bg-[#f0eeea] dark:hover:bg-[#281c15] transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("إلغاء", "Cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || plansQuery.isLoading || plans.length === 0}
              className="bg-[#9c6402] hover:bg-[#825200] text-white px-5 py-2 rounded-[6px] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{t("إنشاء وتفعيل الاشتراك", "Create & Activate Subscription")}</span>
            </button>
          </div>
        </DashboardStickyActionBar>
      </form>

      <LuxuryAlertDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleExecuteCreate}
        title={t("تأكيد تسجيل الاشتراك", "Confirm Subscription Registration")}
        description={t(
          `هل أنت متأكد من تسجيل واشتراك مكتب "${pendingValues?.firmName}" في ${selectedPlan?.name || "الباقة المحددة"}؟`,
          `Are you sure you want to register "${pendingValues?.firmName}" on ${selectedPlan?.name || "the selected plan"}?`
        )}
        confirmLabel={t("تأكيد التسجيل", "Confirm Registration")}
        cancelLabel={t("تراجع", "Cancel")}
        variant="info"
      />
    </div>
  );
}
