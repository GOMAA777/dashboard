"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Edit3,
  LogIn,
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

interface EmployeeDetailsViewProps {
  employee: Employee;
  onBack: () => void;
  onEdit: () => void;
  onLoginAsEmployee: () => void;
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
  const isSuspended = employee.status === "suspended";

  return (
    <div className="space-y-6 pb-20" dir="rtl" data-node-id="1:9815">
      {/* Top Breadcrumb & Back bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="h-[38px] px-4 rounded-[6px] border border-[#d6cfc7] bg-white hover:bg-[#f5f3ef] text-[#514537] text-[13px] font-medium flex items-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          <span>العودة لطاقم العمل</span>
          <ArrowRight className="size-[15px]" />
        </button>

        <span className="text-[12px] text-[#79716b]">
          طاقم العمل / تفاصيل الموظف / {employee.empCode}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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
                  موقوف
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9]">
                  <span className="size-[6px] rounded-full bg-[#1b7340]" />
                  نشط
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
                  تاريخ الإنشاء: {employee.createdAt || "14 يناير 2024 (منذ 9 أشهر)"}
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
            <span>تعديل الموظف</span>
          </button>

          {/* Login as employee */}
          <button
            type="button"
            onClick={onLoginAsEmployee}
            className="px-4 py-2 rounded-[6px] bg-[#fbf5ed] hover:bg-[#f5ebd9] text-[#8e5927] border border-[#ebdcc8] text-[13px] font-bold flex items-center gap-2 transition-colors"
          >
            <LogIn className="size-[15px]" />
            <span>الدخول كالموظف</span>
          </button>

          {/* Deactivate / Activate */}
          {isSuspended ? (
            <button
              type="button"
              onClick={onActivate}
              className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9] text-[13px] font-semibold flex items-center gap-2 transition-colors"
            >
              <UserCheck className="size-[15px]" />
              <span>تفعيل الحساب</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onDeactivate}
              className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] text-[13px] font-semibold flex items-center gap-2 transition-colors"
            >
              <UserX className="size-[15px]" />
              <span>إيقاف الحساب</span>
            </button>
          )}

          {/* Reset password */}
          <button
            type="button"
            onClick={onResetPassword}
            className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-[#f5f3ef] text-[#514537] border border-[#d6cfc7] text-[13px] font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="size-[15px]" />
            <span>إعادة تعيين كلمة المرور</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Left (Permissions) & Right (Main Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right 2 Columns: البيانات الأساسية ومعلومات الدخول */}
        <div className="lg:col-span-2 bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#f2efe9] mb-5">
              <div className="flex items-center gap-3">
                <div className="size-[36px] rounded-[8px] bg-[#f5efe6] flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-[18px] text-[#9c6402]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                    البيانات الأساسية ومعلومات الدخول
                  </h2>
                  <p className="text-[12px] text-[#79716b]">
                    السجلات الشخصية والبيانات المعتمدة للموظف في النظام
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#79716b] bg-[#f5f3ef] px-2.5 py-1 rounded-[4px] border border-[#e6e2dc]">
                ID: {employee.empCode}
              </span>
            </div>

            {/* 4x2 Grid of Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 1 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  الاسم الرباعي المعتمد
                </span>
                <span className="text-[14px] font-bold text-[#1b1c1a]">
                  {employee.name}
                </span>
              </div>

              {/* Field 2 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#79716b] block mb-1">
                    المعرف الوظيفي
                  </span>
                  <span className="text-[14px] font-bold font-mono text-[#1b1c1a]">
                    {employee.empCode}
                  </span>
                </div>
                <span className="text-[11px] text-[#79716b] bg-[#f2efe9] px-2 py-0.5 rounded-[4px]">
                  موظف دائم
                </span>
              </div>

              {/* Field 3 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#79716b] block mb-1">
                    البريد الإلكتروني المعتمد للدخول
                  </span>
                  <span className="text-[13px] font-bold font-mono text-[#1b1c1a]">
                    {employee.email}
                  </span>
                </div>
                <CheckCircle2 className="size-[16px] text-[#10b981] shrink-0" />
              </div>

              {/* Field 4 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#79716b] block mb-1">
                    رقم الجوال الموثق للتحقق
                  </span>
                  <span className="text-[13px] font-bold font-mono text-[#1b1c1a]" dir="ltr">
                    {employee.phone}
                  </span>
                </div>
                <span className="text-[10px] text-[#1b7340] bg-[#e8f5e9] px-2 py-0.5 rounded-[4px] border border-[#c8e6c9]">
                  مربوط بـ OTP
                </span>
              </div>

              {/* Field 5 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  الدور الوظيفي المعتمد
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.role.name}
                </span>
                <span className="text-[11px] text-[#79716b] block mt-0.5">
                  المستوى الإجرائي: المستوى الأول
                </span>
              </div>

              {/* Field 6 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  القسم الإداري
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.department}
                </span>
                <span className="text-[11px] text-[#79716b] block mt-0.5">
                  المشرف المباشر: {employee.directSupervisor || "م. عبد العزيز بن فهد"}
                </span>
              </div>

              {/* Field 7 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  تاريخ وتوقيت إنشاء الحساب
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.createdAt || "14 يناير 2024 - 10:30 ص"}
                </span>
                <span className="text-[11px] text-[#79716b] block mt-0.5">
                  بواسطة: الإدارة العليا للنظام
                </span>
              </div>

              {/* Field 8 */}
              <div className="bg-[#fcfaf7] p-3.5 rounded-[6px] border border-[#f0ece5]">
                <span className="text-[11px] text-[#79716b] block mb-1">
                  آخر نشاط ومصادقة ناجحة
                </span>
                <span className="text-[13px] font-bold text-[#1b1c1a]">
                  {employee.lastLogin.time}
                </span>
                <span className="text-[11px] text-[#1b7340] font-semibold block mt-0.5">
                  ● جلسة نشطة حالياً
                </span>
              </div>
            </div>
          </div>

          {/* Security & Encryption Compliance Banner */}
          <div className="mt-6 bg-[#faf8f5] border border-[#e8e2d8] rounded-[8px] p-4">
            <div className="flex items-center gap-2 mb-2 text-[#1b1c1a] font-bold text-[13px]">
              <Shield className="size-[15px] text-[#9c6402]" />
              <span>معايير التشفير والأمان المطبقة</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px] text-[#514537]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-[14px] text-[#10b981] shrink-0" />
                <span>
                  سياسة كلمة المرور: مشفرة آلياً ({employee.passwordLastChanged || "تم التجديد الدوري قبل 45 يوماً"})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-[14px] text-[#10b981] shrink-0" />
                <span>
                  المصادقة الثنائية (2FA): مفروضة إلزامياً عبر تطبيق Authenticator ورمز SMS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left 1 Column: ملخص الصلاحيات */}
        <div className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-[#f2efe9] mb-5">
              <div className="size-[36px] rounded-[8px] bg-[#f5efe6] flex items-center justify-center shrink-0">
                <KeyRound className="size-[18px] text-[#9c6402]" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                  ملخص الصلاحيات
                </h2>
                <p className="text-[12px] text-[#79716b]">
                  الأدوار والوحدات المرخصة للموظف
                </p>
              </div>
            </div>

            {/* Role Header Card */}
            <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] mb-5">
              <span className="text-[11px] text-[#79716b] block mb-1">
                الدور النشط المرتبط
              </span>
              <h3 className="text-[15px] font-bold text-[#1b1c1a]">
                {employee.role.name}
              </h3>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#79716b]">تغطية الوحدات الإدارية المصرح بها:</span>
                  <span className="font-bold text-[#9c6402]">6 من أصل 14 وحدة (42%)</span>
                </div>
                <div className="w-full bg-[#f0ece5] h-[6px] rounded-full overflow-hidden">
                  <div className="bg-[#9c6402] h-full w-[42%]" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#ede8e1] text-[11px]">
                <span className="text-[#514537]">إجمالي 24 صلاحية نشطة</span>
                <span className="text-[#8e5927] bg-[#fbf5ed] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce] font-medium">
                  حدود إدارية مضبوطة
                </span>
              </div>
            </div>

            {/* Allowed Modules List */}
            <div>
              <span className="text-[13px] font-bold text-[#1b1c1a] block mb-3">
                الوحدات المصرح بها والقدرات المتاحة
              </span>

              <div className="space-y-3">
                {/* Module 1 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] bg-[#fcfaf7] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Headphones className="size-[16px] text-[#10b981] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        تذاكر الدعم الفني والشكاوى
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        استعراض، إنشاء، الرد وتحديث التذاكر، إسناد للمشرفين
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1b7340] bg-[#e8f5e9] px-2 py-0.5 rounded-full border border-[#c8e6c9] shrink-0">
                    كامل الصلاحية
                  </span>
                </div>

                {/* Module 2 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] bg-[#fcfaf7] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Building className="size-[16px] text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        إدارة العملاء والمكاتب القانونية
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        عرض بيانات المكاتب، فحص حالة الاشتراك، سجل النشاط
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#d97706] bg-[#fff5ea] px-2 py-0.5 rounded-full border border-[#fed7aa] shrink-0">
                    صلاحية مقيدة
                  </span>
                </div>

                {/* Module 3 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] bg-[#fcfaf7] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Users className="size-[16px] text-[#79716b] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        دليل طاقم العمل
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        استعراض قائمة الزملاء وقنوات التواصل الداخلية فقط
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#79716b] bg-[#f2efe9] px-2 py-0.5 rounded-full shrink-0">
                    قراءة فقط
                  </span>
                </div>

                {/* Module 4 */}
                <div className="p-3 rounded-[6px] border border-[#f0ece5] bg-[#fcfaf7] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Bell className="size-[16px] text-[#10b981] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-bold text-[#1b1c1a] block">
                        الإشعارات والرسائل التنبيهية
                      </span>
                      <span className="text-[11px] text-[#79716b] leading-[18px] block">
                        بث التنبيهات الفنية للعملاء وإرسال تحديثات تذاكر الدعم
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1b7340] bg-[#e8f5e9] px-2 py-0.5 rounded-full border border-[#c8e6c9] shrink-0">
                    إرسال وتحديث
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: سجل العمليات والنشاط الأخير */}
      <div className="bg-white rounded-[8px] border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#f2efe9]">
          <div className="flex items-center gap-3">
            <div className="size-[36px] rounded-[8px] bg-[#f5efe6] flex items-center justify-center shrink-0">
              <Clock className="size-[18px] text-[#9c6402]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1b1c1a]">
                سجل العمليات والنشاط الأخير
              </h2>
              <p className="text-[12px] text-[#79716b]">
                توثيق إلكتروني آلي غير قابل للتعديل لكافة حركات تسجيل الدخول، تعديل الصلاحيات، والجلسات الرقابية المعتمدة.
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#e6e2dc] text-[#514537] font-semibold">
                <th className="py-3 px-4 font-bold min-w-[170px]">التاريخ والوقت</th>
                <th className="py-3 px-4 font-bold min-w-[160px]">نوع الحدث / الإجراء</th>
                <th className="py-3 px-4 font-bold min-w-[170px]">المنفذ المسؤول</th>
                <th className="py-3 px-4 font-bold min-w-[280px]">تفاصيل العملية وملاحظات الأمان</th>
                <th className="py-3 px-4 font-bold min-w-[220px]">عنوان IP والجهاز الموثق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2efe9]">
              {sampleSaraAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#fbf9f5] transition-colors">
                  {/* Date & Time */}
                  <td className="py-3.5 px-4 font-medium text-[#1b1c1a]">
                    <div className="flex flex-col">
                      <span>{log.time}</span>
                      <span className="text-[11px] text-[#79716b]">{log.date}</span>
                    </div>
                  </td>

                  {/* Event Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[12px] font-semibold border ${log.eventBadgeClass}`}
                    >
                      <span className="size-[5px] rounded-full bg-current" />
                      {log.eventType}
                    </span>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-4 text-[#514537] leading-[20px]">
                    {log.details}
                  </td>

                  {/* IP & Device */}
                  <td className="py-3.5 px-4 text-[12px] text-[#79716b] font-mono">
                    {log.ip} • {log.device}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
