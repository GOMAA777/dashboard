"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  DoorOpen,
  LogOut,
  Users,
  UserCheck,
  Briefcase,
  Clock,
  CheckCircle2,
  Eye,
  PenSquare,
  Ban,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { endFirmPreview, loginAsFirm } from "@/lib/api/utility";

interface OfficeAdminAccessViewProps {
  office: ClientOffice;
  onExit: () => void;
}

const mockClients: Array<{ id: string; name: string; cases: number; status: string }> = [];
const mockStaff: Array<{ id: string; name: string; role: string; status: string }> = [];

export function OfficeAdminAccessView({ office, onExit }: OfficeAdminAccessViewProps) {
  const { t, isEn, direction } = useLanguage();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeTab, setActiveTab] = useState<"clients" | "staff">("clients");

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function enterFirm() {
      try {
        await loginAsFirm(office.id);
        if (!cancelled) {
          toast.success(
            `تم الدخول إلى مكتب «${office.name}» بصلاحيات المسؤول`
          );
        }
      } catch {
        // Keep local preview mode even if API is offline.
      }
    }
    void enterFirm();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [office.id]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAction = (messageAr: string, messageEn: string) => {
    toast.success(t(messageAr, messageEn));
  };

  return (
    <div dir={direction} className="space-y-6 pb-8 font-['Cairo',sans-serif]">
      {/* Admin access banner */}
      <div className="bg-[#fef3c7] border-2 border-[#fcd34d] rounded-[10px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="size-[42px] rounded-full bg-[#9c6402] text-white flex items-center justify-center shrink-0 shadow-inner">
            <DoorOpen className="size-[22px]" />
          </div>
          <div className="text-start">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[16px] font-extrabold text-[#78350f]">
                {t("وضع دخول المسؤول إلى المكتب", "Admin Office Access Mode")}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#9c6402] text-white px-2 py-0.5 rounded-full">
                <ShieldAlert className="size-3" />
                {t("صلاحيات Admin كاملة", "Full Admin Permissions")}
              </span>
            </div>
            <p className="text-[12px] text-[#92400e] mt-0.5 font-medium">
              {t(
                `أنت الآن داخل مكتب «${office.name}» بصلاحيات كاملة لإدارة العملاء والموظفين.`,
                `You are inside «${office.name}» with full permissions to manage clients and staff.`
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[#92400e] bg-white/70 border border-[#fcd34d] px-3 py-1.5 rounded-full text-[12px] font-bold">
            <Clock className="size-3.5" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await endFirmPreview();
              } catch {
                // Continue local exit even if API is offline.
              }
              toast.info(
                t("تم الخروج من وضع دخول المكتب", "Exited office admin access mode")
              );
              onExit();
            }}
            className="bg-[#1b1c1a] hover:bg-[#333] text-white px-4 py-2 rounded-[6px] text-[12px] font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>{t("إنهاء الدخول", "Exit Access")}</span>
          </button>
        </div>
      </div>

      {/* Office summary */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-12 rounded-[10px] flex items-center justify-center font-extrabold text-[18px]",
              office.initialBg,
              office.initialText
            )}
          >
            {office.initial}
          </div>
          <div className="text-start">
            <h1 className="text-[20px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {office.name}
            </h1>
            <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd]">
              {office.owner} • {office.city} • {office.plan}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#e8f5e9] text-[#1b7340] dark:bg-[#132c1c] dark:text-[#6ee7b7]">
            {t("تحكم كامل", "Full Control")}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#eff6ff] text-[#1d4ed8] dark:bg-[#172554] dark:text-[#93c5fd]">
            {t("عملاء + موظفون", "Clients + Staff")}
          </span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            icon: Users,
            label: t("عملاء المكتب", "Office Clients"),
            value: String(mockClients.length),
          },
          {
            icon: UserCheck,
            label: t("الموظفون", "Staff"),
            value: String(mockStaff.length),
          },
          {
            icon: Briefcase,
            label: t("القضايا النشطة", "Active Cases"),
            value: String(mockClients.reduce((sum, c) => sum + c.cases, 0)),
          },
          {
            icon: CheckCircle2,
            label: t("حالة الاشتراك", "Subscription"),
            value: office.subscriptionStatus.label,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] p-4 flex items-center gap-3"
          >
            <div className="size-10 rounded-[8px] bg-[rgba(156,100,2,0.1)] text-[#9c6402] dark:bg-[rgba(226,157,56,0.15)] dark:text-[#e29d38] flex items-center justify-center">
              <card.icon className="size-5" />
            </div>
            <div className="text-start">
              <p className="text-[11px] text-[#837565] dark:text-[#a89f91] font-semibold">
                {card.label}
              </p>
              <p className="text-[16px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 border-b border-[#f0eeea] dark:border-[#38271c]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("clients")}
              className={cn(
                "px-4 py-2.5 text-[13px] font-bold rounded-t-[8px] border-b-2 transition-colors cursor-pointer",
                activeTab === "clients"
                  ? "text-[#9c6402] border-[#9c6402] bg-[#fff9ee]/60 dark:bg-[#342711]/40"
                  : "text-[#737067] border-transparent hover:text-[#9c6402]"
              )}
            >
              {t("عملاء المكتب", "Office Clients")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={cn(
                "px-4 py-2.5 text-[13px] font-bold rounded-t-[8px] border-b-2 transition-colors cursor-pointer",
                activeTab === "staff"
                  ? "text-[#9c6402] border-[#9c6402] bg-[#fff9ee]/60 dark:bg-[#342711]/40"
                  : "text-[#737067] border-transparent hover:text-[#9c6402]"
              )}
            >
              {t("موظفو المكتب", "Office Staff")}
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              handleAction(
                activeTab === "clients"
                  ? "تم فتح نموذج إضافة عميل جديد داخل المكتب"
                  : "تم فتح نموذج إضافة موظف جديد داخل المكتب",
                activeTab === "clients"
                  ? "Opened add-client form inside the office"
                  : "Opened add-staff form inside the office"
              )
            }
            className="mb-2 bg-[#9c6402] hover:bg-[#855402] text-white px-3 py-1.5 rounded-[6px] text-[12px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>
              {activeTab === "clients"
                ? t("إضافة عميل", "Add Client")
                : t("إضافة موظف", "Add Staff")}
            </span>
          </button>
        </div>

        <div className="p-4 overflow-x-auto">
          {activeTab === "clients" ? (
            <table className="w-full text-start text-[13px]">
              <thead>
                <tr className="text-[11px] text-[#837565] dark:text-[#a89f91] border-b border-[#f0eeea] dark:border-[#38271c]">
                  <th className="py-2 px-3 font-bold">{t("اسم العميل", "Client Name")}</th>
                  <th className="py-2 px-3 font-bold">{t("القضايا", "Cases")}</th>
                  <th className="py-2 px-3 font-bold">{t("الحالة", "Status")}</th>
                  <th className="py-2 px-3 font-bold text-center">{t("إجراءات", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {mockClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                      {t("لا يوجد عملاء مسجلون لهذا المكتب", "No clients registered for this office")}
                    </td>
                  </tr>
                ) : (
                  mockClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-[#f5f3ef] dark:border-[#2c221c] last:border-0"
                  >
                    <td className="py-3 px-3 font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {client.name}
                    </td>
                    <td className="py-3 px-3 text-[#514537] dark:text-[#cdc5bd]">
                      {client.cases}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-full",
                          client.status === "active"
                            ? "bg-[#e8f5e9] text-[#1b7340]"
                            : "bg-[#fff7ed] text-[#c2410c]"
                        )}
                      >
                        {client.status === "active"
                          ? t("نشط", "Active")
                          : t("موقوف", "Paused")}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title={t("عرض", "View")}
                          onClick={() =>
                            handleAction(
                              `تم فتح ملف العميل «${client.name}»`,
                              `Opened client file «${client.name}»`
                            )
                          }
                          className="p-1.5 rounded hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#514537] cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title={t("تعديل", "Edit")}
                          onClick={() =>
                            handleAction(
                              `تم فتح تعديل بيانات «${client.name}»`,
                              `Opened edit for «${client.name}»`
                            )
                          }
                          className="p-1.5 rounded hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#514537] cursor-pointer"
                        >
                          <PenSquare className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title={t("تعطيل", "Suspend")}
                          onClick={() =>
                            handleAction(
                              `تم تعطيل «${client.name}» مؤقتاً`,
                              `Suspended «${client.name}»`
                            )
                          }
                          className="p-1.5 rounded hover:bg-[#fff7ed] text-[#c2410c] cursor-pointer"
                        >
                          <Ban className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-start text-[13px]">
              <thead>
                <tr className="text-[11px] text-[#837565] dark:text-[#a89f91] border-b border-[#f0eeea] dark:border-[#38271c]">
                  <th className="py-2 px-3 font-bold">{t("الموظف", "Employee")}</th>
                  <th className="py-2 px-3 font-bold">{t("الدور", "Role")}</th>
                  <th className="py-2 px-3 font-bold">{t("الحالة", "Status")}</th>
                  <th className="py-2 px-3 font-bold text-center">{t("إجراءات", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {mockStaff.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                      {t("لا يوجد موظفون مسجلون لهذا المكتب", "No staff registered for this office")}
                    </td>
                  </tr>
                ) : (
                  mockStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-[#f5f3ef] dark:border-[#2c221c] last:border-0"
                  >
                    <td className="py-3 px-3 font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {member.name}
                    </td>
                    <td className="py-3 px-3 text-[#514537] dark:text-[#cdc5bd]">
                      {member.role}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-full",
                          member.status === "active"
                            ? "bg-[#e8f5e9] text-[#1b7340]"
                            : "bg-[#eff6ff] text-[#1d4ed8]"
                        )}
                      >
                        {member.status === "active"
                          ? t("نشط", "Active")
                          : t("إجازة", "On Leave")}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title={t("عرض", "View")}
                          onClick={() =>
                            handleAction(
                              `تم فتح ملف الموظف «${member.name}»`,
                              `Opened staff file «${member.name}»`
                            )
                          }
                          className="p-1.5 rounded hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#514537] cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title={t("تعديل", "Edit")}
                          onClick={() =>
                            handleAction(
                              `تم فتح تعديل صلاحيات «${member.name}»`,
                              `Opened permissions edit for «${member.name}»`
                            )
                          }
                          className="p-1.5 rounded hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#514537] cursor-pointer"
                        >
                          <PenSquare className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title={t("تعطيل", "Suspend")}
                          onClick={() =>
                            handleAction(
                              `تم تعطيل وصول «${member.name}»`,
                              `Suspended access for «${member.name}»`
                            )
                          }
                          className="p-1.5 rounded hover:bg-[#fff7ed] text-[#c2410c] cursor-pointer"
                        >
                          <Ban className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
