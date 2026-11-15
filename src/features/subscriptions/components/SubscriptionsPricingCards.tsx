"use client";

import React from "react";
import { Check, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface SubscriptionsPricingCardsProps {
  billingCycle: "monthly" | "annual";
  onSelectPlan?: (planId: string) => void;
}

export function SubscriptionsPricingCards({
  billingCycle,
  onSelectPlan,
}: SubscriptionsPricingCardsProps) {
  const { t } = useLanguage();
  const isAnnual = billingCycle === "annual";

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Card 1: Free / الباقة الأساسية */}
        <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#1a120d] p-6 sm:p-7 border border-[#ded5c6] dark:border-[#38271c] shadow-xs hover:border-[#c29547]/60 dark:hover:border-[#d4a759]/60 hover:shadow-md transition-all relative">
          <div>
            {/* Header */}
            <div className="mb-5 text-start">
              <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#fdfbf7] block">
                {t("مجاني للمحامي", "Solo Lawyer (Free)")}
              </span>
              <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-1.5 leading-relaxed">
                {t("مثالية للمحامي المستقل وتجربة النظام ومتابعة القضايا الفردية", "Ideal for solo practitioners to trial the system and manage individual matters")}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6 text-start">
              <span className="text-4xl font-extrabold text-[#1c1917] dark:text-[#fdfbf7]">
                0
              </span>
              <span className="text-xs font-bold text-[#8c8279] dark:text-[#8e8680]">
                {t("ر.س / شهرياً", "SAR / month")}
              </span>
            </div>

            {/* Capacity Highlight Box */}
            <div className="p-3 rounded-2xl bg-[#faf8f4] dark:bg-[#281c15] border border-[#eee6d9] dark:border-[#38271c] mb-6 text-start">
              <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
                {t("50 قضية وجلسة شهرياً", "50 cases & hearings / month")}
              </span>
              <span className="text-[11px] text-[#8c8279] dark:text-[#80786e]">
                {t("سعة تخزين 1 جيجابايت للمستندات", "1 GB cloud document storage")}
              </span>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 text-start">
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("إدارة ملفات الموكلين والقضايا الأساسية", "Basic client and case file management")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("تقويم الجلسات ومواعيد المحاكم", "Hearing calendar & court schedules")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("مستخدم فردي واحد (المحامي)", "Single user (the lawyer)")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("دعم فني عبر البريد الإلكتروني", "Email technical support")}</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onSelectPlan?.("free")}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-[#2d2823] dark:text-[#fdfbf7] bg-white dark:bg-[#281c15] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] dark:hover:border-[#d4a759] hover:bg-[#faf8f4] dark:hover:bg-[#282420] transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              {t("ابدأ مجاناً الآن", "Get Started Free")}
            </button>
            <span className="text-[10px] text-[#8c8279] dark:text-[#6e675d] block mt-2">
              {t("لا يلزم بطاقة ائتمان", "No credit card required")}
            </span>
          </div>
        </div>

        {/* Card 2: Starter / المحترف (HIGHLIGHTED / MOST POPULAR) */}
        <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#1a120d] p-6 sm:p-7 border-2 border-[#c29547] dark:border-[#d4a759] shadow-[0_12px_40px_-8px_rgba(194,149,71,0.2)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] relative transform md:-translate-y-2">
          {/* Most Popular Floating Pill Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1c1917] text-[#c29547] dark:bg-[#c29547] dark:text-[#171513] text-[11px] font-extrabold shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <Star className="w-3 h-3 fill-current" />
            <span>{t("الأكثر طلباً واختياراً", "Most Popular Choice")}</span>
          </div>

          <div>
            {/* Header */}
            <div className="mb-5 text-start mt-1">
              <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#fdfbf7] block">
                {t("باقة المحترف للمكاتب", "Professional Firm Plan")}
              </span>
              <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-1.5 leading-relaxed">
                {t("الخيار الأمثل لمكاتب المحاماة الصاعدة والفرق القانونية المتوسطة", "The optimal choice for growing law firms and medium legal teams")}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6 text-start">
              <span className="text-4xl font-extrabold text-[#c29547] dark:text-[#d4a759]">
                {isAnnual ? "120" : "150"}
              </span>
              <span className="text-xs font-bold text-[#8c8279] dark:text-[#8e8680]">
                {isAnnual
                  ? t("ر.س / شهرياً (تُدفع سنوياً)", "SAR / month (billed annually)")
                  : t("ر.س / شهرياً", "SAR / month")}
              </span>
            </div>

            {/* Capacity Highlight Box */}
            <div className="p-3 rounded-2xl bg-[#faf5eb] dark:bg-[#281c15] border border-[#eeddbb] dark:border-[#4d3a1f] mb-6 text-start">
              <span className="text-xs font-bold text-[#c29547] dark:text-[#d4a759] block">
                {t("1,500 قضية وجلسة شهرياً", "1,500 cases & hearings / month")}
              </span>
              <span className="text-[11px] text-[#7a7164] dark:text-[#a8a195]">
                {t("سعة تخزين 25 جيجابايت سحابية مشفرة", "25 GB encrypted cloud storage")}
              </span>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 text-start">
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc] font-medium">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("كل ما تتضمنه الباقة المجانية", "Everything included in Free plan")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("فريق عمل حتى 5 محامين ومساعدين", "Team of up to 5 lawyers and assistants")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("المساعد القانوني الذكي وصياغة المذكرات", "AI legal assistant & brief drafting")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("إشعارات وتنبيهات الواتساب للموكلين", "WhatsApp notifications for clients")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#c29547] dark:bg-[#d4a759] text-white dark:text-[#171513] flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("دعم فني أولوية عبر الشات والهاتف", "Priority chat & phone technical support")}</span>
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
              {t("اشترك الآن - تجربة مجانية 14 يوماً", "Subscribe Now - 14-Day Free Trial")}
            </button>
            <span className="text-[10px] text-[#8c8279] dark:text-[#6e675d] block mt-2 font-medium">
              {t("إمكانية الإلغاء أو الترقية في أي وقت", "Cancel or upgrade anytime")}
            </span>
          </div>
        </div>

        {/* Card 3: Growth / المؤسسات والشركات الكبرى */}
        <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#1a120d] p-6 sm:p-7 border border-[#ded5c6] dark:border-[#38271c] shadow-xs hover:border-[#c29547]/60 dark:hover:border-[#d4a759]/60 hover:shadow-md transition-all relative">
          <div>
            {/* Header */}
            <div className="mb-5 text-start">
              <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#fdfbf7] block">
                {t("باقة المؤسسات والشركات", "Enterprise & Corporate Plan")}
              </span>
              <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-1.5 leading-relaxed">
                {t("حلول قانونية متكاملة لشركات المحاماة الكبرى والمكاتب متعددة الفروع", "Complete enterprise legal solutions for large firms and multi-branch offices")}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6 text-start">
              <span className="text-4xl font-extrabold text-[#1c1917] dark:text-[#fdfbf7]">
                {isAnnual ? "360" : "450"}
              </span>
              <span className="text-xs font-bold text-[#8c8279] dark:text-[#8e8680]">
                {isAnnual
                  ? t("ر.س / شهرياً (تُدفع سنوياً)", "SAR / month (billed annually)")
                  : t("ر.س / شهرياً", "SAR / month")}
              </span>
            </div>

            {/* Capacity Highlight Box */}
            <div className="p-3 rounded-2xl bg-[#faf8f4] dark:bg-[#281c15] border border-[#eee6d9] dark:border-[#38271c] mb-6 text-start">
              <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
                {t("قضايا وجلسات غير محدودة", "Unlimited cases & hearings")}
              </span>
              <span className="text-[11px] text-[#8c8279] dark:text-[#80786e]">
                {t("مساحة تخزين سحابية غير محدودة", "Unlimited cloud storage")}
              </span>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 text-start">
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("كل ما تتضمنه باقة المحترف", "Everything in Professional plan")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("عدد غير محدود من المحامين والمستشارين", "Unlimited lawyers and consultants")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("تخصيص كامل للهوية وشعار المكتب الرسمي", "Full custom branding & firm logo")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("بوابات دفع إلكترونية وفواتير ضريبية معتمدة", "Payment gateways & certified tax invoices")}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#4a433b] dark:text-[#ded7cc]">
                <span className="w-4 h-4 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{t("مدير حساب مخصص ودعم VIP فوري", "Dedicated account manager & instant VIP support")}</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onSelectPlan?.("growth")}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-[#2d2823] dark:text-[#fdfbf7] bg-white dark:bg-[#281c15] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] dark:hover:border-[#d4a759] hover:bg-[#faf8f4] dark:hover:bg-[#282420] transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              {t("تواصل مع المبيعات للشركات", "Contact Enterprise Sales")}
            </button>
            <span className="text-[10px] text-[#8c8279] dark:text-[#6e675d] block mt-2">
              {t("شروط تعاقدية مخصصة", "Custom enterprise contract terms")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
