import React, { useState } from "react";
import Image from "next/image";
import {
  LogIn,
  MoreVertical,
  Shield,
  Headphones,
  Calculator,
  Briefcase,
  ShoppingCart,
  Cloud,
  Scale,
  Monitor,
  Eye,
  KeyRound,
  UserX,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Lock,
} from "lucide-react";
import { Employee, IconType } from "../types/staff.types";

interface StaffTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onLoginAsEmployee: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onActivate: (employee: Employee) => void;
  onResetPassword: (employee: Employee) => void;
}

export function StaffTable({
  employees,
  onViewDetails,
  onLoginAsEmployee,
  onDeactivate,
  onActivate,
  onResetPassword,
}: StaffTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getRoleIcon = (iconType: IconType) => {
    switch (iconType) {
      case "shield":
        return <Shield className="size-[13px] text-[#9c6402]" />;
      case "headset":
        return <Headphones className="size-[13px] text-[#514537]" />;
      case "calculator":
        return <Calculator className="size-[13px] text-[#514537]" />;
      case "briefcase":
        return <Briefcase className="size-[13px] text-[#514537]" />;
      case "cart":
        return <ShoppingCart className="size-[13px] text-[#514537]" />;
      case "cloud":
        return <Cloud className="size-[13px] text-[#514537]" />;
      case "scales":
        return <Scale className="size-[13px] text-[#514537]" />;
      case "monitor":
        return <Monitor className="size-[13px] text-[#514537]" />;
      default:
        return <Shield className="size-[13px] text-[#514537]" />;
    }
  };

  return (
    <div
      className="bg-white rounded-[8px] border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
      data-node-id="1:8992"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          {/* Table Header */}
          <thead>
            <tr
              className="bg-[#fcfaf7] border-b border-[#e6e2dc] text-[13px] font-semibold text-[#514537] h-[52px]"
              data-node-id="1:8995"
            >
              <th className="py-3 px-4 font-bold min-w-[240px]">
                اسم الموظف والمعرف
              </th>
              <th className="py-3 px-4 font-bold min-w-[190px]">
                البريد الإلكتروني المهني
              </th>
              <th className="py-3 px-4 font-bold min-w-[140px]">
                رقم الجوال
              </th>
              <th className="py-3 px-4 font-bold min-w-[170px]">
                الدور والصلاحية
              </th>
              <th className="py-3 px-4 font-bold min-w-[150px]">
                آخر تسجيل دخول
              </th>
              <th className="py-3 px-4 font-bold min-w-[110px]">
                حالة الحساب
              </th>
              <th className="py-3 px-4 font-bold text-center w-[100px]">
                الإجراءات
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f2efe9]" data-node-id="1:9010">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#79716b]">
                  لا توجد نتائج مطابقة لخيارات البحث المحددة.
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const isSuspended = emp.status === "suspended";

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#fbf9f5] transition-colors group"
                  >
                    {/* Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className={`size-[38px] rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 overflow-hidden ${emp.avatarBg} ${emp.avatarText}`}
                        >
                          {emp.avatarImage ? (
                            <Image
                              src={emp.avatarImage}
                              alt={emp.name}
                              width={38}
                              height={38}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            emp.initials
                          )}
                        </div>

                        {/* Name & Code */}
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => onViewDetails(emp)}
                            className="font-bold text-[14px] text-[#1b1c1a] hover:text-[#9c6402] transition-colors text-right leading-[20px]"
                          >
                            {emp.name}
                          </button>
                          <span className="text-[11px] text-[#79716b] leading-[16px] mt-0.5">
                            {emp.empCode} • {emp.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] font-mono">
                      {emp.email}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] font-mono" dir="ltr">
                      {emp.phone}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-semibold border ${emp.role.badgeClass}`}
                      >
                        {getRoleIcon(emp.role.iconType)}
                        <span>{emp.role.name}</span>
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4">
                      {emp.lastLogin.note ? (
                        <div className="flex flex-col text-[12px]">
                          <span className="font-medium text-[#79716b]">
                            {emp.lastLogin.time}
                          </span>
                          <span className="text-[11px] text-[#d97706] mt-0.5">
                            {emp.lastLogin.note}
                          </span>
                        </div>
                      ) : emp.lastLogin.ip ? (
                        <div className="flex flex-col text-[12px]">
                          <span className="font-semibold text-[#1b1c1a]">
                            {emp.lastLogin.time}
                          </span>
                          <span className="text-[11px] text-[#79716b] font-mono mt-0.5">
                            IP: {emp.lastLogin.ip}
                          </span>
                          {emp.lastLogin.location && (
                            <span className="text-[11px] text-[#9c6402]">
                              ({emp.lastLogin.location})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block text-[11px] text-[#79716b] bg-[#f5f3ef] px-2 py-0.5 rounded-[4px]">
                          {emp.lastLogin.time}
                        </span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#fff5ea] text-[#d97706] border border-[#fed7aa]">
                          <span className="size-[6px] rounded-full bg-[#d97706]" />
                          موقوف
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9]">
                          <span className="size-[6px] rounded-full bg-[#1b7340]" />
                          نشط
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 relative">
                        {/* Simulation / Login as employee Button */}
                        <button
                          type="button"
                          onClick={() => onLoginAsEmployee(emp)}
                          title={
                            isSuspended
                              ? "محاولة الدخول كموظف (موقوف - سيظهر تنبيه الحوكمة)"
                              : "الدخول كالموظف (بدء وضع المعاينة)"
                          }
                          className={`size-[30px] rounded-[4px] flex items-center justify-center transition-colors ${
                            isSuspended
                              ? "bg-[#fff5ea] text-[#d97706] hover:bg-[#fed7aa]"
                              : "bg-[#f5efe6] text-[#9c6402] hover:bg-[#eadfcf]"
                          }`}
                        >
                          {isSuspended ? (
                            <Lock className="size-[14px]" />
                          ) : (
                            <LogIn className="size-[14px]" />
                          )}
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === emp.id ? null : emp.id)
                            }
                            className="size-[30px] rounded-[4px] hover:bg-[#f2efe9] text-[#79716b] flex items-center justify-center transition-colors"
                          >
                            <MoreVertical className="size-[15px]" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === emp.id && (
                            <div
                              className="absolute end-0 top-full mt-1 w-[190px] bg-white rounded-[8px] border border-[#e6e2dc] shadow-lg py-1 z-20 text-right"
                              onMouseLeave={() => setActiveMenuId(null)}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onViewDetails(emp);
                                }}
                                className="w-full px-3 py-2 text-[13px] text-[#1b1c1a] hover:bg-[#f5f3ef] flex items-center gap-2 text-right"
                              >
                                <Eye className="size-[14px] text-[#9c6402]" />
                                <span>عرض تفاصيل الموظف</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onLoginAsEmployee(emp);
                                }}
                                className="w-full px-3 py-2 text-[13px] text-[#1b1c1a] hover:bg-[#f5f3ef] flex items-center gap-2 text-right"
                              >
                                <LogIn className="size-[14px] text-[#9c6402]" />
                                <span>الدخول كالموظف</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onResetPassword(emp);
                                }}
                                className="w-full px-3 py-2 text-[13px] text-[#1b1c1a] hover:bg-[#f5f3ef] flex items-center gap-2 text-right"
                              >
                                <KeyRound className="size-[14px] text-[#79716b]" />
                                <span>إعادة تعيين كلمة المرور</span>
                              </button>

                              <div className="my-1 border-t border-[#f2efe9]" />

                              {isSuspended ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onActivate(emp);
                                  }}
                                  className="w-full px-3 py-2 text-[13px] text-[#1b7340] hover:bg-[#e8f5e9] flex items-center gap-2 text-right"
                                >
                                  <UserCheck className="size-[14px]" />
                                  <span>تفعيل حساب الموظف</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onDeactivate(emp);
                                  }}
                                  className="w-full px-3 py-2 text-[13px] text-[#b91c1c] hover:bg-[#fee2e2] flex items-center gap-2 text-right"
                                >
                                  <UserX className="size-[14px]" />
                                  <span>إيقاف حساب الموظف</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#fcfaf7] border-t border-[#e6e2dc] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[13px] text-[#79716b]">
          عرض 1 إلى {employees.length} من أصل 10 موظف
        </span>

        <div className="flex items-center gap-1 text-[13px]">
          <button
            type="button"
            disabled
            className="px-2.5 py-1 text-[#a8a29e] cursor-not-allowed flex items-center gap-1 rounded-[4px]"
          >
            <ChevronRight className="size-[14px]" />
            <span>السابق</span>
          </button>

          <button
            type="button"
            className="size-[28px] rounded-[4px] bg-[#9c6402] text-white font-bold flex items-center justify-center text-[12px]"
          >
            1
          </button>

          <button
            type="button"
            className="size-[28px] rounded-[4px] hover:bg-[#f2efe9] text-[#514537] flex items-center justify-center text-[12px]"
          >
            2
          </button>

          <button
            type="button"
            className="size-[28px] rounded-[4px] hover:bg-[#f2efe9] text-[#514537] flex items-center justify-center text-[12px]"
          >
            3
          </button>

          <span className="px-1 text-[#79716b]">..</span>

          <button
            type="button"
            className="size-[28px] rounded-[4px] hover:bg-[#f2efe9] text-[#514537] flex items-center justify-center text-[12px]"
          >
            16
          </button>

          <button
            type="button"
            className="px-2.5 py-1 text-[#514537] hover:bg-[#f2efe9] flex items-center gap-1 rounded-[4px]"
          >
            <span>التالي</span>
            <ChevronLeft className="size-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
