"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle, PenSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { initialFeatures } from "../../data/initialWebsiteSettings";
import { FeatureItem } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";
import {
  fetchWebsiteFeatures,
  createWebsiteFeature,
  toggleWebsiteItem,
  deleteWebsiteItem,
} from "@/lib/api/website";
import { mapWebsiteFeaturesResponse } from "@/lib/api/mappers";

export function FeaturesTab() {
  const [items, setItems] = useState<FeatureItem[]>(initialFeatures);

  const handleAddFeature = async () => {
    const draft: FeatureItem = {
      id: `feature-${Date.now()}`,
      orderNumber: items.length + 1,
      titleAr: "ميزة جديدة",
      titleEn: "New Feature",
      platform: "Web",
      status: true,
    };
    try {
      await createWebsiteFeature({
        title_ar: draft.titleAr,
        title_en: draft.titleEn,
        platform: draft.platform,
        status: "active",
      });
    } catch {
      // Keep local create.
    }
    setItems((prev) => [...prev, draft]);
    toast.success("تمت إضافة ميزة جديدة");
  };

  useEffect(() => {
    let cancelled = false;
    fetchWebsiteFeatures()
      .then((payload) => {
        if (cancelled) return;
        const mapped = mapWebsiteFeaturesResponse(payload);
        if (mapped.length > 0) setItems(mapped);
      })
      .catch(() => {
        // Keep mock features if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleWebsiteItem(id);
    } catch {
      // Keep local toggle.
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
    toast.success("تم تحديث حالة الميزة");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWebsiteItem(id);
    } catch {
      // Keep local delete.
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم حذف العنصر بنجاح");
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[20px]">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddFeature}
          className="bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold rounded-[6px] px-4 py-2 transition-colors cursor-pointer"
        >
          إضافة ميزة
        </button>
      </div>
      <div className="overflow-x-auto rounded-[8px] border border-[#f5f5f4] dark:border-[#38271c]">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-[#fefce8]/60 dark:bg-[#1a120d]/80 text-[#78350f] dark:text-[#e29d38] text-[13px] font-bold border-b border-[#f3efe6] dark:border-[#38271c]">
              <th className="py-[12px] px-[16px] w-[50px] text-center">#</th>
              <th className="py-[12px] px-[16px]">Title (العنوان)</th>
              <th className="py-[12px] px-[16px] text-center w-[120px]">Image / (الصورة / الأيقونة)</th>
              <th className="py-[12px] px-[16px] text-center w-[120px]">Type (النوع)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">Status (الحالة)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">Action (الإجراءات)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f4] dark:divide-[#38271c] text-[14px] text-[#292524] dark:text-[#fdfbf7]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#fafaf9] dark:hover:bg-[#281c15]/60 transition-colors">
                <td className="py-[16px] px-[16px] text-center font-mono text-[13px] text-[#78716c] dark:text-[#8e8680]">
                  {item.orderNumber}
                </td>
                <td className="py-[16px] px-[16px]">
                  <div className="flex flex-col gap-[3px]">
                    <span className="font-semibold text-[#1c1917] dark:text-[#fdfbf7] text-[14px]">
                      {item.titleAr}
                    </span>
                    <span className="text-[12px] text-[#78716c] dark:text-[#8e8680] font-sans">
                      {item.titleEn}
                    </span>
                  </div>
                </td>
                <td className="py-[16px] px-[16px] text-center">
                  <div className="size-[38px] rounded-[10px] bg-[#25d366] text-white mx-auto flex items-center justify-center shadow-2xs">
                    <MessageCircle className="size-[20px]" />
                  </div>
                </td>
                <td className="py-[16px] px-[16px] text-center">
                  <span className="inline-flex items-center gap-[6px] border border-[#fde68a] dark:border-[#e29d38]/30 bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.18)] text-[#92400e] dark:text-[#f3c27e] text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
                    <MessageCircle className="size-[13px]" />
                    <span>{item.platform}</span>
                  </span>
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
                      onClick={() => toast.info(`تعديل: ${item.titleAr}`)}
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
