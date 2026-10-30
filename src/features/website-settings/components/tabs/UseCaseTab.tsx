"use client";

import React, { useState, useMemo } from "react";
import { Search, PenSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { initialUseCases } from "../../data/initialWebsiteSettings";
import { UseCaseItem } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";

export function UseCaseTab() {
  const [items, setItems] = useState<UseCaseItem[]>(initialUseCases);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
    toast.success("تم تحديث حالة الاستخدام");
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم حذف السجل بنجاح");
  };

  return (
    <div className="bg-white rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[20px]">
      {/* Search Header */}
      <div className="flex items-center justify-start">
        <div className="relative w-full max-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث... (Search)"
            className="w-full bg-[#fafaf9]/70 border border-[#e7e5e4] rounded-[8px] ps-[14px] pe-[36px] py-[8px] text-[13px] text-[#292524] placeholder-[#a8a29e] focus:outline-none focus:border-[#9c6402] focus:bg-white transition-all text-right"
          />
          <Search className="absolute top-1/2 -translate-y-1/2 end-[12px] size-[15px] text-[#a8a29e]" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[8px] border border-[#f5f5f4]">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#fefce8]/60 text-[#78350f] text-[13px] font-bold border-b border-[#f3efe6]">
              <th className="py-[12px] px-[16px] w-[50px] text-center">#</th>
              <th className="py-[12px] px-[16px]">العنوان (Title)</th>
              <th className="py-[12px] px-[16px]">الوصف (Description)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">الحالة (Status)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">الإجراء (Action)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f4] text-[14px] text-[#292524]">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-[#fafaf9] transition-colors">
                <td className="py-[14px] px-[16px] text-center font-mono text-[13px] text-[#78716c]">
                  {item.orderNumber}
                </td>
                <td className="py-[14px] px-[16px] font-semibold text-[#1c1917]">
                  {item.title}
                </td>
                <td className="py-[14px] px-[16px] text-[#57534e] text-[13px]">
                  {item.description}
                </td>
                <td className="py-[14px] px-[16px] text-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.status}
                    onClick={() => handleToggleStatus(item.id)}
                    className={cn(
                      "w-[38px] h-[22px] rounded-full p-[2px] transition-colors cursor-pointer inline-flex items-center",
                      item.status ? "bg-[#9c6402]" : "bg-[#d6d3d1]"
                    )}
                  >
                    <div
                      className={cn(
                        "size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200",
                        item.status ? "-translate-x-[16px]" : "translate-x-0"
                      )}
                    />
                  </button>
                </td>
                <td className="py-[14px] px-[16px] text-center">
                  <div className="flex items-center justify-center gap-[6px]">
                    <button
                      type="button"
                      onClick={() => toast.info(`تعديل حالة: ${item.title}`)}
                      className="size-[30px] rounded-[6px] text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4] flex items-center justify-center transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <PenSquare className="size-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="size-[30px] rounded-[6px] text-[#dc2626] hover:bg-[#fee2e2]/60 flex items-center justify-center transition-colors cursor-pointer"
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
