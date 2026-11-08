"use client";

import React from "react";
import { Briefcase, Scale } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

interface LawyerPlanItem {
  name: string;
  price: string;
  subscriptions: number;
}

export function LawyerSubscriptionsPlansSection() {
  const { language } = useUIStore();
  const ls = translations[language].lawyerSubs;

  const legalPlans: LawyerPlanItem[] = [
    {
      name: language === "ar" ? "باقة المحامي المستقل (Pro)" : "Solo Advocate (Pro)",
      price: "$250.00",
      subscriptions: 38,
    },
    {
      name: language === "ar" ? "باقة مكاتب المحاماة (Suite)" : "Law Firm Suite",
      price: "$450.00",
      subscriptions: 27,
    },
    {
      name: language === "ar" ? "باقة الشركات والاستشارات" : "Corporate Legal",
      price: "$890.00",
      subscriptions: 11,
    },
    {
      name: language === "ar" ? "باقة النخبة والشراكات" : "Elite Legal Practice",
      price: "$1,200.00",
      subscriptions: 5,
    },
    {
      name: language === "ar" ? "باقة المحامي المتدرب" : "Junior Advocate",
      price: "$75.00",
      subscriptions: 14,
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top 2 Cards: Total Lawyer Licenses & Covered Cases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
        {/* Card 1: Total Lawyer Licenses */}
        <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] transition-all group hover:-translate-y-0.5">
          <div className="w-11 h-11 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0 mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-[#7c7366] dark:text-[#9e968a] block">
            {ls.totalLicenses}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#c29547] dark:text-[#d4a759] tracking-tight mt-1 block">
            420
          </span>
        </div>

        {/* Card 2: Covered Cases */}
        <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] transition-all group hover:-translate-y-0.5">
          <div className="w-11 h-11 rounded-full bg-[#fdf7ed] dark:bg-[#251e16] border border-[#f5dfbc] dark:border-[#44331e] flex items-center justify-center text-[#b87928] dark:text-[#e59a3c] shrink-0 mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-[#7c7366] dark:text-[#9e968a] block">
            {ls.coveredCases}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#b87928] dark:text-[#e59a3c] tracking-tight mt-1 block">
            18.4 K
          </span>
        </div>
      </div>

      {/* Bottom Card: Best Selling Plans for Lawyers */}
      <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] flex-1 flex flex-col justify-between">
        <div className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-3 mb-3 shrink-0">
          <h2 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
            {ls.bestSellingPlans}
          </h2>
        </div>

        <div className="overflow-x-auto flex-1 flex flex-col justify-between">
          <table className="w-full text-xs text-start flex-1 h-full">
            <thead className="shrink-0">
              <tr className="border-b border-[#ded5c6]/40 dark:border-[#2f2a24] text-[#8c8279] dark:text-[#787166]">
                <th className="pb-2.5 font-semibold text-start">{ls.plan}</th>
                <th className="pb-2.5 font-semibold text-start">{ls.price}</th>
                <th className="pb-2.5 font-semibold text-end">{ls.subscriptions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded5c6]/30 dark:divide-[#25201a] h-full">
              {legalPlans.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#faf8f4] dark:hover:bg-[#201d1a] transition-colors"
                >
                  <td className="py-3 sm:py-3.5 font-semibold text-[#2c2825] dark:text-[#e4ded5] text-start align-middle">
                    {p.name}
                  </td>
                  <td className="py-3 sm:py-3.5 font-medium text-[#6c645b] dark:text-[#9e968a] text-start align-middle">
                    {p.price}
                  </td>
                  <td className="py-3 sm:py-3.5 font-bold text-[#1c1917] dark:text-[#f5f4f0] text-end align-middle">
                    {p.subscriptions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
