import React from "react";
import { Shield, Key, Plus, Lightbulb } from "lucide-react";

interface RolesEmptyStateProps {
  onAddRole: () => void;
}

export function RolesEmptyState({ onAddRole }: RolesEmptyStateProps) {
  return (
    <div
      className="bg-white rounded-[8px] p-8 md:p-14 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center"
      data-node-id="1:11321"
      dir="rtl"
    >
      {/* Icon with warm badge */}
      <div className="relative mb-5" data-node-id="1:11360">
        <div className="bg-[#fff8e1] size-[76px] rounded-[16px] flex items-center justify-center text-[#9c6402] shadow-xs">
          <Shield className="size-[36px]" />
        </div>
        <div className="absolute -bottom-1 -start-1 bg-white border border-[#ffddb6] size-[26px] rounded-full flex items-center justify-center text-[#9c6402] shadow-xs">
          <Key className="size-[13px]" />
        </div>
      </div>

      {/* Heading */}
      <h2
        className="text-[22px] md:text-[24px] font-bold text-[#1b1c1a] leading-tight"
        data-node-id="1:11366"
      >
        لا توجد أدوار حتى الآن
      </h2>

      {/* Description */}
      <p
        className="text-[14px] text-[#514537] max-w-[560px] mt-2 leading-[24px]"
        data-node-id="1:11368"
      >
        أنشئ أول دور لتحديد صلاحيات الموظفين وإدارة وصولهم إلى النظام وربط المهام والمسؤوليات القانونية والإدارية بأمان تام وشفافية.
      </p>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onAddRole}
        className="mt-6 bg-[#9c6402] hover:bg-[#855402] text-white px-6 py-2.5 rounded-[6px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
        data-node-id="1:11370"
      >
        <Plus className="size-[16px]" />
        <span>إنشاء أول دور</span>
      </button>

      {/* Pro Tip Box */}
      <div
        className="mt-8 bg-[#f5f3ef] border border-[#e6e2dc] rounded-[8px] p-4 max-w-[680px] w-full flex items-start gap-3 text-right"
        data-node-id="1:11375"
      >
        <div className="size-[28px] rounded-full bg-[#ffeed9] flex items-center justify-center text-[#9c6402] shrink-0 mt-0.5">
          <Lightbulb className="size-[15px]" />
        </div>
        <div className="text-[12px] text-[#514537] leading-[20px]">
          <span className="font-bold text-[#1b1c1a]">تلميح مهني: </span>
          <span>
            يمكنك إنشاء أدوار مخصصة مثل &apos;مسؤول العملاء&apos;، &apos;مستشار توثيق&apos;، أو &apos;الدعم الفني&apos; ومنح الصلاحيات بدقة وتفويض المهام مباشرة لفرق العمل.
          </span>
        </div>
      </div>
    </div>
  );
}
