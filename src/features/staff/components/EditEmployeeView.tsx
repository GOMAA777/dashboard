"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Check,
  Phone,
  Building2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Employee, isEmployeeAdmin } from "../types/staff.types";
import { editEmployeeSchema, EditEmployeeFormData } from "../schemas/staff.schema";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { fetchRoles } from "@/lib/api/roles";
import { fetchDepartments } from "@/lib/api/departments";
import { unwrapList } from "@/lib/api/helpers";
import { ApiError } from "@/lib/api/http";
import {
  extractFieldErrors,
  mapStaffFormFieldErrors,
} from "@/lib/api/field-errors";

type RoleOption = { id: string; name: string; category: string };
type DeptOption = { id: string; name: string };

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

export interface SaveEditEmployeePayload {
  id: string;
  payload: Record<string, unknown>;
}

interface EditEmployeeViewProps {
  employee: Employee;
  onBack: () => void;
  onSave: (data: SaveEditEmployeePayload) => Promise<void>;
  serverFieldErrors?: Partial<Record<keyof EditEmployeeFormData, string>>;
}

const inputBase =
  "w-full h-[42px] pe-10 ps-3 text-[13px] bg-[#f5f3ef] dark:bg-[#160e0a] border rounded-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:ring-1 transition-colors";

function extractLocalPhone(phone: string): string {
  if (!phone) return "";
  let clean = phone.replace(/\s+/g, "");
  if (clean.startsWith("+966")) clean = clean.slice(4);
  else if (clean.startsWith("00966")) clean = clean.slice(5);
  else if (clean.startsWith("966")) clean = clean.slice(3);
  else if (clean.startsWith("0")) clean = clean.slice(1);
  return clean;
}

