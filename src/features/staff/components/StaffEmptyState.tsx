import React from "react";
import { Users, Plus, ShieldCheck } from "lucide-react";

interface StaffEmptyStateProps {
  onAddEmployee: () => void;
}

export function StaffEmptyState({ onAddEmployee }: StaffEmptyStateProps) {
  return (
    <div
      className="bg-white rounded-[8px] border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-8 sm:p-14 flex flex-col items-center justify-center text-center"
      data-node-id="1:8718"
    >
      {/* Icon Graphic */}
      <div className="relative mb-6">
        <div className="size-[84px] rounded-[16px] bg-[#f5efe6] flex items-center justify-center shadow-inner">
          <Users className="size-[42px] text-[#9c6402]" />
        </div>
        <div className="absolute -bottom-1 -start-1 size-[28px] rounded-full bg-white shadow-md border border-[#e6e2dc] flex items-center justify-center">
          <ShieldCheck className="size-[16px] text-[#9c6402]" />
        </div>
      </div>

      {/* Heading */}
      <h2
        className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] mb-2 leading-[36px]"
        data-node-id="1:8721"
      >
        لا يوجد موظفون حتى الآن
      </h2>

      {/* Description */}
      <p
        className="text-[14px] text-[#514537] max-w-[520px] leading-[24px] mb-6"
        data-node-id="1:8723"
      >
        أضف أول موظف إلى لوحة الجودي وحدد بياناته وصلاحياته للبدء في إدارة وتوزيع
        المهام الإدارية بأمان.
      </p>

      {/* Action Button */}
      <button
        type="button"
        onClick={onAddEmployee}
        className="bg-[#9c6402] hover:bg-[#855402] text-white px-5 py-2.5 rounded-[6px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors mb-10"
        data-node-id="1:8725"
      >
        <Plus className="size-[16px]" />
        <span>إضافة موظف</span>
      </button>

      {/* Compliance / Security Note Box */}
      <div className="w-full max-w-[700px] bg-[#faf8f5] border border-[#e8e2d8] rounded-[8px] p-4 text-start flex items-start gap-3">
        <div className="size-[32px] rounded-[6px] bg-[#f3ede3] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="size-[18px] text-[#9c6402]" />
        </div>
        <div className="flex flex-col text-[13px] leading-[22px]">
          <span className="font-bold text-[#1b1c1a]">
            ملاحظة أمنية ونظامية:
          </span>
          <span className="text-[#514537]">
            يمكنك تعيين أدوار محددة وصلاحيات مقيدة لكل موظف لضمان حماية بيانات العملاء وفق ضوابط الامتثال والأنظمة العدلية بالمملكة العربية السعودية.
          </span>
        </div>
      </div>
    </div>
  );
}
