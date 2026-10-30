"use client";

import React, { useState } from "react";
import {
  X,
  Ban,
  Receipt,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { ClientOffice } from "../types/client.types";

interface DeactivateOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office: ClientOffice | null;
  onConfirm: (reason: string, notes: string) => void;
}

export function DeactivateOfficeModal({
  isOpen,
  onClose,
  office,
  onConfirm,
}: DeactivateOfficeModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen || !office) return null;

  const licenseNum = office.licenseNumber.replace("ترخيص عدلي: ", "");

  const handleClose = () => {
    setReason("");
    setNotes("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason, notes);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif]"
      data-node-id="1:2299"
    >
      <div className="relative w-full max-w-[560px] bg-white rounded-[12px] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[#eae8e4] flex flex-col gap-[16px] animate-in fade-in zoom-in-95 duration-150">
        {/* Header: Warning Icon + Title + Close Button */}
        <div className="flex items-start justify-between w-full">
          {/* Close Button (Left) */}
          <button
            type="button"
            onClick={handleClose}
            className="p-[6px] rounded-[4px] hover:bg-[#f5f3ef] text-[#837565] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>

          {/* Icon & Title (Right) */}
          <div className="flex items-center gap-[12px]">
            <div className="flex flex-col text-start">
              <h2 className="text-[20px] font-bold text-[#1c140f] leading-[28px]">
                تعطيل حساب المكتب؟
              </h2>
            </div>
            <div className="size-[44px] rounded-[8px] bg-[rgba(255,218,214,0.4)] flex items-center justify-center text-[#ba1a1a] shadow-xs shrink-0">
              <Ban className="size-[22px]" />
            </div>
          </div>
        </div>

        {/* Target Office Context Callout */}
        <div className="bg-[#f5f3ef] rounded-[6px] p-[14px] flex flex-col gap-[8px]">
          <div className="flex items-start justify-between">
            <span className="bg-[#d1fae5] text-[#065f46] text-[10px] font-semibold px-[8px] py-[2px] rounded-[2px] flex items-center gap-[4px]">
              <span className="size-[5px] bg-[#059669] rounded-full" />
              <span>نشط حالياً</span>
            </span>

            <div className="flex flex-col text-start">
              <span className="text-[#514537] text-[10px] font-bold">
                المنشأة القانونية المستهدفة
              </span>
              <span className="text-[#1c140f] text-[14px] font-bold mt-[1px]">
                {office.name}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-[6px] border-t border-[#eae8e4]/60">
            <div className="flex items-center gap-[4px]">
              <span className="text-[#514537] font-semibold">الباقة:</span>
              <span className="text-[#9c6402] font-bold">{office.plan}</span>
            </div>

            <div className="flex items-center gap-[4px]">
              <span className="text-[#514537] font-semibold">رقم الترخيص العدلي:</span>
              <span className="text-[#1b1c1a] font-bold">{licenseNum}</span>
            </div>
          </div>
        </div>

        {/* Impact Description */}
        <p className="text-[#1b1c1a] text-[13px] leading-[20px] text-start">
          سيتم تعطيل وصول المكتب إلى المنصة وفق سياسة الحسابات. تأكد من مراجعة أثر التعطيل الفوري قبل المتابعة:
        </p>

        {/* Structured Impact Bullet Points */}
        <div className="flex flex-col gap-[8px]">
          {/* Point 1 */}
          <div className="bg-[#f5f3ef]/70 rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a]">
                إيقاف فوري لتسجيل الدخول
              </span>
              <span className="text-[11px] text-[#514537] leading-[16px] mt-[1px]">
                منع وصول كافة المحامين، المستشارين، ومسؤولي النظام للمكتب في الحال.
              </span>
            </div>
            <div className="p-1 text-[#ba1a1a] shrink-0 mt-[1px]">
              <Ban className="size-[15px]" />
            </div>
          </div>

          {/* Point 2 */}
          <div className="bg-[#f5f3ef]/70 rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a]">
                فصل الحساب عن دورة الفوترة المالية
              </span>
              <span className="text-[11px] text-[#514537] leading-[16px] mt-[1px]">
                لا يؤثر تعطيل الحساب على دورة الاشتراك القائم أو الفواتير المستحقة نظامياً.
              </span>
            </div>
            <div className="p-1 text-[#9c6402] shrink-0 mt-[1px]">
              <Receipt className="size-[15px]" />
            </div>
          </div>

          {/* Point 3 */}
          <div className="bg-[#f5f3ef]/70 rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a]">
                حفظ البيانات والأرشيف القضائي
              </span>
              <span className="text-[11px] text-[#514537] leading-[16px] mt-[1px]">
                تظل كافة الوثائق، الصكوك، ومستندات القضايا السحابية مشفرة ومحفوظة بالكامل.
              </span>
            </div>
            <div className="p-1 text-[#059669] shrink-0 mt-[1px]">
              <ShieldCheck className="size-[15px]" />
            </div>
          </div>
        </div>

        {/* Reason for Deactivation & Notes Form Control */}
        <div className="flex flex-col gap-[8px] text-start pt-[2px]">
          <div className="flex items-center gap-[4px] justify-start">
            <span className="text-[12px] font-semibold text-[#1b1c1a]">سبب التعطيل</span>
            <span className="text-[11px] text-[#837565] font-normal">(اختياري للتوثيق الإداري)</span>
          </div>

          <div className="relative">
            <select
              aria-label="سبب التعطيل"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="appearance-none w-full bg-white border border-[#eae8e4] rounded-[4px] px-[12px] py-[8px] pe-[32px] text-[13px] text-[#1b1c1a] focus:outline-none focus:border-[#ba1a1a] cursor-pointer shadow-2xs"
            >
              <option value="">حدد سبب التعطيل من القائمة المعتمدة...</option>
              <option value="بانتظار السداد">بانتظار سداد الفاتورة الدورية</option>
              <option value="طلب من مالك المكتب">بناءً على طلب رسمي من مالك المكتب</option>
              <option value="مراجعة التراخيص العدلية">تدقيق ومراجعة رخصة المحاماة</option>
              <option value="مخالفة شروط الاستخدام">مخالفة سياسة الاستخدام المنصوص عليها</option>
              <option value="أخرى">أسباب إدارية أخرى</option>
            </select>
            <ChevronDown className="size-[13px] text-[#514537] absolute start-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ملاحظات إضافية لسجل المراجعة والتدقيق الإداري..."
            className="w-full bg-white border border-[#eae8e4] rounded-[4px] p-[10px] text-[12px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#ba1a1a] resize-none shadow-2xs"
          />
        </div>

        {/* Action Footer Buttons */}
        <div className="flex items-center justify-end gap-[10px] pt-[8px] border-t border-[#f0eeea]">
          <button
            type="button"
            onClick={handleClose}
            className="bg-white hover:bg-[#f5f3ef] border border-[#eae8e4] text-[#514537] px-[20px] py-[9px] rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#ba1a1a] hover:bg-[#991b1b] text-white px-[22px] py-[9px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <Ban className="size-[14px]" />
            <span>تعطيل الحساب</span>
          </button>
        </div>
      </div>
    </div>
  );
}
