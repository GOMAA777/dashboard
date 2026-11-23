"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Pencil,
  Hash,
  FileText,
  Ticket,
  Users,
} from "lucide-react";
import { TicketDepartment } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";

interface DepartmentDetailsViewProps {
  department: TicketDepartment;
  onBack: () => void;
  onEdit?: (dept: TicketDepartment) => void;
}

export function DepartmentDetailsView({
  department,
  onBack,
  onEdit,
}: DepartmentDetailsViewProps) {
  const { direction, isEn, t } = useLanguage();
  const isActive = department.status === "active";

  return (
    <div
      dir={direction}
      className="flex flex-col gap-6 w-full shrink-0 font-['Cairo',sans-serif]"
    >
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-[8px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0 border border-[#eae8e4] dark:border-[#423122]">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] sm:text-[26px] leading-[34px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {department.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  isActive
                    ? "bg-[#ecfdf5] border-emerald-200 text-[#065f46] dark:bg-[#132c1c] dark:border-emerald-500/40 dark:text-[#6ee7b7]"
                    : "bg-[#f5f3ef] border-[#eae8e4] text-[#666261] dark:bg-[#281c15] dark:border-[#4d3627] dark:text-[#cdc5bd]"
                }`}
              >
                <span
                  className={`size-[7px] rounded-full ${
                    isActive ? "bg-[#10b981]" : "bg-[#837565]"
                  }`}
                />
                {isActive ? t("نشط", "Active") : t("غير نشط", "Inactive")}
              </span>
            </div>
            <p className="text-[#514537] dark:text-[#8e8680] text-[13px] sm:text-[14px] leading-[20px] mt-1">
              {t("تفاصيل القسم ضمن الهيكل التنظيمي للمنصة", "Department details within the platform structure")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(department)}
              className="bg-[#9c6402] hover:bg-[#855402] text-white px-4 py-2 rounded-[4px] font-semibold text-[13px] flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>{t("تعديل القسم", "Edit Department")}</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onBack}
            className="bg-white dark:bg-[#281c15] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e6e2dc] dark:border-[#38271c] px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isEn ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
            <span>{t("العودة", "Back")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-5 sm:p-6 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#837565] dark:text-[#a89f91] text-[12px] font-bold">
              <Hash className="size-3.5" />
              <span>{t("الرمز التعريفي", "Department Code")}</span>
            </div>
            <span className="inline-flex items-center bg-[#f0eeea] dark:bg-[#2d1f16] text-[#61564f] dark:text-[#cdc5bd] font-bold text-[13px] px-2.5 py-1 rounded-[4px] font-mono">
              {department.code}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#837565] dark:text-[#a89f91] text-[12px] font-bold">
              <Building2 className="size-3.5" />
              <span>{t("اسم القسم", "Department Name")}</span>
            </div>
            <p className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {department.name}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#837565] dark:text-[#a89f91] text-[12px] font-bold">
              <FileText className="size-3.5" />
              <span>{t("الوصف والاختصاصات", "Description & Scope")}</span>
            </div>
            <p className="text-[13px] leading-[22px] text-[#514537] dark:text-[#cdc5bd] bg-[#faf8f5] dark:bg-[#1a120d] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] p-4">
              {department.description?.trim()
                ? department.description
                : t("لا يوجد وصف مسجّل لهذا القسم", "No description recorded for this department")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#837565] dark:text-[#a89f91] text-[12px] font-bold">
              <Ticket className="size-3.5" />
              <span>{t("التذاكر النشطة", "Active Tickets")}</span>
            </div>
            <p className="text-[28px] font-black text-[#9c6402] dark:text-[#e29d38] font-mono leading-none">
              {department.activeTicketsCount}
            </p>
          </div>

          <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#837565] dark:text-[#a89f91] text-[12px] font-bold">
              <Users className="size-3.5" />
              <span>{t("المستشارون / الفريق", "Consultants / Team")}</span>
            </div>
            <p className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7] font-mono leading-none">
              {department.consultantsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
