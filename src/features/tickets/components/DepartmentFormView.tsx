"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { TicketDepartment } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";

export interface DepartmentFormValues {
  id?: string;
  name: string;
  code: string;
  description: string;
  status: "active" | "inactive";
}

interface DepartmentFormViewProps {
  mode: "create" | "edit";
  initialData?: TicketDepartment | null;
  onBack: () => void;
  onSave: (values: DepartmentFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function DepartmentFormView({
  mode,
  initialData,
  onBack,
  onSave,
  isSubmitting = false,
}: DepartmentFormViewProps) {
  const { direction, isEn, t } = useLanguage();
  const [name, setName] = useState(initialData?.name || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isActive, setIsActive] = useState(initialData?.status !== "inactive");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    code?: string;
  }>({});

  const isEdit = mode === "edit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; code?: string } = {};
    if (!name.trim()) {
      nextErrors.name = isEn ? "Department name is required" : "اسم القسم مطلوب";
    }
    if (!code.trim()) {
      nextErrors.code = isEn ? "Department code is required" : "الرمز التعريفي مطلوب";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(
        isEn ? "Please fill in the required fields" : "يرجى تعبئة الحقول المطلوبة"
      );
      return;
    }

    await onSave({
      id: initialData?.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      status: isActive ? "active" : "inactive",
    });
  };

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
            <h1 className="text-[22px] sm:text-[26px] leading-[34px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEdit
                ? t("تعديل القسم", "Edit Department")
                : t("إضافة قسم جديد", "Add New Department")}
            </h1>
            <p className="text-[#514537] dark:text-[#8e8680] text-[13px] sm:text-[14px] leading-[20px] mt-1 max-w-[640px]">
              {isEdit
                ? t(
                    "تحديث بيانات القسم وحالته واختصاصاته ضمن الهيكل التنظيمي للمنصة",
                    "Update department details, status, and scope within the platform structure"
                  )
                : t(
                    "أضف قسمًا جديدًا لتنظيم تذاكر الدعم الفني وتوزيع المهام بدقة وسلاسة",
                    "Add a new department to organize support tickets and distribute tasks seamlessly"
                  )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-white dark:bg-[#281c15] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e6e2dc] dark:border-[#38271c] px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          {isEn ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          <span>{t("العودة للأقسام", "Back to Departments")}</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                <span>{t("اسم القسم", "Department Name")}</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder={
                  isEn
                    ? "e.g., Technical Support & Integration"
                    : "مثال: قسم الدعم الفني والربط التقني"
                }
                className="w-full h-10 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
              {fieldErrors.name ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">{fieldErrors.name}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                <span>{t("الرمز التعريفي", "Department Code")}</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (fieldErrors.code) {
                    setFieldErrors((prev) => ({ ...prev, code: undefined }));
                  }
                }}
                placeholder="DEP-01"
                className="w-full h-10 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] font-mono text-[13px] rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
              {fieldErrors.code ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">{fieldErrors.code}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("وصف واختصاصات القسم", "Department Description & Scope")}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isEn
                  ? "Write a summary of cases or services handled by this department..."
                  : "اكتب نبذة عن القضايا أو الخدمات التي يتولى هذا القسم معالجتها..."
              }
              className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] rounded-[6px] p-3 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] resize-none"
            />
          </div>

          <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-4 flex items-center justify-between border border-[#eae8e4]/60 dark:border-[#38271c] gap-4">
            <div className="flex flex-col text-start min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px]">
                  {isEdit
                    ? t("حالة القسم", "Department Status")
                    : t("تفعيل القسم فور الإنشاء", "Activate Department Immediately")}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                    isActive
                      ? "bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7]"
                      : "bg-[#e5dede] dark:bg-[#1a120d] text-[#666261] dark:text-[#a89f91]"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${isActive ? "bg-[#1b7340]" : "bg-[#625d5d]"}`} />
                  {isActive ? t("نشط ومفعل", "Active & Enabled") : t("غير نشط", "Inactive")}
                </span>
              </div>
              <p className="text-[#625d5d] dark:text-[#a89f91] text-[11px] leading-[18px] pt-1">
                {t(
                  "القسم النشط متاح لإسناد التذاكر فوراً، بينما غير النشط محجوب عن خيارات الإسناد.",
                  "An active department is available for ticket routing; inactive is paused from routing options."
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              aria-pressed={isActive}
              className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? "bg-[#10b981]" : "bg-[#d1ccc4] dark:bg-[#3d2a1d]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-[20px] rounded-full bg-white shadow transform transition duration-200 ease-in-out mt-[2px] ${
                  isEn
                    ? isActive
                      ? "translate-x-5"
                      : "translate-x-0.5"
                    : isActive
                      ? "-translate-x-5"
                      : "-translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-[#eae8e4] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#1a120d] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-[6px] bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e4e1dc] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold cursor-pointer transition-colors disabled:opacity-60"
          >
            {t("إلغاء", "Cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#835401] dark:hover:bg-[#d4922f] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4 stroke-[2.5]" />
            )}
            <span>
              {isEdit ? t("حفظ التعديلات", "Save Changes") : t("حفظ القسم", "Save Department")}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
