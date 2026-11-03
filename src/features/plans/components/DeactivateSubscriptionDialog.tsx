"use client";

import React, { useState } from "react";
import { X, Pause, Ban, Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { DetailedSubscribedFirm } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { ModalPortal } from "@/components/shared/ModalPortal";

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
  const { t } = useLanguage();
  const [reason, setReason] = useState("بطلب رسمي موثق من إدارة المكتب");
  const [notes, setNotes] = useState("");
  const [deactivationMode, setDeactivationMode] = useState<"immediate" | "end_of_cycle">("immediate");

  if (!isOpen) return null;

  const firmName =
    firm?.name ||
    t("مكتب خالد بن عبد العزيز العجلان للمحاماة والاستشارات القانونية", "Khalid Al-Ajlan Law & Legal Consultations");
  const licenseNumber = firm?.licenseNumber || "38/412";
  const city = firm?.city || t("الرياض", "Riyadh");
  const renewalDate = firm?.renewalDate || t("15 نوفمبر 2024", "15 Nov 2024");
  const casesUsed = firm?.casesUsed || 194;
  const lawyersUsed = firm?.lawyersUsed || 4;

  const handleConfirm = () => {
    if (onConfirmDeactivate && firm) {
      onConfirmDeactivate(firm.id, reason, notes, deactivationMode);
    } else {
      toast.success(
        t(
          `تم تعطيل اشتراك "${firmName}" ${
            deactivationMode === "immediate"
              ? "فوراً"
              : `بنهاية الدورة الحالية (${renewalDate})`
          }.`,
          `Subscription for "${firmName}" deactivated ${
            deactivationMode === "immediate"
              ? "immediately"
              : `at the end of current cycle (${renewalDate})`
          }.`
        )
      );
    }
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-[16px] animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full max-w-[680px] bg-white dark:bg-[#221812] rounded-[10px] shadow-2xl border border-[#e2ded7] dark:border-[#38271c] overflow-hidden font-['Cairo',sans-serif]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[10px] bg-[#fef2f2] dark:bg-[#381a1a] border border-[#fecaca] dark:border-[#5c2424] text-[#dc2626] dark:text-[#f87171] flex items-center justify-center shrink-0">
              <Pause className="size-[20px] fill-current" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("تعطيل اشتراك الباقة للمكتب؟", "Deactivate Firm's Subscription?")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-[6px] rounded-[4px] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-[20px] pb-[20px] space-y-[18px] max-h-[80vh] overflow-y-auto">
          {/* Firm Summary Box */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[16px] space-y-[12px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[8px]">
              <div>
                <h3 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {firmName}
                </h3>
                <p className="text-[11px] text-[#737067] dark:text-[#cdc5bd]">
                  {t("ترخيص عدلي:", "License:")} {licenseNumber} • {city}
                </p>
              </div>

              <div className="flex items-center gap-[8px]">
                <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#9c6402] dark:text-[#f3c27e] bg-[#fbf6ee] dark:bg-[rgba(226,157,56,0.18)] px-[8px] py-[2px] rounded border border-[#f5e3c8] dark:border-[#e29d38]/50">
                  <span className="size-[6px] rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
                  <span>{t("الباقة الفضية", "Silver Plan")}</span>
                </span>
                <span className="text-[12px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                  399 {t("ر.س /شهرياً", "SAR /month")}
                </span>
              </div>
            </div>

            {/* 4 Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px] pt-[8px] border-t border-[#f0eeea] dark:border-[#38271c]">
              <div className="bg-white dark:bg-[#221812] p-[8px] rounded-[6px] border border-[#f0eeea] dark:border-[#38271c]">
                <div className="text-[10px] text-[#737067] dark:text-[#cdc5bd]">
                  {t("تاريخ البداية", "Start Date")}
                </div>
                <div className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mt-[2px]">
                  {t("15 يناير 2024", "15 Jan 2024")}
                </div>
              </div>

              <div className="bg-white dark:bg-[#221812] p-[8px] rounded-[6px] border border-[#f0eeea] dark:border-[#38271c]">
                <div className="text-[10px] text-[#737067] dark:text-[#cdc5bd]">
                  {t("موعد التجديد القادم", "Next Renewal")}
                </div>
                <div className="text-[12px] font-bold text-[#b91c1c] dark:text-[#f87171] mt-[2px]">
                  {renewalDate}
                </div>
                <div className="text-[9px] text-[#b91c1c] dark:text-[#f87171]">
                  ({t("متبقي 22 يوماً", "22 days remaining")})
                </div>
              </div>

              <div className="bg-white dark:bg-[#221812] p-[8px] rounded-[6px] border border-[#f0eeea] dark:border-[#38271c]">
                <div className="text-[10px] text-[#737067] dark:text-[#cdc5bd]">
                  {t("القضايا النشطة", "Active Cases")}
                </div>
                <div className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mt-[2px]">
                  {casesUsed} {t("قضية", "cases")}
                </div>
              </div>

              <div className="bg-white dark:bg-[#221812] p-[8px] rounded-[6px] border border-[#f0eeea] dark:border-[#38271c]">
                <div className="text-[10px] text-[#737067] dark:text-[#cdc5bd]">
                  {t("المحامون المرتبطون", "Linked Lawyers")}
                </div>
                <div className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mt-[2px]">
                  {lawyersUsed} {t("مستخدمين مفعلين", "active users")}
                </div>
              </div>
            </div>
          </div>

          {/* Reason Field */}
          <div>
            <div className="flex items-center justify-between mb-[6px]">
              <label
                htmlFor="deactivate-reason-select"
                className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("سبب التعطيل وتوثيق الإجراء الإداري", "Deactivation Reason & Documentation")}{" "}
                <span className="text-[#b91c1c]">*</span>
              </label>
              <span className="text-[10px] font-bold text-[#737067] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#281c15] px-[6px] py-[2px] rounded">
                {t("مطلوب للتدقيق الرقابي", "Required for compliance")}
              </span>
            </div>

            <DashboardSelect
              id="deactivate-reason-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-[40px] text-[13px] bg-[#f5f3ef] dark:bg-[#281c15] border-[#e2ded7] dark:border-[#38271c]"
            >
              <option value="بطلب رسمي موثق من إدارة المكتب">
                {t("بطلب رسمي موثق من إدارة المكتب", "Official request documented from office management")}
              </option>
              <option value="تأخر سداد الفاتورة الدورية وتجاوز فترة السماح">
                {t("تأخر سداد الفاتورة الدورية وتجاوز فترة السماح", "Overdue periodic invoice exceeding grace period")}
              </option>
              <option value="مخالفة شروط الاستخدام أو تجاوز الحدود التعاقدية">
                {t("مخالفة شروط الاستخدام أو تجاوز الحدود التعاقدية", "Violation of terms or exceeding contractual quotas")}
              </option>
              <option value="أسباب إدارية داخلية بالتنسيق مع المشرف العام">
                {t("أسباب إدارية داخلية بالتنسيق مع المشرف العام", "Internal administrative reasons aligned with supervisor")}
              </option>
            </DashboardSelect>
          </div>

          {/* Notes Field */}
          <div>
            <label
              htmlFor="deactivate-notes-input"
              className="block text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-[6px]"
            >
              {t("ملاحظات وتوجيهات المشرف العام (اختياري)", "Supervisor Notes & Directives (Optional)")}
            </label>
            <textarea
              id="deactivate-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(
                "أدخل تفاصيل الطلب، رقم المرجع الداخلي، أو ملاحظات التسوية الخاصة بمسؤول الحساب...",
                "Enter request details, internal reference number, or account settlement notes..."
              )}
              className="w-full bg-[#f5f3ef] dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] rounded-[6px] p-[12px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 resize-none"
            />
          </div>

          {/* Deactivation Timeline Options */}
          <div>
            <div className="flex items-center gap-[6px] text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-[10px]">
              <Calendar className="size-[15px] text-[#9c6402] dark:text-[#e29d38]" />
              <span>{t("خيارات سريان التعطيل والأثر المالي", "Deactivation Timeline & Financial Impact")}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
              {/* Option 1: Immediate */}
              <div
                onClick={() => setDeactivationMode("immediate")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer border ${
                  deactivationMode === "immediate"
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#fdfbf7] dark:bg-[#2d1f16] shadow-2xs"
                    : "border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] hover:border-[#cfcac1]"
                }`}
              >
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="flex items-center gap-[8px]">
                    <div
                      className={`size-[16px] rounded-full border flex items-center justify-center shrink-0 ${
                        deactivationMode === "immediate"
                          ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                          : "border-[#cfcac1] dark:border-[#4d3627] bg-white dark:bg-[#221812]"
                      }`}
                    >
                      {deactivationMode === "immediate" && (
                        <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("تعطيل فوري للاشتراك", "Immediate Deactivation")}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold bg-[#fee2e2] dark:bg-[#381a1a] text-[#b91c1c] dark:text-[#f87171] px-[6px] py-[1px] rounded">
                    {t("فوري", "Immediate")}
                  </span>
                </div>

                <p className="text-[11px] text-[#737067] dark:text-[#cdc5bd] leading-relaxed">
                  {t(
                    "إيقاف الميزات النشطة والتجديد التلقائي في الحال مع حفظ النسخ الاحتياطية.",
                    "Instantly suspend active features and auto-renewal while preserving secure data backups."
                  )}
                </p>
              </div>

              {/* Option 2: End of cycle */}
              <div
                onClick={() => setDeactivationMode("end_of_cycle")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer border ${
                  deactivationMode === "end_of_cycle"
                    ? "border-[#9c6402] dark:border-[#e29d38] bg-[#fdfbf7] dark:bg-[#2d1f16] shadow-2xs"
                    : "border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] hover:border-[#cfcac1]"
                }`}
              >
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="flex items-center gap-[8px]">
                    <div
                      className={`size-[16px] rounded-full border flex items-center justify-center shrink-0 ${
                        deactivationMode === "end_of_cycle"
                          ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                          : "border-[#cfcac1] dark:border-[#4d3627] bg-white dark:bg-[#221812]"
                      }`}
                    >
                      {deactivationMode === "end_of_cycle" && (
                        <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("نهاية الدورة الحالية", "End of Current Cycle")}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#737067] dark:text-[#cdc5bd] leading-relaxed">
                  {t(
                    `استمرار الخدمة حتى ${renewalDate} وعدم التجديد للدورة اللاحقة.`,
                    `Service remains active until ${renewalDate} without renewing for the subsequent cycle.`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-[16px] bg-[#faf8f5] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-[9px] rounded-[6px] bg-white dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-[20px] py-[9px] rounded-[6px] bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <Ban className="size-[15px]" />
            <span>{t("تعطيل الاشتراك", "Deactivate Subscription")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
