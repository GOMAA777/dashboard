"use client";

import React, { useState } from "react";
import { PenSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { initialNavMoreItems } from "../../data/initialWebsiteSettings";
import { NavMoreItem } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";

export function NavMoreTab() {
  const [items, setItems] = useState<NavMoreItem[]>(initialNavMoreItems);

  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
    toast.success("تم تحديث حالة الرابط في شريط التنقل");
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم حذف العنصر بنجاح");
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[20px]">
      <div className="overflow-x-auto rounded-[8px] border border-[#f5f5f4] dark:border-[#38271c]">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-[#fefce8]/60 dark:bg-[#1a120d]/80 text-[#78350f] dark:text-[#e29d38] text-[13px] font-bold border-b border-[#f3efe6] dark:border-[#38271c]">
              <th className="py-[12px] px-[16px] w-[50px] text-center">#</th>
              <th className="py-[12px] px-[16px]">العنوان (TITLE)</th>
              <th className="py-[12px] px-[16px]">الوصف (DESCRIPTION)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">الحالة (STATUS)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">الإجراء (ACTION)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f4] dark:divide-[#38271c] text-[14px] text-[#292524] dark:text-[#fdfbf7]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#fafaf9] dark:hover:bg-[#281c15]/60 transition-colors">
                <td className="py-[14px] px-[16px] text-center font-mono text-[13px] text-[#78716c] dark:text-[#8e8680]">
                  {item.orderNumber}
                </td>
                <td className="py-[14px] px-[16px]">
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-semibold text-[#1c1917] dark:text-[#fdfbf7] text-[14px]">
                      {item.titleAr}
                    </span>
                    <span className="text-[12px] text-[#78716c] dark:text-[#8e8680] font-medium font-sans">
                      {item.titleEn}
                    </span>
                  </div>
                </td>
                <td className="py-[14px] px-[16px]">
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[#44403c] dark:text-[#cdc5bd] text-[13px]">
                      {item.descriptionAr}
                    </span>
                    <span className="text-[11px] text-[#a8a29e] dark:text-[#8e8680] font-sans">
                      {item.descriptionEn}
                    </span>
                  </div>
                </td>
                <td className="py-[14px] px-[16px] text-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.status}
                    onClick={() => handleToggleStatus(item.id)}
                    className={cn(
                      "w-[38px] h-[22px] rounded-full p-[2px] transition-colors cursor-pointer inline-flex items-center",
                      item.status ? "bg-[#9c6402] dark:bg-[#e29d38]" : "bg-[#d6d3d1] dark:bg-[#38271c]"
                    )}
                  >
                    <div
                      className={cn(
                        "size-[18px] rounded-full bg-white dark:bg-[#1a120d] shadow-sm transition-transform duration-200",
                        item.status ? "-translate-x-[16px]" : "translate-x-0"
                      )}
                    />
                  </button>
                </td>
                <td className="py-[14px] px-[16px] text-center">
                  <div className="flex items-center justify-center gap-[6px]">
                    <button
                      type="button"
                      onClick={() => toast.info(`تعديل عنصر: ${item.titleAr}`)}
                      className="size-[30px] rounded-[6px] text-[#78716c] dark:text-[#8e8680] hover:text-[#1c1917] dark:hover:text-[#fdfbf7] hover:bg-[#f5f5f4] dark:hover:bg-[#38271c] flex items-center justify-center transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <PenSquare className="size-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="size-[30px] rounded-[6px] text-[#dc2626] dark:text-red-400 hover:bg-[#fee2e2]/60 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="size-[15px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
