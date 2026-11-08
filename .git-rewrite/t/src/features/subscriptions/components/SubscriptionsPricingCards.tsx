"use client";

import React from "react";
import { Check, Star } from "lucide-react";

interface SubscriptionsPricingCardsProps {
  billingCycle: "monthly" | "annual";
  onSelectPlan?: (planId: string) => void;
}

export function SubscriptionsPricingCards({
  billingCycle,
  onSelectPlan,
}: SubscriptionsPricingCardsProps) {
  const isAnnual = billingCycle === "annual";

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Card 1: Free / الباقة الأساسية */}
        <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#1a1816] p-6 sm:p-7 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs hover:border-[#c29547]/60 dark:hover:border-[#d4a759]/60 hover:shadow-md transition-all relative">
          <div>
            {/* Header */}
            <div className="mb-5 text-start">
              <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0] block">
                مجاني للمحامي
              </span>
              <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-1.5 leading-relaxed">
                مثالية للمحامي المستقل وتجربة النظام ومتابعة القضايا الفردية
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6 text-start">
              <span className="text-4xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
                0
              </span>
              <span className="text-xs font-bold text-[#8c8279] dark:text-[#787166]">
                ر.س / شهرياً
              </span>
            </div>

            {/* Capacity Highlight Box */}
            <div className="p-3 rounded-2xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#eee6d9] dark:border-[#2f2a24] mb-6 text-start">
              <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] block">
                50 قضية وجلسة شهرياً
              </span>
              <span className="text-[11px] text-[#8c8279] dark:text-[#80786e]">
                سعة تخزين 1 جيجابايت للمستندات
              </span>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 text-start">
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>إدارة ملفات الموكلين والقضايا الأساسية</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>تقويم الجلسات ومواعيد المحاكم</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>مستخدم فردي واحد (المحامي)</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>دعم فني عبر البريد الإلكتروني</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onSelectPlan?.("free")}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-[#2d2823] dark:text-[#f5f4f0] bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] dark:hover:border-[#d4a759] hover:bg-[#faf8f4] dark:hover:bg-[#282420] transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              ابدأ مجاناً الآن
            </button>
            <span className="text-[10px] text-[#8c8279] dark:text-[#6e675d] block mt-2">
              لا يلزم بطاقة ائتمان
            </span>
          </div>
        </div>

        {/* Card 2: Starter / المحترف (HIGHLIGHTED / MOST POPULAR) */}
        <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#1a1816] p-6 sm:p-7 border-2 border-[#c29547] dark:border-[#d4a759] shadow-[0_12px_40px_-8px_rgba(194,149,71,0.2)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] relative transform md:-translate-y-2">
          {/* Most Popular Floating Pill Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1c1917] text-[#c29547] dark:bg-[#c29547] dark:text-[#171513] text-[11px] font-extrabold shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <Star className="w-3 h-3 fill-current" />
            <span>الأكثر طلباً واختياراً</span>
          </div>

          <div>
            {/* Header */}
            <div className="mb-5 text-start mt-1">
              <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0] block">
                باقة المحترف للمكاتب
              </span>
              <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-1.5 leading-relaxed">
                الخيار الأمثل لمكاتب المحاماة الصاعدة والفرق القانونية المتوسطة
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6 text-start">
              <span className="text-4xl font-extrabold text-[#c29547] dark:text-[#d4a759]">
                {isAnnual ? "120" : "150"}
              </span>
              <span className="text-xs font-bold text-[#8c8279] dark:text-[#787166]">
                ر.س / شهرياً {isAnnual && "(تُدفع سنوياً)"}
              </span>
            </div>

            {/* Capacity Highlight Box */}
            <div className="p-3 rounded-2xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] mb-6 text-start">
              <span className="text-xs font-bold text-[#c29547] dark:text-[#d4a759] block">
                1,500 قضية وجلسة شهرياً
              </span>
              <span className="text-[11px] text-[#7a7164] dark:text-[#a8a195]">
                سعة تخزين 25 جيجابايت سحابية مشفرة
              </span>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 text-start">
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc] font-medium">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>كل ما تتضمنه الباقة المجانية</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>فريق عمل حتى 5 محامين ومساعدين</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>المساعد القانوني الذكي وصياغة المذكرات</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>إشعارات وتنبيهات الواتساب للموكلين</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>دعم فني أولوية عبر الشات والهاتف</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onSelectPlan?.("starter")}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-white dark:text-[#171513] bg-[#1c1917] dark:bg-[#c29547] hover:bg-[#c29547] dark:hover:bg-[#d4a759] transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              اشترك الآن - تجربة مجانية 14 يوماً
            </button>
            <span className="text-[10px] text-[#8c8279] dark:text-[#6e675d] block mt-2 font-medium">
              إمكانية الإلغاء أو الترقية في أي وقت
            </span>
          </div>
        </div>

        {/* Card 3: Growth / المؤسسات والشركات الكبرى */}
        <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#1a1816] p-6 sm:p-7 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs hover:border-[#c29547]/60 dark:hover:border-[#d4a759]/60 hover:shadow-md transition-all relative">
          <div>
            {/* Header */}
            <div className="mb-5 text-start">
              <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0] block">
                باقة المؤسسات والشركات
              </span>
              <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-1.5 leading-relaxed">
                حلول قانونية متكاملة لشركات المحاماة الكبرى والمكاتب متعددة الفروع
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6 text-start">
              <span className="text-4xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
                {isAnnual ? "360" : "450"}
              </span>
              <span className="text-xs font-bold text-[#8c8279] dark:text-[#787166]">
                ر.س / شهرياً {isAnnual && "(تُدفع سنوياً)"}
              </span>
            </div>

            {/* Capacity Highlight Box */}
            <div className="p-3 rounded-2xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#eee6d9] dark:border-[#2f2a24] mb-6 text-start">
              <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] block">
                قضايا وجلسات غير محدودة
              </span>
              <span className="text-[11px] text-[#8c8279] dark:text-[#80786e]">
                مساحة تخزين سحابية غير محدودة
              </span>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 text-start">
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>كل ما تتضمنه باقة المحترف</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>عدد غير محدود من المحامين والمستشارين</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>تخصيص كامل للهوية وشعار المكتب الرسمي</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>بوابات دفع إلكترونية وفواتير ضريبية معتمدة</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>مدير حساب مخصص ودعم VIP فوري</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onSelectPlan?.("growth")}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-[#2d2823] dark:text-[#f5f4f0] bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] dark:hover:border-[#d4a759] hover:bg-[#faf8f4] dark:hover:bg-[#282420] transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              تواصل مع المبيعات للشركات
            </button>
            <span className="text-[10px] text-[#8c8279] dark:text-[#6e675d] block mt-2">
              شروط تعاقدية مخصصة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
