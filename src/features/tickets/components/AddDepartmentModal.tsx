"use client";

import React, { useState } from "react";
import { X, Check, Building2 } from "lucide-react";
import { toast } from "sonner";
import { TicketDepartment } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface AddDepartmentModalProps {
  onClose: () => void;
  onSave: (newDept: TicketDepartment) => void;
}

export function AddDepartmentModal({ onClose, onSave }: AddDepartmentModalProps) {
  const { direction, isEn } = useLanguage();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(isEn ? "Please enter department name" : "يرجى إدخال اسم القسم");
      return;
    }

    setIsSubmitting(true);
    const randomId = Math.floor(10 + Math.random() * 90);
    const newDepartment: TicketDepartment = {
      id: `dep-${Date.now()}`,
      code: `DEP-0${randomId}`,
      name: name.trim(),
      description:
        description.trim() ||
        (isEn
          ? "Specialized administrative department handling legal & technical support tickets."
          : "قسم تنظيمي متخصص لمتابعة مهام وتذاكر الاستشارات القانونية والتقنية بالمنصة."),
      status: isActive ? "active" : "inactive",
      activeTicketsCount: 0,
      consultantsCount: 1,
    };

    onSave(newDepartment);
    setIsSubmitting(false);
  };

  return (
    <ModalPortal isOpen>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs antialiased"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#221812] rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.55)] w-full max-w-[620px] overflow-hidden flex flex-col relative text-start animate-in fade-in zoom-in-95 duration-150 border border-transparent dark:border-[#38271c]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Accent Line */}
          <div className="h-[6px] w-full bg-gradient-to-r from-[#9c6402] via-[#e5b352] to-[#9c6402] dark:from-[#e29d38] dark:via-[#f3c27e] dark:to-[#e29d38]" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-[24px] pt-[20px] pb-[16px] border-b border-[#eae8e4]/60 dark:border-[#38271c]">
            <div className="flex items-center gap-[12px]">
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] size-[44px] rounded-[8px] flex items-center justify-center shrink-0 border border-transparent dark:border-[#423122]">
                <Building2 className="size-[20px] text-[#9c6402] dark:text-[#e29d38]" />
              </div>
              <div className="flex flex-col gap-[2px]">
                <h2 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[20px] leading-[26px]">
                  {isEn ? "Add New Department" : "إضافة قسم جديد"}
                </h2>
                <p className="text-[#514537] dark:text-[#a89f91] text-[12px] leading-[18px]">
                  {isEn
                    ? "Add a new department to organize support tickets and distribute tasks seamlessly"
                    : "أضف قسمًا جديدًا لتنظيم تذاكر الدعم الفني وتوزيع المهام بدقة وسلاسة"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] size-[32px] rounded-[6px] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-[14px]" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] p-[24px]">
            {/* Field 1: Department Name */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                  <span>{isEn ? "Department Name" : "اسم القسم"}</span>
                  <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
                </label>
              </div>
              <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91]">
                {isEn
                  ? "Enter the department name (e.g. Technical Support, Client Relations, Advisory)"
                  : "أدخل اسم القسم باللغة العربية (مثال: الدعم التقني والربط، خدمة العملاء، الاستشارات)"}
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  isEn
                    ? "e.g., Technical Support & Integration Dept"
                    : "مثال: قسم الدعم الفني والربط التقني"
                }
                className="w-full bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] h-[44px] px-[14px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565]/70 dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.03)] text-start"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Department Description & Scope (Optional)" : "وصف واختصاصات القسم (اختياري)"}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isEn
                    ? "Write a summary of cases or services handled by this department..."
                    : "اكتب نبذة عن القضايا أو الخدمات التي يتولى هذا القسم معالجتها..."
                }
                className="w-full bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] p-[12px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565]/70 dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] text-start resize-none"
              />
            </div>

            {/* Field 2: Interactive Department Status Card */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Department Status" : "حالة القسم"}
              </label>
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[16px] flex items-center justify-between border border-[#eae8e4]/60 dark:border-[#38271c] gap-4">
                {/* Status details */}
                <div className="flex flex-col text-start min-w-0">
                  <div className="flex items-center gap-[8px] flex-wrap">
                    <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px]">
                      {isEn ? "Activate Department Immediately" : "تفعيل القسم فور الإنشاء"}
                    </span>
                    <div
                      className={`flex items-center gap-[4px] px-[8px] py-[2px] rounded-[4px] text-[10px] font-bold ${
                        isActive
                          ? "bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7]"
                          : "bg-[#e5dede] dark:bg-[#1a120d] text-[#666261] dark:text-[#a89f91]"
                      }`}
                    >
                      <span>
                        {isEn
                          ? isActive
                            ? "Active & Enabled"
                            : "Inactive"
                          : isActive
                          ? "نشط ومفعل"
                          : "غير نشط"}
                      </span>
                      <div
                        className={`size-[6px] rounded-full ${
                          isActive ? "bg-[#1b7340] dark:bg-[#10b981]" : "bg-[#625d5d] dark:bg-[#8e8680]"
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-[#625d5d] dark:text-[#a89f91] text-[11px] leading-[18px] pt-[2px]">
                    {isEn
                      ? "An active department is available immediately for ticket routing, while an inactive department is paused from routing options."
                      : "القسم النشط متاح للاستخدام وإسناد التذاكر والمهام فوراً، بينما القسم غير النشط يكون متوقفاً ومحجوباً عن خيارات الإسناد."}
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  aria-pressed={isActive}
                  className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? "bg-[#10b981]" : "bg-[#d1ccc4] dark:bg-[#3d2a1d]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-[20px] rounded-full bg-white dark:bg-[#fdfbf7] shadow transform ring-0 transition duration-200 ease-in-out ${
                      isEn
                        ? isActive
                          ? "translate-x-5"
                          : "translate-x-0.5"
                        : isActive
                        ? "-translate-x-5"
                        : "-translate-x-0.5"
                    } mt-[2px]`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-[10px] pt-[12px] border-t border-[#eae8e4] dark:border-[#38271c]">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#625d5d] dark:text-[#cdc5bd] px-[20px] py-[10px] rounded-[4px] font-semibold text-[13px] transition-colors cursor-pointer border border-transparent dark:border-[#38271c]"
              >
                {isEn ? "Cancel" : "إلغاء"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#d4922f] text-white dark:text-[#1c140f] flex items-center gap-[6px] px-[24px] py-[10px] rounded-[4px] font-semibold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="size-[15px]" />
                <span>{isEn ? "Save Department" : "حفظ القسم"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
