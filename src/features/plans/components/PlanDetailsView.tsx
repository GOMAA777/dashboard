"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Edit3,
  Building2,
  CreditCard,
  TrendingUp,
  Users,
  Scale,
  Briefcase,
  UserCheck,
  Cloud,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";
import { silverSubscribedFirms } from "../data/initialPlans";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";

interface PlanDetailsViewProps {
  plan?: PricingPlanItem;
  onBack: () => void;
  onEdit: (plan?: PricingPlanItem) => void;
  onNavigateToClients?: () => void;
}

export function PlanDetailsView({
  plan,
  onBack,
  onEdit,
  onNavigateToClients,
}: PlanDetailsViewProps) {
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalItems = silverSubscribedFirms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const pagedFirms = silverSubscribedFirms.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  const planCode = plan?.code || "CODE: PLAN-SLV-02";
  const planName = plan?.name || "الباقة الفضية";
  const planDescription =
    plan?.description ||
    "للفرق القانونية النامية والمكاتب المتوسطة التي تتطلب أدوات أتمتة العمليات القضائية والربط";

  return (
    <div className="w-full space-y-[24px] font-['Cairo',sans-serif]">
      {/* 1. Top Identity & Command Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] pb-[8px]">
        {/* Right: Plan Code, Title & Description */}
        <div className="flex flex-col items-start gap-[6px]">
          <div className="flex items-center gap-[10px]">
            <span className="font-mono text-[11px] font-semibold text-[#737067] bg-[#f5f3ef] dark:bg-[#281c15] dark:text-[#cdc5bd] dark:border-[#38271c] px-[8px] py-[3px] rounded border border-[#e2ded7]">
              {planCode}
            </span>
            <span className="text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] dark:bg-[#132c1c] dark:text-[#6ee7b7] dark:border-[#165a2e] px-[8px] py-[2px] rounded-full border border-[#c8e6c9]">
              باقة مفعلة
            </span>
          </div>

          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={onBack}
              className="p-[6px] rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
              title="العودة للباقات"
            >
              <ArrowRight className="size-[20px]" />
            </button>
            <h1 className="text-[28px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] leading-tight">
              {planName}
            </h1>
          </div>

          <p className="text-[13px] text-[#737067] dark:text-[#cdc5bd] max-w-[650px] leading-relaxed">
            {planDescription}
          </p>
        </div>

        {/* Left: Action Buttons */}
        <div className="flex items-center gap-[10px] shrink-0">
          <button
            type="button"
            onClick={onNavigateToClients || onBack}
            className="border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[13px] px-[16px] py-[9px] rounded-[6px] shadow-2xs flex items-center gap-[8px] transition-colors cursor-pointer"
          >
            <Building2 className="size-[16px] text-[#737067] dark:text-[#cdc5bd]" />
            <span>عرض المكاتب (52)</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(plan)}
            className="bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] font-bold text-[13px] px-[18px] py-[9px] rounded-[6px] shadow-xs flex items-center gap-[8px] transition-all cursor-pointer"
          >
            <Edit3 className="size-[16px]" />
            <span>تعديل الباقة</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Metrics (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        {/* Metric 1: Monthly Price */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              السعر الشهري المعتمد
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] text-[#9c6402] dark:bg-[#2d1f16] dark:text-[#e29d38] dark:border dark:border-[#4d3627]/60">
              <CreditCard className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[8px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">399</span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              ر.س / شهر
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#9c6402] bg-[#fbf6ee] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50 px-[8px] py-[2px] rounded border border-[#f5e3c8]">
              خصم 339 ر.س عند السداد السنوي (-15%)
            </span>
          </div>
        </div>

        {/* Metric 2: Subscribed Firms */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              المكاتب المشتركة حالياً
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] text-[#9c6402] dark:bg-[#2d1f16] dark:text-[#e29d38] dark:border dark:border-[#4d3627]/60">
              <Building2 className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">52</span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              مكتباً نشطاً
            </span>
          </div>
          {/* Progress bar */}
          <div className="space-y-[4px]">
            <div className="h-[6px] w-full bg-[#eeebe5] dark:bg-[#38271c] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full"
                style={{ width: "54%" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#737067] dark:text-[#cdc5bd] font-medium">
              <span>54% من إجمالي المكاتب المشتركة</span>
              <span className="text-[#9c6402] dark:text-[#f3c27e] font-bold">الأكثر طلباً</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Generated Monthly Revenue */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              الإيراد الشهري الناتج
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#e8f5e9] text-[#15803d] dark:bg-[#132c1c] dark:text-[#6ee7b7] dark:border dark:border-[#165a2e]">
              <TrendingUp className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[8px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">20,748</span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              ر.س / شهر
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] dark:bg-[#132c1c] dark:text-[#6ee7b7] dark:border-[#165a2e] px-[8px] py-[2px] rounded border border-[#c8e6c9] flex items-center gap-[4px]">
              <span>↑</span>
              <span>+12.4% مقارنة بالربع السابق</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Usage Limits & Cloud Resources (5 Compact Cards Row) */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[20px] shadow-2xs">
        <div className="mb-[16px]">
          <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            حدود الاستخدام والموارد السحابية للباقة
          </h2>
          <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd]">
            المواصفات التقنية والمخصصات البرمجية لكل مكتب مشترك في الباقة الفضية
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-[12px]">
          {/* Limit 1: Lawyers */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Users className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                4 محامين
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                تراخيص مستخدمين ومستشارين مرخصين
              </div>
            </div>
          </div>

          {/* Limit 2: Cases */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Scale className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                200 قضية
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                قضية ومعاملة نشطة في نفس الوقت
              </div>
            </div>
          </div>

          {/* Limit 3: Agents */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Briefcase className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                5 وكلاء
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                وكلاء ومفوضون شرعيون بصلاحيات محددة
              </div>
            </div>
          </div>

          {/* Limit 4: Clients */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <UserCheck className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                1,000 عميل
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                سجل موكلين وشركات مع ملفات رقمية
              </div>
            </div>
          </div>

          {/* Limit 5: Storage */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Cloud className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                20 GB
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                تخزين سحابي مشفر للوثائق والمستندات
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Middle Section: Billing Cycles (left) & Features (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
        {/* Left: Billing Cycles & Prices (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[20px] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-[4px]">
              <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                دورات الفوترة والأسعار
              </h2>
              <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded border border-[#e2ded7] dark:border-[#38271c]">
                باقة تجارية
              </span>
            </div>
            <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd] mb-[18px]">
              خيارات الاشتراك الرسمية المتاحة للمكاتب القانونية
            </p>

            <div className="space-y-[12px]">
              {/* Option 1: Monthly */}
              <div className="border border-[#e2ded7] dark:border-[#38271c] rounded-[6px] p-[16px] bg-[#faf8f5] dark:bg-[#281c15]">
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    الدورة الشهرية
                  </span>
                  <span className="text-[10px] font-bold bg-[#eeebe5] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded">
                    تجدد تلقائي
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                    تجدد كل 30 يوماً مع إشعار استباقي
                  </div>
                  <div className="text-left">
                    <span className="text-[20px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
                      399
                    </span>
                    <span className="text-[11px] text-[#737067] dark:text-[#8e8680] ms-[4px]">
                      ر.س / شهرياً
                    </span>
                  </div>
                </div>
              </div>

              {/* Option 2: Annual (Highlighted) */}
              <div className="border-2 border-[#9c6402] dark:border-[#e29d38] rounded-[6px] p-[16px] bg-[#fcf9f2] dark:bg-[rgba(226,157,56,0.1)] relative shadow-xs">
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      الدورة السنوية (12 شهراً)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] px-[8px] py-[2px] rounded">
                    الأكثر طلباً (-15%)
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[11px] text-[#737067] dark:text-[#cdc5bd]">
                    تعادل 339 ر.س / شهرياً عند الدفع لمرة واحدة
                  </div>
                  <div className="text-left">
                    <span className="text-[22px] font-black text-[#9c6402] dark:text-[#f3c27e]">
                      4,068
                    </span>
                    <span className="text-[11px] text-[#737067] dark:text-[#8e8680] ms-[4px]">
                      ر.س / سنوياً
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-[16px] mt-[16px] border-t border-[#f0eeea] dark:border-[#38271c] text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed">
            * جميع الأسعار غير شاملة ضريبة القيمة المضافة 15% ويتم إصدار فاتورة
            ضريبية إلكترونية فورية لكل دفعة.
          </div>
        </div>

        {/* Right: Features and Ecosystem Integrations (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[20px] shadow-2xs">
          <div className="flex items-center justify-between mb-[4px]">
            <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              مميزات الباقة وتكاملات المنظومة
            </h2>
            <span className="text-[11px] font-bold bg-[#fbf6ee] dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#f3c27e] px-[8px] py-[2px] rounded border border-[#f5e3c8] dark:border-[#e29d38]/50">
              4 من 6 مميزات
            </span>
          </div>
          <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd] mb-[16px]">
            الخدمات المفعلة والمستثناة ضمن اتفاقية مستوى الخدمة لهذه الباقة
          </p>

          <div className="space-y-[10px]">
            {/* Feature 1: Priority SLA */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    دعم فني ذو أولوية للمكتب
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    استجابة مضمونة خلال 4 ساعات عمل كحد أقصى مع قناة محادثة
                    مباشرة.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 2: Najiz Sync */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    الربط التلقائي المباشر مع منصة ناجز ووزارة العدل
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    مزامنة الجلسات، التبليغات القضائية، والقرارات التنفيذية
                    بصورة لحظية.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 3: ZATCA Phase 2 */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    الفوترة الإلكترونية المتوافقة مع هيئة الزكاة والضريبة (ZATCA
                    Phase 2)
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    إصدار فواتير ضريبية إلكترونية مشفرة برمز QR وفق متطلبات
                    المرحلة الثانية.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 4: KPI Analytics */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    تقارير مؤشرات الأداء والتحليلات القضائية
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    لوحات مؤشرات متقدمة لقياس معدلات إنجاز القضايا ومستحقات
                    أتعاب المحاماة.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 5: Dedicated Account Manager (Excluded) */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#fdfdfc] dark:bg-[#281c15]/50 border border-[#ece9e3] dark:border-[#38271c]/60 opacity-80">
              <div className="flex items-start gap-[10px]">
                <XCircle className="size-[18px] text-[#9e9e9e] dark:text-[#8e8680] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-medium text-[#737067] dark:text-[#8e8680] line-through decoration-1">
                    مدير حساب استشاري مخصص
                  </div>
                  <div className="text-[11px] text-[#9e9e9e] dark:text-[#6f6760] mt-[2px]">
                    متاح حصرياً للمشتركين في الباقة الذهبية أو الباقات المخصصة
                    لكبرى الشركات.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#f5f5f5] dark:bg-[#221812] text-[#757575] dark:text-[#8e8680] px-[8px] py-[3px] rounded border border-[#e0e0e0] dark:border-[#38271c] shrink-0">
                غير متوفرة
              </span>
            </div>

            {/* Feature 6: Custom API Integration (Excluded) */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#fdfdfc] dark:bg-[#281c15]/50 border border-[#ece9e3] dark:border-[#38271c]/60 opacity-80">
              <div className="flex items-start gap-[10px]">
                <XCircle className="size-[18px] text-[#9e9e9e] dark:text-[#8e8680] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-medium text-[#737067] dark:text-[#8e8680] line-through decoration-1">
                    تكامل واجهة البرمجة (Custom API Integration)
                  </div>
                  <div className="text-[11px] text-[#9e9e9e] dark:text-[#6f6760] mt-[2px]">
                    ربط أنظمة الـ ERP الخاصة بالمكتب كـ Oracle و SAP (متوفر في
                    الباقة المخصصة).
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#f5f5f5] dark:bg-[#221812] text-[#757575] dark:text-[#8e8680] px-[8px] py-[3px] rounded border border-[#e0e0e0] dark:border-[#38271c] shrink-0">
                غير متوفرة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subscribed Offices Table */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[20px] shadow-2xs">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pb-[16px] border-b border-[#f0eeea] dark:border-[#38271c]">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              المكاتب المشتركة في الباقة
            </h2>
            <span className="text-[11px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] px-[8px] py-[2px] rounded border border-[#e2ded7] dark:border-[#38271c]">
              52 مكتباً
            </span>
            <span className="text-[12px] text-[#737067] dark:text-[#cdc5bd] hidden md:inline">
              | استعراض لأحدث المكاتب والشركات القانونية المسجلة في الباقة الفضية
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToClients || onBack}
            className="text-[13px] font-bold text-[#9c6402] dark:text-[#f3c27e] hover:text-[#855402] dark:hover:text-[#e29d38] flex items-center gap-[4px] cursor-pointer transition-colors"
          >
            <span>عرض جميع المكاتب المشتركة (52)</span>
            <span aria-hidden="true">&larr;</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-[13px]">
            <thead>
              <tr className="border-b border-[#f0eeea] dark:border-[#38271c] text-[#737067] dark:text-[#cdc5bd] text-[12px] font-semibold">
                <th className="py-[12px] px-[12px]">اسم المنشأة القانونية</th>
                <th className="py-[12px] px-[12px]">المدير التنفيذي / المالك</th>
                <th className="py-[12px] px-[12px]">تاريخ الاشتراك</th>
                <th className="py-[12px] px-[12px]">موعد التجديد</th>
                <th className="py-[12px] px-[12px]">دورة السداد والحالة</th>
                <th className="py-[12px] px-[12px] text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
              {pagedFirms.map((firm) => (
                <tr
                  key={firm.id}
                  className="hover:bg-[#faf8f5] dark:hover:bg-[#281c15]/60 transition-colors"
                >
                  {/* Firm name and license */}
                  <td className="py-[14px] px-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[34px] rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] flex items-center justify-center font-bold text-[#9c6402] dark:text-[#e29d38] shrink-0">
                        {firm.initial}
                      </div>
                      <div>
                        <div className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {firm.name}
                        </div>
                        <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                          {firm.licenseNumber} • {firm.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="py-[14px] px-[12px]">
                    <div className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{firm.owner}</div>
                    <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                      {firm.ownerRole}
                    </div>
                  </td>

                  {/* Subscription Date */}
                  <td className="py-[14px] px-[12px] text-[#514537] dark:text-[#cdc5bd] font-medium">
                    {firm.subscriptionDate}
                  </td>

                  {/* Renewal Date */}
                  <td className="py-[14px] px-[12px]">
                    <span
                      className={`font-semibold ${
                        firm.status === "auto_renew"
                          ? "text-[#b45309] dark:text-[#f3c27e]"
                          : "text-[#1b1c1a] dark:text-[#fdfbf7]"
                      }`}
                    >
                      {firm.renewalDate}
                    </span>
                  </td>

                  {/* Billing cycle & Status badge */}
                  <td className="py-[14px] px-[12px]">
                    {firm.status === "active" ? (
                      <span className="inline-flex items-center gap-[6px] bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-[#165a2e] px-[8px] py-[3px] rounded-full text-[11px] font-bold">
                        <span className="size-[6px] rounded-full bg-[#15803d] dark:bg-[#6ee7b7]" />
                        <span>{firm.billingCycle}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-[6px] bg-[#fef3c7] dark:bg-[rgba(226,157,56,0.18)] text-[#92400e] dark:text-[#f3c27e] border border-[#fde68a] dark:border-[#e29d38]/40 px-[8px] py-[3px] rounded-full text-[11px] font-bold">
                        <span className="size-[6px] rounded-full bg-[#f59e0b] dark:bg-[#f3c27e]" />
                        <span>{firm.billingCycle}</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-[14px] px-[12px]">
                    <div className="flex items-center justify-center gap-[8px]">
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(`عرض تفاصيل منشأة: ${firm.name}`)
                        }
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] cursor-pointer"
                        title="عرض الملف"
                      >
                        <Eye className="size-[15px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(`إدارة اشتراك منشأة: ${firm.name}`)
                        }
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] cursor-pointer"
                        title="إعدادات الاشتراك"
                      >
                        <SlidersHorizontal className="size-[15px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] pt-[16px] mt-[12px] border-t border-[#f0eeea] dark:border-[#38271c] text-[12px] text-[#737067] dark:text-[#cdc5bd]">
          <div className="flex items-center gap-3">
            <div>
              عرض {totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1} إلى{" "}
              {Math.min(validCurrentPage * pageSize, totalItems)} من أصل {totalItems} مكتباً
            </div>

            <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
              <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd]">صفوف بالصفحة:</span>
              <PageSizeDropdown
                value={pageSize}
                onChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
                options={[5, 10, 20, 50]}
              />
            </div>
          </div>

          <div className="flex items-center gap-[4px]">
            {/* First Page */}
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage(1)}
              title="الصفحة الأولى"
              className="size-[28px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              <ChevronsRight className="size-[14px]" />
            </button>

            {/* Previous Page */}
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <ChevronRight className="size-[14px]" />
              <span>السابق</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                    validCurrentPage === pageNumber
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f]"
                      : "border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <span>التالي</span>
              <ChevronLeft className="size-[14px]" />
            </button>

            {/* Last Page */}
            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title="الصفحة الأخيرة"
              className="size-[28px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              <ChevronsLeft className="size-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
