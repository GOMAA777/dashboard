"use client";

import React from "react";
import { Building2, Scale } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

interface RecentSubItem {
  client: string;
  price: string;
  date: string;
  isAlJoudy?: boolean;
}

interface BestClientItem {
  name: string;
  totalSpend: string;
  startedAt: string;
  isAlJoudy?: boolean;
}

export function DashboardSubscriptionsAndClientsTables() {
  const { language } = useUIStore();
  const t = translations[language].overview;

  const recentSubs: RecentSubItem[] = [
    { client: "mahhor eye center", price: "$300.00", date: "08-25-2026 00:31 am" },
    { client: "mahhor eye center", price: "$300.00", date: "08-25-2026 00:30 am" },
    { client: "mahhor eye center", price: "$300.00", date: "08-24-2026 07:52 am" },
    { client: "الجودي والمروج لتقنية المعلومات", price: "$0.00", date: "08-17-2026 12:39 pm", isAlJoudy: true },
    { client: "الجودي للتسويق الإلكتروني السعودية", price: "$2,500.00", date: "07-30-2026 10:14 am", isAlJoudy: true },
  ];

  const bestClients: BestClientItem[] = [
    { name: "mahhor eye center", totalSpend: "$144,000.00", startedAt: "22 Sep 2025" },
    { name: "الجودي للتسويق الإلكتروني السعودية", totalSpend: "$41,113.00", startedAt: "31 May 2025", isAlJoudy: true },
    { name: "الجودي والمروج لتقنية المعلومات", totalSpend: "$344.00", startedAt: "15 Oct 2025", isAlJoudy: true },
    { name: "التأهيل الحركي", totalSpend: "$188.00", startedAt: "03 Jan 2026" },
    { name: "makhazenaljoomla", totalSpend: "$335.00", startedAt: "20 Nov 2025" },
  ];

  return (
    <section
      aria-label="Recent Subscriptions and Best Clients"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* 1. Recent Subscription Card */}
      <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
        <div className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-3 mb-3">
          <h2 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
            {t.recentSubscription}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-[#ded5c6]/40 dark:border-[#2f2a24] text-[#8c8279] dark:text-[#787166]">
                <th className="pb-2.5 font-semibold text-start">{t.client}</th>
                <th className="pb-2.5 font-semibold text-start">{t.price}</th>
                <th className="pb-2.5 font-semibold text-end">{t.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded5c6]/30 dark:divide-[#25201a]">
              {recentSubs.map((sub, idx) => (
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
                      <span className="truncate">{sub.client}</span>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-[#6c645b] dark:text-[#9e968a] text-start">
                    {sub.price}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-[#8c8279] dark:text-[#787166] text-end">
                    {sub.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Best Client Card */}
      <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
        <div className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-3 mb-3">
          <h2 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
            {t.bestClient}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-[#ded5c6]/40 dark:border-[#2f2a24] text-[#8c8279] dark:text-[#787166]">
                <th className="pb-2.5 font-semibold text-start">{t.name}</th>
                <th className="pb-2.5 font-semibold text-start">{t.totalSpend}</th>
                <th className="pb-2.5 font-semibold text-end">{t.startedAt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded5c6]/30 dark:divide-[#25201a]">
              {bestClients.map((client, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#faf8f4] dark:hover:bg-[#201d1a] transition-colors"
                >
                  <td className="py-3 font-semibold text-[#2c2825] dark:text-[#e4ded5] text-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#fbf6ec] dark:bg-[#2b2419] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center shrink-0">
                        {client.isAlJoudy ? (
                          <Scale className="w-3.5 h-3.5 text-[#9c6402]" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-[#8c8279] dark:text-[#a8a195]" />
                        )}
                      </div>
                      <span className="truncate">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
                    {client.totalSpend}
                  </td>
                  <td className="py-3 font-medium text-[#8c8279] dark:text-[#787166] text-end">
                    {client.startedAt}
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
