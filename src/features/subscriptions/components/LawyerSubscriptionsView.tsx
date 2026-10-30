"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { SubscriptionsPricingHero } from "./SubscriptionsPricingHero";
import { SubscriptionsPricingCards } from "./SubscriptionsPricingCards";
import { SubscriptionsCustomBanner } from "./SubscriptionsCustomBanner";
import { SubscriptionsBenefitsGrid } from "./SubscriptionsBenefitsGrid";
import { SubscriptionsCompareTable } from "./SubscriptionsCompareTable";
import { SubscriptionsFaqSection } from "./SubscriptionsFaqSection";
import { SubscriptionsBottomCta } from "./SubscriptionsBottomCta";
import { SubscriptionsPageFooter } from "./SubscriptionsPageFooter";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { toast } from "sonner";

export function LawyerSubscriptionsView() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handleSelectPlan = (planId: string) => {
    const planNames: Record<string, string> = {
      free: "الباقة المجانية",
      starter: "باقة المحترف للمكاتب",
      growth: "باقة المؤسسات والشركات",
    };
    const name = planNames[planId] || planId;
    toast.success(`تم اختيار ${name}`, {
      description: `خطة الدفع: ${billingCycle === "annual" ? "السنوي (خصم 20%)" : "الشهري"}`,
    });
  };

  return (
    <div className="flex h-screen h-dvh overflow-hidden bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      {/* 1. Main Navigation Sidebar (Right side in RTL) */}
      <DashboardSidebar />

      {/* 2. Main Application Body Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Navigation Bar with breadcrumbs and actions */}
        <DashboardTopNavbar />

        {/* Dashboard Workspace Content */}
        <main className="flex-1 overflow-y-auto w-full relative scrollbar-thin">
          <DashboardPageTransition>
          {/* Ambient Scales of Justice (ميزان العدالة) Background Emblems replacing the side photo arches */}
          {/* 1. Left Ambient Scale Emblem */}
          <div
            className="fixed top-28 -left-28 w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] dark:text-[#d4a759] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          {/* 2. Right Ambient Scale Emblem */}
          <div
            className="fixed top-[520px] -right-28 w-[400px] h-[400px] sm:w-[480px] sm:h-[480px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] dark:text-[#d4a759] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          {/* 3. Center Huge Watermark */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] opacity-[0.025] dark:opacity-[0.035] text-[#c29547] dark:text-[#d4a759] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          {/* Ambient Warm Golden Radial Glows */}
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c29547]/5 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="fixed bottom-10 right-20 w-[450px] h-[450px] bg-[#c29547]/4 rounded-full blur-[120px] pointer-events-none z-0" />

          {/* Content Wrapper */}
          <div className="relative z-10 py-6">
            {/* Section 1: Hero Header with Monthly/Annual Billing Switch */}
            <SubscriptionsPricingHero
              billingCycle={billingCycle}
              onBillingCycleChange={setBillingCycle}
            />

            {/* Section 2: The 3 Main Pricing Cards (Free, Starter [Highlighted], Growth) */}
            <SubscriptionsPricingCards
              billingCycle={billingCycle}
              onSelectPlan={handleSelectPlan}
            />

            {/* Section 3: "Need more than that?" Custom Enterprise Banner */}
            <SubscriptionsCustomBanner />

            {/* Section 4: 5 Information & Benefit Cards Grid */}
            <SubscriptionsBenefitsGrid />

            {/* Section 5: Compare Plans Comprehensive Table */}
            <SubscriptionsCompareTable
              billingCycle={billingCycle}
              onSelectPlan={handleSelectPlan}
            />

            {/* Section 6: FAQ Accordion (Questions, Answered) */}
            <SubscriptionsFaqSection />

            {/* Section 7: Bottom Action CTA Banner */}
            <SubscriptionsBottomCta />

            {/* Section 8: Page Footer */}
            <SubscriptionsPageFooter />
          </div>
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
