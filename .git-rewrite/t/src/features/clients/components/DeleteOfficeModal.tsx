"use client";

import React, { useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  CircleX,
  Unlink,
  KeyRound,
  Shield,
  Check,
} from "lucide-react";
import { ClientOffice } from "../types/client.types";

interface DeleteOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office: ClientOffice | null;
  onConfirm: () => void;
}

export function DeleteOfficeModal({
  isOpen,
  onClose,
  office,
  onConfirm,
}: DeleteOfficeModalProps) {
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  if (!isOpen || !office) return null;

  const licenseNum = office.licenseNumber.replace("ترخيص عدلي: ", "");

  const handleClose = () => {
    setIsAcknowledged(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!isAcknowledged) return;
    onConfirm();
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif]"
      data-node-id="1:2377"
      dir="rtl"
    >
      <div className="relative w-full max-w-[590px] bg-white rounded-[12px] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[#eae8e4] flex flex-col gap-[14px] animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header: Trash Icon + Title + Close Button */}
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
            <div className="flex flex-col text-right">
              <h2 className="text-[20px] font-bold text-[#1c140f] leading-[28px]">
                حذف المكتب نهائيًا؟
              </h2>
            </div>
            <div className="size-[44px] rounded-[8px] bg-[rgba(255,218,214,0.4)] flex items-center justify-center text-[#ba1a1a] shadow-xs shrink-0">
              <Trash2 className="size-[22px]" />
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

            <div className="flex flex-col text-right">
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

        {/* Critical Alert Banner */}
        <div className="bg-[#fff5f5] border border-[#fed7d7] rounded-[6px] p-[12px] flex items-start gap-[10px]">
          <div className="flex-1 flex flex-col text-right">
            <div className="flex items-center gap-[4px]">
              <span className="text-[12px] font-bold text-[#ba1a1a]">تنبيه هام:</span>
              <span className="text-[12px] text-[#514537] leading-[18px]">
                هذا الإجراء يختلف جوهرياً عن التعطيل المؤقت؛
              </span>
            </div>
            <p className="text-[12px] text-[#514537] leading-[18px] mt-[1px]">
              سيؤدي الحذف إلى إزالة وصول منسوبي المكتب نهائياً وفصل الربط التقني والخدمات السحابية بالكامل.
            </p>
          </div>
          <AlertTriangle className="size-[18px] text-[#ba1a1a] shrink-0 mt-[2px]" />
        </div>

        {/* 3 Structured Consequences */}
        <div className="flex flex-col gap-[8px]">
          {/* Point 1 */}
          <div className="bg-[#f5f3ef] rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-right">
              <span className="text-[12px] font-bold text-[#1b1c1a]">
                إلغاء اشتراك المكتب ومقاعد المحامين فوراً
              </span>
              <span className="text-[11px] text-[#514537] leading-[16px] mt-[1px]">
                إلغاء تفعيل 15 ترخيص مستخدم وإنهاء دورة الفوترة القادمة بصورة نهائية.
              </span>
            </div>
            <div className="p-1 text-[#ba1a1a] shrink-0 mt-[1px]">
              <CircleX className="size-[15px]" />
            </div>
          </div>

          {/* Point 2 */}
          <div className="bg-[#f5f3ef] rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-right">
              <span className="text-[12px] font-bold text-[#1b1c1a]">
                إيقاف الربط المباشر مع بوابة ناجز القضائية
              </span>
              <span className="text-[11px] text-[#514537] leading-[16px] mt-[1px]">
                تعطيل المزامنة الآلية ومفاتيح الـ API للقضايا والجلسات الإلكترونية فوراً.
              </span>
            </div>
            <div className="p-1 text-[#ba1a1a] shrink-0 mt-[1px]">
              <Unlink className="size-[15px]" />
            </div>
          </div>

          {/* Point 3 */}
          <div className="bg-[#f5f3ef] rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-right">
              <span className="text-[12px] font-bold text-[#1b1c1a]">
                أرشفة البيانات وفصل مفاتيح الوصول السحابي
              </span>
              <span className="text-[11px] text-[#514537] leading-[16px] mt-[1px]">
                تجريد منسوبي المكتب من الوصول السحابي وإغلاق النطاق الفرعي alajlan.aljudy.sa.
              </span>
            </div>
            <div className="p-1 text-[#837565] shrink-0 mt-[1px]">
              <KeyRound className="size-[15px]" />
            </div>
          </div>
        </div>

        {/* Regulatory Compliance Warning */}
        <div className="bg-[#f0eeea] border-r-3 border-[#7b4e00] rounded-[4px] p-[12px] flex flex-col gap-[3px] text-right">
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#1b1c1a]">
              تنبيه نظامي بخصوص الامتثال والحفظ المالي:
            </span>
            <Shield className="size-[13px] text-[#7b4e00]" />
          </div>
          <p className="text-[11px] text-[#514537] leading-[17px]">
            وفقاً للوائح هيئة الزكاة والضريبة والجمارك وضوابط الامتثال العدلي، قد تخضع السجلات المالية، الفواتير الإلكترونية الصادرة، والقيود المحاسبية لمدد حفظ نظامية ملزمة ولن تُشطب فوراً من السجل المالي للمنصة.
          </p>
        </div>

        {/* Acknowledgment Checkbox */}
        <label className="bg-[#f5f3ef] hover:bg-[#eae8e4]/70 rounded-[4px] p-[12px] flex items-center justify-between gap-[10px] cursor-pointer transition-colors">
          <div className="flex-1 text-right">
            <span className="text-[12px] font-semibold text-[#1b1c1a] leading-[18px]">
              أقر بعلمي بتبعات الحذف النهائي وفصل حساب المنشأة القانونية وإلغاء التراخيص المرتبطة بها نهائياً.
            </span>
          </div>

          <div
            className={`size-[18px] rounded-[3px] border flex items-center justify-center shrink-0 transition-all ${
              isAcknowledged
                ? "bg-[#ba1a1a] border-[#ba1a1a] text-white"
                : "border-[#837565] bg-white"
            }`}
          >
            {isAcknowledged && <Check className="size-[13px] stroke-[3]" />}
          </div>
          <input
            type="checkbox"
            checked={isAcknowledged}
            onChange={(e) => setIsAcknowledged(e.target.checked)}
            className="sr-only"
          />
        </label>

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
            disabled={!isAcknowledged}
            onClick={handleConfirm}
            className={`px-[22px] py-[9px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-xs transition-colors ${
              isAcknowledged
                ? "bg-[#ba1a1a] hover:bg-[#991b1b] text-white cursor-pointer"
                : "bg-[#d97777]/60 text-white cursor-not-allowed opacity-60"
            }`}
          >
            <Trash2 className="size-[14px]" />
            <span>حذف المكتب نهائياً</span>
          </button>
        </div>
      </div>
    </div>
  );
}
