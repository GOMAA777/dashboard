"use client";

import React, { useState } from "react";
import {
  Menu,
  Plus,
  RotateCcw,
  Check,
  Link2,
  FolderTree,
  X,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { useUIStore } from "@/stores/use-ui-store";

interface MenuItemConfig {
  id: string;
  labelAr: string;
  labelEn: string;
  href: string;
  badge?: string;
  enabled: boolean;
  isCollapsible?: boolean;
  subItems?: {
    id: string;
    labelAr: string;
    labelEn: string;
    href: string;
    badge?: string;
    enabled: boolean;
  }[];
}

const initialMenuTree: MenuItemConfig[] = [
  {
    id: "sec-overview",
    labelAr: "1. نظرة عامة",
    labelEn: "1. Overview",
    href: "/",
    enabled: true,
    isCollapsible: false,
    subItems: [
      { id: "m-dashboard", labelAr: "لوحة التحكم (Dashboard)", labelEn: "Dashboard", href: "/", enabled: true },
      { id: "m-analytics", labelAr: "التقارير والإحصائيات (Analytics)", labelEn: "Reports & Analytics", href: "#", badge: "جديد", enabled: true },
    ],
  },
  {
    id: "sec-sales",
    labelAr: "2. إدارة المشتركين والمبيعات",
    labelEn: "2. Subscribers & Sales",
    href: "#",
    enabled: true,
    isCollapsible: true,
    subItems: [
      { id: "m-law-firms", labelAr: "إدارة العملاء / مكاتب المحاماة", labelEn: "Law Firms Management", href: "#", enabled: true },
      { id: "m-leads", labelAr: "طلبات التجربة والعملاء المحتملين", labelEn: "Leads & Trials", href: "#", enabled: true },
      { id: "m-storage", labelAr: "إدارة المساحات التخزينية للمكاتب", labelEn: "Storage Quotas", href: "#", enabled: true },
    ],
  },
  {
    id: "sec-finance",
    labelAr: "3. المالية والاشتراكات",
    labelEn: "3. Finance & Subscriptions",
    href: "/subscriptions",
    enabled: true,
    isCollapsible: true,
    subItems: [
      { id: "m-subs", labelAr: "الاشتراكات النشطة والمنتهية", labelEn: "Subscriptions", href: "/subscriptions", enabled: true },
      { id: "m-plans", labelAr: "خطط الأسعار والباقات", labelEn: "Pricing Plans", href: "#", enabled: true },
      { id: "m-invoices", labelAr: "الفواتير والمعاملات المالية", labelEn: "Invoices & Billing", href: "#", enabled: true },
      { id: "m-coupons", labelAr: "كوبونات الخصم والعروض", labelEn: "Coupons & Promos", href: "#", enabled: true },
      { id: "m-gateways", labelAr: "بوابات الدفع الإلكتروني", labelEn: "Payment Gateways", href: "#", enabled: true },
    ],
  },
  {
    id: "sec-legal",
    labelAr: "4. المحتوى القانوني العام",
    labelEn: "4. Legal Content",
    href: "#",
    enabled: true,
    isCollapsible: true,
    subItems: [
      { id: "m-templates", labelAr: "مكتبة الصيغ والعقود الجاهزة", labelEn: "Legal Templates", href: "#", enabled: true },
      { id: "m-courts", labelAr: "إعدادات المحاكم والبيانات القانونية", labelEn: "Courts & Cases", href: "#", enabled: true },
    ],
  },
  {
    id: "sec-support",
    labelAr: "5. التواصل والدعم",
    labelEn: "5. Communication & Support",
    href: "#",
    enabled: true,
    isCollapsible: false,
    subItems: [
      { id: "m-team", labelAr: "فريق العمل والصلاحيات", labelEn: "Team & Roles", href: "#", enabled: true },
      { id: "m-tickets", labelAr: "الدعم الفني والتذاكر", labelEn: "Support Tickets", href: "#", badge: "3", enabled: true },
      { id: "m-notifs", labelAr: "الإشعارات والتنبيهات", labelEn: "Notifications", href: "#", enabled: true },
      { id: "m-ai", labelAr: "المساعد الذكي القانوني", labelEn: "AI Legal Assistant", href: "#", badge: "AI", enabled: true },
    ],
  },
  {
    id: "sec-settings",
    labelAr: "6. الإعدادات والنظام",
    labelEn: "6. Settings & System",
    href: "/integrations",
    enabled: true,
    isCollapsible: true,
    subItems: [
      { id: "m-integrations", labelAr: "الإضافات والتكاملات", labelEn: "Add-ons & Integrations", href: "/integrations", enabled: true },
      { id: "m-accounts", labelAr: "الحسابات (Accounts)", labelEn: "Accounts", href: "/accounts", enabled: true },
      { id: "m-menus", labelAr: "القوائم (Menus)", labelEn: "Menus", href: "/menus", enabled: true },
      { id: "m-permissions", labelAr: "الصلاحيات (Permissions)", labelEn: "Permissions", href: "/permissions", enabled: true },
      { id: "m-site", labelAr: "إعدادات الموقع والواجهة", labelEn: "Site Settings", href: "#", enabled: true },
      { id: "m-mail", labelAr: "إعدادات البريد والرسائل", labelEn: "Email & SMS Settings", href: "#", enabled: true },
      { id: "m-backup", labelAr: "إعدادات النظام والنسخ الاحتياطي", labelEn: "System & Backups", href: "#", enabled: true },
      { id: "m-audit", labelAr: "سجل النشاطات والأمان", labelEn: "Audit Logs", href: "#", enabled: true },
    ],
  },
];

export function MenusView() {
  const language = useUIStore((state) => state.language);
  const isAr = language === "ar";

  const [menus, setMenus] = useState<MenuItemConfig[]>(initialMenuTree);
  const [editingItem, setEditingItem] = useState<{ id: string; labelAr: string; href: string } | null>(null);

  const handleToggleSub = (sectionId: string, subId: string) => {
    setMenus((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId && sec.subItems) {
          return {
            ...sec,
            subItems: sec.subItems.map((sub) => {
              if (sub.id === subId) {
                const next = !sub.enabled;
                toast.success(
                  next
                    ? isAr
                      ? `تم تفعيل إظهار "${sub.labelAr}" في القائمة`
                      : `Enabled "${sub.labelEn}" in sidebar`
                    : isAr
                    ? `تم إخفاء "${sub.labelAr}" من القائمة`
                    : `Hidden "${sub.labelEn}" from sidebar`
                );
                return { ...sub, enabled: next };
              }
              return sub;
            }),
          };
        }
        return sec;
      })
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setMenus((prev) =>
      prev.map((sec) => ({
        ...sec,
        subItems: sec.subItems?.map((sub) =>
          sub.id === editingItem.id
            ? { ...sub, labelAr: editingItem.labelAr, href: editingItem.href }
            : sub
        ),
      }))
    );
    toast.success(isAr ? "تم تحديث بيانات القائمة بنجاح!" : "Menu updated successfully!");
    setEditingItem(null);
  };

  const totalMainSections = menus.length;
  const totalSubItems = menus.reduce((acc, m) => acc + (m.subItems?.length || 0), 0);
  const activeSubItems = menus.reduce(
    (acc, m) => acc + (m.subItems?.filter((s) => s.enabled).length || 0),
    0
  );

  return (
    <div className="flex min-h-screen bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopNavbar />

        <main className="flex-1 w-full relative">
          {/* Ambient Scales of Justice Emblems */}
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

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#eeddbb]/70 dark:border-[#383126] bg-gradient-to-br from-[#ffffff] via-[#fbf8f2] to-[#f4ece0] dark:from-[#1e1b18] dark:via-[#191715] dark:to-[#141210] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c29547]/10 dark:bg-[#c29547]/20 text-[#966e2e] dark:text-[#eeddbb] border border-[#c29547]/30">
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>
                      {isAr
                        ? "هيكلية القوائم والتنقل • Navigation Architecture"
                        : "Menu Hierarchy & Navigation"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917] dark:text-[#f5f4f0]">
                    {isAr ? "إدارة القوائم (Menus Management)" : "Navigation Menus Management"}
                  </h1>

                  <p className="text-sm sm:text-base text-[#6b6357] dark:text-[#a8a196] max-w-2xl leading-relaxed">
                    {isAr
                      ? "التحكم في شجرة القوائم الرئيسية والفرعية، وترتيب ظهورها، وتفعيل وإخفاء التابات، وضبط مسارات التنقل والشارات التنبيهية."
                      : "Control the sidebar navigation tree, menu order, active visibility, route paths, and badge counters."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMenus(initialMenuTree);
                      toast.info(isAr ? "تمت استعادة هيكلية القوائم الافتراضية" : "Restored default menu hierarchy");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1c1917] dark:text-[#f5f4f0] bg-white dark:bg-[#25221d] border border-[#e2d5c0] dark:border-[#3d372e] shadow-sm hover:border-[#c29547] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#8c8279]" />
                    <span>{isAr ? "استعادة الافتراضي" : "Reset Order"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toast.info(isAr ? "نافذة إضافة عنصر قائمة جديد" : "Add custom menu item");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#c29547] via-[#b38538] to-[#996c25] hover:opacity-95 shadow-md shadow-[#c29547]/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? "إضافة عنصر قائمة" : "Add Menu Item"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196] mb-1">
                  {isAr ? "الأقسام الرئيسية" : "Main Sections"}
                </div>
                <div className="text-2xl font-black text-[#1c1917] dark:text-[#f5f4f0]">
                  {totalMainSections} أقسام
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr ? "الهيكلية القياسية للـ SaaS" : "Core SaaS sections"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196] mb-1">
                  {isAr ? "إجمالي التابات والروابط" : "Total Sub-Items"}
                </div>
                <div className="text-2xl font-black text-[#c29547] dark:text-[#d4a759]">
                  {totalSubItems} تاب
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr ? "روابط شاشات متفرعة" : "Branch navigation tabs"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196] mb-1">
                  {isAr ? "التابات المفعلة" : "Active Tabs"}
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {activeSubItems}
                </div>
                <div className="text-[11px] text-emerald-600/80 mt-1">
                  {isAr ? "تظهر للمستخدمين بالقائمة" : "Visible in sidebar"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196] mb-1">
                  {isAr ? "القوائم المنسدلة" : "Collapsible Groups"}
                </div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  4 قوائم
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr ? "تدعم الطي والتوسيع الانسيابي" : "Vector branch enabled"}
                </div>
              </div>
            </div>

            {/* Menu Tree Interactive Cards */}
            <div className="space-y-4">
              {menus.map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs overflow-hidden"
                >
                  {/* Section Bar */}
                  <div className="p-4 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#faf5eb] dark:bg-[#282117] border border-[#eeddbb] dark:border-[#523e20] flex items-center justify-center text-[#c29547]">
                        <Menu className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
                          {isAr ? section.labelAr : section.labelEn}
                        </h2>
                        <span className="text-[11px] text-[#8c8279]">
                          {section.subItems?.length || 0} {isAr ? "تابات وروابط فرعية" : "sub-items"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {section.isCollapsible && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#faf5eb] dark:bg-[#282117] text-[#c29547] border border-[#eeddbb]">
                          {isAr ? "قائمة منسدلة" : "Collapsible"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sub-items List */}
                  <div className="divide-y divide-[#ded5c6]/40 dark:divide-[#2f2a24]/40">
                    {section.subItems?.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 sm:px-6 flex items-center justify-between hover:bg-[#faf5eb]/30 dark:hover:bg-[#201d1a]/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#c29547]" />
                          <div>
                            <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] block">
                              {isAr ? sub.labelAr : sub.labelEn}
                            </span>
                            <span className="text-[11px] font-mono text-[#8c8279] flex items-center gap-1">
                              <Link2 className="w-3 h-3 text-[#c29547]" />
                              <span>{sub.href}</span>
                            </span>
                          </div>
                          {sub.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#faf5eb] dark:bg-[#282117] text-[#c29547] border border-[#eeddbb]">
                              {sub.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Toggle Switch */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#8c8279] hidden sm:inline">
                              {sub.enabled ? (isAr ? "ظاهر" : "Visible") : (isAr ? "مخفي" : "Hidden")}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleSub(section.id, sub.id)}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                sub.enabled
                                  ? "bg-[#c29547] justify-end"
                                  : "bg-stone-300 dark:bg-stone-700 justify-start"
                              }`}
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                            </button>
                          </div>

                          {/* Quick Edit */}
                          <button
                            type="button"
                            onClick={() =>
                              setEditingItem({
                                id: sub.id,
                                labelAr: sub.labelAr,
                                href: sub.href,
                              })
                            }
                            className="p-1.5 rounded-lg text-[#8c8279] hover:text-[#c29547] hover:bg-[#faf5eb] dark:hover:bg-[#201d1a] transition-colors cursor-pointer"
                            title={isAr ? "تعديل المسمى والرابط" : "Edit"}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-4 h-4 text-[#c29547]" />
                <h3 className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
                  {isAr ? "تعديل بيانات عنصر القائمة" : "Edit Menu Item"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2c2825] dark:text-[#e4ded5] mb-1.5">
                  {isAr ? "اسم التاب في القائمة الجانبية" : "Menu Label"}
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.labelAr}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, labelAr: e.target.value })
                  }
                  className="w-full h-11 rounded-2xl px-3.5 bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0] focus:outline-none focus:border-[#c29547]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2c2825] dark:text-[#e4ded5] mb-1.5">
                  {isAr ? "مسار التوجيه (Route URL)" : "Route Path"}
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.href}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, href: e.target.value })
                  }
                  className="w-full h-11 rounded-2xl px-3.5 bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-mono text-[#2c2825] dark:text-[#f5f4f0] focus:outline-none focus:border-[#c29547]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ded5c6]/40 dark:border-[#2f2a24]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-[#524b43] dark:text-[#c4bcb1] hover:bg-stone-100 dark:hover:bg-[#25201b] transition-colors cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(194,149,71,0.3)] transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? "حفظ التعديلات" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
