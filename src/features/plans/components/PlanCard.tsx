"use client";

import React from "react";
import {
  Users,
  Scale,
  Briefcase,
  UserCheck,
  Cloud,
  Headphones,
  Link,
  Settings,
  MoreVertical,
  Pencil,
  Power,
  Trash2,
  Eye,
} from "lucide-react";
import { PricingPlanItem, PlanBillingCycle } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";

interface PlanCardProps {
  plan: PricingPlanItem;
  billingCycle: PlanBillingCycle;
  onEdit: (plan: PricingPlanItem) => void;
  onViewDetails?: (plan: PricingPlanItem) => void;
  onViewSubscribers?: (plan: PricingPlanItem) => void;
  onToggleActive?: (plan: PricingPlanItem) => void;
  onDelete?: (plan: PricingPlanItem) => void;
}

export function PlanCard({
  plan,
  billingCycle,
  onEdit,
  onViewDetails,
  onViewSubscribers,
  onToggleActive,
  onDelete,
}: PlanCardProps) {
  const { t, isEn } = useLanguage();
  const isCustom = billingCycle === "custom";
  const isAnnual = billingCycle === "annual";
  const rawAnnualPrice =
    plan.annualPrice && plan.annualPrice > 0
      ? plan.annualPrice
      : plan.monthlyPrice * 10;
  const displayPrice = isAnnual ? rawAnnualPrice : plan.monthlyPrice;

  const translatedPlanName = isEn
    ? plan.name
        .replace("الباقة الاحترافية", "Professional Plan")
        .replace("باقة الشركات", "Enterprise Plan")
        .replace("الباقة الأساسية", "Basic Plan")
        .replace("تجربة مجانية", "Free Trial")
    : plan.name;

  return (
    <div
      className={`relative bg-white dark:bg-[#221812] rounded-[8px] flex flex-col justify-between transition-all duration-200 font-['Cairo',sans-serif] ${
        plan.isPopular
          ? "border-2 border-[#9c6402] dark:border-[#e29d38] shadow-[0px_8px_24px_rgba(156,100,2,0.12)] dark:shadow-[0px_8px_24px_rgba(0,0,0,0.4)] pt-[24px]"
          : "border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] pt-[20px]"
      } px-[20px] pb-[20px]`}
    >
      {/* Popular Ribbon Tag */}
      {plan.isPopular && (
        <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-10 bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] text-[11px] font-bold px-[16px] py-[3px] rounded-full shadow-xs flex items-center gap-[4px] whitespace-nowrap">
          <span>★</span>
          <span>{t("الأكثر اختياراً", "Most Popular")}</span>
        </div>
      )}

      {/* Top Header Row: 3-dot options & status badge */}
      <div className="flex items-center justify-between w-full mb-[12px]">
        {/* Status Pill */}
        <div className="flex items-center gap-[6px] flex-wrap">
          {plan.badge && (
            <span
              className="inline-flex items-center gap-[4px] text-[10px] font-bold px-[7px] py-[2px] rounded-full"
              style={{
                backgroundColor: plan.badgeColor ? `${plan.badgeColor}18` : "#fef3c7",
                color: plan.badgeColor || "#d97706",
                borderColor: plan.badgeColor ? `${plan.badgeColor}40` : "#fcd34d",
                borderWidth: 1,
              }}
            >
              <span>★</span>
              <span>{plan.badge}</span>
            </span>
          )}

          {plan.isEnterprise && (
            <span className="bg-[#f0eeea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#514537] dark:text-[#cdc5bd] text-[9px] font-bold px-[6px] py-[2px] rounded-[2px] uppercase tracking-wider">
              ENTERPRISE
            </span>
          )}

          <span
            className={`inline-flex items-center gap-[5px] text-[11px] font-bold px-[8px] py-[2px] rounded-full border ${
              plan.isActive
                ? "bg-[#e8f5e9] border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#1b7340] dark:text-[#6ee7b7]"
                : "bg-[#f5f3ef] border-[#eae8e4] dark:bg-[#281c15] dark:border-[#4d3627] text-[#837565] dark:text-[#8e8680]"
            }`}
          >
            <span
              className={`size-[6px] rounded-full ${
                plan.isActive ? "bg-[#1b7340] dark:bg-[#10b981]" : "bg-[#837565] dark:bg-[#8e8680]"
              }`}
            />
            <span>{plan.isActive ? t("مفعلة", "Active") : t("معطلة حالياً", "Inactive")}</span>
          </span>
        </div>

        {/* Top Action Buttons: Deactivate / Activate & Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleActive && onToggleActive(plan)}
            className={`px-2 py-1 rounded-[4px] text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 shadow-2xs ${
              plan.isActive
                ? "bg-[#fffbeb] dark:bg-[#2c2014] hover:bg-[#fef3c7] dark:hover:bg-[#3d2c1c] text-[#9c6402] dark:text-[#e29d38] border-[#fde68a] dark:border-[#523b24]"
                : "bg-[#e8f5e9] dark:bg-[#132c1c] hover:bg-[#c8e6c9] dark:hover:bg-[#1b4329] text-[#1b7340] dark:text-[#6ee7b7] border-[#c8e6c9] dark:border-emerald-500/40"
            }`}
            title={plan.isActive ? t("تعطيل الباقة", "Deactivate Plan") : t("تفعيل الباقة", "Activate Plan")}
          >
            <Power className="size-[12px] shrink-0" />
            <span>{plan.isActive ? t("تعطيل", "Deactivate") : t("تفعيل", "Activate")}</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete && onDelete(plan)}
            className="px-2 py-1 rounded-[4px] bg-[#fef2f2] dark:bg-[#311616] hover:bg-[#fee2e2] dark:hover:bg-[#451e1e] text-[#b91c1c] dark:text-[#f87171] border border-[#fecaca] dark:border-[#5c2424] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            title={t("حذف الباقة", "Delete Plan")}
          >
            <Trash2 className="size-[12px] shrink-0" />
            <span>{t("حذف", "Delete")}</span>
          </button>
        </div>
      </div>

      {/* Plan Title & Subtitle */}
      <div className="flex flex-col text-start mb-[16px]">
        <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[28px]">
          {translatedPlanName}
        </h2>
        <p className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] min-h-[36px] mt-[4px]">
          {plan.description}
        </p>
      </div>

      {/* Pricing Block */}
      <div className="bg-[#f5f3ef]/60 dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[6px] p-[16px] flex flex-col text-start mb-[16px]">
        <div className="flex items-baseline gap-[6px] flex-wrap">
          {plan.isEnterprise && (
            <span className="text-[12px] font-bold text-[#514537] dark:text-[#cdc5bd]">{t("يبدأ من", "Starts at")}</span>
          )}
          <span className="text-[32px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
            {displayPrice > 0 ? displayPrice.toLocaleString() : t("مخصص", "Custom")}
          </span>
          <span className="text-[12px] font-semibold text-[#514537] dark:text-[#cdc5bd]">
            {isCustom
              ? t("ر.س / مخصص", "SAR / Custom")
              : isAnnual
              ? t("ر.س / سنوياً", "SAR / yr")
              : t("ر.س / شهرياً", "SAR / mo")}
          </span>
          {isCustom && (
            <span className="bg-[#fff8e6] border border-[#f5e3c8] dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/50 text-[#9c6402] dark:text-[#f3c27e] text-[10px] font-bold px-[6px] py-[1px] rounded-full ms-auto">
              {t("تسعير تعاقدي", "Contractual Pricing")}
            </span>
          )}
          {isAnnual && (
            <span className="bg-[#ecfdf5] border border-emerald-300 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#047857] dark:text-[#6ee7b7] text-[10px] font-bold px-[6px] py-[1px] rounded-full ms-auto">
              {plan.yearlyDiscountPercent && plan.yearlyDiscountPercent > 0
                ? t(`وفر ${plan.yearlyDiscountPercent}%`, `Save ${plan.yearlyDiscountPercent}%`)
                : t("خصم شهرين", "Save 2 months")}
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#837565] dark:text-[#8e8680] leading-[16px] mt-[6px]">
          {isCustom
            ? t(
                "تسعير تعاقدي مخصص ومميزات استثنائية وفق متطلبات واتفاقية المكتب",
                "Custom contractual pricing and exclusive features tailored to firm requirements"
              )
            : isAnnual
            ? t(
                `ما يعادل ${Math.round(displayPrice / 12).toLocaleString()} ر.س / شهرياً - تدفع سنوياً بموجب فاتورة إلكترونية`,
                `Equivalent to ${Math.round(displayPrice / 12).toLocaleString()} SAR / mo - billed annually via e-invoice`
              )
            : (plan.annualNote || t("تدفع سنوياً أو شهرياً بموجب فاتورة إلكترونية", "Billed annually or monthly via e-invoice"))}
        </p>
      </div>

      {/* Subscribed Firms Share Block */}
      <button
        type="button"
        onClick={() => onViewSubscribers && onViewSubscribers(plan)}
        title={t("عرض المكاتب المشتركة في هذه الباقة", "View firms subscribed to this plan")}
        className="w-full bg-white hover:bg-[#faf8f5] dark:bg-[#281c15] dark:hover:bg-[#34241b] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] p-[10px] flex items-center justify-between text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd] mb-[16px] transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-[6px]">
          <Users className="size-[14px] text-[#9c6402] dark:text-[#e29d38]" />
          <span className="group-hover:text-[#9c6402] dark:group-hover:text-[#e29d38] transition-colors">
            {plan.subscribedFirmsCount} {t("مكتباً مشتركاً", "subscribed firms")}
          </span>
        </div>
        <span className="text-[#837565] dark:text-[#8e8680] font-semibold text-[10px]">
          {plan.sharePercentage}
        </span>
      </button>

      {/* Limits & Features Checklist */}
      <div className="flex flex-col gap-[10px] text-start text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] flex-1 mb-[20px]">
        <span className="text-[11px] font-bold text-[#837565] dark:text-[#8e8680] mb-[2px]">
          {t("الحدود والمميزات المتضمنة:", "Limits & Included Features:")}
        </span>

        {/* 1. Lawyers */}
        <div className="flex items-center gap-[8px]">
          <Users className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
          <span className="leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">{plan.limits.lawyers}</span>
        </div>

        {/* 2. Cases */}
        <div className="flex items-center gap-[8px]">
          <Scale className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
          <span className="leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">{plan.limits.cases}</span>
        </div>

        {/* 3. Agents */}
        <div className="flex items-center gap-[8px]">
          <Briefcase className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
          <span className="leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">{plan.limits.agents}</span>
        </div>

        {/* 3.1 Assistants */}
        {plan.limits.assistants && plan.limits.assistants !== "—" && (
          <div className="flex items-center gap-[8px]">
            <UserCheck className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
            <span className="leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">{plan.limits.assistants}</span>
          </div>
        )}

        {/* 4. Clients */}
        <div className="flex items-center gap-[8px]">
          <UserCheck className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
          <span className="leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">{plan.limits.clients}</span>
        </div>

        {/* 5. Storage */}
        <div className="flex items-center gap-[8px]">
          <Cloud className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
          <span className="leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">{plan.limits.storage}</span>
        </div>

        {/* 6. Support */}
        <div className="flex items-center gap-[8px]">
          <Headphones className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
          <span className="leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">{plan.limits.support}</span>
        </div>

        {/* 7. Integration (Enterprise) */}
        {plan.limits.integration && (
          <div className="flex items-center gap-[8px]">
            <Link className="size-[14px] text-[#837565] dark:text-[#e29d38] shrink-0" />
            <span className="leading-[18px] font-bold text-[#9c6402] dark:text-[#e29d38]">
              {plan.limits.integration}
            </span>
          </div>
        )}
      </div>

      {/* Card Action Footer: تفاصيل، تعديل، الأشخاص المشتركين */}
      <div className="pt-[14px] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(plan)}
          className="flex-1 py-2 px-2 rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
          title={t("عرض تفاصيل الباقة", "View Plan Details")}
        >
          <Eye className="size-[13px] shrink-0" />
          <span className="truncate">{t("تفاصيل", "Details")}</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(plan)}
          className={`flex-1 py-2 px-2 rounded-[4px] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs ${
            plan.isPopular
              ? "bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#c88528] text-white dark:text-[#1c140f]"
              : "bg-[#1b1c1a] dark:bg-[#281c15] hover:bg-[#333] dark:hover:bg-[#38271c] text-white dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c]"
          }`}
          title={t("تعديل الباقة", "Edit Plan")}
        >
          <Pencil className="size-[13px] shrink-0" />
          <span className="truncate">{t("تعديل", "Edit")}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onViewSubscribers) onViewSubscribers(plan);
            else if (onViewDetails) onViewDetails(plan);
          }}
          className="flex-1 py-2 px-2 rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
          title={t("عرض المشتركين في هذه الباقة", "View Subscribers")}
        >
          <Users className="size-[13px] shrink-0" />
          <span className="truncate">{t("المشتركين", "Subscribers")} ({plan.subscribedFirmsCount})</span>
        </button>
      </div>
    </div>
  );
}
