"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Shield,
  Lightbulb,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { staffRoles } from "../data/initialStaff";
import { Employee } from "../types/staff.types";
import { addEmployeeSchema, AddEmployeeFormData } from "../schemas/staff.schema";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AddEmployeeViewProps {
  onBack: () => void;
  onSave: (employee: Employee) => void;
}

export function AddEmployeeView({ onBack, onSave }: AddEmployeeViewProps) {
  const { t, isEn, direction } = useLanguage();

  const [formData, setFormData] = useState<AddEmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddEmployeeFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { percent: 0, text: t("أدخل كلمة المرور", "Enter password"), color: "bg-[#e6e2dc]" };
    if (pwd.length < 6) return { percent: 25, text: t("ضعيفة جداً", "Very weak"), color: "bg-[#ef4444]" };
    if (pwd.length < 8) return { percent: 50, text: t("متوسطة", "Medium"), color: "bg-[#f59e0b]" };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { percent: 100, text: t("الموصى به: قوي جداً", "Recommended: Very strong"), color: "bg-[#10b981]" };
    }
    return { percent: 75, text: t("جيدة", "Good"), color: "bg-[#9c6402]" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (isDraft = false) => {
    if (isDraft) {
      toast.info(t("تم حفظ بيانات الموظف كمسودة مؤقتة في المتصفح.", "Employee data saved as temporary draft in browser."));
      return;
    }

    const result = addEmployeeSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AddEmployeeFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddEmployeeFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error(t("يرجى مراجعة وتصحيح البيانات المطلوبة.", "Please review and correct the required fields."));
      return;
    }

    setErrors({});
    const matchedRole = staffRoles.find((r) => r.id === formData.roleId) || staffRoles[1];

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      empCode: `EMP-${Math.floor(130 + Math.random() * 50)}`,
      name: formData.name,
      initials: formData.name.trim().split(" ").slice(0, 2).map((n) => n[0]).join("") || (isEn ? "E" : "م"),
      avatarBg: "bg-[#f5e6d3]",
      avatarText: "text-[#8e5927]",
      jobTitle: matchedRole.name,
      department: matchedRole.category,
      email: formData.email,
      phone: formData.phone.startsWith("+") ? formData.phone : `+966 ${formData.phone}`,
      role: matchedRole,
      status: "active",
      lastLogin: {
        time: isEn ? "Never logged in" : "لم يسجل الدخول بعد",
      },
      createdAt: isEn ? "Today" : "اليوم",
      directSupervisor: isEn ? "Eng. Abdulaziz bin Fahd" : "م. عبد العزيز بن فهد",
      twoFactorEnabled: true,
      twoFactorMethod: isEn ? "Authenticator App & SMS OTP" : "تطبيق Authenticator ورمز SMS",
      passwordLastChanged: isEn ? "Today" : "اليوم",
    };

    onSave(newEmp);
    toast.success(
      isEn
        ? `Employee "${newEmp.name}" added and activated successfully.`
        : `تمت إضافة الموظف "${newEmp.name}" بنجاح وتفعيل حسابه.`
    );
  };

  return (
    <div dir={direction} className="space-y-6 pb-2 sm:pb-3" data-node-id="1:9529">
      {/* Header Banner */}
      <div className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] leading-[36px]">
            {t("إضافة موظف", "Add Employee")}
          </h1>
          <p className="text-[14px] text-[#514537] mt-1">
            {t(
              "إضافة موظف جديد إلى النظام وتحديد الدور المسؤول عن صلاحياته وفق سياسات الحوكمة والأمان المعتمدة.",
              "Add a new employee to the system and define their role according to governance and security policies."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="h-[38px] px-4 rounded-[6px] border border-[#d6cfc7] bg-white hover:bg-[#f5f3ef] text-[#514537] text-[13px] font-medium flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className={cn("size-[15px]", isEn && "rotate-180")} />
          <span>{t("العودة", "Back")}</span>
        </button>
      </div>

      {/* Card 1: البيانات الأساسية */}
      <div className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2efe9]">
          <div className="size-[42px] rounded-[8px] bg-[#f5efe6] flex items-center justify-center shrink-0">
            <User className="size-[20px] text-[#9c6402]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#1b1c1a]">
              {t("البيانات الأساسية", "Basic Information")}
            </h2>
            <p className="text-[12px] text-[#79716b]">
              {t(
                "المعلومات الشخصية والاعتماد الإداري المباشر",
                "Personal details and direct administrative accreditation"
              )}
            </p>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* الاسم الكامل */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              {t("الاسم الكامل", "Full Name")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("أدخل الاسم الكامل للموظف", "Enter employee's full name")}
                className={`w-full h-[42px] pe-10 ps-3 text-[13px] bg-[#fdfbf7] border rounded-[6px] text-[#1b1c1a] focus:outline-none focus:ring-1 transition-colors ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#d6cfc7] focus:ring-[#9c6402] focus:border-[#9c6402]"
                }`}
              />
              <User className="size-[16px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            {errors.name && (
              <span className="text-[11px] text-red-500 mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          {/* البريد الإلكتروني المهني */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              {t("البريد الإلكتروني المهني", "Professional Email")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@aljudy.com"
                className={`w-full h-[42px] pe-10 ps-3 text-[13px] bg-[#fdfbf7] border rounded-[6px] text-[#1b1c1a] font-mono focus:outline-none focus:ring-1 transition-colors ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#d6cfc7] focus:ring-[#9c6402] focus:border-[#9c6402]"
                }`}
              />
              <Mail className="size-[16px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#79716b] mt-1">
              {t("ⓘ يُستخدم هذا البريد كمعرّف لتسجيل الدخول", "ⓘ This email is used as login identifier")}
            </p>
            {errors.email && (
              <span className="text-[11px] text-red-500 mt-0.5 block">
                {errors.email}
              </span>
            )}
          </div>

          {/* رقم الجوال */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              {t("رقم الجوال", "Mobile Number")} <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-[6px] border border-[#d6cfc7] bg-[#fdfbf7] overflow-hidden focus-within:border-[#9c6402] focus-within:ring-1 focus-within:ring-[#9c6402]">
              <span className="bg-[#f2efe9] px-3 py-2 text-[12px] font-semibold text-[#514537] border-e border-[#d6cfc7] flex items-center justify-center shrink-0">
                +966
              </span>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="50 123 4567"
                className="w-full h-[40px] px-3 text-[13px] bg-transparent text-[#1b1c1a] focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-[#79716b] mt-1">
              {t("يُستخدم لتأكيد العمليات الحساسة وإرسال رموز OTP", "Used to confirm sensitive operations & send OTPs")}
            </p>
            {errors.phone && (
              <span className="text-[11px] text-red-500 mt-0.5 block">
                {errors.phone}
              </span>
            )}
          </div>

          {/* الدور الوظيفي */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              {t("الدور الوظيفي", "Role")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                className={`w-full h-[42px] pe-10 ps-3 text-[13px] bg-[#fdfbf7] border rounded-[6px] text-[#1b1c1a] appearance-none focus:outline-none focus:ring-1 transition-colors ${
                  errors.roleId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#d6cfc7] focus:ring-[#9c6402] focus:border-[#9c6402]"
                }`}
              >
                <option value="">{t("اختر دور الموظف", "Select employee role")}</option>
                {staffRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.category})
                  </option>
                ))}
              </select>
              <Shield className="size-[16px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#79716b] mt-1">
              {t(
                "يحدد الدور الحزم والأقسام والإجراءات التي يمكن للموظف النفاذ إليها داخل المنصة.",
                "The role determines packages, modules, and actions accessible inside the platform."
              )}
            </p>
            {errors.roleId && (
              <span className="text-[11px] text-red-500 mt-0.5 block">
                {errors.roleId}
              </span>
            )}
          </div>
        </div>

        {/* Regulatory Note */}
        <div className="mt-6 bg-[#faf8f5] border border-[#e8e2d8] rounded-[8px] p-4 flex items-start gap-3">
          <Lightbulb className="size-[18px] text-[#d97706] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#514537] leading-[20px]">
            <span className="font-bold text-[#1b1c1a]">{t("ملاحظة تنظيمية: ", "Regulatory note: ")}</span>
            {t(
              "في حال عدم توفر دور ملائم لطبيعة مهام الموظف، يمكنك ",
              "If no suitable role matches employee tasks, you can "
            )}
            <span className="font-bold text-[#9c6402] underline cursor-pointer">
              {t("إنشاء دور جديد +", "Create New Role +")}
            </span>{" "}
            {t(
              "عبر قسم الأدوار والصلاحيات المستقل وتطبيقه مباشرة دون فقدان البيانات المدخلة هنا.",
              "via the independent Roles & Permissions section and apply it directly without losing inputs."
            )}
          </p>
        </div>
      </div>

      {/* Card 2: كلمة المرور وتأكيد الحساب */}
      <div className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2efe9]">
          <div className="size-[42px] rounded-[8px] bg-[#f5efe6] flex items-center justify-center shrink-0">
            <KeyRound className="size-[20px] text-[#9c6402]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#1b1c1a]">
              {t("كلمة المرور وتأكيد الحساب", "Password & Account Confirmation")}
            </h2>
            <p className="text-[12px] text-[#79716b]">
              {t("تعيين بيانات الاعتماد الأمنية الأولية", "Set initial security credentials")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* كلمة المرور */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              {t("كلمة المرور", "Password")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className={`w-full h-[42px] pe-10 ps-10 text-[13px] bg-[#fdfbf7] border rounded-[6px] text-[#1b1c1a] focus:outline-none focus:ring-1 transition-colors ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#d6cfc7] focus:ring-[#9c6402] focus:border-[#9c6402]"
                }`}
              />
              <KeyRound className="size-[16px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 start-3 text-[#948b83] hover:text-[#514537]"
              >
                {showPassword ? <EyeOff className="size-[16px]" /> : <Eye className="size-[16px]" />}
              </button>
            </div>
            {/* Password strength bar */}
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-[#79716b]">{t("مستوى قوة كلمة المرور:", "Password strength:")}</span>
              <span className="font-semibold text-[#1b1c1a]">{strength.text}</span>
            </div>
            <div className="w-full bg-[#f2efe9] h-[4px] rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            {errors.password && (
              <span className="text-[11px] text-red-500 mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              {t("تأكيد كلمة المرور", "Confirm Password")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••••••"
                className={`w-full h-[42px] pe-10 ps-10 text-[13px] bg-[#fdfbf7] border rounded-[6px] text-[#1b1c1a] focus:outline-none focus:ring-1 transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#d6cfc7] focus:ring-[#9c6402] focus:border-[#9c6402]"
                }`}
              />
              <KeyRound className="size-[16px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 -translate-y-1/2 start-3 text-[#948b83] hover:text-[#514537]"
              >
                {showConfirmPassword ? <EyeOff className="size-[16px]" /> : <Eye className="size-[16px]" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[11px] text-red-500 mt-1 block">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating Sticky Action Bar */}
      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[13px] text-[#514537] dark:text-[#cdc5bd]">
          <ShieldCheck className="size-[18px] text-[#10b981] shrink-0" />
          <span>{t("يتم تسجيل إضافة الموظف فوراً في سجل تدقيق العمليات القضائي.", "Employee registration is logged immediately in the audit log.")}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2c2017] hover:bg-[#eae6e0] dark:hover:bg-[#382a1f] border border-transparent dark:border-[#3d2a1d] rounded-[6px] transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2c2017] hover:bg-[#eae6e0] dark:hover:bg-[#382a1f] border border-transparent dark:border-[#3d2a1d] rounded-[6px] transition-colors cursor-pointer"
          >
            {t("حفظ كمسودة", "Save as Draft")}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="px-5 py-2 text-[13px] font-bold text-white bg-[#9c6402] hover:bg-[#855402] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="size-[16px]" />
            <span>{t("حفظ الموظف", "Save Employee")}</span>
          </button>
        </div>
      </DashboardStickyActionBar>
    </div>
  );
}