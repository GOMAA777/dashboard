"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import {
  ShieldAlert,
  Clock,
  LogOut,
  Headphones,
  Zap,
  CheckCircle2,
  Plus,
  Eye,
  Trash2,
  Paperclip,
  Send,
  Lock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Employee } from "../types/staff.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface EmployeePreviewModeViewProps {
  employee: Employee;
  onEndPreview: () => void;
}

export function EmployeePreviewModeView({
  employee,
  onEndPreview,
}: EmployeePreviewModeViewProps) {
  const { t, isEn, direction } = useLanguage();
  const [secondsElapsed, setSecondsElapsed] = useState(259); // 04:19
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "in_progress">("all");

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error(
        t("يرجى إدخال التوجيه الفني أولاً.", "Please enter technical instructions first.")
      );
      return;
    }
    toast.success(
      t(
        "تم إرسال إفادة الدعم الفني وتحديث حالة التذكرة بنجاح.",
        "Support response sent and ticket status updated successfully."
      )
    );
    setReplyText("");
  };

  return (
    <div dir={direction} className="space-y-6 pb-20" data-node-id="1:10398">
      {/* Top Simulation Banner */}
      <div className="bg-[#fef3c7] border-2 border-[#fcd34d] rounded-[10px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        {/* Right side: Employee preview info */}
        <div className="flex items-center gap-3">
          <div className="size-[42px] rounded-full bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-inner">
            <ShieldAlert className="size-[22px]" />
          </div>

          <div className="text-start">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[16px] text-[#78350f]">
                {t(
                  `أنت الآن تعرض النظام بصفة: ${employee.name}`,
                  `You are viewing the system as: ${employee.name}`
                )}
              </span>
              <span className="text-[12px] font-semibold text-[#92400e] bg-[#fde68a] px-2.5 py-0.5 rounded-[4px] border border-[#fcd34d]">
                ({employee.jobTitle} - {employee.empCode})
              </span>
            </div>
            <p className="text-[11px] text-[#92400e] mt-0.5">
              {t(
                "وضع المعاينة الرقابي نشط • العمليات الإتلافية مقيدة لحماية سجلات الامتثال",
                "Audit preview mode active • Destructive operations restricted for compliance integrity"
              )}
            </p>
          </div>
        </div>

        {/* Center: Timer */}
        <div className="bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#fcd34d] flex items-center gap-2 text-[12px] font-bold text-[#78350f]">
          <span className="size-[7px] rounded-full bg-[#f59e0b] animate-ping shrink-0" />
          <Clock className="size-[14px]" />
          <span>{t("مدة الجلسة:", "Session duration:")} {formatTimer(secondsElapsed)}</span>
        </div>

        {/* Left side: End preview button */}
        <button
          type="button"
          onClick={onEndPreview}
          className="px-4 py-2.5 rounded-[6px] bg-[#78350f] hover:bg-[#592607] text-white text-[13px] font-bold flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <LogOut className="size-[15px]" />
          <span>{t("إنهاء المعاينة والعودة لحساب المدير", "End Preview & Return to Admin")}</span>
        </button>
      </div>

      {/* 3 KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-[8px] p-5 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between h-[120px]">
          <div className="flex items-start justify-between">
            <div className="text-start">
              <span className="text-[13px] font-semibold text-[#79716b] block">
                {t("تذاكر مسندة للموظف", "Assigned Tickets")}
              </span>
              <span className="text-[28px] font-bold text-[#1b1c1a] font-sans mt-1 block">
                17
              </span>
            </div>
            <div className="size-[38px] rounded-[8px] bg-[#f5efe6] flex items-center justify-center shrink-0">
              <Headphones className="size-[18px] text-[#9c6402]" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#b45309]">
            {t("! 4 تتطلب تدخل اليوم", "! 4 require action today")}
          </span>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-[#9c6402]" />
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-[8px] p-5 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between h-[120px]">
          <div className="flex items-start justify-between">
            <div className="text-start">
              <span className="text-[13px] font-semibold text-[#79716b] block">
                {t("التذاكر ذات الأولوية القصوى", "High Priority Tickets")}
              </span>
              <span className="text-[28px] font-bold text-[#b91c1c] font-sans mt-1 block">
                03
              </span>
            </div>
            <div className="size-[38px] rounded-[8px] bg-[#fee2e2] flex items-center justify-center shrink-0">
              <Zap className="size-[18px] text-[#b91c1c]" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#b91c1c]">
            {t("اتفاقيات محاكم وقضايا", "Court agreements & cases")}
          </span>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-[#b91c1c]" />
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-[8px] p-5 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between h-[120px]">
          <div className="flex items-start justify-between">
            <div className="text-start">
              <span className="text-[13px] font-semibold text-[#79716b] block">
                {t("مغلقة بنجاح هذا الشهر", "Closed Successfully This Month")}
              </span>
              <span className="text-[28px] font-bold text-[#1b1c1a] font-sans mt-1 block">
                48
              </span>
            </div>
            <div className="size-[38px] rounded-[8px] bg-[#eef8f1] flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-[18px] text-[#1b7340]" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#1b7340]">
            {t("معدل الرضا 98.4%", "Satisfaction Rate 98.4%")}
          </span>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-[#1b7340]" />
        </div>
      </div>

      {/* 2 Columns: Right (Tickets Table) & Left (Ticket Details Inspection) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right (2 Cols): Tickets Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[8px] border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Table Actions Header */}
            <div className="p-4 border-b border-[#f2efe9] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toast.info(t("خاصية إضافة تذكرة مخصصة للمشتركين فقط.", "Ticket creation is reserved for clients only."))}
                className="px-4 py-2 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="size-[15px]" />
                <span>{t("تسجيل تذكرة جديدة", "Register New Ticket")}</span>
              </button>

              <div className="flex items-center gap-1 bg-[#f5f3ef] p-1 rounded-[6px] self-end sm:self-auto text-[12px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === "all"
                      ? "bg-white text-[#1b1c1a] shadow-sm"
                      : "text-[#79716b] hover:text-[#1b1c1a]"
                  }`}
                >
                  <span>{t("التذاكر", "Tickets")}</span>
                  <span className="size-[18px] rounded-full bg-[#9c6402] text-white text-[10px] flex items-center justify-center font-bold">
                    12
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("in_progress")}
                  className={`px-3 py-1 rounded-[4px] font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === "in_progress"
                      ? "bg-white text-[#1b1c1a] shadow-sm"
                      : "text-[#79716b] hover:text-[#1b1c1a]"
                  }`}
                >
                  <span>{t("قيد المعالجة", "In Progress")}</span>
                  <span className="size-[18px] rounded-full bg-[#d97706] text-white text-[10px] flex items-center justify-center font-bold">
                    5
                  </span>
                </button>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#fcfaf7] border-b border-[#e6e2dc] text-[#514537] font-semibold">
                    <th className="py-3 px-4 font-bold min-w-[200px] text-start">{t("معرف التذكرة والجهة القانونية", "Ticket ID & Legal Entity")}</th>
                    <th className="py-3 px-4 font-bold min-w-[220px] text-start">{t("تصنيف المسألة", "Issue Category")}</th>
                    <th className="py-3 px-4 font-bold min-w-[100px] text-start">{t("مستوى الأولوية", "Priority")}</th>
                    <th className="py-3 px-4 font-bold min-w-[120px] text-start">{t("الحالة الإجرائية", "Status")}</th>
                    <th className="py-3 px-4 font-bold min-w-[110px] text-start">{t("آخر تحديث", "Last Updated")}</th>
                    <th className="py-3 px-4 font-bold text-center w-[80px]">{t("الإجراءات", "Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2efe9]">
                  {/* Row 1 */}
                  <tr className="hover:bg-[#fbf9f5] transition-colors bg-[#fdfbf7]/50">
                    <td className="py-3.5 px-4 text-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1b1c1a]">
                          {t("مجموعة الرياض للتحكيم الدولي", "Riyadh International Arbitration Group")}
                        </span>
                        <span className="text-[11px] text-[#79716b] font-mono mt-0.5">
                          {t("عقد TCK-2024-8839 • سنوي فئة A", "Contract TCK-2024-8839 • Annual Class A")}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#514537] text-start">
                      {t("تفعيل ختم التوقيع الرقمي المعتمد", "Activate certified digital signature")}
                      <span className="block text-[11px] text-[#79716b] mt-0.5">
                        {t("تحقق نفاذ الوطني للشركاء", "Nafath partner verification")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-start">
                      <span className="text-[12px] text-[#514537] font-medium">
                        {t("● عادي", "● Normal")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-start">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#e8f5e9] text-[#1b7340]">
                        {t("بانتظار رد العميل", "Awaiting Client Reply")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[12px] text-[#79716b] text-start">
                      {t("منذ 34 دقيقة", "34 mins ago")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="size-[28px] rounded-[4px] hover:bg-[#f2efe9] text-[#9c6402] flex items-center justify-center"
                          title={t("عرض", "View")}
                        >
                          <Eye className="size-[15px]" />
                        </button>
                        <button
                          type="button"
                          disabled
                          className="size-[28px] rounded-[4px] text-[#d6cfc7] cursor-not-allowed flex items-center justify-center"
                          title={t("الصلاحية محجوبة: يتطلب موافقة المشرف الأعلى ولا تتاح في نمط الموظف", "Restricted: Requires supervisor approval")}
                        >
                          <Trash2 className="size-[15px]" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-[#fbf9f5] transition-colors">
                    <td className="py-3.5 px-4 text-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1b1c1a]">
                          {t("مكتب الريادة والعدل للمحاماة", "Al-Riyada & Justice Law Firm")}
                        </span>
                        <span className="text-[11px] text-[#79716b] font-mono mt-0.5">
                          {t("حساب TCK-2024-8835 • مستخدم نشط 3 سنوات", "Account TCK-2024-8835 • Active 3 yrs")}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#514537] text-start">
                      {t("طلب ترحيل قضايا سابقة من Excel", "Migrate past cases from Excel")}
                      <span className="block text-[11px] text-[#79716b] mt-0.5">
                        {t("استيراد 240 ملف موكل", "Import 240 client files")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-start">
                      <span className="text-[12px] text-[#514537] font-medium">
                        {t("● عادي", "● Normal")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-start">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#fffbeb] text-[#b45309]">
                        {t("جاري سحب البيانات", "Fetching Data")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[12px] text-[#79716b] text-start">
                      {t("منذ ساعتين", "2 hours ago")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="size-[28px] rounded-[4px] hover:bg-[#f2efe9] text-[#9c6402] flex items-center justify-center"
                          title={t("عرض", "View")}
                        >
                          <Eye className="size-[15px]" />
                        </button>
                        <button
                          type="button"
                          disabled
                          className="size-[28px] rounded-[4px] text-[#d6cfc7] cursor-not-allowed flex items-center justify-center"
                          title={t("الصلاحية محجوبة: يتطلب موافقة المشرف الأعلى ولا تتاح في نمط الموظف", "Restricted: Requires supervisor approval")}
                        >
                          <Trash2 className="size-[15px]" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-[#fbf9f5] transition-colors">
                    <td className="py-3.5 px-4 text-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1b1c1a]">
                          {t("شركة ميثاق الحوكمة القانونية", "Mithaq Legal Governance Co.")}
                        </span>
                        <span className="text-[11px] text-[#79716b] font-mono mt-0.5">
                          {t("حساب TCK-2024-8830 • مؤسسي", "Account TCK-2024-8830 • Enterprise")}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#514537] text-start">
                      {t("تعديل مسار تسليم الإنذارات العدلية", "Adjust judicial notices delivery route")}
                      <span className="block text-[11px] text-[#79716b] mt-0.5">
                        {t("إشعارات SMS التلقائية", "Automated SMS notifications")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-start">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#fee2e2] text-[#b91c1c]">
                        {t("● عاجل", "● Urgent")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-start">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#e8f5e9] text-[#1b7340]">
                        {t("مكتملة ومؤرشفة", "Completed & Archived")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[12px] text-[#79716b] text-start">
                      {t("أمس 16:40", "Yesterday 16:40")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="size-[28px] rounded-[4px] hover:bg-[#f2efe9] text-[#9c6402] flex items-center justify-center"
                          title={t("عرض", "View")}
                        >
                          <Eye className="size-[15px]" />
                        </button>
                        <button
                          type="button"
                          disabled
                          className="size-[28px] rounded-[4px] text-[#d6cfc7] cursor-not-allowed flex items-center justify-center"
                          title={t("الصلاحية محجوبة: يتطلب موافقة المشرف الأعلى ولا تتاح في نمط الموظف", "Restricted: Requires supervisor approval")}
                        >
                          <Trash2 className="size-[15px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-[#fcfaf7] border-t border-[#e6e2dc] px-4 py-3 flex items-center justify-between text-[12px]">
              <span className="text-[#79716b]">
                {t("عرض 1 إلى 8 من أصل 10 تذكرة نشطة", "Showing 1 to 8 of 10 active tickets")}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2 py-1 text-[#a8a29e] cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronRight className={cn("size-[13px]", isEn && "rotate-180")} />
                  <span>{t("السابق", "Previous")}</span>
                </button>
                <button
                  type="button"
                  className="size-[24px] rounded-[4px] bg-[#9c6402] text-white font-bold flex items-center justify-center"
                >
                  1
                </button>
                <button
                  type="button"
                  className="size-[24px] rounded-[4px] hover:bg-[#f2efe9] text-[#514537] flex items-center justify-center"
                >
                  2
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-[#514537] hover:bg-[#f2efe9] flex items-center gap-1"
                >
                  <span>{t("التالي", "Next")}</span>
                  <ChevronLeft className={cn("size-[13px]", isEn && "rotate-180")} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side (1 Col): Ticket Detail Review & Inspector */}
        <div className="space-y-4">
          {/* Card: تفاصيل التذكرة المحددة */}
          <div className="bg-white rounded-[8px] p-5 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-start space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2efe9]">
              <h3 className="font-bold text-[14px] text-[#1b1c1a]">
                {t("تفاصيل التذكرة المحددة", "Selected Ticket Details")}
              </h3>
              <span className="font-mono text-[11px] font-bold text-[#8e5927] bg-[#fbf5ed] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce]">
                TCK-2024-8841
              </span>
            </div>

            {/* Client Info Card */}
            <div className="bg-[#fcfaf7] p-3 rounded-[6px] border border-[#f0ece5] flex items-center gap-3">
              <div className="size-[48px] rounded-[8px] overflow-hidden shrink-0 border border-[#e6e2dc]">
                <Image
                  src={userAvatarImg}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-start">
                <span className="font-bold text-[13px] text-[#1b1c1a] block">
                  {t("أ. عبد المحسن الرويلي", "Mr. Abdulmohsen Al-Ruwaili")}
                </span>
                <span className="text-[11px] text-[#79716b] block">
                  {t("الشريك المؤسس • مكتب النخبة", "Founding Partner • Al-Nokhba Firm")}
                </span>
                <span className="text-[11px] text-[#79716b] font-mono block mt-0.5" dir="ltr">
                  {t("هاتف موثق: +966 50 *** 9211", "Verified: +966 50 *** 9211")}
                </span>
              </div>
            </div>

            {/* Ticket Description */}
            <div className="bg-[#faf8f5] p-3.5 rounded-[6px] border border-[#e8e2d8]">
              <span className="text-[12px] font-bold text-[#1b1c1a] block mb-1">
                {t("وصف الخلل الوارد:", "Reported Issue:")}
              </span>
              <p className="text-[12px] text-[#514537] leading-[21px]">
                {t(
                  "«نواجه توقفاً في تحديث تقويم الجلسات المستعجلة لقضية الدائرة التجارية الرابعة منذ صباح اليوم. يلزم فحص التوكيل الرقمي المربوط بنظام منصة ناجز فوراً للأهمية القضائية.»",
                  "\"We are experiencing issues updating the urgent court calendar for Commercial Chamber 4 since this morning. Immediate check of the digital POA linked to Najiz is requested.\""
                )}
              </p>
            </div>

            {/* Reply Input Form */}
            <div className="space-y-2">
              <span className="text-[12px] font-bold text-[#1b1c1a] block">
                {t(
                  `كتابة إفادة الدعم الفني (بصفتك ${employee.name}):`,
                  `Write support response (as ${employee.name}):`
                )}
              </span>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t(
                  "اكتب التوجيه الفني أو الإجراء المتخذ للمشترك...",
                  "Enter technical response or action taken for the subscriber..."
                )}
                rows={3}
                className="w-full p-2.5 text-[12px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#1b1c1a] placeholder:text-[#948b83] focus:outline-none focus:border-[#9c6402] resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-4 py-1.5 rounded-[4px] bg-[#9c6402] hover:bg-[#855402] text-white text-[12px] font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="size-[13px]" />
                    <span>{t("إرسال التحديث", "Send Update")}</span>
                  </button>
                  <button
                    type="button"
                    title={t("إرفاق ملف", "Attach file")}
                    className="size-[30px] rounded-[4px] hover:bg-[#f2efe9] text-[#79716b] flex items-center justify-center transition-colors"
                  >
                    <Paperclip className="size-[15px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Restricted Action with Policy Note */}
            <div className="pt-2 border-t border-[#f2efe9] space-y-1.5">
              <button
                type="button"
                disabled
                className="w-full py-2 px-3 rounded-[6px] bg-[#f5f3ef] text-[#a8a29e] text-[12px] font-medium flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Lock className="size-[13px]" />
                <span>{t("حذف التذكرة نهائياً وإلغاء السجل (مقيد)", "Permanently Delete Ticket (Restricted)")}</span>
              </button>
              <p className="text-[10px] text-[#b91c1c] text-center leading-[15px]">
                {t(
                  "* الصلاحية محجوبة: يتطلب موافقة المشرف الأعلى ولا تتاح في نمط الموظف.",
                  "* Permission restricted: Requires supervisor approval, unavailable in employee mode."
                )}
              </p>
            </div>
          </div>

          {/* Active Employee Persona Card */}
          <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] flex items-center gap-3 text-start">
            <div className="size-[48px] rounded-full overflow-hidden shrink-0 border border-[#e6e2dc]">
              {employee.avatarImage ? (
                <Image
                  src={employee.avatarImage}
                  alt={employee.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="size-full bg-[#f5e6d3] text-[#8e5927] font-bold flex items-center justify-center">
                  {employee.initials}
                </div>
              )}
            </div>

            <div className="flex-1">
              <span className="font-bold text-[13px] text-[#1b1c1a] block">
                {employee.name}
              </span>
              <span className="text-[11px] text-[#79716b] block">
                {t("أخصائي عمليات ودعم فني المنصة", "Platform Support & Operations Specialist")}
              </span>
              <span className="text-[11px] text-[#9c6402] font-mono block">
                {t("الرقم الوظيفي:", "Employee Code:")} {employee.empCode}
              </span>
              <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                <span className="bg-[#f2efe9] text-[#514537] px-2 py-0.5 rounded-[4px]">
                  {t("القسم: خدمة العملاء", "Dept: Customer Support")}
                </span>
                <span className="bg-[#e8f5e9] text-[#1b7340] px-2 py-0.5 rounded-[4px] font-semibold">
                  {t("المستوى الرقابي: L2", "Audit Level: L2")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}