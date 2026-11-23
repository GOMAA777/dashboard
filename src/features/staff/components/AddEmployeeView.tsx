"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Lightbulb,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Employee, EmployeeRole } from "../types/staff.types";
import {
  AddEmployeeFormData,
  validateStaffForm,
  isSeniorManagementDept,
} from "../schemas/staff.schema";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useRolesQuery, useDepartmentsQuery } from "../hooks/useStaffQuery";
import { unwrapList } from "@/lib/api/helpers";
import { ApiError } from "@/lib/api/http";
import {
  extractFieldErrors,
  mapStaffFormFieldErrors,
} from "@/lib/api/field-errors";
import { saveUnifiedDraft } from "@/stores/use-drafts-store";
import { generateTempPassword } from "@/lib/api/password";

const initialDefaultRoles: RoleOption[] = [
  { id: "1", name: "Super Admin", category: "الإدارة العليا" },
  { id: "3", name: "موظف", category: "طاقم العمل" },
];

const initialDefaultDepartments: DeptOption[] = [
  { id: "1", name: "الإدارة العليا" },
  { id: "2", name: "قسم القضايا العمالية والنزاعات" },
  { id: "3", name: "قسم الشركات والاستشارات التجارية" },
  { id: "4", name: "قسم الترافع والتمثيل القضائي" },
  { id: "5", name: "قسم التوثيق والعقود العقارية" },
  { id: "6", name: "قسم الدعم الفني والربط التقني" },
];

export type SaveEmployeePayload = {
  employee: Employee;
  password: string;
  departmentId: number;
  roleId: number;
};

interface AddEmployeeViewProps {
  onBack: () => void;
  onSave: (payload: SaveEmployeePayload) => Promise<void>;
  existingEmployees?: Employee[];
  serverFieldErrors?: Partial<Record<keyof AddEmployeeFormData, string>>;
}

type RoleOption = { id: string; name: string; category: string };
type DeptOption = { id: string; name: string };

const inputBase =
  "w-full h-[42px] pe-10 ps-3 text-[13px] bg-[#f5f3ef] dark:bg-[#160e0a] border rounded-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:ring-1 transition-colors";

