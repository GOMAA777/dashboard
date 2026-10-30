"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  RotateCcw,
  Layers,
  Eye,
  Edit3,
  Trash2,
  Download,
  AlertCircle,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { useUIStore } from "@/stores/use-ui-store";

interface PermissionRule {
  id: string;
  name: string;
  nameEn: string;
  section: string;
  sectionEn: string;
  visibleInSidebar: boolean;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

const defaultPermissions: Record<string, PermissionRule[]> = {
  super_admin: [
    { id: "p-1", name: "لوحة التحكم", nameEn: "Dashboard", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-2", name: "التقارير والإحصائيات", nameEn: "Reports & Analytics", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-3", name: "إدارة العملاء ومكاتب المحاماة", nameEn: "Law Firms Management", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-4", name: "طلبات التجربة والعملاء المحتملين", nameEn: "Leads & Trials", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-5", name: "الاشتراكات والخطط السعرية", nameEn: "Subscriptions & Plans", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-6", name: "الفواتير والمعاملات المالية", nameEn: "Invoices & Transactions", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-7", name: "مكتبة الصيغ والعقود القانونية", nameEn: "Legal Templates Library", section: "المحتوى القانوني العام", sectionEn: "Legal Content", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-8", name: "الدعم الفني وتذاكر المكاتب", nameEn: "Support Tickets", section: "التواصل والدعم", sectionEn: "Communication & Support", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-9", name: "الإضافات والتكاملات التقنية", nameEn: "Add-ons & Integrations", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-10", name: "إدارة الحسابات والمشرفين", nameEn: "Accounts Management", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-11", name: "القوائم والصلاحيات (RBAC)", nameEn: "Menus & Permissions", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
    { id: "p-12", name: "إعدادات النظام والنسخ الاحتياطي", nameEn: "System & Backups", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: true, canView: true, canEdit: true, canDelete: true, canExport: true },
  ],
  sales: [
    { id: "p-1", name: "لوحة التحكم", nameEn: "Dashboard", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: true, canView: true, canEdit: false, canDelete: false, canExport: false },
    { id: "p-2", name: "التقارير والإحصائيات", nameEn: "Reports & Analytics", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-3", name: "إدارة العملاء ومكاتب المحاماة", nameEn: "Law Firms Management", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: true, canView: true, canEdit: true, canDelete: false, canExport: true },
    { id: "p-4", name: "طلبات التجربة والعملاء المحتملين", nameEn: "Leads & Trials", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: true, canView: true, canEdit: true, canDelete: false, canExport: true },
    { id: "p-5", name: "الاشتراكات والخطط السعرية", nameEn: "Subscriptions & Plans", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-6", name: "الفواتير والمعاملات المالية", nameEn: "Invoices & Transactions", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-7", name: "مكتبة الصيغ والعقود القانونية", nameEn: "Legal Templates Library", section: "المحتوى القانوني العام", sectionEn: "Legal Content", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-8", name: "الدعم الفني وتذاكر المكاتب", nameEn: "Support Tickets", section: "التواصل والدعم", sectionEn: "Communication & Support", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-9", name: "الإضافات والتكاملات التقنية", nameEn: "Add-ons & Integrations", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-10", name: "إدارة الحسابات والمشرفين", nameEn: "Accounts Management", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-11", name: "القوائم والصلاحيات (RBAC)", nameEn: "Menus & Permissions", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-12", name: "إعدادات النظام والنسخ الاحتياطي", nameEn: "System & Backups", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
  ],
  support: [
    { id: "p-1", name: "لوحة التحكم", nameEn: "Dashboard", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: true, canView: true, canEdit: false, canDelete: false, canExport: false },
    { id: "p-2", name: "التقارير والإحصائيات", nameEn: "Reports & Analytics", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-3", name: "إدارة العملاء ومكاتب المحاماة", nameEn: "Law Firms Management", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-4", name: "طلبات التجربة والعملاء المحتملين", nameEn: "Leads & Trials", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-5", name: "الاشتراكات والخطط السعرية", nameEn: "Subscriptions & Plans", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-6", name: "الفواتير والمعاملات المالية", nameEn: "Invoices & Transactions", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-7", name: "مكتبة الصيغ والعقود القانونية", nameEn: "Legal Templates Library", section: "المحتوى القانوني العام", sectionEn: "Legal Content", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-8", name: "الدعم الفني وتذاكر المكاتب", nameEn: "Support Tickets", section: "التواصل والدعم", sectionEn: "Communication & Support", visibleInSidebar: true, canView: true, canEdit: true, canDelete: false, canExport: true },
    { id: "p-9", name: "الإضافات والتكاملات التقنية", nameEn: "Add-ons & Integrations", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-10", name: "إدارة الحسابات والمشرفين", nameEn: "Accounts Management", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-11", name: "القوائم والصلاحيات (RBAC)", nameEn: "Menus & Permissions", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-12", name: "إعدادات النظام والنسخ الاحتياطي", nameEn: "System & Backups", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
  ],
  finance: [
    { id: "p-1", name: "لوحة التحكم", nameEn: "Dashboard", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: true, canView: true, canEdit: false, canDelete: false, canExport: true },
    { id: "p-2", name: "التقارير والإحصائيات", nameEn: "Reports & Analytics", section: "نظرة عامة", sectionEn: "Overview", visibleInSidebar: true, canView: true, canEdit: false, canDelete: false, canExport: true },
    { id: "p-3", name: "إدارة العملاء ومكاتب المحاماة", nameEn: "Law Firms Management", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-4", name: "طلبات التجربة والعملاء المحتملين", nameEn: "Leads & Trials", section: "إدارة المشتركين والمبيعات", sectionEn: "Subscribers & Sales", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-5", name: "الاشتراكات والخطط السعرية", nameEn: "Subscriptions & Plans", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: true, canView: true, canEdit: true, canDelete: false, canExport: true },
    { id: "p-6", name: "الفواتير والمعاملات المالية", nameEn: "Invoices & Transactions", section: "المالية والاشتراكات", sectionEn: "Finance & Subscriptions", visibleInSidebar: true, canView: true, canEdit: true, canDelete: false, canExport: true },
    { id: "p-7", name: "مكتبة الصيغ والعقود القانونية", nameEn: "Legal Templates Library", section: "المحتوى القانوني العام", sectionEn: "Legal Content", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-8", name: "الدعم الفني وتذاكر المكاتب", nameEn: "Support Tickets", section: "التواصل والدعم", sectionEn: "Communication & Support", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-9", name: "الإضافات والتكاملات التقنية", nameEn: "Add-ons & Integrations", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: true, canView: true, canEdit: true, canDelete: false, canExport: false },
    { id: "p-10", name: "إدارة الحسابات والمشرفين", nameEn: "Accounts Management", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-11", name: "القوائم والصلاحيات (RBAC)", nameEn: "Menus & Permissions", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
    { id: "p-12", name: "إعدادات النظام والنسخ الاحتياطي", nameEn: "System & Backups", section: "الإعدادات والنظام", sectionEn: "Settings & System", visibleInSidebar: false, canView: false, canEdit: false, canDelete: false, canExport: false },
  ],
};

export function PermissionsView() {
  const language = useUIStore((state) => state.language);
  const isAr = language === "ar";

  const [activeRole, setActiveRole] = useState<string>("super_admin");
  const [rolePermissions, setRolePermissions] = useState<Record<string, PermissionRule[]>>(defaultPermissions);
  const [isSaving, setIsSaving] = useState(false);

  const currentRules = rolePermissions[activeRole] || rolePermissions.super_admin;

  const handleToggle = (ruleId: string, field: keyof PermissionRule) => {
    setRolePermissions((prev) => ({
      ...prev,
      [activeRole]: (prev[activeRole] || []).map((rule) => {
        if (rule.id === ruleId) {
          return { ...rule, [field]: !rule[field] };
        }
        return rule;
      }),
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: isAr ? "جارٍ حفظ مصفوفة الصلاحيات وتحديث الجلسات..." : "Saving permissions matrix...",
        success: isAr
          ? "تم حفظ وتطبيق صلاحيات القوائم بنجاح لجميع المشرفين!"
          : "Role permissions and menu access saved successfully!",
        error: isAr ? "فشل حفظ الصلاحيات" : "Failed to save permissions",
      }
    );
    setTimeout(() => setIsSaving(false), 850);
  };

  const handleReset = () => {
    setRolePermissions(defaultPermissions);
    toast.info(isAr ? "تمت استعادة الإعدادات الافتراضية للصلاحيات" : "Restored default permissions");
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopNavbar />

        <main className="flex-1 w-full relative">
          {/* Ambient Emblems */}
          <div
            className="fixed top-28 -left-28 w-[400px] h-[400px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>
          <div
            className="fixed top-[520px] -right-28 w-[400px] h-[400px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#eeddbb]/70 dark:border-[#383126] bg-gradient-to-br from-[#ffffff] via-[#fbf8f2] to-[#f4ece0] dark:from-[#1e1b18] dark:via-[#191715] dark:to-[#141210] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c29547]/10 dark:bg-[#c29547]/20 text-[#966e2e] dark:text-[#eeddbb] border border-[#c29547]/30">
                    <Key className="w-3.5 h-3.5" />
                    <span>
                      {isAr
                        ? "أمن النظام والتحكم في القوائم • RBAC Matrix"
                        : "Role-Based Access Control"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917] dark:text-[#f5f4f0]">
                    {isAr ? "إدارة الصلاحيات والرتب (Permissions)" : "Access Roles & Permissions"}
                  </h1>

                  <p className="text-sm sm:text-base text-[#6b6357] dark:text-[#a8a196] max-w-2xl leading-relaxed">
                    {isAr
                      ? "التحكم في ظهور القوائم الجانبية لكل رتبة إدارية، وتخصيص صلاحيات العرض، التعديل، الحذف، وتصدير التقارير بدقة متناهية."
                      : "Control sidebar visibility, page access, creation, editing, deletion, and data exports per administrative role."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1c1917] dark:text-[#f5f4f0] bg-white dark:bg-[#25221d] border border-[#e2d5c0] dark:border-[#3d372e] shadow-sm hover:border-[#c29547] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#8c8279]" />
                    <span>{isAr ? "الافتراضي" : "Reset"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#c29547] via-[#b38538] to-[#996c25] hover:opacity-95 shadow-md shadow-[#c29547]/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? "حفظ وتطبيق الصلاحيات" : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Role Tabs */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-1">
              {[
                { id: "super_admin", labelAr: "مدير النظام (يشوف ويعمل أي حاجة)", labelEn: "System Admin (Full Access)", count: "12 قائمة" },
                { id: "sales", labelAr: "السيلز (التجارب والمكاتب)", labelEn: "Sales (Trials & Firms)", count: "3 قوائم" },
                { id: "support", labelAr: "الدعم الفني (التذاكر فقط)", labelEn: "Technical Support (Tickets)", count: "2 قائمة" },
                { id: "finance", labelAr: "المالية (الاشتراكات والفواتير والدفع)", labelEn: "Finance (Billing & Subscriptions)", count: "5 قوائم" },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    activeRole === role.id
                      ? "bg-[#faf5eb] dark:bg-[#282117] text-[#966e2e] dark:text-[#eeddbb] border-[#eeddbb] dark:border-[#523e20] shadow-sm"
                      : "bg-white dark:bg-[#1a1714] text-[#7c7366] dark:text-[#a8a196] border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#c29547]"
                  }`}
                >
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      activeRole === role.id ? "text-[#c29547]" : "text-[#8c8279]"
                    }`}
                  />
                  <span>{isAr ? role.labelAr : role.labelEn}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5">
                    {role.count}
                  </span>
                </button>
              ))}
            </div>

            {/* RBAC Matrix Table */}
            <div className="rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                  <Layers className="w-4 h-4 text-[#c29547]" />
                  <span>
                    {isAr
                      ? "مصفوفة التحكم في ظهور القوائم وصلاحيات العمليات"
                      : "Permissions & Visibility Matrix"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#8c8279]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#c29547]" />
                  <span>
                    {isAr
                      ? "يتم تفعيل الصلاحيات لحظياً على القائمة الجانبية للشاشات"
                      : "Applies instantly to matching admin accounts"}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#ded5c6] dark:border-[#2f2a24] bg-[#faf8f4]/50 dark:bg-[#201d1a]/50 text-[#7c7366] dark:text-[#a8a196]">
                      <th className="py-3 px-4 text-start font-bold">
                        {isAr ? "القائمة / الشاشة" : "Menu / Section"}
                      </th>
                      <th className="py-3 px-4 text-center font-bold">
                        {isAr ? "الظهور بالقائمة" : "Visible"}
                      </th>
                      <th className="py-3 px-4 text-center font-bold">
                        {isAr ? "العرض (Read)" : "View"}
                      </th>
                      <th className="py-3 px-4 text-center font-bold">
                        {isAr ? "التعديل (Edit)" : "Edit"}
                      </th>
                      <th className="py-3 px-4 text-center font-bold">
                        {isAr ? "الحذف (Delete)" : "Delete"}
                      </th>
                      <th className="py-3 px-4 text-center font-bold">
                        {isAr ? "التصدير (Export)" : "Export"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ded5c6]/50 dark:divide-[#2f2a24]/50">
                    {currentRules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="hover:bg-[#faf5eb]/40 dark:hover:bg-[#201d1a]/40 transition-colors"
                      >
                        {/* Menu Item Name & Section */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#1c1917] dark:text-[#f5f4f0]">
                            {isAr ? rule.name : rule.nameEn}
                          </div>
                          <div className="text-[10px] text-[#8c8279] mt-0.5">
                            {isAr ? rule.section : rule.sectionEn}
                          </div>
                        </td>

                        {/* Visible in Sidebar Switch */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(rule.id, "visibleInSidebar")}
                            className={`w-9 h-5 inline-flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                              rule.visibleInSidebar
                                ? "bg-[#c29547] justify-end"
                                : "bg-stone-300 dark:bg-stone-700 justify-start"
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                          </button>
                        </td>

                        {/* canView */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(rule.id, "canView")}
                            className={`w-6 h-6 inline-flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                              rule.canView
                                ? "bg-[#faf5eb] dark:bg-[#282218] border-[#eeddbb] dark:border-[#4d3a1f] text-[#c29547] dark:text-[#d4a759]"
                                : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400"
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>

                        {/* canEdit */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(rule.id, "canEdit")}
                            className={`w-6 h-6 inline-flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                              rule.canEdit
                                ? "bg-[#faf5eb] dark:bg-[#282218] border-[#eeddbb] dark:border-[#4d3a1f] text-[#c29547] dark:text-[#d4a759]"
                                : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400"
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                        {/* canDelete */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(rule.id, "canDelete")}
                            className={`w-6 h-6 inline-flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                              rule.canDelete
                                ? "bg-[#faf5eb] dark:bg-[#282218] border-[#eeddbb] dark:border-[#4d3a1f] text-[#c29547] dark:text-[#d4a759]"
                                : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400"
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                        {/* canExport */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(rule.id, "canExport")}
                            className={`w-6 h-6 inline-flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                              rule.canExport
                                ? "bg-[#faf5eb] dark:bg-[#282117] border-[#eeddbb] dark:border-[#523e20] text-[#c29547]"
                                : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400"
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
