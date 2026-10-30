import React, { useState, useMemo } from "react";
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
  BadgeAlert,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { RoleItem, PermissionModule } from "../types/roles.types";
import { permissionModules } from "../data/initialRoles";

interface AddRoleViewProps {
  onBack: () => void;
  onSaveRole: (newRole: RoleItem) => void;
  initialRole?: RoleItem | null;
}

export function AddRoleView({ onBack, onSaveRole, initialRole }: AddRoleViewProps) {
  // Form fields
  const [roleName, setRoleName] = useState(initialRole?.name || "مستشار مراجعة الامتثال والتوثيق");
  const [roleSlug, setRoleSlug] = useState(initialRole?.slug || "compliance_audit_specialist");
  const [searchFilter, setSearchFilter] = useState("");

  // Permissions state
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(() => {
    if (initialRole?.permissions) {
      if (initialRole.permissions.includes("all")) {
        // Collect all permissions
        const allIds = permissionModules.flatMap((m) => m.permissions.map((p) => p.id));
        return new Set(allIds);
      }
      return new Set(initialRole.permissions);
    }
    // Default initial checked items matching Figma 1:12201 (23 permissions checked)
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
    return permissionModules.reduce((acc, m) => acc + m.permissions.length, 0);
  }, []);

  // Filter modules/permissions
  const filteredModules = useMemo(() => {
    if (!searchFilter.trim()) return permissionModules;
    const q = searchFilter.toLowerCase();
    return permissionModules
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
  }, [searchFilter]);

  // Toggle single permission
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

  // Select all permissions in a module
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

  // Check if sensitive permissions selected
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
      toast.error("يرجى إدخال اسم الدور الوظيفي");
      return;
    }
    if (!roleSlug.trim()) {
      toast.error("يرجى إدخال المعرف البرمجي (Slug)");
      return;
    }
    if (selectedPermissions.size === 0) {
      toast.error("يرجى تحديد صلاحية واحدة على الأقل");
      return;
    }

    const newRole: RoleItem = {
      id: initialRole?.id || `role-${Date.now()}`,
      name: roleName.trim(),
      slug: roleSlug.trim(),
      subtitle: `دور مخصص يحتوي على ${selectedPermissions.size} صلاحية تشغيلية`,
      description: `دور مخصص يحتوي على ${selectedPermissions.size} صلاحية تشغيلية`,
      permissionsCount: selectedPermissions.size,
      permissionsLabel: `${selectedPermissions.size} صلاحية مخصصة`,
      hasFullPermissionsBadge: selectedPermissions.size >= 50,
      assignedEmployeesCount: initialRole?.assignedEmployeesCount || 0,
      type: "custom",
      typeBadge: {
        label: isDraft ? "مسودة دور" : "دور مخصص",
        badgeClass: isDraft
          ? "bg-[#f5f3ef] text-[#837565]"
          : "bg-[#e8f5e9] text-[#1b7340]",
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
        ? `تم حفظ الدور "${newRole.name}" كمسودة بنجاح`
        : `تم اعتماد وتفعيل الدور "${newRole.name}" بنجاح في مصفوفة الصلاحيات!`
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

  return (
    <div className="space-y-6 pb-24" dir="rtl" data-node-id="1:12201">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#837565] hover:text-[#1b1c1a] transition-colors cursor-pointer"
      >
        <ArrowRight className="size-[15px]" />
        <span>العودة لقائمة الأدوار والصلاحيات</span>
      </button>

      {/* Main Identity & Command Banner (Figma 1:12204) */}
      <div
        className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        data-node-id="1:12204"
      >
        <div>
          <h1
            className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] leading-[38px]"
            data-node-id="1:12229"
          >
            {initialRole ? "تعديل الدور الوظيفي" : "إضافة دور جديد"}
          </h1>
          <p
            className="text-[14px] text-[#514537] mt-1"
            data-node-id="1:12227"
          >
            أنشئ دوراً وظيفياً مخصصاً وحدد صلاحيات الوصول إلى الموديولات المؤسسية بدقة.
          </p>
        </div>

        {/* Dynamic Indicators widget (Figma 1:12207) */}
        <div
          className="bg-[#fdfbf7] border border-[#e6e2dc] rounded-[8px] p-2 flex items-center gap-3 shrink-0"
          data-node-id="1:12207"
        >
          {/* Selected permissions indicator */}
          <div
            className="bg-white border border-[#e6e2dc] rounded-[6px] px-3 py-1.5 flex items-center gap-2 shadow-2xs"
            data-node-id="1:12214"
          >
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] text-[#837565]">الصلاحيات المحددة</span>
              <div className="text-[13px] font-bold text-[#1b1c1a] flex items-center gap-1">
                <span className="text-[#9c6402]">{selectedPermissions.size}</span>
                <span className="text-[11px] text-[#837565]">من أصل {totalPermissionsCount}</span>
              </div>
            </div>
            <div className="text-[#9c6402] shrink-0">
              <Key className="size-[15px]" />
            </div>
          </div>

          {/* Risk Level indicator */}
          <div className="px-2.5 py-1 text-right flex flex-col items-end" data-node-id="1:12208">
            <span className="text-[10px] text-[#837565]">مستوى المخاطر</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`size-[7px] rounded-full ${
                  hasSensitivePermissions ? "bg-[#d97706]" : "bg-[#1b7340]"
                }`}
              />
              <span
                className={`text-[11px] font-bold ${
                  hasSensitivePermissions ? "text-[#d97706]" : "text-[#1b7340]"
                }`}
              >
                {hasSensitivePermissions ? "صلاحيات موسعة" : "مضبوط أمنياً"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: البيانات الأساسية للدور (Figma 1:12230) */}
      <div
        className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] space-y-4"
        data-node-id="1:12230"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-[#f0eeea]">
          <div className="bg-[#fff8e1] size-[32px] rounded-[6px] flex items-center justify-center text-[#9c6402]">
            <UserCheck className="size-[16px]" />
          </div>
          <h2 className="text-[16px] font-bold text-[#1b1c1a]" data-node-id="1:12235">
            البيانات الأساسية للدور
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Role Name */}
          <div className="space-y-1.5 text-right" data-node-id="1:12239">
            <label className="block text-[13px] font-semibold text-[#1b1c1a]">
              اسم الدور الوظيفي <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="مثال: مسؤول العملاء، أخصائي مراجعة..."
                className="w-full h-[42px] pe-9 ps-3 text-[13px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#1b1c1a] placeholder:text-[#948b83] focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] transition-colors text-right"
              />
              <UserCheck className="size-[15px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#837565] pt-0.5">
              يظهر هذا الاسم في بطاقات الموظفين وتقارير التدقيق الإداري.
            </p>
          </div>

          {/* Role Slug */}
          <div className="space-y-1.5 text-right" data-node-id="1:12251">
            <label className="block text-[13px] font-semibold text-[#1b1c1a]">
              المعرّف البرمجي للنظام (Slug)<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={roleSlug}
                onChange={(e) => setRoleSlug(e.target.value)}
                placeholder="e.g. compliance_audit_specialist"
                className="w-full h-[42px] pe-9 ps-3 text-[13px] font-mono bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#1b1c1a] placeholder:text-[#948b83] focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] transition-colors text-right"
              />
              <Code className="size-[15px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#837565] pt-0.5">
              معرّف نظام فريد ومستقر يُستخدم برمجياً في محركات فحص الأذونات والسياسات، وليس اسم تسجيل دخول للموظف.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: مصفوفة صلاحيات النظام (Figma 1:12263) */}
      <div
        className="bg-white rounded-[8px] border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
        data-node-id="1:12263"
      >
        {/* Matrix Header & Filter */}
        <div className="p-6 border-b border-[#f0eeea] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="bg-[#fff8e1] size-[32px] rounded-[6px] flex items-center justify-center text-[#9c6402]">
                <Key className="size-[16px]" />
              </div>
              <h2 className="text-[18px] font-bold text-[#1b1c1a]">
                مصفوفة صلاحيات النظام
              </h2>
              <span className="bg-[#ffeed9] text-[#7b4e00] text-[11px] font-bold px-2.5 py-0.5 rounded-[4px]">
                11 موديول مفعل
              </span>
            </div>
            <p className="text-[12px] text-[#625d5d] mt-1">
              حدد الصلاحيات بدقة لكل موديول؛ لن يتم منح صلاحيات افتراضية دون تحديد صريح من المشرف العام.
            </p>
          </div>

          {/* Search filter in matrix */}
          <div className="relative min-w-[280px]" data-node-id="1:12265">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="تصفية الأقسام أو الصلاحيات..."
              className="w-full h-[36px] pe-9 ps-3 text-[12px] bg-[#f5f3ef] border border-[#d6cfc7]/60 rounded-[4px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] transition-colors text-right"
            />
            <Search className="size-[14px] text-[#837565] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#f0eeea] border-b border-[#e6e2dc] text-[#514537] text-[12px] font-bold">
                <th className="py-3 px-6 w-[340px]" data-node-id="1:12285">
                  الوحدة / الموديول المؤسسي
                </th>
                <th className="py-3 px-6" data-node-id="1:12287">
                  الصلاحيات المتاحة والأذونات التنفيذية
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0eeea]">
              {filteredModules.map((module) => {
                const allSelected = module.permissions.every((p) =>
                  selectedPermissions.has(p.id)
                );

                return (
                  <tr
                    key={module.id}
                    className="hover:bg-[#fbf9f6] transition-colors align-top"
                  >
                    {/* Left/Right col 1: Module Info */}
                    <td className="py-5 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="size-[30px] rounded-[6px] bg-[#f0eeea] flex items-center justify-center text-[#514537] shrink-0">
                            {getModuleIcon(module.iconType)}
                          </div>
                          <span className="text-[14px] font-bold text-[#1b1c1a]">
                            {module.name}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#625d5d] leading-[18px]">
                          {module.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleToggleModuleAll(module)}
                          className="text-[11px] font-bold text-[#9c6402] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="size-[12px]" />
                          <span>{allSelected ? "إلغاء تحديد الكل" : "تحديد الكل لهذا القسم"}</span>
                        </button>
                      </div>
                    </td>

                    {/* Col 2: Checkboxes for permissions */}
                    <td className="py-5 px-6">
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
                                    ? "bg-[#fff7ed] border-[#ea580c] text-[#9a3412] shadow-2xs"
                                    : "bg-[#fff8e1]/60 border-[#9c6402] text-[#1b1c1a] shadow-2xs"
                                  : perm.isSensitive
                                    ? "bg-white border-[#fecaca] text-[#b91c1c] hover:border-[#f87171]"
                                    : "bg-white border-[#e6e2dc] text-[#514537] hover:border-[#c5bcaf]"
                              }`}
                            >
                              {/* Custom styled checkbox indicator */}
                              <div
                                className={`size-[16px] rounded-[3px] flex items-center justify-center border transition-colors shrink-0 ${
                                  isChecked
                                    ? perm.isSensitive
                                      ? "bg-[#ea580c] border-[#ea580c] text-white"
                                      : "bg-[#9c6402] border-[#9c6402] text-white"
                                    : "border-[#d6cfc7] bg-white"
                                }`}
                              >
                                {isChecked && <Check className="size-[11px] stroke-[3]" />}
                              </div>

                              <span>{perm.label}</span>

                              {/* Sensitive tag */}
                              {perm.sensitivityBadge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] border ${
                                    perm.sensitivityBadge === "مقيد أمنياً"
                                      ? "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]"
                                      : "bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]"
                                  }`}
                                >
                                  {perm.sensitivityBadge}
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

      {/* FIXED BOTTOM STICKY BAR: Compliance & Actions (Figma 1:12201) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e6e2dc] shadow-[0px_-4px_10px_rgba(0,0,0,0.04)] py-3 px-6 md:px-12">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Security guarantee note on start */}
          <div className="flex items-center gap-2.5 text-right">
            <div className="size-[28px] rounded-full bg-[#f0eeea] flex items-center justify-center text-[#9c6402] shrink-0">
              <ShieldCheck className="size-[16px]" />
            </div>
            <div className="text-[11px] text-[#514537]">
              <div className="flex items-center gap-1.5 font-bold text-[#1b1c1a]">
                <span>ضمان الامتثال والرقابة الأمنية</span>
                <span className="bg-[#f0eeea] text-[#625d5d] text-[10px] font-mono px-1.5 py-0.2 rounded-[2px]">
                  SEC-ROLE-AUDIT-v2
                </span>
              </div>
              <p className="text-[#837565]">
                سيتم توثيق إنشاء هذا الدور في سجل التدقيق الأمني الجنائي فور الاعتماد.
              </p>
            </div>
          </div>

          {/* Action buttons on end */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-[#f0eeea] hover:bg-[#e6e2dc] text-[#514537] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-2 bg-white hover:bg-[#f5f3ef] text-[#514537] border border-[#d6cfc7] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              حفظ كمسودة
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2 bg-[#9c6402] hover:bg-[#855402] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="size-[15px]" />
              <span>حفظ وتفعيل الدور</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
