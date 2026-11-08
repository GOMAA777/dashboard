"use client";

import React, { useMemo, useState } from "react";
import { Trash2, GripVertical, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  initialMenuItems,
  menuSectionTargets,
  menuSectionTargetUrls,
} from "../../data/initialWebsiteSettings";
import { MenuItem } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";

function sanitizeMenuItems(items: MenuItem[]): MenuItem[] {
  return items.filter((item) => menuSectionTargetUrls.has(item.url as any));
}

export function MenuTab() {
  const { isEn } = useLanguage();
  const [showDefaultMenu, setShowDefaultMenu] = useState(true);
  const [items, setItems] = useState<MenuItem[]>(() =>
    sanitizeMenuItems(initialMenuItems)
  );
  const [isSaving, setIsSaving] = useState(false);

  const usedUrls = useMemo(() => new Set(items.map((item) => item.url)), [items]);

  const availableToAdd = useMemo(
    () => menuSectionTargets.filter((section) => !usedUrls.has(section.url)),
    [usedUrls]
  );

  const handleLabelChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: value } : item))
    );
  };

  const handleTargetChange = (id: string, url: string) => {
    if (!menuSectionTargetUrls.has(url as any)) return;
    const section = menuSectionTargets.find((entry) => entry.url === url);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              url,
              label: item.label.trim()
                ? item.label
                : isEn
                  ? section?.labelEn || url
                  : section?.labelAr || url,
            }
          : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(isEn ? "Item deleted successfully" : "تم حذف العنصر بنجاح");
  };

  const handleAddItem = () => {
    const next = availableToAdd[0];
    if (!next) {
      toast.info(
        isEn
          ? "All available sections are already in the menu."
          : "كل الأقسام المتاحة مضافة بالفعل في القائمة."
      );
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id: `menu-${Date.now()}`,
        label: isEn ? next.labelEn : next.labelAr,
        url: next.url,
      },
    ]);
  };

  const handleSave = () => {
    setIsSaving(true);
    setItems((prev) => sanitizeMenuItems(prev));
    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        isEn ? "Menu saved and updated successfully" : "تم حفظ وتحديث القائمة بنجاح"
      );
    }, 600);
  };

  const sectionAnchorsNote = menuSectionTargets
    .map((section) => section.url)
    .filter((url) => url.startsWith("#"))
    .join(", ");

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      {/* 1. Default Link Toggle Section */}
      <div className="flex items-center justify-between py-[4px]">
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            role="switch"
            aria-checked={showDefaultMenu}
            onClick={() => setShowDefaultMenu(!showDefaultMenu)}
            className={cn(
              "w-[44px] h-[24px] rounded-full p-[2px] transition-colors cursor-pointer flex items-center shrink-0",
              showDefaultMenu
                ? "bg-[#9c6402] dark:bg-[#e29d38]"
                : "bg-[#d6d3d1] dark:bg-[#38271c]"
            )}
          >
            <div
              className={cn(
                "size-[20px] rounded-full bg-white dark:bg-[#1a120d] shadow-sm transition-transform duration-200",
                showDefaultMenu
                  ? isEn
                    ? "translate-x-[20px]"
                    : "-translate-x-[20px]"
                  : "translate-x-0"
              )}
            />
          </button>
          <span className="text-[14px] font-semibold text-[#44403c] dark:text-[#fdfbf7]">
            {isEn
              ? "Show Default Menu Link"
              : "إظهار رابط القائمة الافتراضي (Show Default Menu Link)"}
          </span>
        </div>
      </div>

      {/* 2. Notice Box for Section IDs */}
      <div className="bg-[#f4ecdf] dark:bg-[rgba(226,157,56,0.12)] border border-transparent dark:border-[#e29d38]/30 rounded-[8px] p-[16px] text-start">
        <p className="text-[13px] leading-[22px] text-[#9c6402] dark:text-[#e29d38] mb-[6px]">
          <span className="font-bold">
            {isEn ? "Important Note: " : "تنبيه هام (Note): "}
          </span>
          <span>
            {isEn
              ? "Target must be selected from the sections available across website tabs:"
              : "يجب اختيار الهدف من الأقسام المتاحة عبر تبويبات إعدادات الموقع:"}
          </span>
        </p>
        <p className="font-mono font-bold text-[12px] text-[#7b4e00] dark:text-[#f3c27e] leading-[20px] direction-ltr text-start">
          {sectionAnchorsNote}
        </p>
      </div>

      {/* 3. Menu Items List */}
      <div className="flex flex-col gap-[14px]">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#281c15] border border-[rgba(231,229,228,0.9)] dark:border-[#38271c] rounded-[12px] p-[14px] flex items-center gap-[12px] shadow-2xs hover:border-[#9c6402]/30 dark:hover:border-[#e29d38]/40 transition-all"
          >
            <button
              type="button"
              onClick={() => handleDeleteItem(item.id)}
              className="size-[36px] rounded-[8px] text-[#dc2626] dark:text-red-400 hover:bg-[#fee2e2]/50 dark:hover:bg-red-950/40 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title={isEn ? "Delete" : "حذف"}
            >
              <Trash2 className="size-[18px]" />
            </button>

            <div className="flex-1 min-w-0">
              <DashboardSelect
                value={item.url}
                onChange={(e) => handleTargetChange(item.id, e.target.value)}
                className="h-[40px] text-[13px] font-mono"
              >
                {menuSectionTargets.map((section) => {
                  const takenByOther =
                    section.url !== item.url && usedUrls.has(section.url);
                  return (
                    <option
                      key={section.url}
                      value={section.url}
                      disabled={takenByOther}
                      className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
                    >
                      {isEn
                        ? `${section.labelEn} (${section.url})`
                        : `${section.labelAr} (${section.url})`}
                    </option>
                  );
                })}
              </DashboardSelect>
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleLabelChange(item.id, e.target.value)}
                placeholder={isEn ? "Menu name" : "اسم القائمة"}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[14px] text-[#292524] dark:text-[#fdfbf7] font-medium focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] transition-all text-start"
              />
            </div>

            <div className="size-[28px] flex items-center justify-center text-[#a8a29e] dark:text-[#8e8680] cursor-grab shrink-0">
              <GripVertical className="size-[18px]" />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-[8px] border border-dashed border-[#e7e5e4] dark:border-[#38271c] px-4 py-8 text-center text-[13px] text-[#78716c] dark:text-[#8e8680]">
            {isEn
              ? "No menu items. Add a section from the available tabs."
              : "لا توجد عناصر في القائمة. أضف قسماً من التبويبات المتاحة."}
          </div>
        )}
      </div>

      {/* 4. Bottom Action Bar */}
      <div className="border-t border-[#f5f5f4] dark:border-[#38271c] pt-[20px] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleAddItem}
          disabled={availableToAdd.length === 0}
          className="bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae6e0] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] px-[20px] py-[10px] rounded-[8px] text-[13px] font-bold flex items-center gap-[8px] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="size-[16px]" />
          <span>{isEn ? "Add section" : "إضافة قسم"}</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-[28px] py-[10px] rounded-[8px] text-[13px] font-bold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
        >
          <Check className="size-[16px]" />
          <span>
            {isSaving
              ? isEn
                ? "Saving..."
                : "جارٍ الحفظ..."
              : isEn
                ? "Save and Update"
                : "حفظ وتحديث (Update)"}
          </span>
        </button>
      </div>
    </div>
  );
}
