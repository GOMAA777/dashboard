"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import {
  Key,
  ShieldCheck,
  Search,
  Check,
  Building2,
  Users,
  CreditCard,
  Tag,
  UserCheck,
  Bell,
  Headphones,
  Receipt,
  Wallet,
  Settings,
  Code,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { RoleItem, PermissionModule } from "../types/roles.types";
import { permissionModules } from "../data/initialRoles";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { fetchSystemPermissions, fetchRoleById } from "@/lib/api/roles";
import { unwrapList, unwrapData, asString } from "@/lib/api/helpers";

interface AddRoleViewProps {
  onBack: () => void;
  onSaveRole: (newRole: RoleItem) => void;
  initialRole?: RoleItem | null;
}

export function AddRoleView({ onBack, onSaveRole, initialRole }: AddRoleViewProps) {
  const { t, isEn, direction } = useLanguage();

  // Form fields
  const [roleName, setRoleName] = useState(initialRole?.name || "");
  const [roleSlug, setRoleSlug] = useState(initialRole?.slug || "");
  const [searchFilter, setSearchFilter] = useState("");
  const [modules, setModules] = useState<PermissionModule[]>(permissionModules);

  useEffect(() => {
    let cancelled = false;
    fetchSystemPermissions()
      .then((payload) => {
        if (cancelled) return;
        const list = unwrapList<Record<string, unknown>>(payload);
        if (list.length === 0) return;

        // API may return flat permissions or nested modules.
        const looksNested = list.some((item) => Array.isArray(item.permissions));
        if (looksNested) {
          setModules(
            list.map((mod, idx) => ({
              id: asString(mod.id, `mod-${idx}`),
              name: asString(mod.name, `Module ${idx + 1}`),
              description: asString(mod.description, ""),
              iconType: "settings" as const,
              permissions: (
                (mod.permissions as Array<Record<string, unknown> | string>) || []
              ).map((p, pIdx) =>
                typeof p === "string"
                  ? { id: p, label: p }
                  : {
                      id: asString(p.id || p.name, `perm-${pIdx}`),
                      label: asString(p.label || p.name, asString(p.id, `perm-${pIdx}`)),
                      isSensitive: Boolean(p.is_sensitive),
                    }
              ),
            }))
          );
        }
      })
      .catch(() => {
        // Keep local permission modules.
      });

    if (initialRole?.id) {
      fetchRoleById(initialRole.id)
        .then((payload) => {
          if (cancelled) return;
          const raw = (unwrapData<Record<string, unknown>>(payload) ||
            payload) as Record<string, unknown>;
          if (raw?.name) setRoleName(asString(raw.name));
          if (raw?.slug) setRoleSlug(asString(raw.slug));
        })
        .catch(() => {
          // Keep initial role fields.
        });
    }

    return () => {
      cancelled = true;
    };
  }, [initialRole?.id]);

  // Permissions state
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(() => {
    if (initialRole?.permissions) {
      if (initialRole.permissions.includes("all")) {
        const allIds = modules.flatMap((m) => m.permissions.map((p) => p.id));
        return new Set(allIds);
      }
      return new Set(initialRole.permissions);
    }
    return new Set([
      "dashboard.view",
      "dashboard.analytics",
      "clients.view",
      "clients.create",
      "clients.edit",
      "subscriptions.view",
      "subscriptions.create",
      "subscriptions.edit",
      "subscriptions.manage_status",
      "plans.view",
      "staff.view",
      "roles.view",
      "notifications.view",
      "notifications.create",
      "notifications.broadcast",
      "tickets.view",
      "tickets.create",
      "tickets.edit",
      "tickets.assign",
      "finance.transactions.view",
      "finance.invoices.view",
      "payments.methods.view",
      "system.settings.view",
    ]);
  });

  // Total permissions across all modules
  const totalPermissionsCount = useMemo(() => {
    return modules.reduce((acc, m) => acc + m.permissions.length, 0);
  }, [modules]);

  // Filter modules/permissions
  const filteredModules = useMemo(() => {
    if (!searchFilter.trim()) return modules;
    const q = searchFilter.toLowerCase();
    return modules
      .map((mod) => {
        const matchesModuleName = mod.name.toLowerCase().includes(q);
        const matchedPermissions = mod.permissions.filter((p) =>
          p.label.toLowerCase().includes(q)
        );
        if (matchesModuleName) return mod;
        if (matchedPermissions.length > 0) {
          return { ...mod, permissions: matchedPermissions };
        }
        return null;
      })
      .filter((m): m is PermissionModule => m !== null);
  }, [searchFilter, modules]);

  const handleTogglePermission = (id: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleModuleAll = (module: PermissionModule) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      const allSelected = module.permissions.every((p) => next.has(p.id));
      if (allSelected) {
        module.permissions.forEach((p) => next.delete(p.id));
      } else {
        module.permissions.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const hasSensitivePermissions = useMemo(() => {
    const sensitiveIds = [
      "clients.impersonate",
      "staff.impersonate",
      "finance.refunds.process",
      "clients.delete",
      "staff.delete",
    ];
    return sensitiveIds.some((id) => selectedPermissions.has(id));
  }, [selectedPermissions]);

  const handleSave = (isDraft = false) => {
    if (!roleName.trim()) {
      toast.error(t("يرجى إدخال اسم الدور الوظيفي", "Please enter role name"));
      return;
    }
    if (!roleSlug.trim()) {
      toast.error(t("يرجى إدخال المعرف البرمجي (Slug)", "Please enter role slug"));
      return;
    }
    if (selectedPermissions.size === 0) {
      toast.error(t("يرجى تحديد صلاحية واحدة على الأقل", "Please select at least one permission"));
      return;
    }

    const newRole: RoleItem = {
      id: initialRole?.id || `role-${Date.now()}`,
      name: roleName.trim(),
      slug: roleSlug.trim(),
      subtitle: isEn
        ? `Custom role with ${selectedPermissions.size} permissions`
        : `دور مخصص يحتوي على ${selectedPermissions.size} صلاحية تشغيلية`,
      description: isEn
        ? `Custom role with ${selectedPermissions.size} permissions`
        : `دور مخصص يحتوي على ${selectedPermissions.size} صلاحية تشغيلية`,
      permissionsCount: selectedPermissions.size,
      permissionsLabel: isEn
        ? `${selectedPermissions.size} permissions`
        : `${selectedPermissions.size} صلاحية مخصصة`,
      hasFullPermissionsBadge: selectedPermissions.size >= 50,
      assignedEmployeesCount: initialRole?.assignedEmployeesCount || 0,
      type: "custom",
      typeBadge: {
        label: isDraft ? t("مسودة دور", "Draft Role") : t("دور مخصص", "Custom Role"),
        badgeClass: isDraft
          ? "bg-[#f5f3ef] dark:bg-[#281c15] text-[#837565] dark:text-[#a89f91]"
          : "bg-[#e8f5e9] dark:bg-[#132c21] text-[#1b7340] dark:text-[#34d399]",
        dotClass: isDraft ? "bg-[#837565]" : "bg-[#1b7340]",
      },
      isProtected: false,
      iconType: "shield",
      iconBg: "bg-[#f0eeea]",
      permissions: Array.from(selectedPermissions),
    };

    onSaveRole(newRole);
    toast.success(
      isDraft
        ? t(`تم حفظ الدور "${newRole.name}" كمسودة بنجاح`, `Role "${newRole.name}" saved as draft successfully`)
        : t(`تم اعتماد وتفعيل الدور "${newRole.name}" بنجاح في مصفوفة الصلاحيات!`, `Role "${newRole.name}" saved and activated successfully!`)
    );
    onBack();
  };

  const getModuleIcon = (iconType: string) => {
    switch (iconType) {
      case "home":
        return <Building2 className="size-[15px]" />;
      case "users":
        return <Users className="size-[15px]" />;
      case "credit-card":
        return <CreditCard className="size-[15px]" />;
      case "tag":
        return <Tag className="size-[15px]" />;
      case "user-check":
        return <UserCheck className="size-[15px]" />;
      case "key":
        return <Key className="size-[15px]" />;
      case "bell":
        return <Bell className="size-[15px]" />;
      case "headphones":
        return <Headphones className="size-[15px]" />;
      case "receipt":
        return <Receipt className="size-[15px]" />;
      case "wallet":
        return <Wallet className="size-[15px]" />;
      case "settings":
        return <Settings className="size-[15px]" />;
      default:
        return <Key className="size-[15px]" />;
    }
  };

  const inputBase =
    "w-full h-[42px] pe-10 ps-3 text-[13px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] focus:border-[#9c6402] dark:focus:border-[#e29d38] transition-colors";

  return (
    <div dir={direction} className="space-y-4 pb-2" data-node-id="1:12201">
      {/* Header — same shape as Add Employee */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        data-node-id="1:12204"
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="size-[40px] rounded-[8px] bg-[#f5f3ef] dark:bg-[#2d1f16] border border-transparent dark:border-[#38271c] flex items-center justify-center hover:bg-[#eae6e0] dark:hover:bg-[#38271c] transition-colors cursor-pointer"
          >
            <ArrowLeft
              className={cn(
                "size-[18px] text-[#514537] dark:text-[#cdc5bd]",
                !isEn && "rotate-180"
              )}
            />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {initialRole
                ? t("تعديل الدور الوظيفي", "Edit Role")
                : t("إضافة دور جديد", "Add New Role")}
            </h1>
            <p className="text-[13px] text-[#79716b] dark:text-[#a89f91] mt-0.5">
              {t(
                "أنشئ دوراً وظيفياً مخصصاً وحدد صلاحيات الوصول إلى الموديولات المؤسسية بدقة.",
                "Create a custom role and configure exact module access permissions."
              )}
            </p>
          </div>
        </div>

        <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-[#e6e2dc] dark:border-[#38271c] rounded-[8px] p-2 flex items-center gap-3 shrink-0">
          <div className="bg-white dark:bg-[#221812] border border-[#e6e2dc] dark:border-[#38271c] rounded-[6px] px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <div className="text-start flex flex-col">
              <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
                {t("الصلاحيات المحددة", "Selected Permissions")}
              </span>
              <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                <span className="text-[#9c6402] dark:text-[#e29d38]">
                  {selectedPermissions.size}
                </span>
                <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                  {t(`من أصل ${totalPermissionsCount}`, `of ${totalPermissionsCount}`)}
                </span>
              </div>
            </div>
            <Key className="size-[15px] text-[#9c6402] dark:text-[#e29d38] shrink-0" />
          </div>

          <div className="px-2.5 py-1 text-start flex flex-col">
            <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
              {t("مستوى المخاطر", "Risk Level")}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={cn(
                  "size-[7px] rounded-full",
                  hasSensitivePermissions ? "bg-[#d97706]" : "bg-[#1b7340]"
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-bold",
                  hasSensitivePermissions
                    ? "text-[#d97706] dark:text-[#fbbf24]"
                    : "text-[#1b7340] dark:text-[#34d399]"
                )}
              >
                {hasSensitivePermissions
                  ? t("صلاحيات موسعة", "Elevated Scope")
                  : t("مضبوط أمنياً", "Strictly Secured")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: البيانات الأساسية للدور */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        data-node-id="1:12230"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2efe9] dark:border-[#38271c]">
          <div className="size-[42px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center shrink-0">
            <UserCheck className="size-[20px] text-[#9c6402] dark:text-[#e29d38]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("البيانات الأساسية للدور", "Core Role Information")}
            </h2>
            <p className="text-[12px] text-[#79716b] dark:text-[#a89f91]">
              {t("اسم الدور والمعرف البرمجي", "Role name and system slug")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div data-node-id="1:12239">
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("اسم الدور الوظيفي", "Role Name")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder={t(
                  "مثال: مسؤول العملاء، أخصائي مراجعة...",
                  "e.g. Account Manager, Audit Specialist..."
                )}
                className={inputBase}
              />
              <UserCheck className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#79716b] dark:text-[#a89f91] mt-1">
              {t(
                "يظهر هذا الاسم في بطاقات الموظفين وتقارير التدقيق الإداري.",
                "This name appears in staff badges and administrative audit logs."
              )}
            </p>
          </div>

          <div data-node-id="1:12251">
            <label className="block text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("المعرّف البرمجي للنظام (Slug)", "System Identifier (Slug)")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={roleSlug}
                onChange={(e) => setRoleSlug(e.target.value)}
                placeholder="e.g. employee"
                dir="ltr"
                className={cn(inputBase, "text-left font-mono")}
              />
              <Code className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#79716b] dark:text-[#a89f91] mt-1">
              {t(
                "معرّف نظام فريد ومستقر يُستخدم برمجياً في محركات فحص الأذونات والسياسات، وليس اسم تسجيل دخول للموظف.",
                "A unique stable system identifier used by permission evaluation engines, not a login username."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: مصفوفة صلاحيات النظام */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
        data-node-id="1:12263"
      >
        <div className="p-6 border-b border-[#f2efe9] dark:border-[#38271c] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-[42px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center shrink-0">
              <Key className="size-[20px] text-[#9c6402] dark:text-[#e29d38]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("مصفوفة صلاحيات النظام", "System Permissions Matrix")}
                </h2>
                <span className="bg-[#ffeed9] dark:bg-[#2d1f16] text-[#7b4e00] dark:text-[#f3c27e] text-[11px] font-bold px-2.5 py-0.5 rounded-[4px]">
                  {t(
                    `${modules.length} موديول مفعل`,
                    `${modules.length} Active Modules`
                  )}
                </span>
              </div>
              <p className="text-[12px] text-[#79716b] dark:text-[#a89f91] mt-0.5">
                {t(
                  "حدد الصلاحيات بدقة لكل موديول؛ لن يتم منح صلاحيات افتراضية دون تحديد صريح من المشرف العام.",
                  "Configure permissions precisely for each module; no permissions granted by default without supervisor selection."
                )}
              </p>
            </div>
          </div>

          <div className="relative min-w-[280px]" data-node-id="1:12265">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t(
                "تصفية الأقسام أو الصلاحيات...",
                "Filter modules or permissions..."
              )}
              className="w-full h-[42px] pe-10 ps-3 text-[13px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] transition-colors"
            />
            <Search className="size-[16px] text-[#948b83] dark:text-[#a89f91] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-[#f0eeea] dark:bg-[#281c15] border-b border-[#e6e2dc] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-bold">
                <th className="py-3 px-6 text-start w-[340px]" data-node-id="1:12285">
                  {t("الوحدة / الموديول المؤسسي", "Module / System Unit")}
                </th>
                <th className="py-3 px-6 text-start" data-node-id="1:12287">
                  {t("الصلاحيات المتاحة والأذونات التنفيذية", "Available Permissions & Actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
              {filteredModules.map((module) => {
                const allSelected = module.permissions.every((p) =>
                  selectedPermissions.has(p.id)
                );

                return (
                  <tr
                    key={module.id}
                    className="hover:bg-[#fbf9f6] dark:hover:bg-[#2a1d15] transition-colors align-top"
                  >
                    {/* Module Info */}
                    <td className="py-5 px-6 text-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="size-[30px] rounded-[6px] bg-[#f0eeea] dark:bg-[#281c15] flex items-center justify-center text-[#514537] dark:text-[#cdc5bd] shrink-0">
                            {getModuleIcon(module.iconType)}
                          </div>
                          <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {module.name}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#625d5d] dark:text-[#a89f91] leading-[18px]">
                          {module.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleToggleModuleAll(module)}
                          className="text-[11px] font-bold text-[#9c6402] dark:text-[#f59e0b] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="size-[12px]" />
                          <span>
                            {allSelected
                              ? t("إلغاء تحديد الكل", "Deselect All")
                              : t("تحديد الكل لهذا القسم", "Select All in Module")}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Checkboxes for permissions */}
                    <td className="py-5 px-6 text-start">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {module.permissions.map((perm) => {
                          const isChecked = selectedPermissions.has(perm.id);

                          return (
                            <label
                              key={perm.id}
                              onClick={() => handleTogglePermission(perm.id)}
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-[6px] border text-[12px] font-semibold transition-all cursor-pointer select-none ${
                                isChecked
                                  ? perm.isSensitive
                                    ? "bg-[#fff7ed] dark:bg-[#341e13] border-[#ea580c] text-[#9a3412] dark:text-[#fb923c] shadow-2xs"
                                    : "bg-[#fff8e1]/60 dark:bg-[#342711] border-[#9c6402] text-[#1b1c1a] dark:text-[#fdfbf7] shadow-2xs"
                                  : perm.isSensitive
                                  ? "bg-white dark:bg-[#221812] border-[#fecaca] dark:border-[#5a1b26] text-[#b91c1c] dark:text-[#f87171] hover:border-[#f87171]"
                                  : "bg-white dark:bg-[#221812] border-[#e6e2dc] dark:border-[#38271c] text-[#514537] dark:text-[#a89f91] hover:border-[#c5bcaf]"
                              }`}
                            >
                              <div
                                className={`size-[16px] rounded-[3px] flex items-center justify-center border transition-colors shrink-0 ${
                                  isChecked
                                    ? perm.isSensitive
                                      ? "bg-[#ea580c] border-[#ea580c] text-white"
                                      : "bg-[#9c6402] border-[#9c6402] text-white"
                                    : "border-[#d6cfc7] dark:border-[#4d3627] bg-white dark:bg-[#281c15]"
                                }`}
                              >
                                {isChecked && <Check className="size-[11px] stroke-[3]" />}
                              </div>

                              <span>{perm.label}</span>

                              {perm.sensitivityBadge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] border ${
                                    perm.sensitivityBadge === "مقيد أمنياً"
                                      ? "bg-[#fef2f2] dark:bg-[#311616] text-[#b91c1c] dark:text-[#f87171] border-[#fecaca] dark:border-[#582121]"
                                      : "bg-[#fff7ed] dark:bg-[#341e13] text-[#c2410c] dark:text-[#fb923c] border-[#ffedd5] dark:border-[#542918]"
                                  }`}
                                >
                                  {perm.sensitivityBadge === "مقيد أمنياً"
                                    ? t("مقيد أمنياً", "Restricted")
                                    : t("حساس", "Sensitive")}
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[13px] text-[#514537] dark:text-[#cdc5bd]">
          <ShieldCheck className="size-[18px] text-[#10b981] shrink-0" />
          <span>
            {t(
              "سيتم توثيق إنشاء هذا الدور في سجل التدقيق الأمني فور الاعتماد.",
              "Creation of this role will be recorded in the security audit log immediately."
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2d1f16] hover:bg-[#eae6e0] dark:hover:bg-[#38271c] border border-transparent dark:border-[#38271c] rounded-[6px] transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-4 py-2 text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#2d1f16] hover:bg-[#eae6e0] dark:hover:bg-[#38271c] border border-transparent dark:border-[#38271c] rounded-[6px] transition-colors cursor-pointer"
          >
            {t("حفظ كمسودة", "Save as Draft")}
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-5 py-2 text-[13px] font-bold text-white dark:text-[#1c140f] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#f3c27e] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Check className="size-[16px]" />
            <span>{t("حفظ وتفعيل الدور", "Save & Activate Role")}</span>
          </button>
        </div>
      </DashboardStickyActionBar>
    </div>
  );
}