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
} from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";
import { silverSubscribedFirms } from "../data/initialPlans";

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
  const [currentPage, setCurrentPage] = useState(1);

  const planCode = plan?.code || "CODE: PLAN-SLV-02";
  const planName = plan?.name || "الباقة الفضية";
  const planDescription =
    plan?.description ||
    "للفرق القانونية النامية والمكاتب المتوسطة التي تتطلب أدوات أتمتة العمليات القضائية والربط";

  return (
    <div className="w-full space-y-[24px] font-['Cairo',sans-serif]" dir="rtl">
      {/* 1. Top Identity & Command Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] pb-[8px]">
        {/* Right: Plan Code, Title & Description */}
        <div className="flex flex-col items-start gap-[6px]">
          <div className="flex items-center gap-[10px]">
            <span className="font-mono text-[11px] font-semibold text-[#737067] bg-[#f5f3ef] px-[8px] py-[3px] rounded border border-[#e2ded7]">
              {planCode}
            </span>
            <span className="text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] px-[8px] py-[2px] rounded-full border border-[#c8e6c9]">
              باقة مفعلة
            </span>
          </div>

          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={onBack}
              className="p-[6px] rounded-[6px] hover:bg-[#eae8e4] text-[#737067] hover:text-[#1b1c1a] transition-colors cursor-pointer"
              title="العودة للباقات"
            >
              <ArrowRight className="size-[20px]" />
            </button>
            <h1 className="text-[28px] font-extrabold text-[#1b1c1a] leading-tight">
              {planName}
            </h1>
          </div>

          <p className="text-[13px] text-[#737067] max-w-[650px] leading-relaxed">
            {planDescription}
          </p>
        </div>

        {/* Left: Action Buttons */}
        <div className="flex items-center gap-[10px] shrink-0">
          <button
            type="button"
            onClick={onNavigateToClients || onBack}
            className="border border-[#e2ded7] bg-white hover:bg-[#f5f3ef] text-[#1b1c1a] font-bold text-[13px] px-[16px] py-[9px] rounded-[6px] shadow-2xs flex items-center gap-[8px] transition-colors cursor-pointer"
          >
            <Building2 className="size-[16px] text-[#737067]" />
            <span>عرض المكاتب (52)</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(plan)}
            className="bg-[#9c6402] hover:bg-[#855402] text-white font-bold text-[13px] px-[18px] py-[9px] rounded-[6px] shadow-xs flex items-center gap-[8px] transition-all cursor-pointer"
          >
            <Edit3 className="size-[16px]" />
            <span>تعديل الباقة</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Metrics (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        {/* Metric 1: Monthly Price */}
        <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067]">
              السعر الشهري المعتمد
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] text-[#9c6402]">
              <CreditCard className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[8px]">
            <span className="text-[28px] font-black text-[#1b1c1a]">399</span>
            <span className="text-[13px] font-bold text-[#737067]">
              ر.س / شهر
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#9c6402] bg-[#fbf6ee] px-[8px] py-[2px] rounded border border-[#f5e3c8]">
              خصم 339 ر.س عند السداد السنوي (-15%)
            </span>
          </div>
        </div>

        {/* Metric 2: Subscribed Firms */}
        <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067]">
              المكاتب المشتركة حالياً
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] text-[#9c6402]">
              <Building2 className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a]">52</span>
            <span className="text-[13px] font-bold text-[#737067]">
              مكتباً نشطاً
            </span>
          </div>
          {/* Progress bar */}
          <div className="space-y-[4px]">
            <div className="h-[6px] w-full bg-[#eeebe5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9c6402] rounded-full"
                style={{ width: "54%" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#737067] font-medium">
              <span>54% من إجمالي المكاتب المشتركة</span>
              <span className="text-[#9c6402] font-bold">الأكثر طلباً</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Generated Monthly Revenue */}
        <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067]">
              الإيراد الشهري الناتج
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#e8f5e9] text-[#15803d]">
              <TrendingUp className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[8px]">
            <span className="text-[28px] font-black text-[#1b1c1a]">20,748</span>
            <span className="text-[13px] font-bold text-[#737067]">
              ر.س / شهر
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] px-[8px] py-[2px] rounded border border-[#c8e6c9] flex items-center gap-[4px]">
              <span>↑</span>
              <span>+12.4% مقارنة بالربع السابق</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Usage Limits & Cloud Resources (5 Compact Cards Row) */}
      <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[20px] shadow-2xs">
        <div className="mb-[16px]">
          <h2 className="text-[16px] font-bold text-[#1b1c1a]">
            حدود الاستخدام والموارد السحابية للباقة
          </h2>
          <p className="text-[12px] text-[#737067]">
            المواصفات التقنية والمخصصات البرمجية لكل مكتب مشترك في الباقة الفضية
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-[12px]">
          {/* Limit 1: Lawyers */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] border border-[#f5e3c8] text-[#9c6402] rounded-[6px]">
              <Users className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a]">
                4 محامين
              </div>
              <div className="text-[11px] text-[#737067] leading-relaxed mt-[2px]">
                تراخيص مستخدمين ومستشارين مرخصين
              </div>
            </div>
          </div>

          {/* Limit 2: Cases */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] border border-[#f5e3c8] text-[#9c6402] rounded-[6px]">
              <Scale className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a]">
                200 قضية
              </div>
              <div className="text-[11px] text-[#737067] leading-relaxed mt-[2px]">
                قضية ومعاملة نشطة في نفس الوقت
              </div>
            </div>
          </div>

          {/* Limit 3: Agents */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] border border-[#f5e3c8] text-[#9c6402] rounded-[6px]">
              <Briefcase className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a]">
                5 وكلاء
              </div>
              <div className="text-[11px] text-[#737067] leading-relaxed mt-[2px]">
                وكلاء ومفوضون شرعيون بصلاحيات محددة
              </div>
            </div>
          </div>

          {/* Limit 4: Clients */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] border border-[#f5e3c8] text-[#9c6402] rounded-[6px]">
              <UserCheck className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a]">
                1,000 عميل
              </div>
              <div className="text-[11px] text-[#737067] leading-relaxed mt-[2px]">
                سجل موكلين وشركات مع ملفات رقمية
              </div>
            </div>
          </div>

          {/* Limit 5: Storage */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] border border-[#f5e3c8] text-[#9c6402] rounded-[6px]">
              <Cloud className="size-[18px]" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#1b1c1a]">
                20 GB
              </div>
              <div className="text-[11px] text-[#737067] leading-relaxed mt-[2px]">
                تخزين سحابي مشفر للوثائق والمستندات
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Middle Section: Billing Cycles (left) & Features (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
        {/* Left: Billing Cycles & Prices (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[8px] border border-[#e2ded7] p-[20px] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-[4px]">
              <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                دورات الفوترة والأسعار
              </h2>
              <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#737067] px-[6px] py-[2px] rounded border border-[#e2ded7]">
                باقة تجارية
              </span>
            </div>
            <p className="text-[12px] text-[#737067] mb-[18px]">
              خيارات الاشتراك الرسمية المتاحة للمكاتب القانونية
            </p>

            <div className="space-y-[12px]">
              {/* Option 1: Monthly */}
              <div className="border border-[#e2ded7] rounded-[6px] p-[16px] bg-[#faf8f5]">
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="font-bold text-[14px] text-[#1b1c1a]">
                    الدورة الشهرية
                  </span>
                  <span className="text-[10px] font-bold bg-[#eeebe5] text-[#514537] px-[6px] py-[2px] rounded">
                    تجدد تلقائي
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[11px] text-[#737067]">
                    تجدد كل 30 يوماً مع إشعار استباقي
                  </div>
                  <div className="text-left">
                    <span className="text-[20px] font-black text-[#1b1c1a]">
                      399
                    </span>
                    <span className="text-[11px] text-[#737067] ms-[4px]">
                      ر.س / شهرياً
                    </span>
                  </div>
                </div>
              </div>

              {/* Option 2: Annual (Highlighted) */}
              <div className="border-2 border-[#9c6402] rounded-[6px] p-[16px] bg-[#fcf9f2] relative shadow-xs">
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="font-bold text-[14px] text-[#1b1c1a]">
                      الدورة السنوية (12 شهراً)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#9c6402] text-white px-[8px] py-[2px] rounded">
                    الأكثر طلباً (-15%)
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[11px] text-[#737067]">
                    تعادل 339 ر.س / شهرياً عند الدفع لمرة واحدة
                  </div>
                  <div className="text-left">
                    <span className="text-[22px] font-black text-[#9c6402]">
                      4,068
                    </span>
                    <span className="text-[11px] text-[#737067] ms-[4px]">
                      ر.س / سنوياً
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-[16px] mt-[16px] border-t border-[#f0eeea] text-[11px] text-[#737067] leading-relaxed">
            * جميع الأسعار غير شاملة ضريبة القيمة المضافة 15% ويتم إصدار فاتورة
            ضريبية إلكترونية فورية لكل دفعة.
          </div>
        </div>

        {/* Right: Features and Ecosystem Integrations (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[8px] border border-[#e2ded7] p-[20px] shadow-2xs">
          <div className="flex items-center justify-between mb-[4px]">
            <h2 className="text-[16px] font-bold text-[#1b1c1a]">
              مميزات الباقة وتكاملات المنظومة
            </h2>
            <span className="text-[11px] font-bold bg-[#fbf6ee] text-[#9c6402] px-[8px] py-[2px] rounded border border-[#f5e3c8]">
              4 من 6 مميزات
            </span>
          </div>
          <p className="text-[12px] text-[#737067] mb-[16px]">
            الخدمات المفعلة والمستثناة ضمن اتفاقية مستوى الخدمة لهذه الباقة
          </p>

          <div className="space-y-[10px]">
            {/* Feature 1: Priority SLA */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] border border-[#f0eeea]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a]">
                    دعم فني ذو أولوية للمكتب
                  </div>
                  <div className="text-[11px] text-[#737067] mt-[2px]">
                    استجابة مضمونة خلال 4 ساعات عمل كحد أقصى مع قناة محادثة
                    مباشرة.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#15803d] px-[8px] py-[3px] rounded border border-[#c8e6c9] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 2: Najiz Sync */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] border border-[#f0eeea]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a]">
                    الربط التلقائي المباشر مع منصة ناجز ووزارة العدل
                  </div>
                  <div className="text-[11px] text-[#737067] mt-[2px]">
                    مزامنة الجلسات، التبليغات القضائية، والقرارات التنفيذية
                    بصورة لحظية.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#15803d] px-[8px] py-[3px] rounded border border-[#c8e6c9] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 3: ZATCA Phase 2 */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] border border-[#f0eeea]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a]">
                    الفوترة الإلكترونية المتوافقة مع هيئة الزكاة والضريبة (ZATCA
                    Phase 2)
                  </div>
                  <div className="text-[11px] text-[#737067] mt-[2px]">
                    إصدار فواتير ضريبية إلكترونية مشفرة برمز QR وفق متطلبات
                    المرحلة الثانية.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#15803d] px-[8px] py-[3px] rounded border border-[#c8e6c9] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 4: KPI Analytics */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] border border-[#f0eeea]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a]">
                    تقارير مؤشرات الأداء والتحليلات القضائية
                  </div>
                  <div className="text-[11px] text-[#737067] mt-[2px]">
                    لوحات مؤشرات متقدمة لقياس معدلات إنجاز القضايا ومستحقات
                    أتعاب المحاماة.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#15803d] px-[8px] py-[3px] rounded border border-[#c8e6c9] shrink-0">
                مشمولة في الباقة
              </span>
            </div>

            {/* Feature 5: Dedicated Account Manager (Excluded) */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#fdfdfc] border border-[#ece9e3] opacity-80">
              <div className="flex items-start gap-[10px]">
                <XCircle className="size-[18px] text-[#9e9e9e] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-medium text-[#737067] line-through decoration-1">
                    مدير حساب استشاري مخصص
                  </div>
                  <div className="text-[11px] text-[#9e9e9e] mt-[2px]">
                    متاح حصرياً للمشتركين في الباقة الذهبية أو الباقات المخصصة
                    لكبرى الشركات.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#f5f5f5] text-[#757575] px-[8px] py-[3px] rounded border border-[#e0e0e0] shrink-0">
                غير متوفرة
              </span>
            </div>

            {/* Feature 6: Custom API Integration (Excluded) */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#fdfdfc] border border-[#ece9e3] opacity-80">
              <div className="flex items-start gap-[10px]">
                <XCircle className="size-[18px] text-[#9e9e9e] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-medium text-[#737067] line-through decoration-1">
                    تكامل واجهة البرمجة (Custom API Integration)
                  </div>
                  <div className="text-[11px] text-[#9e9e9e] mt-[2px]">
                    ربط أنظمة الـ ERP الخاصة بالمكتب كـ Oracle و SAP (متوفر في
                    الباقة المخصصة).
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#f5f5f5] text-[#757575] px-[8px] py-[3px] rounded border border-[#e0e0e0] shrink-0">
                غير متوفرة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subscribed Offices Table */}
      <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[20px] shadow-2xs">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pb-[16px] border-b border-[#f0eeea]">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[16px] font-bold text-[#1b1c1a]">
              المكاتب المشتركة في الباقة
            </h2>
            <span className="text-[11px] font-bold bg-[#f5f3ef] text-[#514537] px-[8px] py-[2px] rounded border border-[#e2ded7]">
              52 مكتباً
            </span>
            <span className="text-[12px] text-[#737067] hidden md:inline">
              | استعراض لأحدث المكاتب والشركات القانونية المسجلة في الباقة الفضية
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToClients || onBack}
            className="text-[13px] font-bold text-[#9c6402] hover:text-[#855402] flex items-center gap-[4px] cursor-pointer transition-colors"
          >
            <span>عرض جميع المكاتب المشتركة (52)</span>
            <span aria-hidden="true">&larr;</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-[13px]">
            <thead>
              <tr className="border-b border-[#f0eeea] text-[#737067] text-[12px] font-semibold">
                <th className="py-[12px] px-[12px]">اسم المنشأة القانونية</th>
                <th className="py-[12px] px-[12px]">المدير التنفيذي / المالك</th>
                <th className="py-[12px] px-[12px]">تاريخ الاشتراك</th>
                <th className="py-[12px] px-[12px]">موعد التجديد</th>
                <th className="py-[12px] px-[12px]">دورة السداد والحالة</th>
                <th className="py-[12px] px-[12px] text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eeea]">
              {silverSubscribedFirms.map((firm) => (
                <tr
                  key={firm.id}
                  className="hover:bg-[#faf8f5] transition-colors"
                >
                  {/* Firm name and license */}
                  <td className="py-[14px] px-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[34px] rounded-[6px] bg-[#f5f3ef] border border-[#e2ded7] flex items-center justify-center font-bold text-[#9c6402] shrink-0">
                        {firm.initial}
                      </div>
                      <div>
                        <div className="font-bold text-[#1b1c1a]">
                          {firm.name}
                        </div>
                        <div className="text-[11px] text-[#737067]">
                          {firm.licenseNumber} • {firm.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="py-[14px] px-[12px]">
                    <div className="font-bold text-[#1b1c1a]">{firm.owner}</div>
                    <div className="text-[11px] text-[#737067]">
                      {firm.ownerRole}
                    </div>
                  </td>

                  {/* Subscription Date */}
                  <td className="py-[14px] px-[12px] text-[#514537] font-medium">
                    {firm.subscriptionDate}
                  </td>

                  {/* Renewal Date */}
                  <td className="py-[14px] px-[12px]">
                    <span
                      className={`font-semibold ${
                        firm.status === "auto_renew"
                          ? "text-[#b45309]"
                          : "text-[#1b1c1a]"
                      }`}
                    >
                      {firm.renewalDate}
                    </span>
                  </td>

                  {/* Billing cycle & Status badge */}
                  <td className="py-[14px] px-[12px]">
                    {firm.status === "active" ? (
                      <span className="inline-flex items-center gap-[6px] bg-[#e8f5e9] text-[#15803d] border border-[#c8e6c9] px-[8px] py-[3px] rounded-full text-[11px] font-bold">
                        <span className="size-[6px] rounded-full bg-[#15803d]" />
                        <span>{firm.billingCycle}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-[6px] bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-[8px] py-[3px] rounded-full text-[11px] font-bold">
                        <span className="size-[6px] rounded-full bg-[#f59e0b]" />
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
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] text-[#737067] hover:text-[#1b1c1a] cursor-pointer"
                        title="عرض الملف"
                      >
                        <Eye className="size-[15px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(`إدارة اشتراك منشأة: ${firm.name}`)
                        }
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] text-[#737067] hover:text-[#1b1c1a] cursor-pointer"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] pt-[16px] mt-[12px] border-t border-[#f0eeea] text-[12px] text-[#737067]">
          <div>عرض 1 إلى 4 من أصل 52 مكتباً مسجلاً في الباقة</div>

          <div className="flex items-center gap-[4px]">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] bg-white text-[#737067] hover:bg-[#f5f3ef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <ChevronRight className="size-[14px]" />
              <span>السابق</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 1
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              1
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 2
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              2
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 3
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              3
            </button>

            <span className="px-[4px] text-[#737067]">...</span>

            <button
              type="button"
              onClick={() => setCurrentPage(16)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 16
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              16
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(16, p + 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] bg-white text-[#737067] hover:bg-[#f5f3ef] cursor-pointer flex items-center gap-[4px]"
            >
              <span>التالي</span>
              <ChevronLeft className="size-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
