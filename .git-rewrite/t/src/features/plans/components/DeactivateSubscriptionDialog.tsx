"use client";

import React, { useState } from "react";
import { X, Pause, Ban, Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { DetailedSubscribedFirm } from "../types/plan.types";

interface DeactivateSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  firm?: DetailedSubscribedFirm | null;
  onConfirmDeactivate?: (firmId: string, reason: string, notes: string, mode: "immediate" | "end_of_cycle") => void;
}

export function DeactivateSubscriptionDialog({
  isOpen,
  onClose,
  firm,
  onConfirmDeactivate,
}: DeactivateSubscriptionDialogProps) {
  const [reason, setReason] = useState("بطلب رسمي موثق من إدارة المكتب");
  const [notes, setNotes] = useState("");
  const [deactivationMode, setDeactivationMode] = useState<"immediate" | "end_of_cycle">("immediate");

  if (!isOpen) return null;

  const firmName =
    firm?.name ||
    "مكتب خالد بن عبد العزيز العجلان للمحاماة والاستشارات القانونية";
  const licenseNumber = firm?.licenseNumber || "38/412";
  const city = firm?.city || "الرياض";
  const renewalDate = firm?.renewalDate || "15 نوفمبر 2024";
  const casesUsed = firm?.casesUsed || 194;
  const lawyersUsed = firm?.lawyersUsed || 4;

  const handleConfirm = () => {
    if (onConfirmDeactivate && firm) {
      onConfirmDeactivate(firm.id, reason, notes, deactivationMode);
    } else {
      toast.success(
        `تم تعطيل اشتراك "${firmName}" ${
          deactivationMode === "immediate"
            ? "فوراً"
            : `بنهاية الدورة الحالية (${renewalDate})`
        }.`
      );
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-[16px] animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="relative w-full max-w-[680px] bg-white rounded-[10px] shadow-2xl border border-[#e2ded7] overflow-hidden font-['Cairo',sans-serif]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[10px] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] flex items-center justify-center shrink-0">
              <Pause className="size-[20px] fill-current" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1b1c1a]">
              تعطيل اشتراك الباقة للمكتب؟
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-[6px] rounded-[4px] text-[#737067] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-[20px] pb-[20px] space-y-[18px] max-h-[80vh] overflow-y-auto">
          {/* Firm Summary Box */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[16px] space-y-[12px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[8px]">
              <div>
                <h3 className="text-[14px] font-bold text-[#1b1c1a]">
                  {firmName}
                </h3>
                <p className="text-[11px] text-[#737067]">
                  ترخيص عدلي: {licenseNumber} • {city}
                </p>
              </div>

              <div className="flex items-center gap-[8px]">
                <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#9c6402] bg-[#fbf6ee] px-[8px] py-[2px] rounded border border-[#f5e3c8]">
                  <span className="size-[6px] rounded-full bg-[#9c6402]" />
                  <span>الباقة الفضية</span>
                </span>
                <span className="text-[12px] font-bold text-[#514537]">
                  399 ر.س /شهرياً
                </span>
              </div>
            </div>

            {/* 4 Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px] pt-[8px] border-t border-[#f0eeea]">
              <div className="bg-white p-[8px] rounded-[6px] border border-[#f0eeea]">
                <div className="text-[10px] text-[#737067]">تاريخ البداية</div>
                <div className="text-[12px] font-bold text-[#1b1c1a] mt-[2px]">
                  15 يناير 2024
                </div>
              </div>

              <div className="bg-white p-[8px] rounded-[6px] border border-[#f0eeea]">
                <div className="text-[10px] text-[#737067]">
                  موعد التجديد القادم
                </div>
                <div className="text-[12px] font-bold text-[#b91c1c] mt-[2px]">
                  {renewalDate}
                </div>
                <div className="text-[9px] text-[#b91c1c]">(متبقي 22 يوماً)</div>
              </div>

              <div className="bg-white p-[8px] rounded-[6px] border border-[#f0eeea]">
                <div className="text-[10px] text-[#737067]">القضايا النشطة</div>
                <div className="text-[12px] font-bold text-[#1b1c1a] mt-[2px]">
                  {casesUsed} قضية
                </div>
              </div>

              <div className="bg-white p-[8px] rounded-[6px] border border-[#f0eeea]">
                <div className="text-[10px] text-[#737067]">
                  المحامون المرتبطون
                </div>
                <div className="text-[12px] font-bold text-[#1b1c1a] mt-[2px]">
                  {lawyersUsed} مستخدمين مفعلين
                </div>
              </div>
            </div>
          </div>

          {/* Reason Field */}
          <div>
            <div className="flex items-center justify-between mb-[6px]">
              <label
                htmlFor="deactivate-reason-select"
                className="text-[12px] font-bold text-[#1b1c1a]"
              >
                سبب التعطيل وتوثيق الإجراء الإداري{" "}
                <span className="text-[#b91c1c]">*</span>
              </label>
              <span className="text-[10px] font-bold text-[#737067] bg-[#f5f3ef] px-[6px] py-[2px] rounded">
                مطلوب للتدقيق الرقابي
              </span>
            </div>

            <div className="relative">
              <select
                id="deactivate-reason-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-[40px] appearance-none bg-[#f5f3ef] border border-[#e2ded7] rounded-[6px] px-[12px] text-[13px] text-[#1b1c1a] font-medium focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 cursor-pointer"
              >
                <option value="بطلب رسمي موثق من إدارة المكتب">
                  بطلب رسمي موثق من إدارة المكتب
                </option>
                <option value="تأخر سداد الفاتورة الدورية وتجاوز فترة السماح">
                  تأخر سداد الفاتورة الدورية وتجاوز فترة السماح
                </option>
                <option value="مخالفة شروط الاستخدام أو تجاوز الحدود التعاقدية">
                  مخالفة شروط الاستخدام أو تجاوز الحدود التعاقدية
                </option>
                <option value="أسباب إدارية داخلية بالتنسيق مع المشرف العام">
                  أسباب إدارية داخلية بالتنسيق مع المشرف العام
                </option>
              </select>
              <div className="absolute top-1/2 -translate-y-1/2 end-[12px] pointer-events-none text-[#737067]">
                <ChevronDown className="size-[15px]" />
              </div>
            </div>
          </div>

          {/* Notes Field */}
          <div>
            <label
              htmlFor="deactivate-notes-input"
              className="block text-[12px] font-bold text-[#1b1c1a] mb-[6px]"
            >
              ملاحظات وتوجيهات المشرف العام (اختياري)
            </label>
            <textarea
              id="deactivate-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أدخل تفاصيل الطلب، رقم المرجع الداخلي، أو ملاحظات التسوية الخاصة بمسؤول الحساب..."
              className="w-full bg-[#f5f3ef] border border-[#e2ded7] rounded-[6px] p-[12px] text-[12px] text-[#1b1c1a] placeholder-[#837565] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 resize-none"
            />
          </div>

          {/* Deactivation Timeline Options */}
          <div>
            <div className="flex items-center gap-[6px] text-[12px] font-bold text-[#1b1c1a] mb-[10px]">
              <Calendar className="size-[15px] text-[#9c6402]" />
              <span>خيارات سريان التعطيل والأثر المالي</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
              {/* Option 1: Immediate */}
              <div
                onClick={() => setDeactivationMode("immediate")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer border ${
                  deactivationMode === "immediate"
                    ? "border-[#9c6402] bg-[#fdfbf7] shadow-2xs"
                    : "border-[#e2ded7] bg-white hover:border-[#cfcac1]"
                }`}
              >
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="flex items-center gap-[8px]">
                    <div
                      className={`size-[16px] rounded-full border flex items-center justify-center shrink-0 ${
                        deactivationMode === "immediate"
                          ? "border-[#9c6402] bg-[#9c6402]"
                          : "border-[#cfcac1] bg-white"
                      }`}
                    >
                      {deactivationMode === "immediate" && (
                        <div className="size-[6px] rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#1b1c1a]">
                      تعطيل فوري للاشتراك
                    </span>
                  </div>

                  <span className="text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c] px-[6px] py-[1px] rounded">
                    فوري
                  </span>
                </div>

                <p className="text-[11px] text-[#737067] leading-relaxed">
                  إيقاف الميزات النشطة والتجديد التلقائي في الحال مع حفظ النسخ
                  الاحتياطية.
                </p>
              </div>

              {/* Option 2: End of cycle */}
              <div
                onClick={() => setDeactivationMode("end_of_cycle")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer border ${
                  deactivationMode === "end_of_cycle"
                    ? "border-[#9c6402] bg-[#fdfbf7] shadow-2xs"
                    : "border-[#e2ded7] bg-white hover:border-[#cfcac1]"
                }`}
              >
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="flex items-center gap-[8px]">
                    <div
                      className={`size-[16px] rounded-full border flex items-center justify-center shrink-0 ${
                        deactivationMode === "end_of_cycle"
                          ? "border-[#9c6402] bg-[#9c6402]"
                          : "border-[#cfcac1] bg-white"
                      }`}
                    >
                      {deactivationMode === "end_of_cycle" && (
                        <div className="size-[6px] rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#1b1c1a]">
                      نهاية الدورة الحالية
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#737067] leading-relaxed">
                  استمرار الخدمة حتى {renewalDate} وعدم التجديد للدورة اللاحقة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-[16px] bg-[#faf8f5] border-t border-[#f0eeea] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-[9px] rounded-[6px] bg-white border border-[#e2ded7] text-[#514537] hover:bg-[#f5f3ef] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-[20px] py-[9px] rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <Ban className="size-[15px]" />
            <span>تعطيل الاشتراك</span>
          </button>
        </div>
      </div>
    </div>
  );
}
