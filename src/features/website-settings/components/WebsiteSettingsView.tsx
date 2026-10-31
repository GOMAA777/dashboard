"use client";

import React from "react";
import { useQueryState } from "nuqs";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { WebsiteSettingsNav } from "./WebsiteSettingsNav";
import { WebsiteSettingsTab } from "../types/website-settings.types";
import { MenuTab } from "./tabs/MenuTab";
import { UseCaseTab } from "./tabs/UseCaseTab";
import { NavMoreTab } from "./tabs/NavMoreTab";
import { SectionTitlesTab } from "./tabs/SectionTitlesTab";
import { SmallTitleTab } from "./tabs/SmallTitleTab";
import { HeroSectionTab } from "./tabs/HeroSectionTab";
import { PartnerLogosTab } from "./tabs/PartnerLogosTab";
import { StoryTab } from "./tabs/StoryTab";
import { UniqueFeaturesTab } from "./tabs/UniqueFeaturesTab";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { AIChatTab } from "./tabs/AIChatTab";
import { SeoTab } from "./tabs/SeoTab";

interface WebsiteSettingsViewProps {
  initialTab?: WebsiteSettingsTab;
}

export function WebsiteSettingsView({ initialTab = "menu" }: WebsiteSettingsViewProps) {
  const [activeTab, setActiveTab] = useQueryState<WebsiteSettingsTab>("tab", {
    defaultValue: initialTab,
    parse: (value) => (value ? (value as WebsiteSettingsTab) : "menu"),
    serialize: (value) => value,
  });

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "menu":
        return <MenuTab />;
      case "use-case":
        return <UseCaseTab />;
      case "nav-more":
        return <NavMoreTab />;
      case "section-titles":
        return <SectionTitlesTab />;
      case "small-title":
        return <SmallTitleTab />;
      case "hero":
        return <HeroSectionTab />;
      case "partner-logo":
        return <PartnerLogosTab />;
      case "story":
        return <StoryTab />;
      case "unique-feature":
        return <UniqueFeaturesTab />;
      case "feature":
        return <FeaturesTab />;
      case "ai-chat":
        return <AIChatTab />;
      case "seo":
        return <SeoTab />;
      default:
        return (
          <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[32px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center gap-[12px] min-h-[360px]">
            <h3 className="text-[18px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">
              إعدادات {activeTab}
            </h3>
            <p className="text-[14px] text-[#78716c] dark:text-[#cdc5bd] max-w-[420px]">
              يتم العمل على مزامنة هذا التبويب مع الهوية البصرية وإعدادات المنصة.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#1a120d] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="site-settings" />

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto pb-28 sm:pb-32 space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            <div className="space-y-6 w-full">
              {/* Main Identity & Command Banner (Figma 1:19876) */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-[4px] text-start">
                  <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    إعدادات الموقع
                  </h1>
                  <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#cdc5bd]">
                    إدارة وتفعيل إعدادات الموقع لدعم الهوية البصرية والألوان وأكواد المنصة
                  </p>
                </div>
              </div>

              {/* Layout Body: Secondary Navigation Sidebar + Content Workspace */}
              <div className="flex flex-col lg:flex-row items-start gap-[24px]">
              {/* Secondary Navigation Aside (Tabs) */}
              <WebsiteSettingsNav
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
              />

              {/* Active Tab Workspace */}
              <div className="flex-1 w-full min-w-0">
                {renderActiveTabContent()}
              </div>
            </div>
            </div>
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
