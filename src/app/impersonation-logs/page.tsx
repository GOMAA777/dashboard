import type { Metadata } from "next";
import { ImpersonationLogsView } from "@/features/impersonation-logs/components/ImpersonationLogsView";

export const metadata: Metadata = {
  title: "سجل الدخول إلى المكاتب | لوحة تحكم منصة الجودي",
  description: "سجل جلسات دخول مشرفي النظام إلى حسابات مكاتب المحاماة.",
};

export default function ImpersonationLogsPage() {
  return <ImpersonationLogsView />;
}
