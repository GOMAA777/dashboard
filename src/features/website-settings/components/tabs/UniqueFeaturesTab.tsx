"use client";

import React, { useState } from "react";
import { Send, User, FileText, Smartphone, PenSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { initialUniqueFeatures } from "../../data/initialWebsiteSettings";
import { UniqueFeatureItem } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";

const uniqueIconsMap: Record<string, (color: string) => React.ReactNode> = {
  send: (color) => <Send className="size-[16px]" style={{ color }} />,
  user: (color) => <User className="size-[16px]" style={{ color }} />,
  "file-text": (color) => <FileText className="size-[16px]" style={{ color }} />,
  smartphone: (color) => <Smartphone className="size-[16px]" style={{ color }} />,
};

export function UniqueFeaturesTab() {
  const [items, setItems] = useState<UniqueFeatureItem[]>(initialUniqueFeatures);

  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
    toast.success("تم تحديث حالة الميزة الفريدة");
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
              <th className="py-[12px] px-[16px]">Title (العنوان)</th>
              <th className="py-[12px] px-[16px] text-center w-[120px]">Icon (الأيقونة)</th>
              <th className="py-[12px] px-[16px] text-center w-[120px]">Status (الحالة)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">Action (الإجراء)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f4] dark:divide-[#38271c] text-[14px] text-[#292524] dark:text-[#fdfbf7]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#fafaf9] dark:hover:bg-[#281c15]/60 transition-colors">
                <td className="py-[16px] px-[16px] text-center font-mono text-[13px] text-[#78716c] dark:text-[#8e8680]">
                  {item.orderNumber}
                </td>
                <td className="py-[16px] px-[16px] font-semibold text-[#1c1917] dark:text-[#fdfbf7]">
                  {item.title}
                </td>
                <td className="py-[16px] px-[16px] text-center">
                  <div
                    className="size-[34px] rounded-full mx-auto flex items-center justify-center shadow-2xs"
                    style={{ backgroundColor: item.badgeBg }}
                  >
                    {uniqueIconsMap[item.iconName]
                      ? uniqueIconsMap[item.iconName](item.badgeColor)
                      : <Send className="size-[16px] text-[#9c6402]" />}
                  </div>
                </td>
                <td className="py-[16px] px-[16px] text-center">
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
                <td className="py-[16px] px-[16px] text-center">
                  <div className="flex items-center justify-center gap-[6px]">
                    <button
                      type="button"
                      onClick={() => toast.info(`تعديل: ${item.title}`)}
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
