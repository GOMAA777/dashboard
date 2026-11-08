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
} from "lucide-react";
import { PricingPlanItem } from "../types/plan.types";

interface PlanCardProps {
  plan: PricingPlanItem;
  billingCycle: "monthly" | "annual";
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const displayPrice =
    billingCycle === "annual" && plan.annualPrice
      ? Math.round(plan.annualPrice / 12)
      : plan.monthlyPrice;

  return (
    <div
      className={`relative bg-white rounded-[8px] flex flex-col justify-between transition-all duration-200 font-['Cairo',sans-serif] ${
        plan.isPopular
          ? "border-2 border-[#9c6402] shadow-[0px_8px_24px_rgba(156,100,2,0.12)] pt-[24px]"
          : "border border-[#eae8e4] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] pt-[20px]"
      } px-[20px] pb-[20px]`}
      dir="rtl"
    >
      {/* Popular Ribbon Tag */}
      {plan.isPopular && (
        <div className="absolute -top-[13px] start-1/2 -translate-x-1/2 bg-[#7b4e00] text-[#fff3e9] text-[11px] font-bold px-[16px] py-[3px] rounded-full shadow-xs flex items-center gap-[4px] whitespace-nowrap">
          <span>★</span>
          <span>الأكثر اختياراً</span>
        </div>
      )}

      {/* Top Header Row: 3-dot options & status badge */}
      <div className="flex items-center justify-between w-full mb-[12px]">
        {/* Status Pill */}
        <div className="flex items-center gap-[6px]">
          {plan.isEnterprise && (
            <span className="bg-[#f0eeea] text-[#514537] text-[9px] font-bold px-[6px] py-[2px] rounded-[2px] uppercase tracking-wider">
              ENTERPRISE
            </span>
          )}

          <span
            className={`inline-flex items-center gap-[5px] text-[11px] font-bold px-[8px] py-[2px] rounded-[2px] ${
              plan.isActive
                ? "bg-[#e8f5e9] text-[#1b7340]"
                : "bg-[#f5f3ef] text-[#837565]"
            }`}
          >
            <span
              className={`size-[6px] rounded-full ${
                plan.isActive ? "bg-[#1b7340]" : "bg-[#837565]"
              }`}
            />
            <span>{plan.isActive ? "مفعلة" : "معطلة حالياً"}</span>
          </span>
        </div>

        {/* 3-dots Menu Icon & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-[#837565] hover:text-[#1b1c1a] p-1 rounded-sm cursor-pointer"
            aria-label="خيارات إضافية"
          >
            <MoreVertical className="size-[15px]" />
          </button>

          {isMenuOpen && (
            <div className="absolute end-0 top-full mt-1 w-[160px] bg-white rounded-[6px] shadow-lg border border-[#e2ded7] py-[4px] z-20 text-right animate-in fade-in duration-100 font-['Cairo',sans-serif]">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onViewDetails) onViewDetails(plan);
                  else onEdit(plan);
                }}
                className="w-full text-right px-[12px] py-[6px] text-[12px] font-semibold text-[#1b1c1a] hover:bg-[#faf8f5] cursor-pointer"
              >
                تعديل الباقة
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onViewSubscribers) onViewSubscribers(plan);
                  else if (onViewDetails) onViewDetails(plan);
                }}
                className="w-full text-right px-[12px] py-[6px] text-[12px] font-semibold text-[#514537] hover:bg-[#faf8f5] cursor-pointer"
              >
                عرض المشتركين ({plan.subscribedFirmsCount})
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onToggleActive) onToggleActive(plan);
                }}
                className="w-full text-right px-[12px] py-[6px] text-[12px] font-semibold text-[#9c6402] hover:bg-[#fbf6ee] cursor-pointer"
              >
                {plan.isActive ? "تعطيل الباقة" : "تفعيل الباقة"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onDelete) onDelete(plan);
                }}
                className="w-full text-right px-[12px] py-[6px] text-[12px] font-semibold text-[#b91c1c] hover:bg-[#fee2e2]/40 border-t border-[#f0eeea] cursor-pointer"
              >
                حذف الباقة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Plan Title & Subtitle */}
      <div className="flex flex-col text-right mb-[16px]">
        <h2 className="text-[20px] font-bold text-[#1b1c1a] leading-[28px]">
          {plan.name}
        </h2>
        <p className="text-[#514537] text-[12px] leading-[18px] min-h-[36px] mt-[4px]">
          {plan.description}
        </p>
      </div>

      {/* Pricing Block */}
      <div className="bg-[#f5f3ef]/60 rounded-[6px] p-[16px] flex flex-col text-right mb-[16px]">
        <div className="flex items-baseline gap-[6px]">
          {plan.isEnterprise && (
            <span className="text-[12px] font-bold text-[#514537]">يبدأ من</span>
          )}
          <span className="text-[32px] font-extrabold text-[#1b1c1a] leading-none">
            {displayPrice}
          </span>
          <span className="text-[12px] font-semibold text-[#514537]">
            ر.س / شهرياً
          </span>
        </div>
        <p className="text-[11px] text-[#837565] leading-[16px] mt-[6px]">
          {plan.annualNote || "شاملة ضريبة القيمة المضافة ومصاريف السيرفر"}
        </p>
      </div>

      {/* Subscribed Firms Share Block */}
      <div className="bg-white border border-[#eae8e4] rounded-[4px] p-[10px] flex items-center justify-between text-[11px] font-bold text-[#514537] mb-[16px]">
        <div className="flex items-center gap-[6px]">
          <Users className="size-[14px] text-[#9c6402]" />
          <span>{plan.subscribedFirmsCount} مكتباً مشتركاً</span>
        </div>
        <span className="text-[#837565] font-semibold text-[10px]">
          {plan.sharePercentage}
        </span>
      </div>

      {/* Limits & Features Checklist */}
      <div className="flex flex-col gap-[10px] text-right text-[12px] text-[#1b1c1a] flex-1 mb-[20px]">
        <span className="text-[11px] font-bold text-[#837565] mb-[2px]">
          الحدود والمميزات المتضمنة:
        </span>

        {/* 1. Lawyers */}
        <div className="flex items-center gap-[8px]">
          <Users className="size-[14px] text-[#837565] shrink-0" />
          <span className="leading-[18px]">{plan.limits.lawyers}</span>
        </div>

        {/* 2. Cases */}
        <div className="flex items-center gap-[8px]">
          <Scale className="size-[14px] text-[#837565] shrink-0" />
          <span className="leading-[18px]">{plan.limits.cases}</span>
        </div>

        {/* 3. Agents */}
        <div className="flex items-center gap-[8px]">
          <Briefcase className="size-[14px] text-[#837565] shrink-0" />
          <span className="leading-[18px]">{plan.limits.agents}</span>
        </div>

        {/* 4. Clients */}
        <div className="flex items-center gap-[8px]">
          <UserCheck className="size-[14px] text-[#837565] shrink-0" />
          <span className="leading-[18px]">{plan.limits.clients}</span>
        </div>

        {/* 5. Storage */}
        <div className="flex items-center gap-[8px]">
          <Cloud className="size-[14px] text-[#837565] shrink-0" />
          <span className="leading-[18px]">{plan.limits.storage}</span>
        </div>

        {/* 6. Support */}
        <div className="flex items-center gap-[8px]">
          <Headphones className="size-[14px] text-[#837565] shrink-0" />
          <span className="leading-[18px]">{plan.limits.support}</span>
        </div>

        {/* 7. Integration (Enterprise) */}
        {plan.limits.integration && (
          <div className="flex items-center gap-[8px]">
            <Link className="size-[14px] text-[#837565] shrink-0" />
            <span className="leading-[18px] font-bold text-[#9c6402]">
              {plan.limits.integration}
            </span>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-[14px] border-t border-[#f0eeea] flex items-center justify-between gap-[10px]">
        {plan.isEnterprise ? (
          <>
            <button
              type="button"
              onClick={() => onEdit(plan)}
              className="p-[8px] rounded-[4px] bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#514537] cursor-pointer"
              title="إعدادات الباقة"
            >
              <Settings className="size-[16px]" />
            </button>

            <button
              type="button"
              onClick={() => onToggleActive && onToggleActive(plan)}
              className="flex-1 bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#514537] py-[8px] px-[12px] rounded-[4px] text-[12px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-[6px]"
            >
              <span>{plan.isActive ? "تعطيل الباقة" : "تفعيل الباقة"}</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                onViewSubscribers
                  ? onViewSubscribers(plan)
                  : onViewDetails
                  ? onViewDetails(plan)
                  : onEdit(plan)
              }
              className="p-[8px] rounded-[4px] bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#514537] cursor-pointer shrink-0"
              title="عرض المكاتب المشتركة"
            >
              <Users className="size-[16px]" />
            </button>

            <button
              type="button"
              onClick={() => (onViewDetails ? onViewDetails(plan) : onEdit(plan))}
              className={`flex-1 py-[8px] px-[14px] rounded-[4px] text-[13px] font-bold shadow-2xs transition-colors cursor-pointer text-center ${
                plan.isPopular
                  ? "bg-[#9c6402] hover:bg-[#855402] text-white"
                  : "bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#1b1c1a]"
              }`}
            >
              تعديل الباقة
            </button>
          </>
        )}
      </div>
    </div>
  );
}
