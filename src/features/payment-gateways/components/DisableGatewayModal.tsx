"use client";

import React, { useState } from "react";
import { PaymentGatewayItem } from "../types/payment-gateways.types";

interface DisableGatewayModalProps {
  gateway: PaymentGatewayItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (gatewayId: string, reason: string) => void;
}

const disableReasons = [
  "إجراء أعمال صيانة دورية مجدولة وتحديث الواجهات (API)",
  "تحديث الحساب المصرفي المستفيد أو بيانات الآيبان",
  "ارتفاع معدل العمليات المرفوضة من المصدر",
  "مراجعة دورية للامتثال والضرائب والتراخيص",
  "أخرى (ملاحظة إدارية داخلية خاصة)",
];

export function DisableGatewayModal({
  gateway,
  isOpen,
  onClose,
  onConfirm,
}: DisableGatewayModalProps) {
  const [selectedReason, setSelectedReason] = useState(disableReasons[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen || !gateway) return null;

  const handleConfirm = () => {
    onConfirm(gateway.id, selectedReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[512px] bg-white rounded-[16px] overflow-hidden shadow-[0px_20px_50px_0px_rgba(28,20,15,0.28)] flex flex-col animate-in zoom-in-95 duration-150 text-right"
        dir="rtl"
      >
        {/* Top Accent Line */}
        <div className="h-[6px] w-full bg-[#ba1a1a]" />

        {/* Modal Body Container */}
        <div className="p-8 space-y-4">
          {/* Header Area with Warning Badge */}
          <div className="flex items-start justify-between w-full">
            {/* Warning Shield & Title */}
            <div className="flex gap-4 items-start">
              <div className="bg-[#ffdad6] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[8px] size-12 flex items-center justify-center shrink-0">
                <img
                  alt="Warning"
                  className="w-[17.5px] h-[21.5px]"
                  src="/figma/payment-gateways/danger-shield.svg"
                />
              </div>

              <div className="flex flex-col items-start text-right">
                <div className="flex items-center gap-2">
                  <h2 className="text-[#1b1c1a] text-[22px] font-bold leading-[32px]">
                    تعطيل بوابة الدفع
                  </h2>
                  <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    إجراء إداري مقيّد
                  </span>
                </div>
                <p className="text-[#514537] text-[14px] leading-[22.75px] mt-1 font-normal">
                  هل أنت متأكد من رغبتك في تعطيل بوابة الدفع المحددة؟ سيؤدي ذلك لحجبها كخيار سداد نشط للعملاء الجدد.
                </p>
              </div>
            </div>

            {/* Close Button on Top Left (in RTL) */}
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-[4px] flex items-center justify-center text-[#514537] hover:bg-[#f0eeea] transition-colors cursor-pointer shrink-0"
              aria-label="إغلاق"
            >
              <img
                alt="Close"
                className="size-[11.6px]"
                src="/figma/payment-gateways/modal-close.svg"
              />
            </button>
          </div>

          {/* Selected Gateway Summary Card */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              {/* Gateway Brand + Name on Right */}
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-[4px] size-9 flex items-center justify-center shadow-2xs font-bold text-sm text-[#7b4e00] shrink-0">
                  {gateway.brandType === "bank" ? "بنكي" : gateway.name}
                </div>
                <div className="flex flex-col items-start text-right">
                  <span className="text-[#1b1c1a] text-[14px] font-bold leading-[20px]">
                    بوابة {gateway.name} للتحصيل المالي
                  </span>
                  <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                    {gateway.providerLegalName}
                  </span>
                </div>
              </div>

              {/* Code Identifier on Left */}
              <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">
                {gateway.code}
              </span>
            </div>

            {/* 3-Column Sub-grid */}
            <div className="bg-white/60 rounded-[4px] p-2 grid grid-cols-3 gap-2 text-right">
              {/* Col 1: Status */}
              <div className="flex flex-col items-start text-right">
                <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                  الحالة الحالية:
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="size-1.5 rounded-full bg-[#059669]" />
                  <span className="text-[#047857] text-[10px] font-bold leading-[14px]">
                    نشطة ومربوطة
                  </span>
                </div>
              </div>

              {/* Col 2: Subscriptions */}
              <div className="flex flex-col items-start text-right">
                <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                  الاشتراكات المرتبطة:
                </span>
                <span className="text-[#1b1c1a] text-[10px] font-bold leading-[14px] mt-0.5">
                  {gateway.activeSubscriptionsCount} اشتراك ساري
                </span>
              </div>

              {/* Col 3: Base Currency */}
              <div className="flex flex-col items-start text-right">
                <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                  العملة الأساسية:
                </span>
                <span className="text-[#1b1c1a] text-[10px] font-bold leading-[14px] mt-0.5">
                  {gateway.baseCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Financial & Compliance Guarantee Banner */}
          <div className="bg-[#fffbeb]/90 border border-[#fef3c7] rounded-[8px] p-4 flex gap-2.5 items-start text-right">
            <div className="flex flex-col items-start text-right">
              <span className="text-[#78350f] text-[12px] font-bold leading-[16px] mb-1">
                ضمانة الاستقرار المالي والنظامي:
              </span>
              <p className="text-[#78350f] text-[12px] leading-[19.5px] font-normal">
                لن يتم إلغاء أو تعديل الاشتراكات السارية أو الفواتير المجدولة سابقاً. سيقتصر التعطيل على حجب البوابة كخيار دفع جديد عند الفوترة والشراء المستقبلي، حفاظاً على حقوق المشتركين والتدفقات النقدية للمنصة.
              </p>
            </div>
            <img
              alt=""
              className="w-[14.5px] h-[20.5px] shrink-0 mt-0.5"
              src="/figma/payment-gateways/guarantee-shield.svg"
            />
          </div>

          {/* Reason Specification (Optional Input) */}
          <div className="flex flex-col gap-1.5 relative">
            <div className="flex items-center justify-between w-full">
              <span className="text-[#1b1c1a] text-[12px] font-semibold">
                سبب التعطيل
              </span>
              <span className="text-[#837565] text-[10px]">اختياري</span>
            </div>

            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#f5f3ef] rounded-[4px] px-4 py-3 flex items-center justify-between text-xs text-[#1b1c1a] cursor-pointer hover:bg-[#eae8e4] transition-colors"
            >
              <span>{selectedReason}</span>
              <img
                alt=""
                className={`w-[9px] h-[5.5px] transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                src="/figma/payment-gateways/select-chevron.svg"
              />
            </div>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-full mt-1 inset-x-0 bg-white rounded-[6px] shadow-lg border border-[#eae8e4] z-20 py-1 overflow-hidden">
                {disableReasons.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedReason(r);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-2.5 text-xs text-right cursor-pointer transition-colors ${
                      r === selectedReason
                        ? "bg-[#fff8e1] text-[#9c6402] font-semibold"
                        : "hover:bg-[#f5f3ef] text-[#1b1c1a]"
                    }`}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#eae8e4] px-4 py-4 flex items-center justify-start gap-2 bg-white">
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#ba1a1a] hover:bg-[#a01616] text-[#fff3e9] text-xs font-bold rounded-[4px] h-10 px-6 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>تأكيد التعطيل</span>
            <img
              alt=""
              className="size-[16.5px]"
              src="/figma/payment-gateways/disable-power.svg"
            />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#e4e1dc] text-[#1b1c1a] text-xs font-semibold rounded-[4px] h-10 px-4 flex items-center justify-center transition-colors cursor-pointer"
          >
            الغاء
          </button>
        </div>
      </div>
    </div>
  );
}
