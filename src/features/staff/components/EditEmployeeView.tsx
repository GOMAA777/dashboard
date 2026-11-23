"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Employee, isEmployeeAdmin } from "../types/staff.types";
import {
  EditEmployeeFormData,
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
  existingEmployees?: Employee[];
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
  existingEmployees = [],
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

  const [touched, setTouched] = useState<Partial<Record<keyof EditEmployeeFormData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof EditEmployeeFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
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

  useEffect(() => {
    if (!formData.roleId && employee.role?.name && roles.length > 0) {
      const matched = roles.find(
        (r) => r.name.toLowerCase() === employee.role.name?.toLowerCase()
      );
      if (matched) {
        setFormData((prev) => (prev.roleId ? prev : { ...prev, roleId: matched.id }));
      }
    }
  }, [roles, employee.role?.name, formData.roleId]);

  useEffect(() => {
    if (!formData.departmentId && employee.department && departments.length > 0) {
      const matched = departments.find(
        (d) => d.name.toLowerCase() === employee.department?.toLowerCase()
      );
      if (matched) {
        setFormData((prev) => (prev.departmentId ? prev : { ...prev, departmentId: matched.id }));
      }
    }
  }, [departments, employee.department, formData.departmentId]);

  const matchedDept = departments.find((d) => d.id === formData.departmentId);
  const departmentName = matchedDept?.name || employee.department;
  const isSeniorDept = isSeniorManagementDept(departmentName);

  const validation = useMemo(() => {
    return validateStaffForm(formData, {
      existingEmployees,
      currentEmployeeId: employee.id,
      departmentName,
      isEdit: true,
    });
  }, [formData, existingEmployees, employee.id, departmentName]);

  const isFormValid = validation.isValid;

  const displayErrors = useMemo(() => {
    const errs: Partial<Record<keyof EditEmployeeFormData, string>> = {};
    const allKeys: (keyof EditEmployeeFormData)[] = [
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
        if (validation.errors[key as keyof typeof validation.errors]) {
          errs[key] = validation.errors[key as keyof typeof validation.errors];
        }
      }
    }
    return errs;
  }, [serverErrors, serverFieldErrors, submitAttempted, touched, formData, validation.errors]);

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

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!validation.isValid) {
      toast.error(
        t(
          "يرجى مراجعة وتصحيح البيانات المطلوبة.",
          "Please review and correct the required fields."
        )
      );
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!validation.isValid) {
      setConfirmOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const phoneDigits = formData.phone.replace(/[\s\-\(\)]/g, "");
      const formattedPhone = phoneDigits.startsWith("+")
        ? phoneDigits
        : phoneDigits.startsWith("00966")
        ? `+${phoneDigits.slice(2)}`
        : phoneDigits.startsWith("966")
        ? `+${phoneDigits}`
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
          setServerErrors((prev) => ({ ...prev, ...apiFields }));
        }
        toast.error(err.message);
      } else {
        toast.error(
          t("فشل تحديث بيانات الموظف. حاول مرة أخرى.", "Failed to update employee.")
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
          >
            <ArrowLeft className={cn("size-[18px] text-[#514537] dark:text-[#cdc5bd]", !isEn && "rotate-180")} />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("تعديل بيانات الموظف", "Edit Employee")}
            </h1>
            <p className="text-[13px] text-[#79716b] dark:text-[#a89f91] mt-0.5">
              {t(
                `تحديث بيانات وصلاحيات الموظف: ${employee.name} (${employee.empCode})`,
                `Update profile & role for: ${employee.name} (${employee.empCode})`
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
              <span className="text-[11px] text-red-500 mt-1 block font-medium">{displayErrors.name}</span>
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
                  setTouched((prev) => ({ ...prev, email: true }));
                  if (serverErrors.email) setServerErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                placeholder="name@aljudy.sa"
                className={cn(inputBase, "text-left", fieldError(!!displayErrors.email))}
                dir="ltr"
              />
              <Mail className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
            </div>
            {displayErrors.email && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">{displayErrors.email}</span>
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

          {/* Department */}
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
              <option value="">{t("اختر القسم", "Select department")}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </DashboardSelect>
            {displayErrors.departmentId && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">{displayErrors.departmentId}</span>
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
                setTouched((prev) => ({ ...prev, roleId: true }));
                if (serverErrors.roleId) {
                  setServerErrors((prev) => ({ ...prev, roleId: undefined }));
                }
              }}
              placeholder={t("اختر دور الموظف", "Select employee role")}
              className={cn(
                "rounded-[6px] bg-[#f5f3ef] dark:bg-[#160e0a]",
                fieldError(!!displayErrors.roleId),
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
            {displayErrors.roleId && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">{displayErrors.roleId}</span>
            )}
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("حالة حساب الموظف", "Account Status")} <span className="text-red-500">*</span>
            </label>
            <DashboardSelect
              value={formData.status}
              disabled={isAdmin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "active" | "suspended",
                })
              }
              className={cn(
                "rounded-[6px] bg-[#f5f3ef] dark:bg-[#160e0a]",
                isAdmin && "opacity-80 cursor-not-allowed"
              )}
            >
              <option value="active">{t("حساب نشط (مفعّل)", "Active (Enabled)")}</option>
              <option value="suspended">{t("حساب موقوف إدارياً", "Suspended")}</option>
            </DashboardSelect>
            {isAdmin && (
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] mt-0.5 block">
                {t("لا يمكن إيقاف حساب المشرف العام الأعلى في المنصة.", "Cannot suspend super admin.")}
              </span>
            )}
          </div>

          {/* Password (Optional on edit) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("تحديث كلمة المرور (اختياري)", "Update Password (Optional)")}
              </label>
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91]">
                {t("اترك الحقل فارغاً إذا كنت لا ترغب بتغييرها", "Leave blank to keep unchanged")}
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setTouched((prev) => ({ ...prev, password: true }));
                  if (serverErrors.password) {
                    setServerErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder={t("أدخل كلمة مرور جديدة أو اترك الحقل فارغاً", "Enter new password or leave empty")}
                className={cn(inputBase, "ps-10", fieldError(!!displayErrors.password))}
                dir="ltr"
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
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#79716b] dark:text-[#a89f91]">
                    {t(
                      "في حال إدخال كلمة جديدة، سيُجبر الموظف على تأكيدها عند تسجيل الدخول القادم.",
                      "If changed, employee will confirm it on next login."
                    )}
                  </span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">{strength.text}</span>
                </div>
                <div className="w-full bg-[#f2efe9] dark:bg-[#281c15] h-[4px] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              </div>
            )}
            {displayErrors.password && (
              <span className="text-[11px] text-red-500 mt-1 block font-medium">{displayErrors.password}</span>
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
            disabled={!isFormValid || isSubmitting}
            className={cn(
              "px-5 py-2 text-[13px] font-bold text-white dark:text-[#1c140f] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors flex items-center gap-2",
              isFormValid && !isSubmitting
                ? "bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#f3c27e] cursor-pointer"
                : "bg-[#9c6402]/50 dark:bg-[#e29d38]/50 opacity-60 cursor-not-allowed pointer-events-none"
            )}
          >
            <Check className="size-[16px]" />
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
        confirmLabel={t("تأكيد الحفظ", "Confirm save")}
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
