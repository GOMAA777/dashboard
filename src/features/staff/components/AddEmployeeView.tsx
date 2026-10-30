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

interface AddEmployeeViewProps {
  onBack: () => void;
  onSave: (employee: Employee) => void;
}

export function AddEmployeeView({ onBack, onSave }: AddEmployeeViewProps) {
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
    if (!pwd) return { percent: 0, text: "أدخل كلمة المرور", color: "bg-[#e6e2dc]" };
    if (pwd.length < 6) return { percent: 25, text: "ضعيفة جداً", color: "bg-[#ef4444]" };
    if (pwd.length < 8) return { percent: 50, text: "متوسطة", color: "bg-[#f59e0b]" };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { percent: 100, text: "الموصى به: قوي جداً", color: "bg-[#10b981]" };
    }
    return { percent: 75, text: "جيدة", color: "bg-[#9c6402]" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (isDraft = false) => {
    if (isDraft) {
      toast.info("تم حفظ بيانات الموظف كمسودة مؤقتة في المتصفح.");
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
      toast.error("يرجى مراجعة وتصحيح البيانات المطلوبة.");
      return;
    }

    setErrors({});
    const matchedRole = staffRoles.find((r) => r.id === formData.roleId) || staffRoles[1];

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      empCode: `EMP-${Math.floor(130 + Math.random() * 50)}`,
      name: formData.name,
      initials: formData.name.trim().split(" ").slice(0, 2).map((n) => n[0]).join("") || "م",
      avatarBg: "bg-[#f5e6d3]",
      avatarText: "text-[#8e5927]",
      jobTitle: matchedRole.name,
      department: matchedRole.category,
      email: formData.email,
      phone: formData.phone.startsWith("+") ? formData.phone : `+966 ${formData.phone}`,
      role: matchedRole,
      status: "active",
      lastLogin: {
        time: "لم يسجل الدخول بعد",
      },
      createdAt: "اليوم",
      directSupervisor: "م. عبد العزيز بن فهد",
      twoFactorEnabled: true,
      twoFactorMethod: "تطبيق Authenticator ورمز SMS",
      passwordLastChanged: "اليوم",
    };

    onSave(newEmp);
    toast.success(`تمت إضافة الموظف "${newEmp.name}" بنجاح وتفعيل حسابه.`);
  };

  return (
    <div className="space-y-6 pb-20" data-node-id="1:9529">
      {/* Header Banner */}
      <div className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] leading-[36px]">
            إضافة موظف
          </h1>
          <p className="text-[14px] text-[#514537] mt-1">
            إضافة موظف جديد إلى النظام وتحديد الدور المسؤول عن صلاحياته وفق سياسات الحوكمة والأمان المعتمدة.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="h-[38px] px-4 rounded-[6px] border border-[#d6cfc7] bg-white hover:bg-[#f5f3ef] text-[#514537] text-[13px] font-medium flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="size-[15px] rtl:rotate-180" />
          <span>العودة</span>
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
              البيانات الأساسية
            </h2>
            <p className="text-[12px] text-[#79716b]">
              المعلومات الشخصية والاعتماد الإداري المباشر
            </p>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* الاسم الكامل */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل الاسم الكامل للموظف"
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
              البريد الإلكتروني المهني <span className="text-red-500">*</span>
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
              ⓘ يُستخدم هذا البريد كمعرّف لتسجيل الدخول
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
              رقم الجوال <span className="text-red-500">*</span>
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
              يُستخدم لتأكيد العمليات الحساسة وإرسال رموز OTP
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
              الدور الوظيفي <span className="text-red-500">*</span>
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
                <option value="">اختر دور الموظف</option>
                {staffRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.category})
                  </option>
                ))}
              </select>
              <Shield className="size-[16px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#79716b] mt-1">
              يحدد الدور الحزم والأقسام والإجراءات التي يمكن للموظف النفاذ إليها داخل المنصة.
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
            <span className="font-bold text-[#1b1c1a]">ملاحظة تنظيمية: </span>
            في حال عدم توفر دور ملائم لطبيعة مهام الموظف، يمكنك{" "}
            <span className="font-bold text-[#9c6402] underline cursor-pointer">
              إنشاء دور جديد +
            </span>{" "}
            عبر قسم الأدوار والصلاحيات المستقل وتطبيقه مباشرة دون فقدان البيانات المدخلة هنا.
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
              كلمة المرور وتأكيد الحساب
            </h2>
            <p className="text-[12px] text-[#79716b]">
              تعيين بيانات الاعتماد الأمنية الأولية
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* كلمة المرور */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] mb-2">
              كلمة المرور <span className="text-red-500">*</span>
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
              <span className="text-[#79716b]">مستوى قوة كلمة المرور:</span>
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
              تأكيد كلمة المرور <span className="text-red-500">*</span>
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
          <span>يتم تسجيل إضافة الموظف فوراً في سجل تدقيق العمليات القضائي.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2c2017] hover:bg-[#eae6e0] dark:hover:bg-[#382a1f] border border-transparent dark:border-[#3d2a1d] rounded-[6px] transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2c2017] hover:bg-[#eae6e0] dark:hover:bg-[#382a1f] border border-transparent dark:border-[#3d2a1d] rounded-[6px] transition-colors cursor-pointer"
          >
            حفظ كمسودة
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="px-5 py-2 text-[13px] font-bold text-white bg-[#9c6402] hover:bg-[#855402] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="size-[16px]" />
            <span>حفظ الموظف</span>
          </button>
        </div>
      </DashboardStickyActionBar>
    </div>
  );
}
