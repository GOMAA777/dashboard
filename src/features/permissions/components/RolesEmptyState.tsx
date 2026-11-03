"use client";

import React from "react";
import { Shield, Key, Plus, Lightbulb } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface RolesEmptyStateProps {
  onAddRole: () => void;
}

export function RolesEmptyState({ onAddRole }: RolesEmptyStateProps) {
  const { t, direction } = useLanguage();

  return (
    <div
      dir={direction}
      className="bg-white dark:bg-[#221812] rounded-[8px] p-8 md:p-14 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center font-['Cairo']"
      data-node-id="1:11321"
    >
      {/* Icon with warm badge */}
      <div className="relative mb-5" data-node-id="1:11360">
        <div className="bg-[#fff8e1] dark:bg-[#342711] size-[76px] rounded-[16px] flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] shadow-xs">
          <Shield className="size-[36px]" />
        </div>
        <div className="absolute -bottom-1 -start-1 bg-white dark:bg-[#221812] border border-[#ffddb6] dark:border-[#543b1f] size-[26px] rounded-full flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] shadow-xs">
          <Key className="size-[13px]" />
        </div>
      </div>

      {/* Heading */}
      <h2
        className="text-[22px] md:text-[24px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-tight"
        data-node-id="1:11366"
      >
        {t("لا توجد أدوار حتى الآن", "No Roles Found Yet")}
      </h2>

      {/* Description */}
      <p
        className="text-[14px] text-[#514537] dark:text-[#a89f91] max-w-[560px] mt-2 leading-[24px]"
        data-node-id="1:11368"
      >
        {t(
          "أنشئ أول دور لتحديد صلاحيات الموظفين وإدارة وصولهم إلى النظام وربط المهام والمسؤوليات القانونية والإدارية بأمان تام وشفافية.",
          "Create the first role to configure staff permissions, system access, and assign responsibilities securely."
        )}
      </p>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onAddRole}
        className="mt-6 bg-[#9c6402] hover:bg-[#855402] text-white px-6 py-2.5 rounded-[6px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
        data-node-id="1:11370"
      >
        <Plus className="size-[16px]" />
        <span>{t("إنشاء أول دور", "Create First Role")}</span>
      </button>

      {/* Pro Tip Box */}
      <div
        className="mt-8 bg-[#f5f3ef] dark:bg-[#281c15] border border-[#e6e2dc] dark:border-[#38271c] rounded-[8px] p-4 max-w-[680px] w-full flex items-start gap-3 text-start"
        data-node-id="1:11375"
      >
        <div className="size-[28px] rounded-full bg-[#ffeed9] dark:bg-[#3d2716] flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] shrink-0 mt-0.5">
          <Lightbulb className="size-[15px]" />
        </div>
        <div className="text-[12px] text-[#514537] dark:text-[#a89f91] leading-[20px]">
          <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("تلميح مهني: ", "Pro Tip: ")}
          </span>
          <span>
            {t(
              "يمكنك إنشاء أدوار مخصصة مثل 'مسؤول العملاء'، 'مستشار توثيق'، أو 'الدعم الفني' ومنح الصلاحيات بدقة وتفويض المهام مباشرة لفرق العمل.",
              "You can create custom roles such as 'Account Manager', 'Documentation Advisor', or 'Tech Support' and configure granular permissions."
            )}
          </span>
        </div>
      </div>
    </div>
  );
}