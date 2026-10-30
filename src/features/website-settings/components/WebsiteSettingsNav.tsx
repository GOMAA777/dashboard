"use client";

import React from "react";
import {
  Palette,
  Menu,
  Briefcase,
  MoreHorizontal,
  Heading,
  Subtitles,
  LayoutTemplate,
  Users,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Bot,
  MessageSquareQuote,
  Trophy,
  HelpCircle,
  MousePointerClick,
  GitFork,
  Star,
  PanelBottom,
  Search,
  Code,
  Hash,
  Settings2,
  Share2,
} from "lucide-react";
import { WebsiteSettingsTab } from "../types/website-settings.types";
import { cn } from "@/lib/utils";

interface WebsiteSettingsNavProps {
  activeTab: WebsiteSettingsTab;
  onSelectTab: (tab: WebsiteSettingsTab) => void;
}

interface NavTabItem {
  id: WebsiteSettingsTab;
  labelAr: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const websiteSettingsTabsList: NavTabItem[] = [
  { id: "theme-options", labelAr: "خيارات المظهر", labelEn: "Theme Options", icon: Palette },
  { id: "menu", labelAr: "القائمة", labelEn: "Menu", icon: Menu },
  { id: "use-case", labelAr: "حالات الاستخدام", labelEn: "Use Case", icon: Briefcase },
  { id: "nav-more", labelAr: "المزيد في شريط التنقل", labelEn: "Nav More", icon: MoreHorizontal },
  { id: "section-titles", labelAr: "عنوان ووصف الأقسام", labelEn: "Section Title Subtitle", icon: Heading },
  { id: "small-title", labelAr: "العنوان الفرعي", labelEn: "Small Title", icon: Subtitles },
  { id: "hero", labelAr: "قسم الهيرو", labelEn: "Hero section", icon: LayoutTemplate },
  { id: "partner-logo", labelAr: "شعارات الشركاء", labelEn: "Partner Logo", icon: Users },
  { id: "story", labelAr: "قصتنا", labelEn: "Story", icon: BookOpen },
  { id: "unique-feature", labelAr: "مميزات فريدة", labelEn: "Unique Feature", icon: Sparkles },
  { id: "feature", labelAr: "المميزات", labelEn: "Feature", icon: CheckCircle2 },
  { id: "ai-chat", labelAr: "المحادثة الذكية", labelEn: "AI Chat", icon: Bot },
  { id: "testimonials", labelAr: "آراء العملاء", labelEn: "Testimonials", icon: MessageSquareQuote },
  { id: "advantage", labelAr: "المزايا التنافسية", labelEn: "Advantage", icon: Trophy },
  { id: "faq", labelAr: "الأسئلة الشائعة", labelEn: "FAQ", icon: HelpCircle },
  { id: "cta", labelAr: "الدعوة لاتخاذ إجراء", labelEn: "CTA", icon: MousePointerClick },
  { id: "flow-builder", labelAr: "منشئ المسارات", labelEn: "Flow Builder", icon: GitFork },
  { id: "highlighted-feature", labelAr: "ميزة مميزة", labelEn: "Highlighted Feature", icon: Star },
  { id: "footer-content", labelAr: "محتوى التذييل", labelEn: "Footer content", icon: PanelBottom },
  { id: "seo", labelAr: "تهيئة محركات البحث", labelEn: "Website SEO & OG", icon: Search },
  { id: "custom-js", labelAr: "جافاسكريبت مخصص", labelEn: "Custom JS", icon: Code },
  { id: "custom-css", labelAr: "أكواد CSS مخصصة", labelEn: "Custom CSS", icon: Hash },
  { id: "google-setup", labelAr: "إعداد Google Setup", labelEn: "Google Setup", icon: Settings2 },
  { id: "facebook-pixel", labelAr: "فيسبوك بيكسل", labelEn: "Facebook Pixel", icon: Share2 },
];

export function WebsiteSettingsNav({ activeTab, onSelectTab }: WebsiteSettingsNavProps) {
  return (
    <aside className="w-[260px] shrink-0 bg-white rounded-[12px] p-[12px] border border-[rgba(231,229,228,0.8)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[3px] overflow-y-auto max-h-[820px] scrollbar-thin">
      {websiteSettingsTabsList.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-[12px] py-[9px] rounded-[6px] text-right transition-all cursor-pointer",
              isActive
                ? "bg-[#f4ecdf] text-[#9c6402] border-r-4 border-[#9c6402] font-bold"
                : "text-[#5e5851] hover:bg-[#faf9f6] hover:text-[#1b1c1a] font-medium"
            )}
          >
            <div className="flex flex-col text-right">
              <span className="text-[13px] leading-[19px]">
                {item.labelAr}
              </span>
              <span className="text-[10px] text-[#8a8176] font-sans leading-[14px]">
                ({item.labelEn})
              </span>
            </div>
            <Icon className={cn("size-[16px] shrink-0", isActive ? "text-[#9c6402]" : "text-[#8a8176]")} />
          </button>
        );
      })}
    </aside>
  );
}
