"use client";

import React from "react";
import { PageLoadingPanel } from "@/components/shared/PageLoadingPanel";

interface LoadingScreenProps {
  statusText?: string;
  progressPercent?: number;
}

/**
 * Full-viewport branded loading — reuses the unified PageLoadingPanel.
 */
export function LoadingScreen({
  statusText = "توثيق مساحة العمل والبيانات...",
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcfbfa] dark:bg-[#150f0b] select-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#ded5c6_1px,transparent_1px)] dark:bg-[radial-gradient(#38271c_1px,transparent_1px)] [background-size:28px_28px] opacity-50 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#c29547]/8 dark:bg-[#e29d38]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="relative z-10 w-full px-4">
        <PageLoadingPanel statusText={statusText} />
      </div>
    </div>
  );
}
