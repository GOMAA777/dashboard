"use client";

import React, { useState } from "react";
import { Trash2, GripVertical, Check } from "lucide-react";
import { toast } from "sonner";
import { initialMenuItems } from "../../data/initialWebsiteSettings";
import { MenuItem } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";

export function MenuTab() {
  const [showDefaultMenu, setShowDefaultMenu] = useState(true);
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [isSaving, setIsSaving] = useState(false);

  const handleItemChange = (id: string, field: "label" | "url", value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم حذف العنصر بنجاح");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ وتحديث القائمة بنجاح");
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      {/* 1. Default Link Toggle Section */}
      <div className="flex items-center justify-between py-[4px]">
        <div className="flex items-center gap-[12px]">
          {/* Switch Button */}
          <button
            type="button"
            role="switch"
            aria-checked={showDefaultMenu}
            onClick={() => setShowDefaultMenu(!showDefaultMenu)}
            className={cn(
              "w-[44px] h-[24px] rounded-full p-[2px] transition-colors cursor-pointer flex items-center shrink-0",
              showDefaultMenu ? "bg-[#9c6402] dark:bg-[#e29d38]" : "bg-[#d6d3d1] dark:bg-[#38271c]"
            )}
          >
            <div
              className={cn(
                "size-[20px] rounded-full bg-white dark:bg-[#1a120d] shadow-sm transition-transform duration-200",
                showDefaultMenu ? "-translate-x-[20px]" : "translate-x-0"
              )}
            />
          </button>
          <span className="text-[14px] font-semibold text-[#44403c] dark:text-[#fdfbf7]">
            إظهار رابط القائمة الافتراضي (Show Default Menu Link)
          </span>
        </div>
      </div>

      {/* 2. Notice Box for Section IDs */}
      <div className="bg-[#f4ecdf] dark:bg-[rgba(226,157,56,0.12)] border border-transparent dark:border-[#e29d38]/30 rounded-[8px] p-[16px] text-start">
        <p className="text-[13px] leading-[22px] text-[#9c6402] dark:text-[#e29d38] mb-[6px]">
          <span className="font-bold">تنبيه هام (Note): </span>
          <span>لقسم &quot;الهدف&quot; (Target)، يرجى استخدام المعرفات التالية للربط التلقائي بالأقسام:</span>
        </p>
        <p className="font-mono font-bold text-[12px] text-[#7b4e00] dark:text-[#f3c27e] leading-[20px] direction-ltr text-start">
          #advantage, #cta, #faq, #partner, #features, #growth, #pricing, #stories, #testimonials, #unique_feature
        </p>
      </div>

      {/* 3. Menu Items List */}
      <div className="flex flex-col gap-[14px]">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#281c15] border border-[rgba(231,229,228,0.9)] dark:border-[#38271c] rounded-[12px] p-[14px] flex items-center gap-[12px] shadow-2xs hover:border-[#9c6402]/30 dark:hover:border-[#e29d38]/40 transition-all"
          >
            {/* Delete button */}
            <button
              type="button"
              onClick={() => handleDeleteItem(item.id)}
              className="size-[36px] rounded-[8px] text-[#dc2626] dark:text-red-400 hover:bg-[#fee2e2]/50 dark:hover:bg-red-950/40 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="حذف"
            >
              <Trash2 className="size-[18px]" />
            </button>

            {/* URL Input */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={item.url}
                onChange={(e) => handleItemChange(item.id, "url", e.target.value)}
                placeholder="/ أو #section"
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[14px] text-[#292524] dark:text-[#fdfbf7] font-medium focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] transition-all text-left font-mono"
              />
            </div>

            {/* Label Input */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleItemChange(item.id, "label", e.target.value)}
                placeholder="اسم القائمة"
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[14px] text-[#292524] dark:text-[#fdfbf7] font-medium focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] transition-all text-start"
              />
            </div>

            {/* Drag Handle */}
            <div className="size-[28px] flex items-center justify-center text-[#a8a29e] dark:text-[#8e8680] cursor-grab shrink-0">
              <GripVertical className="size-[18px]" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Bottom Action Bar */}
      <div className="border-t border-[#f5f5f4] dark:border-[#38271c] pt-[20px] flex items-center justify-start">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-[28px] py-[10px] rounded-[8px] text-[13px] font-bold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
        >
          <Check className="size-[16px]" />
          <span>{isSaving ? "جارٍ الحفظ..." : "حفظ وتحديث (Update)"}</span>
        </button>
      </div>
    </div>
  );
}
