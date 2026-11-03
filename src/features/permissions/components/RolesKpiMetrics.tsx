"use client";

import React from "react";
import { ShieldCheck, Key, Users, Shield, Lock, CheckCircle2, BadgeCheck } from "lucide-react";
import { RoleKpiStats } from "../types/roles.types";
import { useLanguage } from "@/lib/i18n";

interface RolesKpiMetricsProps {
  kpis: RoleKpiStats;
  isEmpty?: boolean;
}

export function RolesKpiMetrics({ kpis, isEmpty = false }: RolesKpiMetricsProps) {
  const { t } = useLanguage();

  if (isEmpty) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        data-node-id="1:11333"
      >
        {/* Card 1: Total Roles (Empty) */}
        <div
          className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
          data-node-id="1:11334"
        >
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] size-[48px] rounded-[8px] flex items-center justify-center text-[#948b83] dark:text-[#8e8680] shrink-0">
            <Shield className="size-[22px]" />
          </div>
          <div className="text-start flex flex-col items-end">
            <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#cdc5bd]">
              {t("إجمالي الأدوار النشطة", "Total Active Roles")}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
                0
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#837565] dark:text-[#8e8680] mt-1">
              {t("لم يتم تخصيص أدوار", "No roles allocated")}
            </span>
          </div>
        </div>

        {/* Card 2: Assigned Staff (Empty) */}
        <div
          className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
          data-node-id="1:11342"
        >
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] size-[48px] rounded-[8px] flex items-center justify-center text-[#948b83] dark:text-[#8e8680] shrink-0">
            <Users className="size-[22px]" />
          </div>
          <div className="text-start flex flex-col items-end">
            <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#cdc5bd]">
              {t("الموظفون المخصصون", "Assigned Staff")}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
                0
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#837565] dark:text-[#8e8680] mt-1">
              {t("بانتظار توزيع الصلاحيات", "Awaiting role assignments")}
            </span>
          </div>
        </div>

        {/* Card 3: Security Pct (Empty) */}
        <div
          className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
          data-node-id="1:11350"
        >
          <div className="bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 size-[48px] rounded-[8px] flex items-center justify-center text-[#b76e00] dark:text-[#f3c27e] shrink-0">
            <Lock className="size-[22px]" />
          </div>
          <div className="text-start flex flex-col items-end">
            <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#cdc5bd]">
              {t("أمان المنظومة", "System Security")}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
                100%
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#1b7340] dark:text-[#6ee7b7] mt-1 flex items-center gap-1">
              {t("محمية ببروتوكول رقابي", "Secured with audit protocol")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
      data-node-id="1:11548"
    >
      {/* Stat Card 1: Total Roles (Figma 1:11600) */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11600"
      >
        <div className="bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 size-[48px] rounded-[8px] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <ShieldCheck className="size-[22px]" />
        </div>
        <div className="text-start flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#cdc5bd]" data-node-id="1:11606">
            {t("إجمالي الأدوار النشطة", "Total Active Roles")}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d] dark:text-[#8e8680]" data-node-id="1:11609">
              {t("أدوار مفعّلة", "Active Roles")}
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none" data-node-id="1:11611">
              {kpis.totalActiveRoles}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#1b7340] dark:text-[#6ee7b7]" data-node-id="1:11612">
            <CheckCircle2 className="size-[12px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11614">
              {t("جاهزة للاستناد الوظيفي", "Role assignment ready")}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Card 2: Total Permissions (Figma 1:11583) */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11583"
      >
        <div className="bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 size-[48px] rounded-[8px] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Key className="size-[20px]" />
        </div>
        <div className="text-start flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#cdc5bd]" data-node-id="1:11589">
            {t("إجمالي الصلاحيات المهيأة", "Total Permissions")}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d] dark:text-[#8e8680]" data-node-id="1:11592">
              {t("صلاحية", "Permissions")}
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none" data-node-id="1:11594">
              {kpis.totalPermissions}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#9c6402] dark:text-[#f3c27e]" data-node-id="1:11595">
            <BadgeCheck className="size-[12px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11597">
              {t("تغطي 14 وحدة وظيفية", "Covers 14 modules")}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Card 3: Associated Staff (Figma 1:11566) */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11566"
      >
        <div className="bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 size-[48px] rounded-[8px] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Users className="size-[22px]" />
        </div>
        <div className="text-start flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#cdc5bd]" data-node-id="1:11572">
            {t("الموظفون المرتبطون", "Associated Staff")}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d] dark:text-[#8e8680]" data-node-id="1:11575">
              {t("موظفاً نشطاً", "Active Staff")}
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none" data-node-id="1:11577">
              {kpis.totalAssignedStaff}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#625d5d] dark:text-[#cdc5bd]" data-node-id="1:11578">
            <Users className="size-[11px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11580">
              {t("100% من الكادر معتمد", "100% of staff verified")}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Card 4: System Protected Roles (Figma 1:11549) */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11549"
      >
        <div className="bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 size-[48px] rounded-[8px] flex items-center justify-center text-[#b76e00] dark:text-[#f3c27e] shrink-0">
          <Shield className="size-[22px]" />
        </div>
        <div className="text-start flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#cdc5bd]" data-node-id="1:11555">
            {t("أدوار النظام الأساسية", "System Core Roles")}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d] dark:text-[#8e8680]" data-node-id="1:11558">
              {t("دور محمي", "Protected Roles")}
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none" data-node-id="1:11560">
              {kpis.systemProtectedRoles}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#b76e00] dark:text-[#f3c27e]" data-node-id="1:11561">
            <Lock className="size-[11px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11563">
              {t("غير قابل للحذف أو السحب", "Non-deletable")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}