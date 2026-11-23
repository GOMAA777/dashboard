"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  DoorOpen,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  FileText,
  Ticket,
  Sparkles,
  Loader2,
  Building2,
} from "lucide-react";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { DashboardSelect, type DashboardSelectOption } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { usePermissions } from "@/lib/permissions";
import {
  OFFICE_ACTIVITY_CATEGORIES,
  type OfficeActivityCategory,
} from "@/lib/constants/office-activities";
import type { ClientOffice } from "../types/client.types";
import { cn } from "@/lib/utils";

export interface OfficeEntryActivityPayload {
  activityType: string;
  reason: string;
  ticketId?: string;
}

interface EnterOfficeConfirmModalProps {
  isOpen: boolean;
  office: ClientOffice | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (activityData?: OfficeEntryActivityPayload) => void;
}

export function EnterOfficeConfirmModal({
  isOpen,
  office,
  isLoading = false,
  onClose,
  onConfirm,
}: EnterOfficeConfirmModalProps) {
  const { t, isEn, direction } = useLanguage();
  const { isSuperAdmin, hasPermission, user } = usePermissions();

  const canBypass =
    isSuperAdmin ||
    hasPermission("clients.impersonate_bypass_reason") ||
    user?.role === "super_admin" ||
    user?.role === "admin";

  const defaultActivityCategory = OFFICE_ACTIVITY_CATEGORIES?.[0]?.id || "tech_support";
  const [activityType, setActivityType] = useState<string>(defaultActivityCategory);
  const [reason, setReason] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [wantToLogActivity, setWantToLogActivity] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActivityType(OFFICE_ACTIVITY_CATEGORIES?.[0]?.id || "tech_support");
      setReason("");
      setTicketId("");
      setSubmittedAttempt(false);
      setWantToLogActivity(false);
    }
  }, [isOpen]);

  const categoryOptions: DashboardSelectOption[] = React.useMemo(() => {
    return (OFFICE_ACTIVITY_CATEGORIES || []).map((cat) => ({
      value: cat.id,
      label: isEn ? cat.labelEn : cat.labelAr,
    }));
  }, [isEn]);

  if (!isOpen || !office) return null;

  const mustProvideReason = !canBypass || wantToLogActivity;
  const isReasonValid = !mustProvideReason || reason.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (!isReasonValid) return;

    if (!mustProvideReason) {
      onConfirm({
        activityType: "admin_direct",
        reason: t("دخول مباشر للمدير العام", "Direct Super Admin Entry"),
      });
      return;
    }

    onConfirm({
      activityType,
      reason: reason.trim(),
      ticketId: ticketId.trim() || undefined,
    });
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif] animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) onClose();
        }}
      >
        <div
          className="relative w-full max-w-[560px] bg-white dark:bg-[#1f1a16] rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] border border-[#eae8e4] dark:border-[#38271c] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-[#f0eeea] dark:border-[#2f2015] bg-[#faf8f5] dark:bg-[#17110d]">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-[10px] bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.15)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center border border-[#e8dccb] dark:border-[#4d3725] shrink-0 shadow-xs">
                <DoorOpen className="size-5" />
              </div>
              <div className="text-start">
                <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("دخول مكتب المحاماة كمسؤول", "Enter Law Firm as Admin")}
                </h3>
                <p className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                  {t(
                    "جلسة إشرافية موثقة وآمنة للوصول إلى لوحة المكتب",
                    "Audited and secure supervisory session to access the office dashboard"
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="p-1.5 rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#2c1f17] text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 scrollbar-thin">
            {/* Target Firm Info Card */}
            <div className="bg-[#faf8f5] dark:bg-[#150f0b] border border-[#f0eeea] dark:border-[#2f2015] rounded-[10px] p-3.5 flex items-center gap-3">
              <div className="size-10 rounded-[8px] bg-white dark:bg-[#221711] border border-[#e8dccb] dark:border-[#38271c] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0 shadow-xs">
                <Building2 className="size-5" />
              </div>
              <div className="flex-1 min-w-0 text-start">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                    {office.name}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#f1efe9] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border border-[#e5e1d8] dark:border-[#38271c]">
                    #{office.id}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#837565] dark:text-[#a89f91]">
                  {office.owner && <span>{office.owner}</span>}
                  {office.email && <span className="font-mono">{office.email}</span>}
                </div>
              </div>
            </div>

            {/* Role & Security Banner */}
            {canBypass ? (
              <div className="bg-[#f0fdf4] dark:bg-[#052e16]/40 border border-[#bbf7d0] dark:border-[#166534]/50 rounded-[10px] p-3.5 flex flex-col gap-2 text-start">
                <div className="flex items-center gap-2 text-[#15803d] dark:text-[#4ade80]">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span className="text-[12px] font-bold">
                    {t(
                      "صلاحية إدارية عليا: استثناء تسجيل النشاط متاح",
                      "Super Admin Privileges: Activity logging bypass available"
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-[#166534] dark:text-[#86efac]/90 leading-relaxed">
                  {t(
                    "بصفتك مديراً عاماً، يمكنك الدخول السريع المباشر أو توثيق نشاط الجلسة اختيارياً لتسجيله في سجل النشاطات.",
                    "As a Super Admin, you can enter directly or optionally document an activity for the audit trail."
                  )}
                </p>

                <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wantToLogActivity}
                    onChange={(e) => setWantToLogActivity(e.target.checked)}
                    className="size-4 rounded border-[#bbf7d0] text-[#9c6402] focus:ring-[#9c6402] cursor-pointer"
                  />
                  <span className="text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("توثيق نشاط وسبب لهذه الزيارة في السجل", "Document an activity & reason for this entry")}
                  </span>
                </label>
              </div>
            ) : (
              <div className="bg-[#fffbeb] dark:bg-[#2d1f04]/50 border border-[#fde68a] dark:border-[#b45309]/50 rounded-[10px] p-3.5 flex items-start gap-2.5 text-start">
                <ShieldAlert className="size-4 text-[#b45309] dark:text-[#f59e0b] shrink-0 mt-0.5" />
                <div className="text-[12px] text-[#92400e] dark:text-[#fde68a] leading-relaxed">
                  <strong className="font-bold block mb-0.5">
                    {t("إجراء أمني إلزامي للموظفين", "Mandatory Security Action for Staff")}
                  </strong>
                  {t(
                    "وفقاً لسياسات الأمان والحوكمة، يلزم تسجيل تصنيف النشاط ومبرر الدخول قبل منح الوصول إلى لوحة المكتب.",
                    "Per security and governance policy, you must log the activity category and reason before accessing the office dashboard."
                  )}
                </div>
              </div>
            )}

            {/* Mandatory Fields for Staff or Optional for Admin */}
            {mustProvideReason && (
              <div className="space-y-4 pt-1 text-start">
                {/* 1. Activity Category Select */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1.5">
                    {t("نوع النشاط / تصنيف الزيارة", "Activity Type / Visit Category")} <span className="text-red-500">*</span>
                  </label>
                  <DashboardSelect
                    value={activityType}
                    optionsList={categoryOptions}
                    onChange={(e) => setActivityType(e.target.value)}
                    disabled={isLoading}
                    containerClassName="w-full relative z-20"
                    className="w-full h-[42px] px-3.5 rounded-[8px] bg-[#faf8f5] dark:bg-[#17110d] border border-[#e8dccb] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#9c6402]/30 focus:border-[#9c6402] transition-all cursor-pointer"
                  >
                    {(OFFICE_ACTIVITY_CATEGORIES || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {isEn ? cat.labelEn : cat.labelAr}
                      </option>
                    ))}
                  </DashboardSelect>

                  {/* Quick-select category chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {(OFFICE_ACTIVITY_CATEGORIES || []).map((cat) => {
                      const isSelected = activityType === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          disabled={isLoading}
                          onClick={() => setActivityType(cat.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-[6px] text-[11px] font-semibold border transition-all cursor-pointer",
                            isSelected
                              ? "bg-[#9c6402] text-white border-[#9c6402] shadow-xs dark:bg-[#e29d38] dark:text-[#1a120d] dark:border-[#e29d38]"
                              : "bg-[#faf8f5] dark:bg-[#17110d] text-[#514537] dark:text-[#cdc5bd] border-[#e8dccb] dark:border-[#38271c] hover:border-[#9c6402]/50 hover:bg-white dark:hover:bg-[#221812]"
                          )}
                        >
                          {isEn ? cat.labelEn : cat.labelAr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Detailed Reason Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("سبب ومبرر الدخول إلى المكتب", "Reason for Entering Office")} <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                      {reason.trim().length} {t("حرف", "chars")}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isLoading}
                    placeholder={t(
                      "يرجى توضيح سبب الزيارة وما ستقوم بتنفيذه داخل لوحة المكتب بالتفصيل...",
                      "Explain the visit purpose and what actions will be performed inside the dashboard..."
                    )}
                    className={cn(
                      "w-full p-3 rounded-[8px] bg-[#faf8f5] dark:bg-[#17110d] border text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] placeholder:text-[#a89f91] focus:outline-none focus:ring-2 transition-all resize-none",
                      submittedAttempt && !isReasonValid
                        ? "border-red-500 focus:ring-red-400/30"
                        : "border-[#e8dccb] dark:border-[#38271c] focus:ring-[#9c6402]/30 focus:border-[#9c6402]"
                    )}
                  />
                  {submittedAttempt && !isReasonValid && (
                    <p className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {t("يرجى كتابة سبب الدخول (3 أحرف على الأقل)", "Please enter a valid reason (min 3 characters)")}
                    </p>
                  )}
                </div>

                {/* 3. Ticket ID or Reference (Optional) */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1.5">
                    {t("رقم التذكرة أو المرجع المرتبط", "Associated Ticket or Reference #")}{" "}
                    <span className="text-[11px] font-normal text-[#837565] dark:text-[#a89f91]">({t("اختياري", "Optional")})</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      disabled={isLoading}
                      placeholder={t("مثال: #TCK-2026-094", "e.g. #TCK-2026-094")}
                      className="w-full h-[38px] px-3 ps-9 rounded-[8px] bg-[#faf8f5] dark:bg-[#17110d] border border-[#e8dccb] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] placeholder:text-[#a89f91] focus:outline-none focus:ring-2 focus:ring-[#9c6402]/30 focus:border-[#9c6402] transition-all font-mono"
                    />
                    <Ticket className="size-4 text-[#837565] dark:text-[#a89f91] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-[#f0eeea] dark:border-[#2f2015] flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="h-[38px] px-4 rounded-[8px] bg-[#f5f3ef] hover:bg-[#eae8e4] dark:bg-[#281c15] dark:hover:bg-[#34251c] text-[#514537] dark:text-[#cdc5bd] text-[13px] font-bold transition-colors cursor-pointer"
              >
                {t("إلغاء", "Cancel")}
              </button>

              <button
                type="submit"
                disabled={isLoading || (submittedAttempt && !isReasonValid)}
                className="h-[38px] px-5 rounded-[8px] bg-[#9c6402] hover:bg-[#78350f] dark:bg-[#e29d38] dark:hover:bg-[#c8872b] text-white dark:text-[#1c140f] text-[13px] font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>{t("جاري التحضير والدخول...", "Entering...")}</span>
                  </>
                ) : (
                  <>
                    <DoorOpen className="size-4" />
                    <span>
                      {!mustProvideReason
                        ? t("دخول سريع كمدير عام", "Quick Admin Entry")
                        : t("تسجيل النشاط ودخول المكتب", "Log Activity & Enter")}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
