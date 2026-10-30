"use client";

import React, { useState } from "react";
import { X, Check, Building2 } from "lucide-react";
import { toast } from "sonner";
import { TicketDepartment } from "../types/tickets.types";

interface AddDepartmentModalProps {
  onClose: () => void;
  onSave: (newDept: TicketDepartment) => void;
}

export function AddDepartmentModal({ onClose, onSave }: AddDepartmentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("يرجى إدخال اسم القسم");
      return;
    }

    const randomId = Math.floor(10 + Math.random() * 90);
    const newDepartment: TicketDepartment = {
      id: `dep-${Date.now()}`,
      code: `DEP-0${randomId}`,
      name: name.trim(),
      description:
        description.trim() ||
        "قسم تنظيمي متخصص لمتابعة مهام وتذاكر الاستشارات القانونية والتقنية بالمنصة.",
      status: isActive ? "active" : "inactive",
      activeTicketsCount: 0,
      consultantsCount: 1,
    };

    onSave(newDepartment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs antialiased">
      <div
        className="bg-white rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-[620px] overflow-hidden flex flex-col relative text-start animate-in fade-in zoom-in-95 duration-150"
        data-node-id="1:16624"
        data-name="إضافة قسم"
      >
        {/* Top Accent Line */}
        <div className="h-[6px] w-full bg-gradient-to-r from-[#9c6402] via-[#e5b352] to-[#9c6402]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-[24px] pt-[20px] pb-[16px] border-b border-[#eae8e4]/60">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] size-[32px] rounded-[6px] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-[14px]" />
          </button>

          <div className="flex items-center gap-[12px]">
            <div className="flex flex-col gap-[2px]">
              <h2 className="text-[#1b1c1a] font-bold text-[20px] leading-[26px]">
                إضافة قسم جديد
              </h2>
              <p className="text-[#514537] text-[12px] leading-[18px]">
                أضف قسمًا جديدًا لتنظيم تذاكر الدعم الفني وتوزيع المهام بدقة وسلاسة
              </p>
            </div>
            <div className="bg-[#f5f3ef] size-[44px] rounded-[8px] flex items-center justify-center shrink-0">
              <Building2 className="size-[20px] text-[#9c6402]" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] p-[24px]">
          {/* Field 1: Department Name */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-[#1b1c1a] flex items-center gap-[4px]">
                <span>اسم القسم</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
            </div>
            <p className="text-[12px] text-[#625d5d]">
              أدخل اسم القسم باللغة العربية (مثال: الدعم التقني والربط، خدمة العملاء، الاستشارات)
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: قسم الدعم الفني والربط التقني"
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] h-[44px] px-[14px] text-[13px] text-[#1b1c1a] placeholder:text-[#837565]/70 focus:outline-none focus:border-[#9c6402] shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.03)] text-start"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-bold text-[#1b1c1a]">
              وصف واختصاصات القسم (اختياري)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة عن القضايا أو الخدمات التي يتولى هذا القسم معالجتها..."
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] p-[12px] text-[13px] text-[#1b1c1a] placeholder:text-[#837565]/70 focus:outline-none focus:border-[#9c6402] text-start"
            />
          </div>

          {/* Field 2: Interactive Department Status Card */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-bold text-[#1b1c1a]">حالة القسم</label>
            <div className="bg-[#f5f3ef]/80 rounded-[8px] p-[16px] flex items-center justify-between border border-[#eae8e4]/60">
              {/* Toggle switch on left (RTL) */}
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? "bg-[#9c6402]" : "bg-[#d1ccc4]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-[20px] rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                    isActive ? "-translate-x-5" : "-translate-x-0.5"
                  } mt-[2px]`}
                />
              </button>

              {/* Status details on right */}
              <div className="flex flex-col text-start">
                <div className="flex items-center gap-[8px]">
                  <span className="font-bold text-[#1b1c1a] text-[13px]">
                    تفعيل القسم فور الإنشاء
                  </span>
                  <div
                    className={`flex items-center gap-[4px] px-[8px] py-[2px] rounded-[2px] text-[10px] font-bold ${
                      isActive
                        ? "bg-[#e8f5e9] text-[#1b7340]"
                        : "bg-[#e5dede] text-[#666261]"
                    }`}
                  >
                    <span>{isActive ? "نشط ومفعل" : "غير نشط"}</span>
                    <div
                      className={`size-[6px] rounded-full ${
                        isActive ? "bg-[#1b7340]" : "bg-[#625d5d]"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-[#625d5d] text-[11px] leading-[18px] pt-[2px]">
                  القسم النشط متاح للاستخدام وإسناد التذاكر والمهام فوراً، بينما القسم غير النشط يكون متوقفاً ومحجوباً عن خيارات الإسناد.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-[10px] pt-[12px] border-t border-[#eae8e4]">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#625d5d] px-[20px] py-[10px] rounded-[4px] font-semibold text-[13px] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[6px] px-[24px] py-[10px] rounded-[4px] font-semibold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
            >
              <Check className="size-[15px]" />
              <span>حفظ القسم</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