export function AddEmployeeView({
  onBack,
  onSave,
  existingEmployees = [],
  serverFieldErrors,
}: AddEmployeeViewProps) {
  const { t, isEn, direction } = useLanguage();

  const [formData, setFormData] = useState<AddEmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    departmentId: "",
    password: generateTempPassword(),
  });

  const [touched, setTouched] = useState<Partial<Record<keyof AddEmployeeFormData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof AddEmployeeFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCopyField = async (text: string, field: "email" | "password") => {
    if (!text.trim()) {
      toast.error(
        field === "email"
          ? t("أدخل البريد الإلكتروني أولاً", "Enter the email first")
          : t("لا توجد كلمة مرور للنسخ", "No password to copy")
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(t("تم النسخ إلى الحافظة", "Copied to clipboard"));
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error(t("تعذر النسخ", "Copy failed"));
    }
  };
  const rolesQuery = useRolesQuery();
  const departmentsQuery = useDepartmentsQuery();

  const roles = useMemo<RoleOption[]>(() => {
    if (!rolesQuery.data) return initialDefaultRoles;
    const roleRows = unwrapList<Record<string, unknown>>(rolesQuery.data).map((raw) => ({
      id: String(raw.id ?? ""),
      name: String(raw.name ?? ""),
      category: String(
        (raw as { slug?: string }).slug ||
          (raw as { description?: string }).description ||
          "—"
      ),
    }));
    const filtered = roleRows.filter((r) => r.id);
    return filtered.length > 0 ? filtered : initialDefaultRoles;
  }, [rolesQuery.data]);

  const departments = useMemo<DeptOption[]>(() => {
    if (!departmentsQuery.data) return initialDefaultDepartments;
    const deptRows = unwrapList<Record<string, unknown>>(departmentsQuery.data).map((raw) => ({
      id: String(raw.id ?? ""),
      name: String(raw.name ?? ""),
    }));
    const filtered = deptRows.filter((d) => d.id);
    return filtered.length > 0 ? filtered : initialDefaultDepartments;
  }, [departmentsQuery.data]);

  const listsError =
    rolesQuery.error instanceof Error
      ? rolesQuery.error.message
      : departmentsQuery.error instanceof Error
      ? departmentsQuery.error.message
      : null;

  const matchedDept = departments.find((d) => d.id === formData.departmentId);
  const departmentName = matchedDept?.name;
  const isSeniorDept = isSeniorManagementDept(departmentName);

  const validation = useMemo(() => {
    return validateStaffForm(formData, {
      existingEmployees,
      departmentName,
      isEdit: false,
    });
  }, [formData, existingEmployees, departmentName]);

  const isFormValid = validation.isValid;

  const displayErrors = useMemo(() => {
    const errs: Partial<Record<keyof AddEmployeeFormData, string>> = {};
    const allKeys: (keyof AddEmployeeFormData)[] = [
      "name",
      "email",
      "phone",
      "roleId",
      "departmentId",
      "password",
    ];
    for (const key of allKeys) {
      if (serverErrors[key]) {
        errs[key] = serverErrors[key];
      } else if (serverFieldErrors?.[key]) {
        errs[key] = serverFieldErrors[key];
      } else if (
        submitAttempted ||
        touched[key] ||
        (formData[key] !== undefined && String(formData[key]).trim().length > 0)
      ) {
        if (validation.errors[key]) {
          errs[key] = validation.errors[key];
        }
      }
    }
    return errs;
  }, [serverErrors, serverFieldErrors, submitAttempted, touched, formData, validation.errors]);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd)
      return {
        percent: 0,
        text: t("أدخل كلمة المرور", "Enter password"),
        color: "bg-[#e6e2dc] dark:bg-[#38271c]",
      };
    if (pwd.length < 6)
      return { percent: 25, text: t("ضعيفة جداً", "Very weak"), color: "bg-[#ef4444]" };
    if (pwd.length < 8)
      return { percent: 50, text: t("متوسطة", "Medium"), color: "bg-[#f59e0b]" };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return {
        percent: 100,
        text: t("الموصى به: قوي جداً", "Recommended: Very strong"),
        color: "bg-[#10b981]",
      };
    }
    return {
      percent: 75,
      text: t("جيدة", "Good"),
      color: "bg-[#9c6402] dark:bg-[#e29d38]",
    };
  };

  const strength = getPasswordStrength(formData.password);

  const buildEmployee = (): SaveEmployeePayload | null => {
    setSubmitAttempted(true);
    if (!validation.isValid) {
      toast.error(
        t(
          "يرجى مراجعة وتصحيح البيانات المطلوبة.",
          "Please review and correct the required fields."
        )
      );
      return null;
    }

    setServerErrors({});
    const matchedRole = roles.find((r) => r.id === formData.roleId);
    const role: EmployeeRole = {
      id: formData.roleId,
      name: matchedRole?.name || (isEn ? "Role" : "دور"),
      category: matchedDept?.name || matchedRole?.category || "—",
      badgeClass:
        "bg-[#ffeed9] dark:bg-[#2d1f16] text-[#7b4e00] dark:text-[#f3c27e] border-[#fcd8b0] dark:border-[#e29d38]/40",
      iconType: "shield",
    };

    const phoneDigits = formData.phone.replace(/[\s\-\(\)]/g, "");
    const phone = phoneDigits.startsWith("+")
      ? phoneDigits
      : phoneDigits.startsWith("00966")
      ? `+${phoneDigits.slice(2)}`
      : phoneDigits.startsWith("966")
      ? `+${phoneDigits}`
      : `+966${phoneDigits.replace(/^0+/, "")}`;

    const employee: Employee = {
      id: `emp-${Date.now()}`,
      empCode: `EMP-${Date.now().toString().slice(-6)}`,
      name: formData.name.trim(),
      initials:
        formData.name
          .trim()
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("") || (isEn ? "E" : "م"),
      avatarBg: "bg-[#f5e6d3]",
      avatarText: "text-[#8e5927]",
      jobTitle: role.name,
      department: matchedDept?.name || "—",
      email: formData.email.trim(),
      phone,
      role,
      status: "active",
      lastLogin: {
        time: isEn ? "Never logged in" : "لم يسجل الدخول بعد",
      },
      createdAt: isEn ? "Today" : "اليوم",
    };

    const deptIdNum = Number(formData.departmentId);
    const roleIdNum = Number(formData.roleId);

    return {
      employee,
      password: formData.password,
      departmentId: Number.isFinite(deptIdNum) && deptIdNum > 0 ? deptIdNum : 1,
      roleId: Number.isFinite(roleIdNum) && roleIdNum > 0 ? roleIdNum : 1,
    };
  };

  const handleSubmit = (isDraft = false) => {
    if (isDraft) {
      const draftId = `draft_staff_${Date.now()}`;
      saveUnifiedDraft({
        id: draftId,
        type: "staff",
        typeLabelAr: "موظف وطاقم",
        typeLabelEn: "Staff Member",
        title: formData.name?.trim() || t("مسودة موظف جديد", "New Draft Employee"),
        summary: formData.email?.trim() || t("بيانات الموظف وقسم التعيين", "Employee credentials & department"),
        targetUrl: `/permissions?tab=staff&action=new-employee&draftId=${draftId}`,
        badge: t("مسودة", "Draft"),
        data: { ...formData },
      });
      toast.success(
        t(
          "تم حفظ بيانات الموظف كمسودة بنجاح وإضافتها إلى قسم المسودات.",
          "Employee data saved to Drafts successfully."
        )
      );
      return;
    }
    if (!buildEmployee()) return;
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    const payload = buildEmployee();
    if (!payload) {
      setConfirmOpen(false);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(payload);
      setConfirmOpen(false);
    } catch (err: unknown) {
      setConfirmOpen(false);
      if (err instanceof ApiError) {
        const apiFields = mapStaffFormFieldErrors(extractFieldErrors(err.body));
        if (Object.keys(apiFields).length > 0) {
          setServerErrors((prev) => ({ ...prev, ...apiFields }));
        }
        toast.error(err.message);
      } else {
        toast.error(
          t("تعذر إضافة الموظف. حاول مرة أخرى.", "Failed to add employee. Please retry.")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (hasError: boolean) =>
    hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-[#eae8e4] dark:border-[#38271c] focus:ring-[#9c6402] dark:focus:ring-[#e29d38] focus:border-[#9c6402] dark:focus:border-[#e29d38]";

  return (
    <div dir={direction} className="space-y-4 pb-2" data-node-id="1:9529">
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="size-[40px] rounded-[8px] bg-[#f5f3ef] dark:bg-[#2d1f16] border border-transparent dark:border-[#38271c] flex items-center justify-center hover:bg-[#eae6e0] dark:hover:bg-[#38271c] transition-colors cursor-pointer"
          >
            <ArrowLeft className={cn("size-[18px] text-[#514537] dark:text-[#cdc5bd]", !isEn && "rotate-180")} />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("إضافة موظف جديد", "Add New Employee")}
            </h1>
            <p className="text-[13px] text-[#79716b] dark:text-[#a89f91] mt-0.5">
              {t(
                "إنشاء حساب موظف بصلاحيات الدخول إلى لوحة الإدارة.",
                "Create a staff account with admin dashboard access."
              )}
            </p>
          </div>
        </div>
      </div>

      {listsError && (
        <div className="rounded-[8px] border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-[#2c2013] px-4 py-3 text-[13px] text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
          <span>{listsError}</span>
          <button
            type="button"
            className="font-semibold underline cursor-pointer"
            onClick={() => {
              void rolesQuery.refetch();
              void departmentsQuery.refetch();
            }}
          >
            {t("إعادة المحاولة", "Retry")}
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2efe9] dark:border-[#38271c]">
          <div className="size-[42px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center shrink-0">
            <User className="size-[20px] text-[#9c6402] dark:text-[#e29d38]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("البيانات الأساسية", "Basic Information")}
            </h2>
            <p className="text-[12px] text-[#79716b] dark:text-[#a89f91]">
              {t("الاسم وبيانات التواصل والدور الوظيفي", "Name, contact details, and role")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. الاسم الكامل */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("الاسم الكامل", "Full Name")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setTouched((prev) => ({ ...prev, name: true }));
                  if (serverErrors.name) setServerErrors((prev) => ({ ...prev, name: undefined }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                placeholder={t("مثال: راكان بن كمال الحارثي", "e.g. Rakan Alharbi")}
                className={cn(inputBase, fieldError(!!displayErrors.name))}
              />
              <User className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            {displayErrors.name && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">
                {displayErrors.name}
              </span>
            )}
          </div>

          {/* 2. البريد الإلكتروني */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("البريد الإلكتروني", "Email")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setTouched((prev) => ({ ...prev, email: true }));
                  if (serverErrors.email) setServerErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                placeholder="name@aljudy.sa"
                className={cn(inputBase, "text-left pe-10 ps-10", fieldError(!!displayErrors.email))}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => void handleCopyField(formData.email, "email")}
                className="absolute top-1/2 -translate-y-1/2 end-2.5 p-1 rounded-[4px] text-[#948b83] hover:text-[#9c6402] dark:text-[#a89f91] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                title={t("نسخ البريد الإلكتروني", "Copy email")}
              >
                {copiedField === "email" ? (
                  <Check className="size-[15px] text-[#10b981]" />
                ) : (
                  <Copy className="size-[15px]" />
                )}
              </button>
              <Mail className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
            </div>
            {displayErrors.email && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">
                {displayErrors.email}
              </span>
            )}
          </div>

          {/* 3. رقم الجوال */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("رقم الجوال", "Mobile Number")} <span className="text-red-500">*</span>
            </label>
            <div
              className={cn(
                "flex rounded-[6px] border overflow-hidden focus-within:ring-1",
                displayErrors.phone
                  ? "border-red-500 focus-within:ring-red-500"
                  : "border-[#eae8e4] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#160e0a] focus-within:border-[#9c6402] dark:focus-within:border-[#e29d38] focus-within:ring-[#9c6402] dark:focus-within:ring-[#e29d38]"
              )}
            >
              <span className="bg-[#eae8e4] dark:bg-[#281c15] px-3 py-2 text-[12px] font-semibold text-[#514537] dark:text-[#cdc5bd] border-e border-[#d6cfc7] dark:border-[#38271c] flex items-center justify-center shrink-0 select-none">
                +966
              </span>
              <input
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setTouched((prev) => ({ ...prev, phone: true }));
                  if (serverErrors.phone) setServerErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                placeholder={isSeniorDept ? "050 123 4567" : "50 123 4567"}
                className="w-full h-[40px] px-3 text-[13px] bg-transparent text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none font-mono text-right"
              />
            </div>
            {displayErrors.phone ? (
              <span className="text-[11px] text-red-500 mt-1 block font-medium leading-relaxed">
                {displayErrors.phone}
              </span>
            ) : isSeniorDept ? (
              <span className="text-[11px] text-[#9c6402] dark:text-[#e29d38] mt-1 block font-medium">
                {t(
                  "قسم الإدارة العليا: يشترط رقم جوال سعودي يبدأ بـ 05 ويتكون من 10 أرقام (أو بصيغة +9665XXXXXXXX).",
                  "Senior Management: Requires Saudi mobile starting with 05 (10 digits) or +9665XXXXXXXX."
                )}
              </span>
            ) : null}
          </div>

          {/* 4. القسم */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("القسم", "Department")} <span className="text-red-500">*</span>
            </label>
            <DashboardSelect
              value={formData.departmentId}
              onChange={(e) => {
                setFormData({ ...formData, departmentId: e.target.value });
                setTouched((prev) => ({ ...prev, departmentId: true }));
                if (serverErrors.departmentId) {
                  setServerErrors((prev) => ({ ...prev, departmentId: undefined }));
                }
              }}
              placeholder={t("اختر القسم", "Select department")}
              className={cn(
                "rounded-[6px] bg-[#f5f3ef] dark:bg-[#160e0a]",
                fieldError(!!displayErrors.departmentId)
              )}
            >
              <option value="">
                {t("اختر القسم", "Select department")}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </DashboardSelect>
            {displayErrors.departmentId && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">
                {displayErrors.departmentId}
              </span>
            )}
          </div>

          {/* 5. الدور الوظيفي */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("الدور الوظيفي", "Role")} <span className="text-red-500">*</span>
            </label>
            <DashboardSelect
              value={formData.roleId}
              onChange={(e) => {
                setFormData({ ...formData, roleId: e.target.value });
                setTouched((prev) => ({ ...prev, roleId: true }));
                if (serverErrors.roleId) {
                  setServerErrors((prev) => ({ ...prev, roleId: undefined }));
                }
              }}
              placeholder={t("اختر دور الموظف", "Select employee role")}
              className={cn(
                "rounded-[6px] bg-[#f5f3ef] dark:bg-[#160e0a]",
                fieldError(!!displayErrors.roleId)
              )}
            >
              <option value="">
                {t("اختر دور الموظف", "Select employee role")}
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </DashboardSelect>
            {displayErrors.roleId && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">
                {displayErrors.roleId}
              </span>
            )}
          </div>

          {/* 6. كلمة المرور المؤقتة */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    password: generateTempPassword(),
                  }))
                }
                className="text-[12px] text-[#9c6402] dark:text-[#e29d38] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="size-3.5" />
                <span>{t("إعادة التوليد", "Regenerate")}</span>
              </button>
              <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("كلمة المرور المؤقتة (مولَّدة)", "Temporary password (generated)")}{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                readOnly
                placeholder="••••••••••••"
                className={cn(inputBase, "ps-10 pe-16", fieldError(!!displayErrors.password))}
                dir="ltr"
              />
              <div className="absolute top-1/2 -translate-y-1/2 end-2.5 flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => void handleCopyField(formData.password, "password")}
                  className="p-1 rounded-[4px] text-[#948b83] hover:text-[#9c6402] dark:text-[#a89f91] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                  title={t("نسخ كلمة المرور", "Copy password")}
                >
                  {copiedField === "password" ? (
                    <Check className="size-[15px] text-[#10b981]" />
                  ) : (
                    <Copy className="size-[15px]" />
                  )}
                </button>
                <KeyRound className="size-[16px] text-[#948b83] dark:text-[#a89f91] pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 start-3 text-[#948b83] dark:text-[#a89f91] hover:text-[#514537] dark:hover:text-[#fdfbf7] cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-[16px]" /> : <Eye className="size-[16px]" />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-[#79716b] dark:text-[#a89f91]">
                {t(
                  "تُعرض مرة واحدة بعد الحفظ مع زر نسخ، ويُجبر الموظف على تغييرها عند أول دخول.",
                  "Shown once after save with a copy button; employee must change it on first login."
                )}
              </span>
              <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] shrink-0 ms-2">
                {strength.text}
              </span>
            </div>
            <div className="w-full bg-[#f2efe9] dark:bg-[#281c15] h-[4px] rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            {displayErrors.password && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">
                {displayErrors.password}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 bg-[#faf8f5] dark:bg-[#1a120d] border border-[#e8e2d8] dark:border-[#38271c] rounded-[8px] p-4 flex items-start gap-3">
          <Lightbulb className="size-[18px] text-[#d97706] dark:text-[#e29d38] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[20px]">
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("ملاحظة تنظيمية: ", "Regulatory note: ")}
            </span>
            {t(
              "في حال عدم توفر دور ملائم لطبيعة مهام الموظف، يمكنك ",
              "If no suitable role matches employee tasks, you can "
            )}
            <Link
              href="/roles?action=add"
              className="font-bold text-[#9c6402] dark:text-[#e29d38] underline cursor-pointer hover:opacity-80"
            >
              {t("إنشاء دور جديد +", "Create New Role +")}
            </Link>{" "}
            {t(
              "عبر قسم الأدوار والصلاحيات المستقل وتطبيقه مباشرة دون فقدان البيانات المدخلة هنا.",
              "via the independent Roles & Permissions section and apply it directly without losing inputs."
            )}
          </p>
        </div>
      </div>

      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[13px] text-[#514537] dark:text-[#cdc5bd]">
          <ShieldCheck className="size-[18px] text-[#10b981] shrink-0" />
          <span>
            {t(
              "يتم تسجيل إضافة الموظف فوراً في سجل تدقيق العمليات القضائي.",
              "Employee registration is logged immediately in the audit log."
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2d1f16] hover:bg-[#eae6e0] dark:hover:bg-[#38271c] border border-transparent dark:border-[#38271c] rounded-[6px] transition-colors cursor-pointer disabled:opacity-60"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2d1f16] hover:bg-[#eae6e0] dark:hover:bg-[#38271c] border border-transparent dark:border-[#38271c] rounded-[6px] transition-colors cursor-pointer disabled:opacity-60"
          >
            {t("حفظ كمسودة", "Save as Draft")}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!isFormValid || isSubmitting}
            className={cn(
              "px-5 py-2 text-[13px] font-bold text-white dark:text-[#1c140f] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors flex items-center gap-2",
              isFormValid && !isSubmitting
                ? "bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#f3c27e] cursor-pointer"
                : "bg-[#9c6402]/50 dark:bg-[#e29d38]/50 opacity-60 cursor-not-allowed pointer-events-none"
            )}
          >
            <UserCheck className="size-[16px]" />
            <span>{t("حفظ الموظف", "Save Employee")}</span>
          </button>
        </div>
      </DashboardStickyActionBar>

      <LuxuryAlertDialog
        isOpen={confirmOpen}
        onClose={() => !isSubmitting && setConfirmOpen(false)}
        onConfirm={() => {
          void handleConfirmSave();
        }}
        title={t("تأكيد إضافة الموظف", "Confirm employee creation")}
        description={t(
          "سيتم إنشاء حساب الموظف عبر واجهة طاقم العمل وإرسال بيانات الدخول وفق إعدادات النظام.",
          "The staff account will be created via the Staff API with the credentials you entered."
        )}
        confirmLabel={t("تأكيد الحفظ", "Confirm save")}
        variant="info"
        itemDetails={{ name: formData.name, email: formData.email }}
      />
    </div>
  );
}
