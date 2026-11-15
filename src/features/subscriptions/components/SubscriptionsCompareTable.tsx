"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface SubscriptionsCompareTableProps {
  billingCycle: "monthly" | "annual";
  onSelectPlan?: (planId: string) => void;
}

interface TableRowItem {
  feature: string;
  free: string | boolean;
  starter: string | boolean;
  growth: string | boolean;
}

interface TableCategory {
  category: string;
  items: TableRowItem[];
}

export function SubscriptionsCompareTable({
  billingCycle,
  onSelectPlan,
}: SubscriptionsCompareTableProps) {
  const { t } = useLanguage();
  const isAnnual = billingCycle === "annual";

  const categories: TableCategory[] = [
    {
      category: t("السعة وإدارة الفريق", "Capacity & Team Management"),
      items: [
        {
          feature: t("عدد حسابات المحامين والمستشارين", "Lawyer & consultant accounts"),
          free: t("1 مستخدم", "1 user"),
          starter: t("5 مستخدمين", "5 users"),
          growth: t("غير محدود", "Unlimited"),
        },
        {
          feature: t("القضايا والجلسات النشطة شهرياً", "Active cases & hearings / mo"),
          free: t("50 قضية", "50 cases"),
          starter: t("1,500 قضية", "1,500 cases"),
          growth: t("غير محدود", "Unlimited"),
        },
        {
          feature: t("سعة التخزين السحابي للمستندات", "Cloud document storage"),
          free: "1 GB",
          starter: "25 GB",
          growth: t("سعة مفتوحة", "Unlimited"),
        },
        {
          feature: t("تحديد صلاحيات وأدوار الموظفين", "Role-based staff permissions"),
          free: false,
          starter: true,
          growth: true,
        },
      ],
    },
    {
      category: t("إدارة القضايا والملفات", "Case & File Management"),
      items: [
        {
          feature: t("تقويم الجلسات والمواعيد القضائية", "Court hearings & calendar"),
          free: true,
          starter: true,
          growth: true,
        },
        {
          feature: t("أرشفة وتصنيف وثائق القضايا", "Case document indexing & archiving"),
          free: true,
          starter: true,
          growth: true,
        },
        {
          feature: t("سجل متابعة الإجراءات والقرارات", "Proceedings & judgment audit log"),
          free: true,
          starter: true,
          growth: true,
        },
        {
          feature: t("بوابة دخول ومتابعة للموكلين", "Client portal access & tracking"),
          free: false,
          starter: true,
          growth: true,
        },
        {
          feature: t("تخصيص الهوية وشعار المكتب على التقارير", "Custom branding & firm logo on reports"),
          free: false,
          starter: false,
          growth: true,
        },
      ],
    },
    {
      category: t("المساعد الذكي والأتمتة", "AI Assistant & Automation"),
      items: [
        {
          feature: t("المساعد القانوني الذكي للبحث والاستنباط", "AI legal research & insights assistant"),
          free: false,
          starter: true,
          growth: true,
        },
        {
          feature: t("صياغة المذكرات والعقود بالذكاء الاصطناعي", "AI drafting for legal briefs & contracts"),
          free: false,
          starter: t("50 شهرياً", "50 / mo"),
          growth: t("غير محدود", "Unlimited"),
        },
        {
          feature: t("إشعارات وتنبيهات الواتساب التلقائية", "Automated WhatsApp notifications"),
          free: false,
          starter: true,
          growth: true,
        },
        {
          feature: t("استخراج وتلخيص نصوص الأحكام إلكترونياً", "Judgment text extraction & summary"),
          free: false,
          starter: true,
          growth: true,
        },
      ],
    },
    {
      category: t("المالية والفوترة", "Finance & Invoicing"),
      items: [
        {
          feature: t("إصدار الفاتورة الإلكترونية المعتمدة (ZATCA)", "ZATCA-compliant electronic invoices"),
          free: false,
          starter: true,
          growth: true,
        },
        {
          feature: t("إدارة الأتعاب والدفعات المالية للموكلين", "Legal fees & client installment management"),
          free: t("أساسية", "Basic"),
          starter: t("متقدمة", "Advanced"),
          growth: t("شاملة مع تقارير", "Comprehensive with reports"),
        },
        {
          feature: t("ربط بوابات الدفع الإلكتروني المباشر", "Online payment gateway integrations"),
          free: false,
          starter: false,
          growth: true,
        },
      ],
    },
    {
      category: t("الدعم الفني والأمان", "Support & Security"),
      items: [
        {
          feature: t("التشفير المصرفي والنسخ الاحتياطي اليومي", "Banking encryption & daily backups"),
          free: true,
          starter: true,
          growth: true,
        },
        {
          feature: t("قنوات الدعم الفني", "Technical support channels"),
          free: t("بريد إلكتروني", "Email"),
          starter: t("شات وهاتف 24/7", "24/7 Chat & Phone"),
          growth: t("مدير حساب VIP", "VIP Account Manager"),
        },
        {
          feature: t("اتفاقية مستوى الخدمة واستمرارية الأعمال", "SLA & business continuity agreement"),
          free: false,
          starter: "99.5%",
          growth: t("99.9% مخصصة", "99.9% Custom"),
        },
      ],
    },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <span className="w-5 h-5 rounded-full bg-[#f3ecdf] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center mx-auto shadow-2xs">
          <Check className="w-3 h-3 stroke-[3]" />
        </span>
      ) : (
        <span className="text-[#beb4a5] dark:text-[#52493c] flex items-center justify-center mx-auto">
          <Minus className="w-3.5 h-3.5" />
        </span>
      );
    }
    return <span className="text-xs font-semibold text-[#2d2823] dark:text-[#ded7cc]">{val}</span>;
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-20 relative z-10">
      {/* Decorative Section Divider Dot */}
      <div className="flex items-center justify-center gap-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
        <span className="w-2 h-2 rounded-full bg-[#c29547]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-[#fdfbf7] mb-2 tracking-tight">
          {t("مقارنة تفصيلية بين كافة الباقات", "Detailed Comparison Across All Plans")}
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7367] dark:text-[#9e968a]">
          {t(
            "نظرة دقيقة وشاملة توضح الميزات المتاحة لمساعدتك في اختيار الباقة الأنسب لاحتياجاتك",
            "A comprehensive breakdown of features to help you choose the best plan for your needs"
          )}
        </p>
      </div>

      {/* Comparison Table Container */}
      <div className="rounded-3xl bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse text-start min-w-[650px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#ded5c6] dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#281c15]">
                <th className="py-4 px-6 text-start text-xs font-extrabold text-[#756c60] dark:text-[#9e968a] w-2/5">
                  {t("الميزات والأقسام", "Features & Categories")}
                </th>
                <th className="py-4 px-4 text-center text-xs font-extrabold text-[#1c1917] dark:text-[#fdfbf7] w-1/5">
                  {t("مجاني", "Free")}
                </th>
                <th className="py-4 px-4 text-center text-xs font-extrabold text-[#c29547] dark:text-[#d4a759] w-1/5 bg-[#faf5eb]/80 dark:bg-[#281c15]/80">
                  {t("المحترف (الأكثر طلباً)", "Professional (Most Popular)")}
                </th>
                <th className="py-4 px-4 text-center text-xs font-extrabold text-[#1c1917] dark:text-[#fdfbf7] w-1/5">
                  {t("المؤسسات والشركات", "Enterprise & Corporate")}
                </th>
              </tr>
            </thead>

            {/* Table Body by Categories */}
            <tbody>
              {categories.map((cat) => (
                <React.Fragment key={cat.category}>
                  {/* Category Header Row */}
                  <tr className="bg-[#fcfbfa] dark:bg-[#150f0b] border-b border-[#eee6d9] dark:border-[#38271c]">
                    <td
                      colSpan={4}
                      className="py-3 px-6 text-xs font-extrabold text-[#c29547] dark:text-[#d4a759]"
                    >
                      {cat.category}
                    </td>
                  </tr>

                  {/* Feature Rows */}
                  {cat.items.map((item, itemIdx) => (
                    <tr
                      key={item.feature}
                      className={cn(
                        "border-b border-[#f2ede4] dark:border-[#38271c] hover:bg-[#faf8f4]/60 dark:hover:bg-[#221812]/60 transition-colors",
                        itemIdx % 2 === 1 ? "bg-[#faf9f6]/40 dark:bg-[#1a120d]/40" : ""
                      )}
                    >
                      <td className="py-3.5 px-6 text-xs font-medium text-[#423b33] dark:text-[#ded7cc]">
                        {item.feature}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderValue(item.free)}
                      </td>
                      <td className="py-3.5 px-4 text-center bg-[#faf5eb]/30 dark:bg-[#281c15]/30">
                        {renderValue(item.starter)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderValue(item.growth)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Bottom Summary Action Row */}
              <tr className="border-t-2 border-[#ded5c6] dark:border-[#383126] bg-[#faf8f4] dark:bg-[#281c15]">
                <td className="py-5 px-6 text-xs font-extrabold text-[#1c1917] dark:text-[#fdfbf7]">
                  {t("الأسعار وبدء الاستخدام", "Pricing & Getting Started")}
                </td>
                {/* Free Column CTA */}
                <td className="py-5 px-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-extrabold text-[#1c1917] dark:text-[#fdfbf7]">
                      0 {t("ر.س", "SAR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectPlan?.("free")}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] bg-white dark:bg-[#281c15] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] shadow-2xs transition-all cursor-pointer"
                    >
                      {t("ابدأ مجاناً", "Start Free")}
                    </button>
                  </div>
                </td>
                {/* Starter Column CTA */}
                <td className="py-5 px-4 text-center bg-[#faf5eb]/80 dark:bg-[#281c15]/80">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-extrabold text-[#c29547] dark:text-[#d4a759]">
                      {isAnnual ? "120" : "150"} {t("ر.س", "SAR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectPlan?.("starter")}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white dark:text-[#171513] bg-[#1c1917] dark:bg-[#c29547] hover:bg-[#c29547] dark:hover:bg-[#d4a759] shadow-sm transition-all cursor-pointer"
                    >
                      {t("اشترك الآن", "Subscribe Now")}
                    </button>
                  </div>
                </td>
                {/* Growth Column CTA */}
                <td className="py-5 px-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-extrabold text-[#1c1917] dark:text-[#fdfbf7]">
                      {isAnnual ? "360" : "450"} {t("ر.س", "SAR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectPlan?.("growth")}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] bg-white dark:bg-[#281c15] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] shadow-2xs transition-all cursor-pointer"
                    >
                      {t("ترقية الحساب", "Upgrade Account")}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
