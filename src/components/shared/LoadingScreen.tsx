"use client";

import React from "react";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

interface LoadingScreenProps {
  title?: string;
  statusText?: string;
}

export function LoadingScreen({}: LoadingScreenProps = {}) {
  return (
    <div className="min-h-screen bg-background flex flex-col p-4 sm:p-6 lg:p-8">
      <DashboardPageSkeleton />
    </div>
  );
}
