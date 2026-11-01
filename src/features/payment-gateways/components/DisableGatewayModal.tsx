"use client";

import React, { useState } from "react";
import { ShieldAlert, X, ShieldCheck, ChevronDown, Power } from "lucide-react";
import { PaymentGatewayItem } from "../types/payment-gateways.types";
import { useLanguage } from "@/lib/i18n";

interface DisableGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateway: PaymentGatewayItem | null;
  onConfirm: (gatewayId: string, reason: string) => void;
}

const disableReasonsAr = [
  "أعمال صيانة وتحديث دورية لبروتوكول الربط",
  "انتهاء صلاحية المفاتيح السرية (API Keys)",
  "توقف الخدمة مؤقتاً من قبل المزود البنكي",
  "تحديث اشتراطات ومتطلبات الامتثال الضريبي (ZATCA)",
  "استبدال وسيلة الدفع بمزود بديل",
];

const disableReasonsEn = [
  "Routine maintenance & integration update",
  "API Keys expired",
  "Temporary outage by banking provider",
  "Updating ZATCA tax compliance requirements",
  "Replacing gateway with alternative provider",
];

export function DisableGatewayModal({
  isOpen,
  onClose,
  gateway,
  onConfirm,
}: DisableGatewayModalProps) {
  const { t, isEn, direction } = useLanguage();
  const reasons = isEn ? disableReasonsEn : disableReasonsAr;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen || !gateway) return null;

  const handleConfirm = () => {
    onConfirm(gateway.id, reasons[selectedIndex] || reasons[0]);
    onClose();
  };

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-[512px] bg-white rounded-[16px] overflow-hidden shadow-[0px_20px_50px_0px_rgba(28,20,15,0.28)] flex flex-col animate-in zoom-in-95 duration-150 text-start"
      >
        {/* Top Accent Line */}
        <div className="h-[6px] w-full bg-[#ba1a1a]" />

        {/* Modal Body Container */}
        <div className="p-8 space-y-4">
          {/* Header Area with Warning Badge */}
          <div className="flex items-start justify-between w-full">
            <div className="flex gap-4 items-start">
              <div className="bg-[#ffdad6] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[8px] size-12 flex items-center justify-center shrink-0">
                <ShieldAlert className="size-6 text-[#93000a]" />
              </div>

              <div className="flex flex-col items-start text-start">
                <div className="flex items-center gap-2">
                  <h2 className="text-[#1b1c1a] text-[22px] font-bold leading-[32px]">
                    {t("تعطيل بوابة الدفع", "Disable Payment Gateway")}
                  </h2>
                  <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    {t("إجراء إداري مقيّد", "Restricted Action")}
                  </span>
                </div>
                <p className="text-[#514537] text-[14px] leading-[22.75px] mt-1 font-normal text-start">
                  {t(
                    "هل أنت متأكد من رغبتك في تعطيل بوابة الدفع المحددة؟ سيؤدي ذلك لحجبها كخيار سداد نشط للعملاء الجدد.",
                    "Are you sure you want to disable this payment gateway? It will be hidden as an active payment option for new clients."
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-[4px] flex items-center justify-center text-[#514537] hover:bg-[#f0eeea] transition-colors cursor-pointer shrink-0"
              aria-label={t("إغلاق", "Close")}
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Selected Gateway Summary Card */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-[4px] size-9 flex items-center justify-center shadow-2xs font-bold text-sm text-[#7b4e00] shrink-0">
                  {gateway.brandType === "bank" ? (isEn ? "Bank" : "بنكي") : gateway.name}
                </div>
                <div className="flex flex-col items-start text-start">
                  <span className="text-[#1b1c1a] text-[14px] font-bold leading-[20px]">
                    {t(`بوابة ${gateway.name} للتحصيل المالي`, `${gateway.name} Payment Gateway`)}
                  </span>
                  <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                    {gateway.providerLegalName}
                  </span>
                </div>
              </div>

              <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono" dir="ltr">
                {gateway.code}
              </span>
            </div>

            {/* 3-Column Sub-grid */}
            <div className="bg-white/60 rounded-[4px] p-2 grid grid-cols-3 gap-2 text-start">
              {/* Col 1: Status */}
              <div className="flex flex-col items-start text-start">
                <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                  {t("الحالة الحالية:", "Current Status:")}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="size-1.5 rounded-full bg-[#059669]" />
                  <span className="text-[#047857] text-[10px] font-bold leading-[14px]">
                    {t("نشطة ومربوطة", "Active & Linked")}
                  </span>
                </div>
              </div>

              {/* Col 2: Subscriptions */}
              <div className="flex flex-col items-start text-start">
                <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                  {t("الاشتراكات المرتبطة:", "Subscriptions:")}
                </span>
                <span className="text-[#1b1c1a] text-[10px] font-bold leading-[14px] mt-0.5">
                  {gateway.activeSubscriptionsCount} {t("اشتراك ساري", "Active Subscriptions")}
                </span>
              </div>

              {/* Col 3: Base Currency */}
              <div className="flex flex-col items-start text-start">
                <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
                  {t("العملة الأساسية:", "Base Currency:")}
                </span>
                <span className="text-[#1b1c1a] text-[10px] font-bold leading-[14px] mt-0.5">
                  {gateway.baseCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Financial & Compliance Guarantee Banner */}
          <div className="bg-[#fffbeb]/90 border border-[#fef3c7] rounded-[8px] p-4 flex gap-2.5 items-start text-start">
            <ShieldCheck className="size-5 shrink-0 mt-0.5 text-[#78350f]" />
            <div className="flex flex-col items-start text-start">
              <span className="text-[#78350f] text-[12px] font-bold leading-[16px] mb-1">
                {t("ضمانة الاستقرار المالي والنظامي:", "Financial & Compliance Guarantee:")}
              </span>
              <p className="text-[#78350f] text-[12px] leading-[19.5px] font-normal">
                {t(
                  "لن يتم إلغاء أو تعديل الاشتراكات السارية أو الفواتير المجدولة سابقاً. سيقتصر التعطيل على حجب البوابة كخيار دفع جديد عند الفوترة والشراء المستقبلي، حفاظاً على حقوق المشتركين والتدفقات النقدية للمنصة.",
                  "Existing active subscriptions or scheduled invoices will not be affected. Disabling will only hide the gateway as a new payment option for future billing."
                )}
              </p>
            </div>
          </div>

          {/* Reason Specification */}
          <div className="flex flex-col gap-1.5 relative">
            <div className="flex items-center justify-between w-full">
              <span className="text-[#1b1c1a] text-[12px] font-semibold">
                {t("سبب التعطيل", "Disable Reason")}
              </span>
              <span className="text-[#837565] text-[10px]">{t("اختياري", "Optional")}</span>
            </div>

            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#f5f3ef] rounded-[4px] px-4 py-3 flex items-center justify-between text-xs text-[#1b1c1a] cursor-pointer hover:bg-[#eae8e4] transition-colors"
            >
              <span>{reasons[selectedIndex]}</span>
              <ChevronDown
                className={`size-3.5 transition-transform text-[#837565] ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-full mt-1 inset-x-0 bg-white rounded-[6px] shadow-lg border border-[#eae8e4] z-20 py-1 overflow-hidden">
                {reasons.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedIndex(i);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-2.5 text-xs text-start cursor-pointer transition-colors ${
                      i === selectedIndex
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
        <div className="border-t border-[#eae8e4] px-4 py-4 flex items-center justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#e4e1dc] text-[#1b1c1a] text-xs font-semibold rounded-[4px] h-10 px-4 flex items-center justify-center transition-colors cursor-pointer"
          >
            {t("الغاء", "Cancel")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#ba1a1a] hover:bg-[#a01616] text-[#fff3e9] text-xs font-bold rounded-[4px] h-10 px-6 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Power className="size-4" />
            <span>{t("تأكيد التعطيل", "Confirm Disable")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}