export function EditEmployeeView({
  employee,
  onBack,
  onSave,
  serverFieldErrors,
}: EditEmployeeViewProps) {
  const { t, isEn, direction } = useLanguage();
  const isAdmin = isEmployeeAdmin(employee);

  const [formData, setFormData] = useState<EditEmployeeFormData>({
    name: employee.name || "",
    email: employee.email || "",
    phone: extractLocalPhone(employee.phone || ""),
    roleId: employee.role?.id ? String(employee.role.id) : "",
    departmentId: employee.departmentId ? String(employee.departmentId) : "",
    status: employee.status || "active",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EditEmployeeFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roles, setRoles] = useState<RoleOption[]>(initialDefaultRoles);
  const [departments, setDepartments] = useState<DeptOption[]>(initialDefaultDepartments);
  const [listsError, setListsError] = useState<string | null>(null);

  useEffect(() => {
    if (serverFieldErrors) {
      setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
    }
  }, [serverFieldErrors]);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([fetchRoles(), fetchDepartments()])
      .then(([rolesRes, deptsRes]) => {
        if (cancelled) return;
        if (rolesRes.status === "fulfilled") {
          const roleRows = unwrapList<Record<string, unknown>>(rolesRes.value).map((raw) => ({
            id: String(raw.id ?? ""),
            name: String(raw.name ?? ""),
            category: String(
              (raw as { slug?: string }).slug ||
                (raw as { description?: string }).description ||
                "—"
            ),
          }));
          const filtered = roleRows.filter((r) => r.id);
          if (filtered.length > 0) {
            setRoles(filtered);
            // If roleId not matched, try matching by name
            setFormData((prev) => {
              if (prev.roleId && filtered.some((r) => r.id === prev.roleId)) {
                return prev;
              }
              const matched = filtered.find(
                (r) => r.name.toLowerCase() === employee.role.name?.toLowerCase()
              );
              return matched ? { ...prev, roleId: matched.id } : prev;
            });
          }
        }
        if (deptsRes.status === "fulfilled") {
          const deptRows = unwrapList<Record<string, unknown>>(deptsRes.value).map((raw) => ({
            id: String(raw.id ?? ""),
            name: String(raw.name ?? ""),
          }));
          const filtered = deptRows.filter((d) => d.id);
          if (filtered.length > 0) {
            setDepartments(filtered);
            // If departmentId not matched, try matching by name
            setFormData((prev) => {
              if (prev.departmentId && filtered.some((d) => d.id === prev.departmentId)) {
                return prev;
              }
              const matched = filtered.find(
                (d) => d.name.toLowerCase() === employee.department?.toLowerCase()
              );
              return matched ? { ...prev, departmentId: matched.id } : prev;
            });
          }
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : t("تعذر تحديث الأدوار والأقسام من الخادم.", "Failed to load roles and departments.");
        setListsError(message);
      });

    return () => {
      cancelled = true;
    };
  }, [employee]);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return null;
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

  const strength = getPasswordStrength(formData.password || "");

  const validateForm = (): boolean => {
    const result = editEmployeeSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EditEmployeeFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof EditEmployeeFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error(
        t(
          "يرجى مراجعة وتصحيح البيانات المطلوبة.",
          "Please review and correct the required fields."
        )
      );
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!validateForm()) {
      setConfirmOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const phoneDigits = formData.phone.replace(/\s+/g, "");
      const formattedPhone = phoneDigits.startsWith("+")
        ? phoneDigits
        : `+966${phoneDigits.replace(/^0+/, "")}`;

      const deptIdNum = Number(formData.departmentId);
      const roleIdNum = Number(formData.roleId);

      const payload: Record<string, unknown> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formattedPhone,
        department_id: Number.isFinite(deptIdNum) && deptIdNum > 0 ? deptIdNum : 1,
        role_id: Number.isFinite(roleIdNum) && roleIdNum > 0 ? roleIdNum : 1,
        status: isAdmin ? "active" : formData.status,
      };

      if (formData.password && formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      await onSave({ id: employee.id, payload });
      setConfirmOpen(false);
    } catch (err: unknown) {
      setConfirmOpen(false);
      if (err instanceof ApiError) {
        const apiFields = mapStaffFormFieldErrors(extractFieldErrors(err.body));
        if (Object.keys(apiFields).length > 0) {
          setErrors((prev) => ({ ...prev, ...apiFields }));
        }
        toast.error(err.message);
      } else {
        toast.error(
          t("تعذر تحديث بيانات الموظف. حاول مرة أخرى.", "Failed to update employee. Please retry.")
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
    <div dir={direction} className="space-y-4 pb-2">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="size-[40px] rounded-[8px] bg-[#f5f3ef] dark:bg-[#2d1f16] border border-transparent dark:border-[#38271c] flex items-center justify-center hover:bg-[#eae6e0] dark:hover:bg-[#38271c] transition-colors cursor-pointer"
            aria-label={t("العودة", "Back")}
          >
            <ArrowLeft className={cn("size-[18px] text-[#514537] dark:text-[#cdc5bd]", !isEn && "rotate-180")} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("تعديل بيانات الموظف", "Edit Employee Data")}
              </h1>
              <span className="text-[12px] font-mono text-[#79716b] dark:text-[#a89f91] bg-[#f5f3ef] dark:bg-[#281c15] px-2.5 py-0.5 rounded-[4px] border border-[#e6e2dc] dark:border-[#38271c]">
                {employee.empCode}
              </span>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#ffeed9] dark:bg-[#2d1f16] text-[#7b4e00] dark:text-[#f3c27e] border border-[#fcd8b0] dark:border-[#e29d38]/40">
                  <Shield className="size-[12px]" />
                  {t("مشرف لوحة التحكم (محمي)", "Super Admin (Protected)")}
                </span>
              ) : employee.status === "suspended" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#fff5ea] dark:bg-[rgba(217,119,6,0.18)] text-[#d97706] dark:text-[#fbbf24] border border-[#fed7aa] dark:border-[#d97706]/40">
                  <span className="size-[6px] rounded-full bg-[#d97706] dark:bg-[#fbbf24]" />
                  {t("موقوف", "Suspended")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40">
                  <span className="size-[6px] rounded-full bg-[#1b7340] dark:bg-[#10b981]" />
                  {t("نشط", "Active")}
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#79716b] dark:text-[#a89f91] mt-0.5">
              {t(
                "تحديث معلومات الحساب والصلاحيات والقسم التابع له.",
                "Update account information, permissions, and department."
              )}
            </p>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="rounded-[8px] border border-[#fcd8b0] dark:border-[#e29d38]/40 bg-[#fff9ee] dark:bg-[#2d1f16] px-4 py-3 text-[13px] text-[#7b4e00] dark:text-[#f3c27e] flex items-center gap-3">
          <ShieldAlert className="size-[18px] text-[#9c6402] dark:text-[#e29d38] shrink-0" />
          <span>
            {t(
              "تنبيه أمني: هذا الحساب يمتلك صلاحيات المشرف العام (Super Admin)، يمكن تعديل بياناته الأساسية ولكن لا يمكن حذفه للحفاظ على سلامة النظام واستقرار إدارة المنصة.",
              "Security Notice: This account holds Super Admin privileges. Basic data can be edited, but it cannot be deleted to maintain system stability and platform administration."
            )}
          </span>
        </div>
      )}

      {listsError && (
        <div className="rounded-[8px] border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-[#2c2013] px-4 py-3 text-[13px] text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
          <span>{listsError}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2efe9] dark:border-[#38271c]">
          <div className="size-[42px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center shrink-0">
            <User className="size-[20px] text-[#9c6402] dark:text-[#e29d38]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("البيانات الأساسية للموظف", "Employee Basic Information")}
            </h2>
            <p className="text-[12px] text-[#79716b] dark:text-[#a89f91]">
              {t("الاسم، البريد الإلكتروني، رقم الجوال، القسم، والدور الوظيفي", "Name, email, mobile, department, and role")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
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
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={t("مثال: راكان بن كمال الحارثي", "e.g. Rakan Alharbi")}
                className={cn(inputBase, fieldError(!!errors.name))}
              />
              <User className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            {errors.name && (
              <span className="text-[11px] text-red-500 mt-0.5 block">{errors.name}</span>
            )}
          </div>

          {/* Email */}
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
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="name@aljudy.sa"
                className={cn(inputBase, "text-left", fieldError(!!errors.email))}
                dir="ltr"
              />
              <Mail className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
            </div>
            {errors.email && (
              <span className="text-[11px] text-red-500 mt-0.5 block">{errors.email}</span>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("رقم الجوال", "Mobile Number")} <span className="text-red-500">*</span>
            </label>
            <div
              className={cn(
                "flex rounded-[6px] border overflow-hidden focus-within:ring-1",
                errors.phone
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
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="50 123 4567"
                className="w-full h-[40px] px-3 text-[13px] bg-transparent text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none font-mono text-right"
              />
            </div>
            {errors.phone && (
              <span className="text-[11px] text-red-500 mt-0.5 block">{errors.phone}</span>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("القسم", "Department")} <span className="text-red-500">*</span>
            </label>
            <DashboardSelect
              value={formData.departmentId}
              onChange={(e) => {
                setFormData({ ...formData, departmentId: e.target.value });
                if (errors.departmentId) {
                  setErrors((prev) => ({ ...prev, departmentId: undefined }));
                }
              }}
              placeholder={t("اختر القسم", "Select department")}
              className={cn(
                "rounded-[6px] bg-[#f5f3ef] dark:bg-[#160e0a]",
                fieldError(!!errors.departmentId)
              )}
            >
              <option value="">{t("اختر القسم", "Select department")}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </DashboardSelect>
            {errors.departmentId && (
              <span className="text-[11px] text-red-500 mt-0.5 block">{errors.departmentId}</span>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("الدور الوظيفي", "Role")} <span className="text-red-500">*</span>
            </label>
            <DashboardSelect
              value={formData.roleId}
              disabled={isAdmin}
              onChange={(e) => {
                setFormData({ ...formData, roleId: e.target.value });
                if (errors.roleId) {
                  setErrors((prev) => ({ ...prev, roleId: undefined }));
                }
              }}
              placeholder={t("اختر دور الموظف", "Select employee role")}
              className={cn(
                "rounded-[6px] bg-[#f5f3ef] dark:bg-[#160e0a]",
                fieldError(!!errors.roleId),
                isAdmin && "opacity-80 cursor-not-allowed"
              )}
            >
              <option value="">{t("اختر دور الموظف", "Select employee role")}</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </DashboardSelect>
            {isAdmin && (
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] mt-0.5 block">
                {t("الدور مثبت كـ Super Admin لحساب المشرف العام.", "Role fixed as Super Admin for administrator.")}
              </span>
            )}
            {errors.roleId && (
              <span className="text-[11px] text-red-500 mt-0.5 block">{errors.roleId}</span>
            )}
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("حالة الحساب", "Account Status")} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 h-[42px]">
              <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={() => setFormData({ ...formData, status: "active" })}
                  className="accent-[#9c6402] dark:accent-[#e29d38] size-4 cursor-pointer"
                />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="size-[8px] rounded-full bg-[#10b981]" />
                  {t("نشط", "Active")}
                </span>
              </label>

              <label
                className={cn(
                  "inline-flex items-center gap-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]",
                  isAdmin ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
                title={isAdmin ? t("لا يمكن إيقاف حساب المشرف العام", "Super Admin cannot be suspended") : undefined}
              >
                <input
                  type="radio"
                  name="status"
                  value="suspended"
                  disabled={isAdmin}
                  checked={formData.status === "suspended"}
                  onChange={() => !isAdmin && setFormData({ ...formData, status: "suspended" })}
                  className="accent-[#9c6402] dark:accent-[#e29d38] size-4 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="size-[8px] rounded-full bg-[#f59e0b]" />
                  {t("موقوف", "Suspended")}
                </span>
              </label>
            </div>
            {isAdmin && (
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] mt-0.5 block">
                {t("لا يمكن إيقاف حساب المشرف لضمان استمرارية الوصول.", "Admin account cannot be suspended to maintain access.")}
              </span>
            )}
          </div>

          {/* New Password (Optional) */}
          <div className="md:col-span-2">
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
              {t("تغيير كلمة المرور", "Change Password")} <span className="text-[12px] font-normal text-[#79716b] dark:text-[#a89f91]">({t("اختياري", "Optional")})</span>
            </label>
            <p className="text-[11px] text-[#79716b] dark:text-[#a89f91] mb-2">
              {t("اترك هذا الحقل فارغاً إذا كنت لا ترغب في تغيير كلمة المرور الحالية للموظف.", "Leave this blank if you do not want to change current password.")}
            </p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder={t("أدخل كلمة المرور الجديدة فقط في حال الرغبة بتحديثها", "Enter new password only to change it")}
                className={cn(inputBase, "ps-10", fieldError(!!errors.password))}
              />
              <KeyRound className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 start-3 text-[#948b83] dark:text-[#a89f91] hover:text-[#514537] dark:hover:text-[#fdfbf7] cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-[16px]" /> : <Eye className="size-[16px]" />}
              </button>
            </div>
            {strength && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#79716b] dark:text-[#a89f91]">
                    {t("مستوى قوة كلمة المرور:", "Password strength:")}
                  </span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {strength.text}
                  </span>
                </div>
                <div className="w-full bg-[#f2efe9] dark:bg-[#281c15] h-[4px] rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              </div>
            )}
            {errors.password && (
              <span className="text-[11px] text-red-500 mt-1 block">{errors.password}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[13px] text-[#514537] dark:text-[#cdc5bd]">
          <ShieldCheck className="size-[18px] text-[#10b981] shrink-0" />
          <span>
            {t(
              "يتم توثيق كافة تعديلات حسابات طاقم العمل فوراً في سجل التدقيق القضائي.",
              "All staff account changes are recorded immediately in the system audit log."
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-[13px] font-bold text-white dark:text-[#1c140f] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#f3c27e] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <Loader2 className="size-[16px] animate-spin" />
            ) : (
              <Check className="size-[16px]" />
            )}
            <span>{t("حفظ التعديلات", "Save Changes")}</span>
          </button>
        </div>
      </DashboardStickyActionBar>

      {/* Save Confirmation Dialog */}
      <LuxuryAlertDialog
        isOpen={confirmOpen}
        onClose={() => !isSubmitting && setConfirmOpen(false)}
        onConfirm={() => {
          void handleConfirmSave();
        }}
        title={t("تأكيد حفظ تعديلات الموظف", "Confirm employee changes")}
        description={t(
          "هل أنت متأكد من حفظ التعديلات الجديدة على بيانات الموظف؟ سيتم تطبيق التغييرات فوراً على حسابه في لوحة الإدارة.",
          "Are you sure you want to save the new changes? The changes will be applied immediately."
        )}
        confirmLabel={
          isSubmitting
            ? t("جاري الحفظ...", "Saving...")
            : t("تأكيد الحفظ", "Confirm save")
        }
        variant="info"
        itemDetails={{
          [t("اسم الموظف", "Employee Name")]: formData.name,
          [t("البريد الإلكتروني", "Email")]: formData.email,
          [t("الرقم الوظيفي", "Code")]: employee.empCode,
        }}
      />
    </div>
  );
}
