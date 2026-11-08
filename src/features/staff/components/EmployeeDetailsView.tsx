"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Edit3,
  UserX,
  UserCheck,
  RotateCcw,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  Building,
  Users,
  Bell,
  Clock,
  KeyRound,
} from "lucide-react";
import { Employee } from "../types/staff.types";
import { sampleSaraAuditLogs } from "../data/initialStaff";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface EmployeeDetailsViewProps {
  employee: Employee;
  onBack: () => void;
  onEdit: () => void;
  onLoginAsEmployee?: () => void;
  onDeactivate: () => void;
  onActivate: () => void;
  onResetPassword: () => void;
}

export function EmployeeDetailsView({
  employee,
  onBack,
  onEdit,
  onLoginAsEmployee,
  onDeactivate,
  onActivate,
  onResetPassword,
}: EmployeeDetailsViewProps) {
  const { t, isEn, direction } = useLanguage();
  const isSuspended = employee.status === "suspended";

  return (
    <div dir={direction} className="space-y-6 pb-20" data-node-id="1:9815">
      {/* Top Back bar */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={onBack}
          className="h-[38px] px-4 rounded-[6px] border border-[#d6cfc7] bg-white hover:bg-[#f5f3ef] text-[#514537] text-[13px] font-medium flex items-center gap-2 transition-colors shrink-0 shadow-sm cursor-pointer"
        >
          <ArrowLeft className={cn("size-[15px]", isEn && "rotate-180")} />
          <span>{t("العودة لطاقم العمل", "Back to Staff Members")}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Right side: Employee Identity */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className={`size-[72px] rounded-[12px] flex items-center justify-center font-bold text-[24px] shrink-0 overflow-hidden shadow-sm ${employee.avatarBg} ${employee.avatarText}`}
          >
            {employee.avatarImage ? (
              <Image
                src={employee.avatarImage}
                alt={employee.name}
                width={72}
                height={72}
                className="w-full h-full object-cover"
              />
            ) : (
              employee.initials
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-bold text-[#1b1c1a]">
                {employee.name}
              </h1>
              <span className="text-[12px] font-mono text-[#79716b] bg-[#f5f3ef] px-2 py-0.5 rounded-[4px] border border-[#e6e2dc]">
                {employee.empCode}
              </span>
              {isSuspended ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#fff5ea] text-[#d97706] border border-[#fed7aa]">
                  <span className="size-[6px] rounded-full bg-[#d97706]" />
                  {t("موقوف", "Suspended")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9]">
                  <span className="size-[6px] rounded-full bg-[#1b7340]" />
                  {t("نشط", "Active")}
                </span>
              )}
            </div>

            <p className="text-[13px] text-[#514537] mt-1 font-medium">
              {employee.jobTitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#79716b] mt-2">
              <div className="flex items-center gap-1.5 font-mono">
                <Mail className="size-[13px] text-[#9c6402]" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-[13px] text-[#9c6402]" />
                <span>
                  {t("تاريخ الإنشاء:", "Created:")} {employee.createdAt || (isEn ? "14 Jan 2024" : "14 يناير 2024")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left side: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors"
          >
            <Edit3 className="size-[15px]" />
            <span>{t("تعديل الموظف", "Edit Employee")}</span>
          </button>

          {/* Deactivate / Activate */}
          {isSuspended ? (
            <button
              type="button"
              onClick={onActivate}
              className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9] text-[13px] font-semibold flex items-center gap-2 transition-colors"
            >
              <UserCheck className="size-[15px]" />
              <span>{t("تفعيل الحساب", "Activate Account")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onDeactivate}
              className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] text-[13px] font-semibold flex items-center gap-2 transition-colors"
            >
              <UserX className="size-[15px]" />
              <span>{t("إيقاف الحساب", "Deactivate Account")}</span>
            </button>
          )}

          {/* Reset password */}
          <button
            type="button"
            onClick={onResetPassword}
            className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-[#f5f3ef] text-[#514537] border border-[#d6cfc7] text-[13px] font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="size-[15px]" />
            <span>{t("إعادة تعيين كلمة المرور", "Reset Password")}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Left (Permissions) & Right (Main Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right 2 Columns: البيانات الأساسية ومعلومات الدخول */}
        <div className="lg:col-span-2 bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#f2efe9] dark:border-[#38271c] mb-5">
              <div className="flex items-center gap-3">
                <div className="size-[36px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("البيانات الأساسية ومعلومات الدخول", "Basic Information & Login Details")}
                  </h2>
                  <p className="text-[12px] text-[#79716b] dark:text-[#a89f91]">
                    {t(
                      "السجلات الشخصية والبيانات المعتمدة للموظف في النظام",
                      "Personal records and approved credentials for employee in the system"
                    )}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#79716b] dark:text-[#a89f91] bg-[#f5f3ef] dark:bg-[#281c15] px-2.5 py-1 rounded-[4px] border border-[#e6e2dc] dark:border-[#38271c]">
                ID: {employee.empCode}
              </span>
            </div>

            {/* 4x2 Grid of Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 1 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                  {t("الاسم الرباعي المعتمد", "Approved Full Name")}
                </span>
                <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {employee.name}
                </span>
              </div>

              {/* Field 2 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#79716b] block mb-1">
                    {t("المعرف الوظيفي", "Employee ID")}
                  </span>
                  <span className="text-[14px] font-bold font-mono text-[#1b1c1a]">
                    {employee.empCode}
                  </span>
                </div>
                <span className="text-[11px] text-[#79716b] bg-[#f2efe9] px-2 py-0.5 rounded-[4px]">
                  {t("موظف دائم", "Permanent")}
                </span>
              </div>

              {/* Field 3 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#79716b] block mb-1">
                    {t("البريد الإلكتروني المعتمد للدخول", "Approved Login Email")}
                  </span>
                  <span className="text-[13px] font-bold font-mono text-[#1b1c1a]">
                    {employee.email}
                  </span>
                </div>
                <CheckCircle2 className="size-[16px] text-[#10b981] shrink-0" />
              </div>

              {/* Field 4 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#79716b] block mb-1">
                    {t("رقم الجوال الموثق للتحقق", "Verified Phone for OTP")}
                  </span>
                  <span className="text-[13px] font-bold font-mono text-[#1b1c1a]" dir="ltr">
                    {employee.phone}
                  </span>
                </div>
                <span className="text-[10px] text-[#1b7340] bg-[#e8f5e9] px-2 py-0.5 rounded-[4px] border border-[#c8e6c9]">
                  {t("مربوط بـ OTP", "OTP Linked")}
                </span>
              </div>

              {/* Field 5 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  {t("الدور الوظيفي المعتمد", "Approved Job Role")}
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.role.name}
                </span>
                <span className="text-[11px] text-[#79716b] block mt-0.5">
                  {t("المستوى الإجرائي: المستوى الأول", "Procedural Level: Level 1")}
                </span>
              </div>

              {/* Field 6 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  {t("القسم الإداري", "Department")}
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.department}
                </span>
                <span className="text-[11px] text-[#79716b] block mt-0.5">
                  {t("المشرف المباشر:", "Direct Supervisor:")} {employee.directSupervisor || (isEn ? "Eng. Abdulaziz bin Fahd" : "م. عبد العزيز بن فهد")}
                </span>
              </div>

              {/* Field 7 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  {t("تاريخ وتوقيت إنشاء الحساب", "Account Creation Date & Time")}
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.createdAt || (isEn ? "14 Jan 2024 - 10:30 AM" : "14 يناير 2024 - 10:30 ص")}
                </span>
                <span className="text-[11px] text-[#79716b] block mt-0.5">
                  {t("بواسطة: الإدارة العليا للنظام", "By: Senior Administration")}
                </span>
              </div>

              {/* Field 8 */}
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3.5 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  {t("آخر نشاط ومصادقة ناجحة", "Last Active & Authenticated")}
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.lastLogin.time}
                </span>
                <span className="text-[11px] text-[#1b7340] font-semibold block mt-0.5">
                  {t("● جلسة نشطة حالياً", "● Active Session")}
                </span>
              </div>
            </div>
          </div>

          {/* Security & Encryption Compliance Banner */}
          <div className="mt-6 bg-[#faf8f5] dark:bg-[#281c15] border border-[#e8e2d8] dark:border-[#38271c] rounded-[8px] p-4">
            <div className="flex items-center gap-2 mb-2 text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[13px]">
              <Shield className="size-[15px] text-[#9c6402]" />
              <span>{t("معايير التشفير والأمان المطبقة", "Applied Encryption & Security Standards")}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px] text-[#514537] dark:text-[#cdc5bd]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-[14px] text-[#10b981] shrink-0" />
                <span>
                  {t("سياسة كلمة المرور: مشفرة آلياً", "Password Policy: Auto-encrypted")} ({employee.passwordLastChanged || (isEn ? "renewed 45 days ago" : "تم التجديد الدوري قبل 45 يوماً")})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-[14px] text-[#10b981] shrink-0" />
                <span>
                  {t(
                    "المصادقة الثنائية (2FA): مفروضة إلزامياً عبر تطبيق Authenticator ورمز SMS",
                    "Two-Factor Auth (2FA): Enforced via Authenticator app & SMS OTP"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left 1 Column: ملخص الصلاحيات */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-[#f2efe9] dark:border-[#38271c] mb-5">
              <div className="size-[36px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] flex items-center justify-center shrink-0">
                <KeyRound className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("ملخص الصلاحيات", "Permissions Summary")}
                </h2>
                <p className="text-[12px] text-[#79716b] dark:text-[#a89f91]">
                  {t("الأدوار والوحدات المرخصة للموظف", "Roles and licensed modules for employee")}
                </p>
              </div>
            </div>

            {/* Role Header Card */}
            <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-4 rounded-[8px] border border-[#f0ece5] dark:border-[#38271c] mb-5">
              <span className="text-[11px] text-[#79716b] block mb-1">
                {t("الدور النشط المرتبط", "Active Assigned Role")}
              </span>
              <h3 className="text-[15px] font-bold text-[#1b1c1a]">
                {employee.role.name}
              </h3>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#79716b]">{t("تغطية الوحدات الإدارية المصرح بها:", "Authorized module coverage:")}</span>
                  <span className="font-bold text-[#9c6402]">{t("6 من أصل 14 وحدة (42%)", "6 of 14 modules (42%)")}</span>
                </div>
                <div className="w-full bg-[#f0ece5] dark:bg-[#38271c] h-[6px] rounded-full overflow-hidden">
                  <div className="bg-[#9c6402] h-full w-[42%]" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#ede8e1] text-[11px]">
                <span className="text-[#514537]">{t("إجمالي 24 صلاحية نشطة", "24 Active Permissions in Total")}</span>
                <span className="text-[#8e5927] bg-[#fbf5ed] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce] font-medium">
                  {t("حدود إدارية مضبوطة", "Controlled Bounds")}
                </span>
              </div>
            </div>

            {/* Allowed Modules List */}
            <div>
              <span className="text-[13px] font-bold text-[#1b1c1a] block mb-3">
                {t("الوحدات المصرح بها والقدرات المتاحة", "Authorized Modules & Capabilities")}
              </span>

              <div className="space-y-3">
                {/* Module 1 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#160e0a] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Headphones className="size-[16px] text-[#10b981] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        {t("تذاكر الدعم الفني والشكاوى", "Support Tickets & Inquiries")}
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        {t("استعراض، إنشاء، الرد وتحديث التذاكر، إسناد للمشرفين", "View, create, reply & update tickets, assign to supervisors")}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1b7340] bg-[#e8f5e9] px-2 py-0.5 rounded-full border border-[#c8e6c9] shrink-0">
                    {t("كامل الصلاحية", "Full Access")}
                  </span>
                </div>

                {/* Module 2 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#160e0a] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Building className="size-[16px] text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        {t("إدارة العملاء والمكاتب القانونية", "Clients & Law Firms Management")}
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        {t("عرض بيانات المكاتب، فحص حالة الاشتراك، سجل النشاط", "View office details, check subscription status, activity logs")}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#d97706] bg-[#fff5ea] px-2 py-0.5 rounded-full border border-[#fed7aa] shrink-0">
                    {t("صلاحية مقيدة", "Restricted")}
                  </span>
                </div>

                {/* Module 3 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#160e0a] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Users className="size-[16px] text-[#79716b] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        {t("دليل طاقم العمل", "Staff Directory")}
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        {t("استعراض قائمة الزملاء وقنوات التواصل الداخلية فقط", "View colleague list and internal communication channels only")}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#79716b] bg-[#f2efe9] px-2 py-0.5 rounded-full shrink-0">
                    {t("قراءة فقط", "Read Only")}
                  </span>
                </div>

                {/* Module 4 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#160e0a] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Bell className="size-[16px] text-[#10b981] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        {t("الإشعارات والرسائل التنبيهية", "Notifications & Alerts")}
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        {t("بث التنبيهات الفنية للعملاء وإرسال تحديثات تذاكر الدعم", "Broadcast technical notices to clients and send ticket updates")}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1b7340] bg-[#e8f5e9] px-2 py-0.5 rounded-full border border-[#c8e6c9] shrink-0">
                    {t("إرسال وتحديث", "Send & Update")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: سجل العمليات والنشاط الأخير */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#f2efe9] dark:border-[#38271c]">
          <div className="flex items-center gap-3">
            <div className="size-[36px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] flex items-center justify-center shrink-0">
              <Clock className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("سجل العمليات والنشاط الأخير", "Recent Operations & Activity Log")}
              </h2>
              <p className="text-[12px] text-[#79716b] dark:text-[#a89f91]">
                {t(
                  "توثيق إلكتروني آلي غير قابل للتعديل لكافة حركات تسجيل الدخول، تعديل الصلاحيات، والجلسات الرقابية المعتمدة.",
                  "Immutable electronic record of all logins, permission updates, and supervised sessions."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#fcfaf7] dark:bg-[#160e0a] border-b border-[#e6e2dc] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] font-semibold">
                <th className="py-3 px-4 font-bold min-w-[170px] text-start">{t("التاريخ والوقت", "Date & Time")}</th>
                <th className="py-3 px-4 font-bold min-w-[160px] text-start">{t("نوع الحدث / الإجراء", "Event Type / Action")}</th>
                <th className="py-3 px-4 font-bold min-w-[170px] text-start">{t("المنفذ المسؤول", "Responsible Actor")}</th>
                <th className="py-3 px-4 font-bold min-w-[280px] text-start">{t("تفاصيل العملية وملاحظات الأمان", "Operation Details & Security Notes")}</th>
                <th className="py-3 px-4 font-bold min-w-[220px] text-start">{t("عنوان IP والجهاز الموثق", "IP Address & Device")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2efe9] dark:divide-[#38271c]">
              {sampleSaraAuditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                    {t("لا توجد سجلات تدقيق", "No audit logs")}
                  </td>
                </tr>
              ) : (
                sampleSaraAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fbf9f5] dark:hover:bg-[#281c15] transition-colors">
                    {/* Date & Time */}
                    <td className="py-3.5 px-4 font-medium text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                      <div className="flex flex-col">
                        <span>{log.time}</span>
                        <span className="text-[11px] text-[#79716b]">{log.date}</span>
                      </div>
                    </td>

                    {/* Event Badge */}
                    <td className="py-3.5 px-4 text-start">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[12px] font-semibold border ${log.eventBadgeClass}`}
                      >
                        <span className="size-[5px] rounded-full bg-current" />
                        {log.eventType}
                      </span>
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4 text-start">
                      <div className="flex items-center gap-2">
                        <div className="size-[24px] rounded-full bg-[#f5e6d3] text-[#8e5927] flex items-center justify-center font-bold text-[10px] shrink-0">
                          {log.actor[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1b1c1a]">{log.actor}</span>
                          <span className="text-[11px] text-[#79716b]">{log.actorRole}</span>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 text-[#514537] leading-[20px] text-start">
                      {log.details}
                    </td>

                    {/* IP & Device */}
                    <td className="py-3.5 px-4 text-[12px] text-[#79716b] font-mono text-start">
                      {log.ip} • {log.device}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}