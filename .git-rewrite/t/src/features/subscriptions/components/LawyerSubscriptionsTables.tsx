"use client";

import React from "react";
import { Building2, UserCheck, Scale } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

interface RecentLawyerSubItem {
  client: string;
  planName: string;
  price: string;
  date: string;
  isAlJoudy?: boolean;
}

interface TopLawFirmItem {
  name: string;
  totalSpend: string;
  startedAt: string;
  isAlJoudy?: boolean;
}

export function LawyerSubscriptionsTables() {
  const { language } = useUIStore();
  const ls = translations[language].lawyerSubs;

  const recentLawyerSubs: RecentLawyerSubItem[] = [
    {
      client: language === "ar" ? "مجموعة الجودي للاستشارات القانونية" : "Al-Joudy Legal Practice Group",
      planName: language === "ar" ? "باقة النخبة" : "Elite Practice",
      price: "$1,200.00",
      date: "14-10-2026 09:15 am",
      isAlJoudy: true,
    },
    {
      client: language === "ar" ? "مكتب المستشار خالد التميمي للمحاماة" : "Khaled Al-Tamimi Law Office",
      planName: language === "ar" ? "مكاتب المحاماة" : "Firm Suite",
      price: "$450.00",
      date: "12-10-2026 02:40 pm",
    },
    {
      client: language === "ar" ? "المحامية سارة المنصور للاستشارات" : "Advocate Sarah Al-Mansour",
      planName: language === "ar" ? "المحامي المستقل" : "Solo Advocate",
      price: "$250.00",
      date: "10-10-2026 11:20 am",
    },
    {
      client: language === "ar" ? "شركة العدالة الدولية للمحاماة والتحكيم" : "Al-Adalah International Law Firm",
      planName: language === "ar" ? "الشركات والاستشارات" : "Corporate Legal",
      price: "$890.00",
      date: "08-10-2026 04:15 pm",
    },
    {
      client: language === "ar" ? "مكتب عبد العزيز الدوسري للمحاماة" : "Abdulaziz Al-Dossari Law Firm",
      planName: language === "ar" ? "مكاتب المحاماة" : "Firm Suite",
      price: "$450.00",
      date: "05-10-2026 10:30 am",
    },
  ];

  const topLawFirms: TopLawFirmItem[] = [
    {
      name: language === "ar" ? "مجموعة الجودي للاستشارات القانونية" : "Al-Joudy Legal Practice Group",
      totalSpend: "$58,200.00",
      startedAt: "15 Feb 2025",
      isAlJoudy: true,
    },
    {
      name: language === "ar" ? "شركة العدالة الدولية للمحاماة والتحكيم" : "Al-Adalah International Law Firm",
      totalSpend: "$36,400.00",
      startedAt: "10 Mar 2025",
    },
    {
      name: language === "ar" ? "مكتب المستشار فهد القحطاني وشريكه" : "Fahad Al-Qahtani & Partners",
      totalSpend: "$24,800.00",
      startedAt: "18 May 2025",
    },
    {
      name: language === "ar" ? "مكتب دار القضاء للمحاماة والتوثيق" : "Dar Al-Qadaa Law & Notary",
      totalSpend: "$18,500.00",
      startedAt: "04 Aug 2025",
    },
    {
      name: language === "ar" ? "المحامي سلطان بن نايف للاستشارات" : "Sultan Bin Naif Legal Consultancy",
      totalSpend: "$14,200.00",
      startedAt: "12 Nov 2025",
    },
  ];

  return (
    <section
      aria-label="Recent Lawyer Subscriptions and Top Law Firms"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10"
    >
      {/* 1. Recent Lawyer Subscriptions Card */}
      <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
        <div className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-3 mb-3">
          <h2 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
            {ls.recentSubscriptions}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-[#ded5c6]/40 dark:border-[#2f2a24] text-[#8c8279] dark:text-[#787166]">
                <th className="pb-2.5 font-semibold text-start">{ls.lawyerOrFirm}</th>
                <th className="pb-2.5 font-semibold text-start">{ls.price}</th>
                <th className="pb-2.5 font-semibold text-end">{ls.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded5c6]/30 dark:divide-[#25201a]">
              {recentLawyerSubs.map((sub, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#faf8f4] dark:hover:bg-[#201d1a] transition-colors"
                >
                  <td className="py-3 font-semibold text-[#2c2825] dark:text-[#e4ded5] text-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#fbf6ec] dark:bg-[#2b2419] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center shrink-0">
                        {sub.isAlJoudy ? (
                          <Scale className="w-3.5 h-3.5 text-[#9c6402]" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-[#8c8279] dark:text-[#a8a195]" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{sub.client}</span>
                        <span className="text-[10px] font-normal text-[#8c8279] dark:text-[#9e968a]">
                          {sub.planName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-[#6c645b] dark:text-[#9e968a] text-start align-middle">
                    {sub.price}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-[#8c8279] dark:text-[#787166] text-end align-middle">
                    {sub.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Top Law Firms Card */}
      <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
        <div className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-3 mb-3">
          <h2 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
            {ls.topLawFirms}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-[#ded5c6]/40 dark:border-[#2f2a24] text-[#8c8279] dark:text-[#787166]">
                <th className="pb-2.5 font-semibold text-start">{ls.lawyerOrFirm}</th>
                <th className="pb-2.5 font-semibold text-start">{ls.totalSpend}</th>
                <th className="pb-2.5 font-semibold text-end">{ls.startedAt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded5c6]/30 dark:divide-[#25201a]">
              {topLawFirms.map((firm, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#faf8f4] dark:hover:bg-[#201d1a] transition-colors"
                >
                  <td className="py-3 font-semibold text-[#2c2825] dark:text-[#e4ded5] text-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#fbf6ec] dark:bg-[#2b2419] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center shrink-0">
                        {firm.isAlJoudy ? (
                          <Scale className="w-3.5 h-3.5 text-[#9c6402]" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5 text-[#8c8279] dark:text-[#a8a195]" />
                        )}
                      </div>
                      <span className="truncate">{firm.name}</span>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start align-middle">
                    {firm.totalSpend}
                  </td>
                  <td className="py-3 font-medium text-[#8c8279] dark:text-[#787166] text-end align-middle">
                    {firm.startedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
