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
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

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
  const { t } = useLanguage();
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
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif]"
        data-node-id="1:2377"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className="relative w-full max-w-[590px] bg-white dark:bg-[#1f1a16] rounded-[12px] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[14px] animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header: Trash Icon + Title + Close Button */}
        <div className="flex items-start justify-between w-full">
          {/* Close Button (Left) */}
          <button
            type="button"
            onClick={handleClose}
            className="p-[6px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>

          {/* Icon & Title (Right) */}
          <div className="flex items-center gap-[12px]">
            <div className="flex flex-col text-start">
              <h2 className="text-[20px] font-bold text-[#1c140f] dark:text-[#fdfbf7] leading-[28px]">
                {t("حذف المكتب نهائيًا؟", "Delete Law Office Permanently?")}
              </h2>
            </div>
            <div className="size-[44px] rounded-[8px] bg-[rgba(255,218,214,0.4)] dark:bg-[#351616] flex items-center justify-center text-[#ba1a1a] dark:text-[#f87171] shadow-xs shrink-0">
              <Trash2 className="size-[22px]" />
            </div>
          </div>
        </div>

        {/* Target Office Context Callout */}
        <div className="bg-[#f5f3ef] dark:bg-[#281e18] rounded-[6px] p-[14px] flex flex-col gap-[8px]">
          <div className="flex items-start justify-between">
            <span className="bg-[#d1fae5] dark:bg-[#132c1c] text-[#065f46] dark:text-[#6ee7b7] text-[10px] font-semibold px-[8px] py-[2px] rounded-[2px] flex items-center gap-[4px]">
              <span className="size-[5px] bg-[#059669] rounded-full" />
              <span>{t("نشط حالياً", "Currently Active")}</span>
            </span>

            <div className="flex flex-col text-start">
              <span className="text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold">
                {t("المنشأة القانونية المستهدفة", "Target Legal Firm")}
              </span>
              <span className="text-[#1c140f] dark:text-[#fdfbf7] text-[14px] font-bold mt-[1px]">
                {office.name}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-[6px] border-t border-[#eae8e4]/60 dark:border-[#38271c]">
            <div className="flex items-center gap-[4px]">
              <span className="text-[#514537] dark:text-[#cdc5bd] font-semibold">{t("الباقة:", "Plan:")}</span>
              <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">{office.plan}</span>
            </div>

            <div className="flex items-center gap-[4px]">
              <span className="text-[#514537] dark:text-[#cdc5bd] font-semibold">{t("رقم الترخيص العدلي:", "Judicial License:")}</span>
              <span className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold">{licenseNum}</span>
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        <div className="bg-[#fff5f5] dark:bg-[#351616] border border-[#fed7d7] dark:border-[#521b1b] rounded-[6px] p-[12px] flex items-start gap-[10px]">
          <div className="flex-1 flex flex-col text-start">
            <div className="flex items-center gap-[4px]">
              <span className="text-[12px] font-bold text-[#ba1a1a] dark:text-[#f87171]">{t("تنبيه هام:", "Important Warning:")}</span>
              <span className="text-[12px] text-[#514537] dark:text-[#e5e0d8] leading-[18px]">
                {t("هذا الإجراء يختلف جوهرياً عن التعطيل المؤقت؛", "This action differs fundamentally from temporary suspension;")}
              </span>
            </div>
            <p className="text-[12px] text-[#514537] dark:text-[#e5e0d8] leading-[18px] mt-[1px]">
              {t(
                "سيؤدي الحذف إلى إزالة وصول منسوبي المكتب نهائياً وفصل الربط التقني والخدمات السحابية بالكامل.",
                "Deletion permanently revokes office member access and terminates technical and cloud integrations."
              )}
            </p>
          </div>
          <AlertTriangle className="size-[18px] text-[#ba1a1a] dark:text-[#f87171] shrink-0 mt-[2px]" />
        </div>

        {/* 3 Structured Consequences */}
        <div className="flex flex-col gap-[8px]">
          {/* Point 1 */}
          <div className="bg-[#f5f3ef] dark:bg-[#281e18] rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("إلغاء اشتراك المكتب ومقاعد المحامين فوراً", "Immediate Plan & Lawyer Seat Cancellation")}
              </span>
              <span className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-[16px] mt-[1px]">
                {t("إلغاء تفعيل 15 ترخيص مستخدم وإنهاء دورة الفوترة القادمة بصورة نهائية.", "Deactivates all user licenses and permanently ends upcoming billing cycles.")}
              </span>
            </div>
            <div className="p-1 text-[#ba1a1a] shrink-0 mt-[1px]">
              <CircleX className="size-[15px]" />
            </div>
          </div>

          {/* Point 2 */}
          <div className="bg-[#f5f3ef] dark:bg-[#281e18] rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("إيقاف الربط المباشر مع بوابة ناجز القضائية", "Disconnect Judicial Portals Integration")}
              </span>
              <span className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-[16px] mt-[1px]">
                {t("تعطيل المزامنة الآلية ومفاتيح الـ API للقضايا والجلسات الإلكترونية فوراً.", "Terminates automatic sync and API keys for cases and hearings immediately.")}
              </span>
            </div>
            <div className="p-1 text-[#ba1a1a] shrink-0 mt-[1px]">
              <Unlink className="size-[15px]" />
            </div>
          </div>

          {/* Point 3 */}
          <div className="bg-[#f5f3ef] dark:bg-[#281e18] rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("أرشفة البيانات وفصل مفاتيح الوصول السحابي", "Archive Data & Revoke Cloud Subdomain")}
              </span>
              <span className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-[16px] mt-[1px]">
                {t("تجريد منسوبي المكتب من الوصول السحابي وإغلاق النطاق الفرعي alajlan.aljudy.sa.", "Revokes staff cloud access and closes the office subdomain.")}
              </span>
            </div>
            <div className="p-1 text-[#837565] dark:text-[#a89f91] shrink-0 mt-[1px]">
              <KeyRound className="size-[15px]" />
            </div>
          </div>
        </div>

        {/* Regulatory Compliance Warning */}
        <div className="bg-[#f0eeea] dark:bg-[#281e18] border-r-3 border-[#7b4e00] dark:border-[#e29d38] rounded-[4px] p-[12px] flex flex-col gap-[3px] text-start">
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("تنبيه نظامي بخصوص الامتثال والحفظ المالي:", "Regulatory Compliance & Tax Notice:")}
            </span>
            <Shield className="size-[13px] text-[#7b4e00] dark:text-[#e29d38]" />
          </div>
          <p className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-[17px]">
            {t(
              "وفقاً للوائح هيئة الزكاة والضريبة والجمارك وضوابط الامتثال العدلي، قد تخضع السجلات المالية، الفواتير الإلكترونية الصادرة، والقيود المحاسبية لمدد حفظ نظامية ملزمة ولن تُشطب فوراً من السجل المالي للمنصة.",
              "In accordance with tax and regulatory compliance laws, electronic tax invoices and accounting records remain preserved for mandatory retention periods and are not immediately wiped from platform records."
            )}
          </p>
        </div>

        {/* Acknowledgment Checkbox */}
        <label className="bg-[#f5f3ef] dark:bg-[#281e18] hover:bg-[#eae8e4]/70 dark:hover:bg-[#32261e] rounded-[4px] p-[12px] flex items-center justify-between gap-[10px] cursor-pointer transition-colors">
          <div className="flex-1 text-start">
            <span className="text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[18px]">
              {t(
                "أقر بعلمي بتبعات الحذف النهائي وفصل حساب المنشأة القانونية وإلغاء التراخيص المرتبطة بها نهائياً.",
                "I acknowledge the consequences of permanent deletion and revoking of associated firm licenses."
              )}
            </span>
          </div>

          <div
            className={`size-[18px] rounded-[3px] border flex items-center justify-center shrink-0 transition-all ${
              isAcknowledged
                ? "bg-[#ba1a1a] border-[#ba1a1a] text-white"
                : "border-[#837565] bg-white dark:bg-[#1a120d]"
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
        <div className="flex items-center justify-end gap-[10px] pt-[8px] border-t border-[#f0eeea] dark:border-[#38271c]">
          <button
            type="button"
            onClick={handleClose}
            className="bg-white dark:bg-[#281e18] hover:bg-[#f5f3ef] dark:hover:bg-[#34271f] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[20px] py-[9px] rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
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
            <span>{t("حذف المكتب نهائياً", "Delete Office")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
