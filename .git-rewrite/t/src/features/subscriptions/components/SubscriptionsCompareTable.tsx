"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isAnnual = billingCycle === "annual";

  const categories: TableCategory[] = [
    {
      category: "السعة وإدارة الفريق",
      items: [
        { feature: "عدد حسابات المحامين والمستشارين", free: "1 مستخدم", starter: "5 مستخدمين", growth: "غير محدود" },
        { feature: "القضايا والجلسات النشطة شهرياً", free: "50 قضية", starter: "1,500 قضية", growth: "غير محدود" },
        { feature: "سعة التخزين السحابي للمستندات", free: "1 GB", starter: "25 GB", growth: "سعة مفتوحة" },
        { feature: "تحديد صلاحيات وأدوار الموظفين", free: false, starter: true, growth: true },
      ],
    },
    {
      category: "إدارة القضايا والملفات",
      items: [
        { feature: "تقويم الجلسات والمواعيد القضائية", free: true, starter: true, growth: true },
        { feature: "أرشفة وتصنيف وثائق القضايا", free: true, starter: true, growth: true },
        { feature: "سجل متابعة الإجراءات والقرارات", free: true, starter: true, growth: true },
        { feature: "بوابة دخول ومتابعة للموكلين", free: false, starter: true, growth: true },
        { feature: "تخصيص الهوية وشعار المكتب على التقارير", free: false, starter: false, growth: true },
      ],
    },
    {
      category: "المساعد الذكي والأتمتة",
      items: [
        { feature: "المساعد القانوني الذكي للبحث والاستنباط", free: false, starter: true, growth: true },
        { feature: "صياغة المذكرات والعقود بالذكاء الاصطناعي", free: false, starter: "50 شهرياً", growth: "غير محدود" },
        { feature: "إشعارات وتنبيهات الواتساب التلقائية", free: false, starter: true, growth: true },
        { feature: "استخراج وتلخيص نصوص الأحكام إلكترونياً", free: false, starter: true, growth: true },
      ],
    },
    {
      category: "المالية والفوترة",
      items: [
        { feature: "إصدار الفاتورة الإلكترونية المعتمدة (ZATCA)", free: false, starter: true, growth: true },
        { feature: "إدارة الأتعاب والدفعات المالية للموكلين", free: "أساسية", starter: "متقدمة", growth: "شاملة مع تقارير" },
        { feature: "ربط بوابات الدفع الإلكتروني المباشر", free: false, starter: false, growth: true },
      ],
    },
    {
      category: "الدعم الفني والأمان",
      items: [
        { feature: "التشفير المصرفي والنسخ الاحتياطي اليومي", free: true, starter: true, growth: true },
        { feature: "قنوات الدعم الفني", free: "بريد إلكتروني", starter: "شات وهاتف 24/7", growth: "مدير حساب VIP" },
        { feature: "اتفاقية مستوى الخدمة واستمرارية الأعمال", free: false, starter: "99.5%", growth: "99.9% مخصصة" },
      ],
    },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <span className="w-5 h-5 rounded-full bg-[#f3ecdf] dark:bg-[#282119] text-[#c29547] dark:text-[#d4a759] flex items-center justify-center mx-auto shadow-2xs">
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0] mb-2 tracking-tight">
          مقارنة تفصيلية بين كافة الباقات
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7367] dark:text-[#9e968a]">
          نظرة دقيقة وشاملة توضح الميزات المتاحة لمساعدتك في اختيار الباقة الأنسب لاحتياجاتك
        </p>
      </div>

      {/* Comparison Table Container */}
      <div className="rounded-3xl bg-white dark:bg-[#1a1816] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse text-start min-w-[650px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#ded5c6] dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a]">
                <th className="py-4 px-6 text-start text-xs font-extrabold text-[#756c60] dark:text-[#9e968a] w-2/5">
                  الميزات والأقسام
                </th>
                <th className="py-4 px-4 text-center text-xs font-extrabold text-[#1c1917] dark:text-[#f5f4f0] w-1/5">
                  مجاني
                </th>
                <th className="py-4 px-4 text-center text-xs font-extrabold text-[#c29547] dark:text-[#d4a759] w-1/5 bg-[#faf5eb]/80 dark:bg-[#272017]/80">
                  المحترف (الأكثر طلباً)
                </th>
                <th className="py-4 px-4 text-center text-xs font-extrabold text-[#1c1917] dark:text-[#f5f4f0] w-1/5">
                  المؤسسات والشركات
                </th>
              </tr>
            </thead>

            {/* Table Body by Categories */}
            <tbody>
              {categories.map((cat) => (
                <React.Fragment key={cat.category}>
                  {/* Category Header Row */}
                  <tr className="bg-[#fcfbfa] dark:bg-[#161412] border-b border-[#eee6d9] dark:border-[#28221a]">
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
                        "border-b border-[#f2ede4] dark:border-[#241f19] hover:bg-[#faf8f4]/60 dark:hover:bg-[#201c18]/60 transition-colors",
                        itemIdx % 2 === 1 ? "bg-[#faf9f6]/40 dark:bg-[#1a1715]/40" : ""
                      )}
                    >
                      <td className="py-3.5 px-6 text-xs font-medium text-[#423b33] dark:text-[#ded7cc]">
                        {item.feature}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderValue(item.free)}
                      </td>
                      <td className="py-3.5 px-4 text-center bg-[#faf5eb]/30 dark:bg-[#272017]/30">
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
              <tr className="border-t-2 border-[#ded5c6] dark:border-[#383126] bg-[#faf8f4] dark:bg-[#201d1a]">
                <td className="py-5 px-6 text-xs font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
                  الأسعار وبدء الاستخدام
                </td>
                {/* Free Column CTA */}
                <td className="py-5 px-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
                      0 ر.س
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectPlan?.("free")}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] bg-white dark:bg-[#2c241a] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] shadow-2xs transition-all cursor-pointer"
                    >
                      ابدأ مجاناً
                    </button>
                  </div>
                </td>
                {/* Starter Column CTA */}
                <td className="py-5 px-4 text-center bg-[#faf5eb]/80 dark:bg-[#272017]/80">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-extrabold text-[#c29547] dark:text-[#d4a759]">
                      {isAnnual ? "120" : "150"} ر.س
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectPlan?.("starter")}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white dark:text-[#171513] bg-[#1c1917] dark:bg-[#c29547] hover:bg-[#c29547] dark:hover:bg-[#d4a759] shadow-sm transition-all cursor-pointer"
                    >
                      اشترك الآن
                    </button>
                  </div>
                </td>
                {/* Growth Column CTA */}
                <td className="py-5 px-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
                      {isAnnual ? "360" : "450"} ر.س
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectPlan?.("growth")}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] bg-white dark:bg-[#2c241a] border border-[#ded5c6] dark:border-[#383126] hover:border-[#c29547] shadow-2xs transition-all cursor-pointer"
                    >
                      ترقية الحساب
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
