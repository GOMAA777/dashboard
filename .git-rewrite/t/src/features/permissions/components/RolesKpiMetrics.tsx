import React from "react";
import { ShieldCheck, Key, Users, Shield, Lock, CheckCircle2, BadgeCheck } from "lucide-react";
import { RoleKpiStats } from "../types/roles.types";

interface RolesKpiMetricsProps {
  kpis: RoleKpiStats;
  isEmpty?: boolean;
}

export function RolesKpiMetrics({ kpis, isEmpty = false }: RolesKpiMetricsProps) {
  if (isEmpty) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        data-node-id="1:11333"
        dir="rtl"
      >
        {/* Card 1: Total Roles (Empty) */}
        <div
          className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
          data-node-id="1:11334"
        >
          <div className="bg-[#f5f3ef] size-[48px] rounded-[8px] flex items-center justify-center text-[#948b83] shrink-0">
            <Shield className="size-[22px]" />
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[12px] font-semibold text-[#625d5d]">
              إجمالي الأدوار النشطة
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] leading-none">
                0
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#837565] mt-1">
              لم يتم تخصيص أدوار
            </span>
          </div>
        </div>

        {/* Card 2: Assigned Staff (Empty) */}
        <div
          className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
          data-node-id="1:11342"
        >
          <div className="bg-[#f5f3ef] size-[48px] rounded-[8px] flex items-center justify-center text-[#948b83] shrink-0">
            <Users className="size-[22px]" />
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[12px] font-semibold text-[#625d5d]">
              الموظفون المخصصون
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] leading-none">
                0
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#837565] mt-1">
              بانتظار توزيع الصلاحيات
            </span>
          </div>
        </div>

        {/* Card 3: Security Pct (Empty) */}
        <div
          className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
          data-node-id="1:11350"
        >
          <div className="bg-[#fff8e1] size-[48px] rounded-[8px] flex items-center justify-center text-[#b76e00] shrink-0">
            <Lock className="size-[22px]" />
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[12px] font-semibold text-[#625d5d]">
              أمان المنظومة
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] leading-none">
                100%
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#1b7340] mt-1 flex items-center gap-1">
              محمية ببروتوكول رقابي
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      data-node-id="1:11548"
      dir="rtl"
    >
      {/* Stat Card 1: Total Roles (Figma 1:11600) */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11600"
      >
        <div className="bg-[rgba(255,221,182,0.4)] size-[48px] rounded-[8px] flex items-center justify-center text-[#9c6402] shrink-0">
          <ShieldCheck className="size-[22px]" />
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d]" data-node-id="1:11606">
            إجمالي الأدوار النشطة
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d]" data-node-id="1:11609">
              أدوار مفعّلة
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] leading-none" data-node-id="1:11611">
              {kpis.totalActiveRoles}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#1b7340]" data-node-id="1:11612">
            <CheckCircle2 className="size-[12px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11614">
              جاهزة للاستناد الوظيفي
            </span>
          </div>
        </div>
      </div>

      {/* Stat Card 2: Total Permissions (Figma 1:11583) */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11583"
      >
        <div className="bg-[#f0eeea] size-[48px] rounded-[8px] flex items-center justify-center text-[#625d5d] shrink-0">
          <Key className="size-[20px]" />
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d]" data-node-id="1:11589">
            إجمالي الصلاحيات المهيأة
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d]" data-node-id="1:11592">
              صلاحية
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] leading-none" data-node-id="1:11594">
              {kpis.totalPermissions}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#9c6402]" data-node-id="1:11595">
            <BadgeCheck className="size-[12px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11597">
              تغطي 14 وحدة وظيفية
            </span>
          </div>
        </div>
      </div>

      {/* Stat Card 3: Associated Staff (Figma 1:11566) */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11566"
      >
        <div className="bg-[#f0eeea] size-[48px] rounded-[8px] flex items-center justify-center text-[#625d5d] shrink-0">
          <Users className="size-[22px]" />
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d]" data-node-id="1:11572">
            الموظفون المرتبطون
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d]" data-node-id="1:11575">
              موظفاً نشطاً
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] leading-none" data-node-id="1:11577">
              {kpis.totalAssignedStaff}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#625d5d]" data-node-id="1:11578">
            <Users className="size-[11px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11580">
              100% من الكادر معتمد
            </span>
          </div>
        </div>
      </div>

      {/* Stat Card 4: System Protected Roles (Figma 1:11549) */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:11549"
      >
        <div className="bg-[#fff8e1] size-[48px] rounded-[8px] flex items-center justify-center text-[#b76e00] shrink-0">
          <Shield className="size-[22px]" />
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[12px] font-semibold text-[#625d5d]" data-node-id="1:11555">
            أدوار النظام الأساسية
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-medium text-[#625d5d]" data-node-id="1:11558">
              دور محمي
            </span>
            <span className="text-[28px] font-bold text-[#1b1c1a] leading-none" data-node-id="1:11560">
              {kpis.systemProtectedRoles}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#b76e00]" data-node-id="1:11561">
            <Lock className="size-[11px]" />
            <span className="text-[10px] font-bold" data-node-id="1:11563">
              غير قابل للحذف أو السحب
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
