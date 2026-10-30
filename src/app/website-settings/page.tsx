import { Suspense } from "react";
import { WebsiteSettingsView } from "@/features/website-settings/components/WebsiteSettingsView";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

export default function WebsiteSettingsPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <WebsiteSettingsView />
    </Suspense>
  );
}
