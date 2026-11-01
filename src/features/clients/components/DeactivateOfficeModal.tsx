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
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { ModalPortal } from "@/components/shared/ModalPortal";

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
  const { t } = useLanguage();
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
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif]"
        data-node-id="1:2299"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className="relative w-full max-w-[560px] bg-white dark:bg-[#1f1a16] rounded-[12px] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[16px] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header: Warning Icon + Title + Close Button */}
        <div className="flex items-start justify-between w-full">
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="p-[6px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>

          {/* Icon & Title */}
          <div className="flex items-center gap-[12px]">
            <div className="flex flex-col text-start">
              <h2 className="text-[20px] font-bold text-[#1c140f] dark:text-[#fdfbf7] leading-[28px]">
                {t("تعطيل حساب المكتب؟", "Suspend Office Account?")}
              </h2>
            </div>
            <div className="size-[44px] rounded-[8px] bg-[rgba(255,218,214,0.4)] dark:bg-[#351616] flex items-center justify-center text-[#ba1a1a] dark:text-[#f87171] shadow-xs shrink-0">
              <Ban className="size-[22px]" />
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

        {/* Impact Description */}
        <p className="text-[#1b1c1a] dark:text-[#cdc5bd] text-[13px] leading-[20px] text-start">
          {t(
            "سيتم تعطيل وصول المكتب إلى المنصة وفق سياسة الحسابات. تأكد من مراجعة أثر التعطيل الفوري قبل المتابعة:",
            "Office access to the platform will be suspended according to account policy. Please review the immediate impact before proceeding:"
          )}
        </p>

        {/* Structured Impact Bullet Points */}
        <div className="flex flex-col gap-[8px]">
          {/* Point 1 */}
          <div className="bg-[#f5f3ef]/70 dark:bg-[#281e18]/70 rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("إيقاف فوري لتسجيل الدخول", "Immediate Login Suspension")}
              </span>
              <span className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-[16px] mt-[1px]">
                {t("منع وصول كافة المحامين، المستشارين، ومسؤولي النظام للمكتب في الحال.", "Immediately blocks access for all lawyers, consultants, and office admins.")}
              </span>
            </div>
            <div className="p-1 text-[#ba1a1a] shrink-0 mt-[1px]">
              <Ban className="size-[15px]" />
            </div>
          </div>

          {/* Point 2 */}
          <div className="bg-[#f5f3ef]/70 dark:bg-[#281e18]/70 rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("فصل الحساب عن دورة الفوترة المالية", "Account Billing Cycle Separation")}
              </span>
              <span className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-[16px] mt-[1px]">
                {t("لا يؤثر تعطيل الحساب على دورة الاشتراك القائم أو الفواتير المستحقة نظامياً.", "Suspension does not waive outstanding invoices or current subscription obligations.")}
              </span>
            </div>
            <div className="p-1 text-[#9c6402] shrink-0 mt-[1px]">
              <Receipt className="size-[15px]" />
            </div>
          </div>

          {/* Point 3 */}
          <div className="bg-[#f5f3ef]/70 dark:bg-[#281e18]/70 rounded-[4px] p-[10px] flex items-start gap-[10px]">
            <div className="flex-1 flex flex-col text-start">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("حفظ البيانات والأرشيف القضائي", "Preservation of Legal Archive")}
              </span>
              <span className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-[16px] mt-[1px]">
                {t("تظل كافة الوثائق، الصكوك، ومستندات القضايا السحابية مشفرة ومحفوظة بالكامل.", "All cloud legal files, deeds, and documents remain securely encrypted and preserved.")}
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
            <span className="text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">{t("سبب التعطيل", "Suspension Reason")}</span>
            <span className="text-[11px] text-[#837565] dark:text-[#8e8680] font-normal">{t("(اختياري للتوثيق الإداري)", "(Optional for administrative records)")}</span>
          </div>

          <DashboardSelect
            aria-label={t("سبب التعطيل", "Suspension Reason")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("حدد سبب التعطيل من القائمة المعتمدة...", "Select suspension reason from list...")}
            className="bg-white dark:bg-[#281e18] border-[#eae8e4] dark:border-[#38271c]"
          >
            <option value="">{t("حدد سبب التعطيل من القائمة المعتمدة...", "Select suspension reason from list...")}</option>
            <option value="بانتظار السداد">{t("بانتظار سداد الفاتورة الدورية", "Pending payment of periodic invoice")}</option>
            <option value="طلب من مالك المكتب">{t("بناءً على طلب رسمي من مالك المكتب", "Formal request from office owner")}</option>
            <option value="مراجعة التراخيص العدلية">{t("تدقيق ومراجعة رخصة المحاماة", "Audit and review of legal license")}</option>
            <option value="مخالفة شروط الاستخدام">{t("مخالفة سياسة الاستخدام المنصوص عليها", "Violation of terms of use policy")}</option>
            <option value="أخرى">{t("أسباب إدارية أخرى", "Other administrative reasons")}</option>
          </DashboardSelect>

          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("ملاحظات إضافية لسجل المراجعة والتدقيق الإداري...", "Additional notes for administrative audit log...")}
            className="w-full bg-white dark:bg-[#281e18] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] p-[10px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#ba1a1a] resize-none shadow-2xs"
          />
        </div>

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
            onClick={handleConfirm}
            className="bg-[#ba1a1a] hover:bg-[#991b1b] text-white px-[22px] py-[9px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <Ban className="size-[14px]" />
            <span>{t("تعطيل الحساب", "Suspend Account")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
