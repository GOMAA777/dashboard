"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  UserX,
  UserCheck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound,
} from "lucide-react";
import { Employee, isEmployeeAdmin } from "../types/staff.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface EmployeeDetailsViewProps {
  employee: Employee;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onLoginAsEmployee?: () => void;
  onDeactivate?: () => void;
  onActivate?: () => void;
  onResetPassword?: () => void;
  /** Extra permission labels when not yet on the employee object. */
  permissions?: string[];
  backLabel?: string;
  editLabel?: string;
  hideBack?: boolean;
}

function formatCreatedAt(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EmployeeDetailsView({
  employee,
  onBack,
  onEdit,
  onDelete,
  onDeactivate,
  onActivate,
  onResetPassword,
  permissions: permissionsProp,
  backLabel,
  editLabel,
  hideBack = false,
}: EmployeeDetailsViewProps) {
  const { t, isEn, direction } = useLanguage();
  const isSuspended = employee.status === "suspended";
  const isAdmin = isEmployeeAdmin(employee);
  const permissions = permissionsProp?.length
    ? permissionsProp
    : employee.permissions || [];
  const permissionsCount = permissions.length || employee.permissionsCount || 0;

  return (
    <div dir={direction} className="space-y-4" data-node-id="1:9815">
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-4 sm:p-5 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`size-[56px] rounded-[10px] flex items-center justify-center font-bold text-[20px] shrink-0 overflow-hidden shadow-sm ${employee.avatarBg} ${employee.avatarText}`}
          >
            {employee.avatarImage ? (
              <Image
                src={employee.avatarImage}
                alt={employee.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              employee.initials
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[18px] sm:text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {employee.name}
              </h1>
              {employee.id ? (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#f4efe6] dark:bg-[#271d15] text-[#78644f] dark:text-[#c4b3a3] border border-[#dfd7cc] dark:border-[#423122] shrink-0"
                  title={`معرف الموظف في النظام (ID): #${employee.id}`}
                >
                  ID: #{employee.id}
                </span>
              ) : null}
              {isSuspended ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#fff5ea] dark:bg-[#341b0b] text-[#d97706] dark:text-[#f59e0b] border border-[#fed7aa] dark:border-[#78350f]">
                  <span className="size-[6px] rounded-full bg-[#d97706]" />
                  {t("موقوف", "Suspended")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#e8f5e9] dark:bg-[#16271c] text-[#1b7340] dark:text-[#4ade80] border border-[#c8e6c9] dark:border-[#225734]">
                  <span className="size-[6px] rounded-full bg-[#1b7340]" />
                  {t("نشط", "Active")}
                </span>
              )}
            </div>
            {(employee.role?.name || employee.jobTitle) && (
              <p className="text-[13px] text-[#514537] dark:text-[#a89f91] mt-1 font-medium">
                {employee.role?.name || employee.jobTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {!hideBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-2 rounded-[6px] bg-white dark:bg-[#1a120d] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#fdfbf7] border border-[#d6cfc7] dark:border-[#38271c] text-[13px] font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <ArrowLeft className={cn("size-[15px]", isEn && "rotate-180")} />
              <span>{backLabel || t("العودة لطاقم العمل", "Back to Staff Members")}</span>
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="px-4 py-2 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
            >
              <Edit3 className="size-[15px]" />
              <span>{editLabel || t("تعديل الموظف", "Edit Employee")}</span>
            </button>
          )}

          {isSuspended && onActivate ? (
            <button
              type="button"
              onClick={onActivate}
              className="px-3.5 py-2 rounded-[6px] bg-white dark:bg-[#16271c] hover:bg-[#e8f5e9] dark:hover:bg-[#1e3826] text-[#1b7340] dark:text-[#4ade80] border border-[#c8e6c9] dark:border-[#225734] text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <UserCheck className="size-[15px]" />
              <span>{t("تفعيل الحساب", "Activate Account")}</span>
            </button>
          ) : !isSuspended && onDeactivate ? (
            <button
              type="button"
              onClick={onDeactivate}
              className="px-3.5 py-2 rounded-[6px] bg-white dark:bg-[#2c1313] hover:bg-[#fee2e2] dark:hover:bg-[#3d1818] text-[#b91c1c] dark:text-[#f87171] border border-[#fca5a5] dark:border-[#5c2424] text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <UserX className="size-[15px]" />
              <span>{t("إيقاف الحساب", "Deactivate Account")}</span>
            </button>
          ) : null}

          {onResetPassword && (
            <button
              type="button"
              onClick={onResetPassword}
              className="px-3.5 py-2 rounded-[6px] bg-white dark:bg-[#1a120d] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#d5cec5] border border-[#d6cfc7] dark:border-[#38271c] text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-[15px]" />
              <span>{t("إعادة تعيين كلمة المرور", "Reset Password")}</span>
            </button>
          )}

          {!isAdmin && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-3.5 py-2 rounded-[6px] bg-white hover:bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="size-[15px]" />
              <span>{t("حذف الموظف", "Delete Employee")}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Basic data — fills most of the row */}
        <div className="xl:col-span-8 min-w-0 bg-white dark:bg-[#221812] rounded-[8px] p-4 sm:p-5 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f2efe9] dark:border-[#38271c] mb-3">
            <div className="size-[32px] rounded-[6px] bg-[#f5efe6] dark:bg-[#2d1f16] flex items-center justify-center shrink-0">
              <ShieldCheck className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />
            </div>
            <div className="min-w-0 text-start">
              <h2 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("البيانات الأساسية ومعلومات الدخول", "Basic Information & Login Details")}
              </h2>
              <p className="text-[11px] text-[#79716b] dark:text-[#a89f91]">
                {t(
                  "السجلات الشخصية والبيانات المعتمدة في النظام",
                  "Personal records and approved credentials in the system"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full flex-1 content-start">
            <div className="w-full min-w-0 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                {t("الاسم الرباعي المعتمد", "Approved Full Name")}
              </span>
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] break-words">
                {employee.name}
              </span>
            </div>

            <div className="w-full min-w-0 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                {t("المعرف الوظيفي", "Employee ID")}
              </span>
              <span className="text-[13px] font-bold font-mono text-[#1b1c1a] dark:text-[#fdfbf7]">
                {employee.empCode}
              </span>
            </div>

            <div className="w-full min-w-0 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                  {t("البريد الإلكتروني المعتمد للدخول", "Approved Login Email")}
                </span>
                <span className="text-[12px] font-bold font-mono text-[#1b1c1a] dark:text-[#fdfbf7] break-all">
                  {employee.email || "—"}
                </span>
              </div>
              {employee.email ? <CheckCircle2 className="size-[15px] text-[#10b981] shrink-0" /> : null}
            </div>

            <div className="w-full min-w-0 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                {t("رقم الجوال", "Phone Number")}
              </span>
              <span className="text-[12px] font-bold font-mono text-[#1b1c1a] dark:text-[#fdfbf7]" dir="ltr">
                {employee.phone || "—"}
              </span>
            </div>

            <div className="w-full min-w-0 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                {t("الدور الوظيفي المعتمد", "Approved Job Role")}
              </span>
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {employee.role?.name || "—"}
              </span>
            </div>

            <div className="w-full min-w-0 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                {t("القسم الإداري", "Department")}
              </span>
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {employee.department || "—"}
              </span>
            </div>

            <div className="w-full min-w-0 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                {t("تاريخ وتوقيت إنشاء الحساب", "Account Creation Date & Time")}
              </span>
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {formatCreatedAt(employee.createdAt)}
              </span>
            </div>

            <div className="w-full min-w-0 sm:col-span-2 lg:col-span-2 bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
              <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
                {t("آخر نشاط ومصادقة ناجحة", "Last Active & Authenticated")}
              </span>
              {employee.lastLogin?.time && employee.lastLogin.time !== "—" ? (
                <>
                  <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block font-mono">
                    {employee.lastLogin.time}
                  </span>
                  {(employee.lastLogin.city || employee.lastLogin.ip) && (
                    <span className="text-[11px] text-[#1b7340] dark:text-[#6ee7b7] font-semibold block mt-0.5">
                      {[employee.lastLogin.city, employee.lastLogin.ip ? `IP: ${employee.lastLogin.ip}` : ""]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[13px] font-semibold text-[#837565] dark:text-[#a89f91] block">
                  {t("لم يسجل الدخول بعد", "Never logged in")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Permissions — compact count only, no scroll */}
        <div className="xl:col-span-4 min-w-0 bg-white dark:bg-[#221812] rounded-[8px] p-4 sm:p-5 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col gap-3">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f2efe9] dark:border-[#38271c]">
            <div className="size-[32px] rounded-[6px] bg-[#f5efe6] dark:bg-[#2d1f16] flex items-center justify-center shrink-0">
              <KeyRound className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />
            </div>
            <div className="min-w-0 text-start">
              <h2 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("ملخص الصلاحيات", "Permissions Summary")}
              </h2>
              <p className="text-[11px] text-[#79716b] dark:text-[#a89f91]">
                {t("الأدوار والصلاحيات من النظام", "Roles and permissions from the system")}
              </p>
            </div>
          </div>

          <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[8px] border border-[#f0ece5] dark:border-[#38271c]">
            <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block mb-1">
              {t("الدور النشط المرتبط", "Active Assigned Role")}
            </span>
            <h3 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {employee.role?.name || "—"}
            </h3>
            <div className="flex items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-[#ede8e1] dark:border-[#38271c] text-[11px]">
              <span className="text-[#8e5927] bg-[#fbf5ed] dark:bg-[#2d1f16] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce] dark:border-[#38271c] font-medium truncate">
                {employee.department || t("بدون قسم", "No department")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[#f0ece5] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#160e0a] px-4 py-3">
            <div className="text-start min-w-0">
              <span className="text-[11px] font-semibold text-[#79716b] dark:text-[#a89f91] block">
                {t("إجمالي الصلاحيات", "Total Permissions")}
              </span>
              <span className="text-[12px] font-semibold text-[#1b7340] dark:text-[#6ee7b7]">
                {permissionsCount === 0
                  ? t("لا توجد صلاحيات مرتبطة", "No linked permissions")
                  : t("صلاحية ممنوحة", "granted permissions")}
              </span>
            </div>
            <span className="text-[32px] leading-none font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tabular-nums shrink-0">
              {permissionsCount}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-[#f2efe9] dark:border-[#38271c] flex items-center gap-3">
          <div className="size-[32px] rounded-[6px] bg-[#f5efe6] dark:bg-[#2d1f16] flex items-center justify-center shrink-0">
            <Clock className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />
          </div>
          <div className="min-w-0 text-start">
            <h2 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("آخر نشاط مسجل", "Latest Recorded Activity")}
            </h2>
            <p className="text-[11px] text-[#79716b] dark:text-[#a89f91]">
              {t(
                "بيانات آخر دخول من سجل الموظف في النظام.",
                "Last login details from the staff record in the system."
              )}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-3">
          {employee.lastLogin?.time && employee.lastLogin.time !== "—" ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] block mb-1">{t("الوقت", "Time")}</span>
                <span className="text-[13px] font-bold font-mono">{employee.lastLogin.time}</span>
              </div>
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] block mb-1">{t("المدينة", "City")}</span>
                <span className="text-[13px] font-bold">{employee.lastLogin.city || "—"}</span>
              </div>
              <div className="bg-[#fcfaf7] dark:bg-[#160e0a] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c]">
                <span className="text-[11px] text-[#79716b] block mb-1">IP</span>
                <span className="text-[13px] font-bold font-mono" dir="ltr">
                  {employee.lastLogin.ip || "—"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-[13px] text-[#837565] dark:text-[#a89f91] py-2">
              {t("لا توجد جلسات مسجلة حتى الآن", "No sessions recorded yet")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
