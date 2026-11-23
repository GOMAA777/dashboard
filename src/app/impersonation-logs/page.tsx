import type { Metadata } from "next";
import { ImpersonationLogsView } from "@/features/impersonation-logs/components/ImpersonationLogsView";

export const metadata: Metadata = {
  title: "النشاطات | لوحة تحكم منصة الجودي",
  description: "سجل متابعة وتدقيق أنشطة دخول الموظفين والمشرفين إلى مكاتب المحاماة.",
};

export default function ImpersonationLogsPage() {
  return <ImpersonationLogsView />;
}
