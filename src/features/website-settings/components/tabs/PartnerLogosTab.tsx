"use client";

import React, { useState } from "react";
import {
  Globe,
  Zap,
  Landmark,
  Crown,
  Download,
  Gavel,
  Scale,
  Shield,
  PenSquare,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { initialPartnerLogos } from "../../data/initialWebsiteSettings";
import { PartnerLogoItem } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";

/** Light cream / pastel partner colors → warm clients dark surfaces */
const DARK_BG_MAP: Record<string, string> = {
  "#fef3c7": "#2d1f16",
  "#fffbeb": "#2d1f16",
  "#fefce8": "#2d1f16",
  "#2e1065": "#2a1d3a",
  "#064e3b": "#132c1c",
  "#18181b": "#1a120d",
  "#78350f": "#342711",
  "#0f172a": "#1a120d",
};

function resolveBgColor(bgColor: string, isDark: boolean): string {
  if (!isDark) return bgColor;
  const key = bgColor.toLowerCase();
  return DARK_BG_MAP[key] ?? "#2d1f16";
}

function PartnerIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const gold = isDark ? "text-[#e29d38]" : "text-[#92400e]";
  const soft = isDark ? "text-[#cdc5bd]" : "text-white";
  const emerald = isDark ? "text-[#6ee7b7]" : "text-emerald-300";
  const blue = isDark ? "text-[#93c5fd]" : "text-blue-300";
  const white = isDark ? "text-[#fdfbf7]" : "text-white";

  const icons: Record<string, React.ReactNode> = {
    globe: <Globe className={cn("size-[18px]", white)} />,
    zap: <Zap className={cn("size-[18px]", emerald)} />,
    landmark: <Landmark className={cn("size-[18px]", gold)} />,
    crown: <Crown className={cn("size-[18px]", isDark ? "text-[#e29d38]" : "text-[#b45309]")} />,
    download: <Download className={cn("size-[18px]", soft)} />,
    gavel: <Gavel className={cn("size-[18px]", white)} />,
    scale: <Scale className={cn("size-[18px]", gold)} />,
    shield: <Shield className={cn("size-[18px]", blue)} />,
  };

  return <>{icons[name] || <Globe className={cn("size-[18px]", white)} />}</>;
}

export function PartnerLogosTab() {
  const theme = useUIStore((state) => state.theme);
  const isDark = theme === "dark";
  const [items, setItems] = useState<PartnerLogoItem[]>(initialPartnerLogos);

  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
    toast.success("تم تحديث حالة شعار الشريك");
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم حذف الشعار بنجاح");
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[20px]">
      <div className="overflow-x-auto rounded-[8px] border border-[#f5f5f4] dark:border-[#38271c]">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-[#fefce8]/60 dark:bg-[#1a120d] text-[#78350f] dark:text-[#e29d38] text-[13px] font-bold border-b border-[#f3efe6] dark:border-[#38271c]">
              <th className="py-[12px] px-[16px] w-[50px] text-center">#</th>
              <th className="py-[12px] px-[16px]">Name (الاسم)</th>
              <th className="py-[12px] px-[16px] text-center">Image (الشعار)</th>
              <th className="py-[12px] px-[16px] text-center w-[120px]">Status (الحالة)</th>
              <th className="py-[12px] px-[16px] text-center w-[100px]">Action (الإجراء)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f4] dark:divide-[#38271c] text-[14px] text-[#292524] dark:text-[#fdfbf7]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#fafaf9] dark:hover:bg-[#281c15]/60 transition-colors">
                <td className="py-[14px] px-[16px] text-center font-mono text-[13px] text-[#78716c] dark:text-[#8e8680]">
                  {item.orderNumber}
                </td>
                <td className="py-[14px] px-[16px] font-semibold text-[#1c1917] dark:text-[#fdfbf7]">
                  {item.name}
                </td>
                <td className="py-[14px] px-[16px] text-center">
                  <div
                    className="size-[38px] rounded-[8px] mx-auto flex items-center justify-center shadow-2xs border border-transparent dark:border-[#4d3627]/50"
                    style={{ backgroundColor: resolveBgColor(item.bgColor, isDark) }}
                  >
                    <PartnerIcon name={item.iconName} isDark={isDark} />
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
                      onClick={() => toast.info(`تعديل الشعار: ${item.name}`)}
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
