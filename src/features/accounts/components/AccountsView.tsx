"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  KeyRound,
  Download,
  Mail,
  Building2,
  X,
  Check,
  Lock,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { LuxurySelect, SelectOption } from "@/components/shared/LuxurySelect";
import { LuxuryCheckbox } from "@/components/shared/LuxuryCheckbox";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";

interface AdminAccount {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: "super_admin" | "sales" | "support" | "finance";
  roleNameAr: string;
  roleNameEn: string;
  scope: string;
  scopeEn: string;
  status: "active" | "suspended";
  lastLogin: string;
  avatarColor: string;
}

const initialAccounts: AdminAccount[] = [
  {
    id: "acc-1",
    name: "عبد الله المنصور",
    nameEn: "Abdallah Al-Mansoor",
    email: "a.mansoor@eljudy.com",
    role: "super_admin",
    roleNameAr: "مدير النظام",
    roleNameEn: "System Admin",
    scope: "يشوف ويعمل أي حاجة (صلاحية كاملة)",
    scopeEn: "Full Access (View & Manage Everything)",
    status: "active",
    lastLogin: "الآن (نشط)",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
  {
    id: "acc-2",
    name: "سارة عبد العزيز",
    nameEn: "Sara Abdulaziz",
    email: "s.abdulaziz@eljudy.com",
    role: "finance",
    roleNameAr: "المالية",
    roleNameEn: "Finance",
    scope: "الاشتراكات والفواتير وطرق الدفع",
    scopeEn: "Subscriptions, Invoices & Payment Methods",
    status: "active",
    lastLogin: "منذ 15 دقيقة",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
  {
    id: "acc-3",
    name: "م. طارق العتيبي",
    nameEn: "Eng. Tariq Al-Otaibi",
    email: "t.otaibi@eljudy.com",
    role: "support",
    roleNameAr: "الدعم الفني",
    roleNameEn: "Technical Support",
    scope: "التذاكر فقط",
    scopeEn: "Support Tickets Only",
    status: "active",
    lastLogin: "منذ ساعتين",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
  {
    id: "acc-4",
    name: "خالد السليمان",
    nameEn: "Khaled Al-Sulaiman",
    email: "k.sulaiman@eljudy.com",
    role: "sales",
    roleNameAr: "السيلز",
    roleNameEn: "Sales",
    scope: "متابعة التجارب المجانية والتواصل مع المكاتب",
    scopeEn: "Free Trials Follow-up & Firm Communications",
    status: "active",
    lastLogin: "منذ يوم واحد",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
  {
    id: "acc-5",
    name: "فهد بن ناصر",
    nameEn: "Fahad Bin Nasser",
    email: "f.nasser@eljudy.com",
    role: "support",
    roleNameAr: "الدعم الفني",
    roleNameEn: "Technical Support",
    scope: "التذاكر فقط",
    scopeEn: "Support Tickets Only",
    status: "suspended",
    lastLogin: "منذ 14 يوماً",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
  {
    id: "acc-6",
    name: "ريم الهذلي",
    nameEn: "Reem Al-Hothali",
    email: "r.hothali@eljudy.com",
    role: "finance",
    roleNameAr: "المالية",
    roleNameEn: "Finance",
    scope: "الاشتراكات والفواتير وطرق الدفع",
    scopeEn: "Subscriptions, Invoices & Payment Methods",
    status: "active",
    lastLogin: "منذ 3 ساعات",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
  {
    id: "acc-7",
    name: "عمر القحطاني",
    nameEn: "Omar Al-Qahtani",
    email: "o.qahtani@eljudy.com",
    role: "sales",
    roleNameAr: "السيلز",
    roleNameEn: "Sales",
    scope: "متابعة التجارب المجانية والتواصل مع المكاتب",
    scopeEn: "Free Trials Follow-up & Firm Communications",
    status: "active",
    lastLogin: "منذ 5 ساعات",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
  {
    id: "acc-8",
    name: "نورة الشهري",
    nameEn: "Noura Al-Shehri",
    email: "n.shehri@eljudy.com",
    role: "support",
    roleNameAr: "الدعم الفني",
    roleNameEn: "Technical Support",
    scope: "التذاكر فقط",
    scopeEn: "Support Tickets Only",
    status: "suspended",
    lastLogin: "منذ أسبوع",
    avatarColor: "from-[#d4a759] to-[#b38032]",
  },
];

// ID of the currently logged-in administrator session
export const CURRENT_LOGGED_IN_ADMIN_ID = "acc-1";
export const isCurrentUser = (id: string) => id === CURRENT_LOGGED_IN_ADMIN_ID;

export function AccountsView() {
  const language = useUIStore((state) => state.language);
  const isAr = language === "ar";

  const [accounts, setAccounts] = useState<AdminAccount[]>(initialAccounts);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [activeMenuAccount, setActiveMenuAccount] = useState<AdminAccount | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    placement: "down" | "up";
  } | null>(null);

  const toggleActionMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    acc: AdminAccount
  ) => {
    e.stopPropagation();
    if (activeMenuAccount?.id === acc.id) {
      setActiveMenuAccount(null);
      setMenuPosition(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const isCurrent = isCurrentUser(acc.id);
    const menuEstimatedHeight = isCurrent ? 85 : 130;
    const menuWidth = 224; // w-56
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Prefer opening downwards if there is enough space (menuEstimatedHeight + 16px)
    // Only open upwards if space below is too small AND space above has more room
    const openUp = spaceBelow < menuEstimatedHeight + 16 && spaceAbove > spaceBelow;

    // Calculate left coordinate in viewport (keeping menu completely on-screen)
    let left = rect.left;
    if (left + menuWidth > window.innerWidth - 16) {
      left = window.innerWidth - menuWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }

    setMenuPosition({
      top: openUp ? undefined : rect.bottom + 6,
      bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
      left,
      placement: openUp ? "up" : "down",
    });
    setActiveMenuAccount(acc);
  };

  // New account form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState("");
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [showNewAdminConfirmPassword, setShowNewAdminConfirmPassword] = useState(false);
  const [newRole, setNewRole] = useState<AdminAccount["role"]>("sales");
  const [newStatus, setNewStatus] = useState<AdminAccount["status"]>("active");

  // Edit account modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<AdminAccount["role"]>("sales");
  const [editStatus, setEditStatus] = useState<AdminAccount["status"]>("active");

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordTargetAccount, setPasswordTargetAccount] = useState<AdminAccount | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasActiveFilters = Boolean(
    search.trim() !== "" || roleFilter !== "all" || statusFilter !== "all"
  );

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
    toast.info(isAr ? "تمت إعادة ضبط وتفريغ كل الفلاتر" : "All filters reset");
  };

  // Close action menu on click outside, scroll, or resize
  useEffect(() => {
    if (!activeMenuAccount) return;

    function handleScrollOrResize() {
      setActiveMenuAccount(null);
      setMenuPosition(null);
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".action-menu-popover") && !target.closest(".action-menu-trigger")) {
        setActiveMenuAccount(null);
        setMenuPosition(null);
      }
    }

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuAccount]);

  // Confirmation Alert Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    variant: "danger" | "warning" | "success" | "info";
    itemDetails?: {
      name?: string;
      email?: string;
      count?: number;
    };
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    variant: "danger",
    onConfirm: () => {},
  });

  const requestBulkActivate = () => {
    const targetIds = selectedAccountIds.filter((id) => !isCurrentUser(id));
    const count = targetIds.length;
    if (count === 0) return;
    setConfirmDialog({
      isOpen: true,
      variant: "success",
      title: isAr ? "تأكيد تنشيط وتفعيل الحسابات" : "Confirm Activate Selected Accounts",
      description: isAr
        ? `هل أنت متأكد من رغبتك في تفعيل كافة الحسابات المحددة (${count})؟ سيتمكن المشرفون من تسجيل الدخول واستخدام صلاحياتهم فوراً.`
        : `Are you sure you want to activate all selected accounts (${count})?`,
      confirmLabel: isAr ? "تنشيط وتفعيل الكل" : "Activate All",
      itemDetails: { count },
      onConfirm: () => handleBulkActivate(),
    });
  };

  const requestBulkSuspend = () => {
    const targetIds = selectedAccountIds.filter((id) => !isCurrentUser(id));
    const count = targetIds.length;
    if (count === 0) {
      toast.error(
        isAr
          ? "لا توجد حسابات قابلة للتعليق (حسابك الحالي نشط ومحمي)"
          : "No suspendable accounts selected (current user is protected)"
      );
      return;
    }
    setConfirmDialog({
      isOpen: true,
      variant: "warning",
      title: isAr ? "تأكيد إلغاء تفعيل وتعليق الحسابات" : "Confirm Suspend Selected Accounts",
      description: isAr
        ? `هل أنت متأكد من رغبتك في تعليق كافة الحسابات المحددة (${count}) مؤقتاً؟ سيتوقف وصول المشرفين المحددين للوحة التحكم (حسابك الحالي محمي تلقائياً).`
        : `Are you sure you want to suspend and deactivate all selected accounts (${count})? (Your current account is protected)`,
      confirmLabel: isAr ? "إلغاء التفعيل والتعليق" : "Deactivate All",
      itemDetails: { count },
      onConfirm: () => handleBulkSuspend(),
    });
  };

  const requestBulkDelete = () => {
    const targetIds = selectedAccountIds.filter((id) => !isCurrentUser(id));
    const count = targetIds.length;
    if (count === 0) {
      toast.error(
        isAr
          ? "لا توجد حسابات قابلة للحذف (حسابك الحالي محمي من الحذف تماماً)"
          : "No deletable accounts selected (current account is protected)"
      );
      return;
    }
    setConfirmDialog({
      isOpen: true,
      variant: "danger",
      title: isAr ? "تأكيد مسح وحذف الحسابات المحددة" : "Confirm Delete Selected Accounts",
      description: isAr
        ? `هل أنت متأكد من مسح وحذف كافة الحسابات المحددة (${count}) نهائياً؟ هذا الإجراء لا يمكن التراجع عنه أبداً (حسابك الحالي محمي تلقائياً من الحذف).`
        : `Are you sure you want to permanently delete all selected accounts (${count})? (Your current account is protected)`,
      confirmLabel: isAr ? "نعم، مسح وحذف الكل" : "Yes, Delete All",
      itemDetails: { count },
      onConfirm: () => handleBulkDelete(),
    });
  };

  const requestDeleteAccount = (id: string, name: string, email: string) => {
    setActiveMenuAccount(null);
    setMenuPosition(null);
    if (isCurrentUser(id)) {
      toast.error(
        isAr
          ? "لا يمكن حذف الحساب المسجل به حالياً منعاً لفقدان السيطرة على لوحة التحكم!"
          : "Cannot delete the currently authenticated account!"
      );
      return;
    }
    setConfirmDialog({
      isOpen: true,
      variant: "danger",
      title: isAr ? "تأكيد حذف حساب المشرف" : "Confirm Delete Admin Account",
      description: isAr
        ? `هل أنت متأكد من رغبتك في حذف حساب "${name}" نهائياً من النظام؟ لا يمكن التراجع عن هذا الإجراء.`
        : `Are you sure you want to permanently delete the account of "${name}"?`,
      confirmLabel: isAr ? "نعم، حذف الحساب" : "Yes, Delete Account",
      itemDetails: { name, email },
      onConfirm: () => handleDeleteAccount(id, name),
    });
  };

  const requestToggleStatus = (acc: AdminAccount) => {
    setActiveMenuAccount(null);
    setMenuPosition(null);
    if (isCurrentUser(acc.id)) {
      toast.error(
        isAr
          ? "حسابك الحالي نشط ومحمي من التعليق أو تغيير حالته منعاً لقفل الوصول للنظام"
          : "Your active account is protected from suspension"
      );
      return;
    }
    const isCurrentlyActive = acc.status === "active";
    const name = isAr ? acc.name : acc.nameEn;

    if (isCurrentlyActive) {
      setConfirmDialog({
        isOpen: true,
        variant: "warning",
        title: isAr ? "تأكيد تعليق الحساب مؤقتاً" : "Confirm Suspend Account",
        description: isAr
          ? `هل أنت متأكد من رغبتك في تعليق حساب المشرف "${name}"؟ سيتعذر عليه تسجيل الدخول حتى يُعاد تفعيله.`
          : `Are you sure you want to suspend the account for "${name}"?`,
        confirmLabel: isAr ? "تعليق الحساب" : "Suspend Account",
        itemDetails: { name, email: acc.email },
        onConfirm: () => handleToggleStatus(acc.id),
      });
    } else {
      setConfirmDialog({
        isOpen: true,
        variant: "success",
        title: isAr ? "تأكيد تنشيط وتفعيل الحساب" : "Confirm Activate Account",
        description: isAr
          ? `هل أنت متأكد من رغبتك في تنشيط وتفعيل حساب المشرف "${name}"؟ سيتمكن من تسجيل الدخول فوراً.`
          : `Are you sure you want to activate the account for "${name}"?`,
        confirmLabel: isAr ? "تنشيط الحساب" : "Activate Account",
        itemDetails: { name, email: acc.email },
        onConfirm: () => handleToggleStatus(acc.id),
      });
    }
  };

  const handleBulkActivate = () => {
    const targetIds = selectedAccountIds.filter((id) => !isCurrentUser(id));
    const count = targetIds.length;
    if (count === 0) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        targetIds.includes(acc.id) ? { ...acc, status: "active" } : acc
      )
    );
    toast.success(
      isAr
        ? `تم تفعيل ${count} حساب بنجاح`
        : `Activated ${count} accounts`
    );
    setSelectedAccountIds([]);
  };

  const handleBulkSuspend = () => {
    const targetIds = selectedAccountIds.filter((id) => !isCurrentUser(id));
    const count = targetIds.length;
    if (count === 0) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        targetIds.includes(acc.id) && !isCurrentUser(acc.id)
          ? { ...acc, status: "suspended" }
          : acc
      )
    );
    toast.success(
      isAr
        ? `تم إلغاء تفعيل وتعليق ${count} حساب بنجاح (حسابك الحالي محمي)`
        : `Deactivated ${count} accounts (current user protected)`
    );
    setSelectedAccountIds([]);
  };

  const handleBulkDelete = () => {
    const targetIds = selectedAccountIds.filter((id) => !isCurrentUser(id));
    const count = targetIds.length;
    if (count === 0) return;
    setAccounts((prev) =>
      prev.filter((acc) => !targetIds.includes(acc.id) || isCurrentUser(acc.id))
    );
    toast.success(
      isAr
        ? `تم مسح وحذف ${count} من حسابات المشرفين المحددة بنجاح (حسابك الحالي محمي تلقائياً)`
        : `Deleted ${count} selected accounts successfully (current user protected)`
    );
    setSelectedAccountIds([]);
  };

  const handleDeleteAccount = (id: string, name: string) => {
    if (isCurrentUser(id)) {
      toast.error(
        isAr
          ? "إجراء محظور: لا يمكن حذف الحساب الحالي المسجل به!"
          : "Action forbidden: cannot delete currently logged-in account!"
      );
      return;
    }
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setSelectedAccountIds((prev) => prev.filter((item) => item !== id));
    setActiveMenuAccount(null);
    setMenuPosition(null);
    toast.success(
      isAr
        ? `تم حذف حساب المشرف "${name}" بنجاح`
        : `Admin account "${name}" deleted`
    );
  };

  const handleToggleStatus = (id: string) => {
    if (isCurrentUser(id)) {
      toast.error(
        isAr
          ? "حسابك الحالي نشط ومحمي من التعليق"
          : "Your current account is protected"
      );
      return;
    }
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const nextStatus = acc.status === "active" ? "suspended" : "active";
          toast.success(
            nextStatus === "active"
              ? isAr
                ? `تم تنشيط حساب ${acc.name}`
                : `Activated account for ${acc.nameEn}`
              : isAr
              ? `تم تعليق حساب ${acc.name}`
              : `Suspended account for ${acc.nameEn}`
          );
          return { ...acc, status: nextStatus };
        }
        return acc;
      })
    );
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.error(
        isAr ? "يرجى إدخال اسم المشرف والبريد الإلكتروني" : "Please fill in all required fields"
      );
      return;
    }

    if (!newAdminPassword || newAdminPassword.length < 6) {
      toast.error(
        isAr
          ? "يجب ألا تقل كلمة المرور عن 6 خانات"
          : "Password must be at least 6 characters"
      );
      return;
    }

    if (newAdminPassword !== newAdminConfirmPassword) {
      toast.error(
        isAr
          ? "كلمتا المرور غير متطابقتين، يرجى إعادة التحقق"
          : "Passwords do not match"
      );
      return;
    }

    const roleConfigMap: Record<
      AdminAccount["role"],
      { ar: string; en: string; scopeAr: string; scopeEn: string }
    > = {
      super_admin: {
        ar: "مدير النظام",
        en: "System Admin",
        scopeAr: "يشوف ويعمل أي حاجة (صلاحية كاملة)",
        scopeEn: "Full Access (View & Manage Everything)",
      },
      sales: {
        ar: "السيلز",
        en: "Sales",
        scopeAr: "متابعة التجارب المجانية والتواصل مع المكاتب",
        scopeEn: "Free Trials Follow-up & Firm Communications",
      },
      support: {
        ar: "الدعم الفني",
        en: "Technical Support",
        scopeAr: "التذاكر فقط",
        scopeEn: "Support Tickets Only",
      },
      finance: {
        ar: "المالية",
        en: "Finance",
        scopeAr: "الاشتراكات والفواتير وطرق الدفع",
        scopeEn: "Subscriptions, Invoices & Payment Methods",
      },
    };

    const newAcc: AdminAccount = {
      id: `acc-${Date.now()}`,
      name: newName.trim(),
      nameEn: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      roleNameAr: roleConfigMap[newRole].ar,
      roleNameEn: roleConfigMap[newRole].en,
      scope: roleConfigMap[newRole].scopeAr,
      scopeEn: roleConfigMap[newRole].scopeEn,
      status: newStatus,
      lastLogin: isAr ? "تم الإنشاء للتو" : "Just created",
      avatarColor: "from-[#d4a759] to-[#b38032]",
    };

    setAccounts([newAcc, ...accounts]);
    toast.success(
      isAr
        ? `تم إنشاء حساب المشرف "${newName}" بنجاح (${newStatus === "active" ? "نشط" : "معلق"})`
        : `Admin account "${newName}" created successfully (${newStatus})`
    );
    setIsAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewAdminPassword("");
    setNewAdminConfirmPassword("");
    setShowNewAdminPassword(false);
    setShowNewAdminConfirmPassword(false);
    setNewRole("sales");
    setNewStatus("active");
  };

  // Filtered accounts
  const filtered = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase()) ||
      acc.roleNameAr.includes(search);
    const matchesRole = roleFilter === "all" || acc.role === roleFilter;
    const matchesStatus = statusFilter === "all" || acc.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (activePage - 1) * pageSize;
  const paginatedAccounts = filtered.slice(startIndex, startIndex + pageSize);
  const fromIndex = totalFiltered === 0 ? 0 : startIndex + 1;
  const toIndex = Math.min(startIndex + pageSize, totalFiltered);

  // Only accounts other than the currently logged-in account are selectable for bulk actions
  const selectableAccounts = paginatedAccounts.filter(
    (acc) => !isCurrentUser(acc.id)
  );

  const isAllSelected =
    selectableAccounts.length > 0 &&
    selectableAccounts.every((acc) => selectedAccountIds.includes(acc.id));

  const isIndeterminate =
    !isAllSelected &&
    selectableAccounts.some((acc) => selectedAccountIds.includes(acc.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const pageSelectableIds = new Set(selectableAccounts.map((a) => a.id));
      setSelectedAccountIds((prev) => prev.filter((id) => !pageSelectableIds.has(id)));
    } else {
      const newIds = new Set([
        ...selectedAccountIds,
        ...selectableAccounts.map((a) => a.id),
      ]);
      setSelectedAccountIds(Array.from(newIds));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (isCurrentUser(id)) {
      toast.info(
        isAr
          ? "حسابك الحالي محمي تلقائياً من التحديد أو الحذف"
          : "Current account is protected from selection and deletion"
      );
      return;
    }
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalCount = accounts.length;
  const activeCount = accounts.filter((a) => a.status === "active").length;
  const suspendedCount = accounts.filter((a) => a.status === "suspended").length;
  const superCount = accounts.filter((a) => a.role === "super_admin").length;

  const roleConfigMap: Record<
    AdminAccount["role"],
    { ar: string; en: string; scopeAr: string; scopeEn: string }
  > = {
    super_admin: {
      ar: "مدير النظام",
      en: "System Admin",
      scopeAr: "يشوف ويعمل أي حاجة (صلاحية كاملة)",
      scopeEn: "Full Access (View & Manage Everything)",
    },
    sales: {
      ar: "السيلز",
      en: "Sales",
      scopeAr: "متابعة التجارب المجانية والتواصل مع المكاتب",
      scopeEn: "Free Trials Follow-up & Firm Communications",
    },
    support: {
      ar: "الدعم الفني",
      en: "Technical Support",
      scopeAr: "التذاكر فقط",
      scopeEn: "Support Tickets Only",
    },
    finance: {
      ar: "المالية",
      en: "Finance",
      scopeAr: "الاشتراكات والفواتير وطرق الدفع",
      scopeEn: "Subscriptions, Invoices & Payment Methods",
    },
  };

  // Combobox Options
  const roleOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل الرتب والأدوار" : "All Roles" },
    { value: "super_admin", label: isAr ? "مدير النظام" : "System Admin" },
    { value: "sales", label: isAr ? "السيلز" : "Sales" },
    { value: "support", label: isAr ? "الدعم الفني" : "Technical Support" },
    { value: "finance", label: isAr ? "المالية" : "Finance" },
  ];

  const statusOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل الحالات" : "All Status" },
    { value: "active", label: isAr ? "الحسابات النشطة" : "Active" },
    { value: "suspended", label: isAr ? "الحسابات المعلقة" : "Suspended" },
  ];

  const pageSizeOptions: SelectOption<number>[] = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
  ];

  const newRoleOptions: SelectOption<AdminAccount["role"]>[] = [
    {
      value: "super_admin",
      label: isAr
        ? "مدير النظام (يشوف ويعمل أي حاجة)"
        : "System Admin (Full Access)",
    },
    {
      value: "sales",
      label: isAr
        ? "السيلز (متابعة التجارب والتواصل مع المكاتب)"
        : "Sales (Free Trials & Firm Outreach)",
    },
    {
      value: "support",
      label: isAr
        ? "الدعم الفني (التذاكر فقط)"
        : "Technical Support (Tickets Only)",
    },
    {
      value: "finance",
      label: isAr
        ? "المالية (الاشتراكات والفواتير وطرق الدفع)"
        : "Finance (Billing, Invoices & Payment)",
    },
  ];

  const adminStatusSelectOptions: SelectOption<AdminAccount["status"]>[] = [
    { value: "active", label: isAr ? "نشط (حساب مفعل)" : "Active" },
    { value: "suspended", label: isAr ? "معلق (موقوف مؤقتاً)" : "Suspended" },
  ];

  const openEditModal = (acc: AdminAccount) => {
    setActiveMenuAccount(null);
    setMenuPosition(null);
    setEditingAccount(acc);
    setEditName(isAr ? acc.name : acc.nameEn);
    setEditEmail(acc.email);
    setEditRole(acc.role);
    setEditStatus(acc.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    const roleConfig = roleConfigMap[editRole];
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === editingAccount.id
          ? {
              ...acc,
              name: editName.trim(),
              nameEn: editName.trim(),
              email: editEmail.trim(),
              role: editRole,
              roleNameAr: roleConfig.ar,
              roleNameEn: roleConfig.en,
              scope: roleConfig.scopeAr,
              scopeEn: roleConfig.scopeEn,
              status: isCurrentUser(acc.id) ? "active" : editStatus,
            }
          : acc
      )
    );
    setIsEditModalOpen(false);
    setEditingAccount(null);
    toast.success(
      isAr
        ? `تم تحديث بيانات المشرف "${editName}" بنجاح`
        : `Admin account "${editName}" updated successfully`
    );
  };

  const openPasswordModal = (acc: AdminAccount) => {
    setActiveMenuAccount(null);
    setMenuPosition(null);
    setPasswordTargetAccount(acc);
    setNewPasswordVal("");
    setConfirmPasswordVal("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetAccount) return;
    if (!newPasswordVal || newPasswordVal.length < 6) {
      toast.error(
        isAr
          ? "يجب أن تتكون كلمة المرور من 6 خانات على الأقل"
          : "Password must be at least 6 characters"
      );
      return;
    }
    if (newPasswordVal !== confirmPasswordVal) {
      toast.error(
        isAr
          ? "كلمتا المرور غير متطابقتين، يرجى التحقق وإعادة المحاولة"
          : "Passwords do not match"
      );
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordTargetAccount(null);
    toast.success(
      isAr
        ? `تم تغيير وتحديث الرقم السري لحساب "${passwordTargetAccount.name}" بنجاح`
        : `Password updated successfully for "${passwordTargetAccount.name}"`
    );
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      {/* 1. Main Navigation Sidebar */}
      <DashboardSidebar />

      {/* 2. Main Application Body Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopNavbar />

        {/* Workspace */}
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

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#eeddbb]/70 dark:border-[#383126] bg-gradient-to-br from-[#ffffff] via-[#fbf8f2] to-[#f4ece0] dark:from-[#1e1b18] dark:via-[#191715] dark:to-[#141210] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c29547]/10 dark:bg-[#c29547]/20 text-[#966e2e] dark:text-[#eeddbb] border border-[#c29547]/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {isAr
                        ? "إدارة الحسابات والتحكم في الوصول • Super Admin"
                        : "Account Management & Access Control"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917] dark:text-[#f5f4f0]">
                    {isAr ? "إدارة حسابات المشرفين (Accounts)" : "Administrator Accounts"}
                  </h1>

                  <p className="text-sm sm:text-base text-[#6b6357] dark:text-[#a8a196] max-w-2xl leading-relaxed">
                    {isAr
                      ? "التحكم الكامل في حسابات مدراء المنظومة، وتعيين الأدوار الوظيفية، ومتابعة آخر تسجيل دخول، وتفعيل أو تعليق الحسابات."
                      : "Manage system administrators, assign roles, inspect activity logs, and activate or suspend accounts securely."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(
                        isAr
                          ? "تم تصدير سجل حسابات المشرفين بنجاح بصيغة CSV"
                          : "Exported admin accounts report as CSV"
                      );
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1c1917] dark:text-[#f5f4f0] bg-white dark:bg-[#25221d] border border-[#e2d5c0] dark:border-[#3d372e] shadow-sm hover:border-[#c29547] hover:text-[#c29547] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#c29547]" />
                    <span>{isAr ? "تصدير التقرير" : "Export"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#c29547] via-[#b38538] to-[#996c25] hover:opacity-95 shadow-md shadow-[#c29547]/20 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isAr ? "إضافة مشرف جديد" : "Add Admin Account"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196]">
                    {isAr ? "إجمالي الحسابات" : "Total Accounts"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf5eb] dark:bg-[#282218] flex items-center justify-center text-[#c29547]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1c1917] dark:text-[#f5f4f0]">
                  {totalCount}
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr ? "حسابات مسجلة بالمنظومة" : "Registered administrators"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196]">
                    {isAr ? "الحسابات النشطة" : "Active Accounts"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf5eb] dark:bg-[#282218] flex items-center justify-center text-[#c29547]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1c1917] dark:text-[#f5f4f0]">
                  {activeCount}
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr ? "جاهزة للعمل وتملك حق الوصول" : "Operational & active"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196]">
                    {isAr ? "مدراء النظام (صلاحية كاملة)" : "System Admins"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf5eb] dark:bg-[#282218] flex items-center justify-center text-[#c29547]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1c1917] dark:text-[#f5f4f0]">
                  {superCount}
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr ? "يشوف ويعمل أي حاجة بالمنظومة" : "Full master authority"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196]">
                    {isAr ? "الحسابات المعلقة" : "Suspended"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf5eb] dark:bg-[#282218] flex items-center justify-center text-[#c29547]">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1c1917] dark:text-[#f5f4f0]">
                  {suspendedCount}
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr ? "تم إيقاف صلاحيات الدخول مؤقتاً" : "Access temporarily blocked"}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#8c8279]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={
                    isAr
                      ? "ابحث بالاسم، البريد، أو الدور..."
                      : "Search by name, email, or role..."
                  }
                  className="w-full h-10.5 ps-10 pe-9 rounded-xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-medium text-[#1c1917] dark:text-[#f5f4f0] focus:outline-none focus:border-[#c29547]"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    title={isAr ? "مسح البحث" : "Clear search"}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8c8279] hover:text-[#1c1917] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <LuxurySelect
                  value={roleFilter}
                  onChange={(val) => {
                    setRoleFilter(val);
                    setCurrentPage(1);
                  }}
                  options={roleOptions}
                  minWidth="min-w-[170px]"
                />

                <LuxurySelect
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                  options={statusOptions}
                  minWidth="min-w-[150px]"
                />

                <button
                  type="button"
                  onClick={handleResetFilters}
                  title={isAr ? "إعادة ضبط وتفريغ كل الفلاتر" : "Reset all filters"}
                  className={`h-10.5 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    hasActiveFilters
                      ? "bg-[#faf5eb] dark:bg-[#282218] border-[#eeddbb] dark:border-[#4d3a1f] text-[#966e2e] dark:text-[#eeddbb] hover:border-[#c29547] shadow-2xs"
                      : "bg-[#faf8f4] dark:bg-[#201d1a] border-[#ded5c6] dark:border-[#2f2a24] text-[#7c7366] dark:text-[#a8a196] hover:border-[#c29547] hover:text-[#c29547]"
                  }`}
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${hasActiveFilters ? "text-[#c29547]" : "text-[#8c8279]"}`} />
                  <span>{isAr ? "إعادة ضبط" : "Reset Filters"}</span>
                </button>
              </div>
            </div>

            {/* Bulk Actions Notification Bar */}
            {selectedAccountIds.length > 0 && (
              <div className="p-3.5 px-4 rounded-2xl border border-[#c29547]/40 bg-[#faf5eb] dark:bg-[#201c17] flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#966e2e] dark:text-[#eeddbb]">
                  <span className="w-6 h-6 rounded-lg bg-[#c29547] text-white flex items-center justify-center text-xs shadow-2xs font-mono">
                    {selectedAccountIds.length}
                  </span>
                  <span>
                    {isAr
                      ? `تم تحديد ${selectedAccountIds.length} من حسابات المشرفين`
                      : `${selectedAccountIds.length} accounts selected`}
                  </span>
                  {selectedAccountIds.length <
                    filtered.filter((a) => !isCurrentUser(a.id)).length && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAccountIds(
                          filtered
                            .filter((a) => !isCurrentUser(a.id))
                            .map((a) => a.id)
                        )
                      }
                      className="text-xs text-[#c29547] hover:text-[#966e2e] underline cursor-pointer font-bold"
                    >
                      {isAr
                        ? `(تحديد كافة الـ ${
                            filtered.filter((a) => !isCurrentUser(a.id)).length
                          } حساب المتاحة)`
                        : `(Select all ${
                            filtered.filter((a) => !isCurrentUser(a.id)).length
                          } available)`}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* زر التفعيل */}
                  <button
                    type="button"
                    onClick={requestBulkActivate}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{isAr ? "تفعيل" : "Activate"}</span>
                  </button>

                  {/* زر التعليق */}
                  <button
                    type="button"
                    onClick={requestBulkSuspend}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>{isAr ? "تعليق" : "Suspend"}</span>
                  </button>

                  {/* زر الحذف */}
                  <button
                    type="button"
                    onClick={requestBulkDelete}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white border border-rose-700 hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? "حذف" : "Delete"}</span>
                  </button>

                  {/* زر إلغاء التحديد */}
                  <button
                    type="button"
                    onClick={() => setSelectedAccountIds([])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#7c7366] dark:text-[#a8a196] hover:bg-white dark:hover:bg-[#282218] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isAr ? "إلغاء" : "Deselect"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Accounts Data Table */}
            <div className="rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#ded5c6] dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] text-[#7c7366] dark:text-[#a8a196]">
                      <th className="py-3.5 px-4 w-11 text-center">
                        <div className="flex items-center justify-center">
                          <LuxuryCheckbox
                            checked={isAllSelected}
                            indeterminate={isIndeterminate}
                            onChange={handleSelectAll}
                            title={
                              isAr
                                ? "تحديد كل الحسابات في الصفحة (يستثني حسابك الحالي تلقائياً)"
                                : "Select all accounts on page (excludes your current account)"
                            }
                          />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "المشرف" : "Administrator"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "الرتبة والدور" : "Role"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "نطاق الصلاحيات المسندة" : "Access Scope"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "الحالة" : "Status"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "آخر تسجيل دخول" : "Last Login"}
                      </th>
                      <th className="py-3.5 px-4 text-center font-bold">
                        {isAr ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ded5c6]/60 dark:divide-[#2f2a24]/60">
                    {paginatedAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#8c8279]">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="w-8 h-8 text-[#c29547]/50" />
                            <p className="font-bold text-sm text-[#2c2825] dark:text-[#eeddbb]">
                              {isAr ? "لم يتم العثور على أي حسابات" : "No administrator accounts found"}
                            </p>
                            <p className="text-xs">
                              {isAr
                                ? "جرّب تغيير عبارة البحث أو إعادة ضبط الفلاتر المحددة"
                                : "Try adjusting search terms or resetting active filters"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedAccounts.map((acc) => {
                        const isCurrent = isCurrentUser(acc.id);
                        return (
                          <tr
                            key={acc.id}
                            className={`transition-colors ${
                              isCurrent
                                ? "bg-[#faf5eb]/50 dark:bg-[#201c16]/50 border-s-2 border-s-[#c29547]"
                                : selectedAccountIds.includes(acc.id)
                                ? "bg-[#faf5eb]/90 dark:bg-[#282218]/50"
                                : "hover:bg-[#faf5eb]/40 dark:hover:bg-[#201d1a]/40"
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-4 w-11 text-center">
                              <div
                                className="flex items-center justify-center"
                                title={
                                  isCurrent
                                    ? isAr
                                      ? "الحساب الحالي غير قابل للتحديد المجمع"
                                      : "Current account cannot be bulk-selected"
                                    : undefined
                                }
                              >
                                <LuxuryCheckbox
                                  checked={!isCurrent && selectedAccountIds.includes(acc.id)}
                                  disabled={isCurrent}
                                  onChange={() => handleToggleSelect(acc.id)}
                                  title={
                                    isCurrent
                                      ? isAr
                                        ? "الحساب الحالي غير قابل للتحديد المجمع"
                                        : "Current account cannot be bulk-selected"
                                      : isAr
                                      ? `تحديد حساب ${acc.name}`
                                      : `Select ${acc.nameEn}`
                                  }
                                />
                              </div>
                            </td>
                            {/* Admin Name & Avatar */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                  <div
                                    className={`w-9 h-9 rounded-full bg-gradient-to-tr ${acc.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                                  >
                                    {acc.name.charAt(0)}
                                  </div>
                                  {isCurrent && (
                                    <span
                                      title={isAr ? "متصل الآن (جلستك الحالية)" : "Online now (Your session)"}
                                      className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1a1714]"
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#1c1917] dark:text-[#f5f4f0]">
                                      {isAr ? acc.name : acc.nameEn}
                                    </span>
                                    {isCurrent && (
                                      <span
                                        title={
                                          isAr
                                            ? "هذا هو الحساب المسجل به حالياً في لوحة التحكم"
                                            : "This is your currently active session account"
                                        }
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c29547]/15 dark:bg-[#c29547]/25 text-[#966e2e] dark:text-[#eeddbb] border border-[#c29547]/30 shadow-2xs shrink-0 select-none"
                                      >
                                        <ShieldCheck className="w-3 h-3 text-[#c29547]" />
                                        <span>{isAr ? "أنت (الحساب الحالي)" : "You (Current)"}</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#8c8279] flex items-center gap-1 font-mono">
                                    <Mail className="w-3 h-3 text-[#c29547]" />
                                    <span>{acc.email}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role Badge - Unified to the first user's luxury gold aesthetic */}
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#c29547]/15 text-[#966e2e] dark:text-[#eeddbb] border border-[#c29547]/30 shadow-2xs">
                                <ShieldCheck className="w-3 h-3 text-[#c29547] shrink-0" />
                                <span>{isAr ? acc.roleNameAr : acc.roleNameEn}</span>
                              </span>
                            </td>

                            {/* Scope */}
                            <td className="py-4 px-4 text-[#524b43] dark:text-[#c4bcb1]">
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#8c8279] shrink-0" />
                                <span>{isAr ? acc.scope : acc.scopeEn}</span>
                              </div>
                            </td>

                            {/* Status Switch (Green for active, Red for suspended) */}
                            <td className="py-4 px-4">
                              {isCurrent ? (
                                <span
                                  title={isAr ? "نشط" : "Active"}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/60 shadow-2xs select-none cursor-default"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>{isAr ? "نشط" : "Active"}</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => requestToggleStatus(acc)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all border ${
                                    acc.status === "active"
                                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 shadow-2xs"
                                      : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300/80 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 shadow-2xs"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      acc.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                                    }`}
                                  />
                                  <span>
                                    {acc.status === "active"
                                      ? isAr
                                        ? "نشط"
                                        : "Active"
                                      : isAr
                                      ? "معلق"
                                      : "Suspended"}
                                  </span>
                                </button>
                              )}
                            </td>

                            {/* Last Login */}
                            <td className="py-4 px-4 font-mono text-[11px] text-[#7c7366] dark:text-[#a8a196]">
                              {acc.lastLogin}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openPasswordModal(acc)}
                                  title={isAr ? "تغيير الرقم السري" : "Change Password"}
                                  className="p-1.5 rounded-lg text-[#8c8279] hover:text-[#c29547] hover:bg-[#faf5eb] dark:hover:bg-[#201d1a] transition-colors cursor-pointer"
                                >
                                  <KeyRound className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => toggleActionMenu(e, acc)}
                                  title={isAr ? "خيارات الحساب" : "Account options"}
                                  className={`action-menu-trigger p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    activeMenuAccount?.id === acc.id
                                      ? "bg-[#faf5eb] dark:bg-[#282218] text-[#c29547]"
                                      : "text-[#8c8279] hover:text-[#1c1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                                  }`}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="p-4 border-t border-[#ded5c6] dark:border-[#2f2a24] bg-[#faf8f4]/60 dark:bg-[#1a1714] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                {/* Left: Rows per page & range summary */}
                <div className="flex flex-wrap items-center gap-4 text-[#7c7366] dark:text-[#a8a196]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{isAr ? "صفوف لكل صفحة:" : "Rows per page:"}</span>
                    <LuxurySelect<number>
                      value={pageSize}
                      onChange={(val) => {
                        setPageSize(val);
                        setCurrentPage(1);
                      }}
                      options={pageSizeOptions}
                      placement="top"
                      compact={true}
                      minWidth="min-w-[70px]"
                      className="w-18"
                    />
                  </div>
                  <span className="text-[#ded5c6] dark:text-[#2f2a24] hidden sm:inline">|</span>
                  <span className="font-medium">
                    {isAr
                      ? `عرض ${fromIndex} إلى ${toIndex} من أصل ${totalFiltered} حساب`
                      : `Showing ${fromIndex} to ${toIndex} of ${totalFiltered} accounts`}
                  </span>
                </div>

                {/* Right: Page navigation controls in LTR order (1, 2, 3) */}
                <div dir="ltr" className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={activePage === 1}
                    title={isAr ? "الصفحة الأولى" : "First page"}
                    className="w-8 h-8 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#201d1a] text-[#524b43] dark:text-[#c4bcb1] hover:border-[#c29547] hover:text-[#c29547] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={activePage === 1}
                    title={isAr ? "الصفحة السابقة" : "Previous page"}
                    className="w-8 h-8 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#201d1a] text-[#524b43] dark:text-[#c4bcb1] hover:border-[#c29547] hover:text-[#c29547] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers (LTR 1, 2, 3...) */}
                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-8 h-8 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          pageNum === activePage
                            ? "bg-gradient-to-r from-[#d4a759] to-[#b38032] text-white shadow-2xs"
                            : "border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#201d1a] text-[#524b43] dark:text-[#c4bcb1] hover:border-[#c29547] hover:text-[#c29547]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={activePage === totalPages}
                    title={isAr ? "الصفحة التالية" : "Next page"}
                    className="w-8 h-8 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#201d1a] text-[#524b43] dark:text-[#c4bcb1] hover:border-[#c29547] hover:text-[#c29547] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={activePage === totalPages}
                    title={isAr ? "الصفحة الأخيرة" : "Last page"}
                    className="w-8 h-8 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#201d1a] text-[#524b43] dark:text-[#c4bcb1] hover:border-[#c29547] hover:text-[#c29547] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add New Admin Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-start">
            <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "إضافة حساب مشرف جديد" : "Create New Admin Account"}
                  </h2>
                  <p className="text-xs text-[#8c8279] dark:text-[#9e968a]">
                    {isAr
                      ? "تعيين بيانات الدخول وكلمة المرور والدور الإداري وحالة الحساب"
                      : "Set credentials, passwords, role, and initial account status"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 pt-7 space-y-5">
              {/* 1. Name Floating Input (اسم) */}
              <div className="relative">
                <input
                  id="modal-admin-name"
                  type="text"
                  required
                  placeholder=" "
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-4 text-xs font-bold bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-admin-name"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "اسم المشرف بالكامل" : "Full Name"}
                </label>
              </div>

              {/* 2. Email Floating Input (بريد) */}
              <div className="relative">
                <input
                  id="modal-admin-email"
                  type="email"
                  required
                  placeholder=" "
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-4 text-xs font-mono font-medium bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-admin-email"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "البريد الإلكتروني الرسمي" : "Official Email"}
                </label>
              </div>

              {/* 3. Password Floating Input (password) */}
              <div className="relative flex items-center">
                <input
                  id="modal-admin-password"
                  type={showNewAdminPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-11 text-xs font-mono font-medium bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-admin-password"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "كلمة المرور (Password)" : "Password"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                  className="absolute end-3.5 p-1 text-[#8c8279] hover:text-[#c29547] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewAdminPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 4. Confirm Password Floating Input (repasssword) */}
              <div className="relative flex items-center">
                <input
                  id="modal-admin-confirm-password"
                  type={showNewAdminConfirmPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  value={newAdminConfirmPassword}
                  onChange={(e) => setNewAdminConfirmPassword(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-11 text-xs font-mono font-medium bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-admin-confirm-password"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "تأكيد كلمة المرور (Re-password)" : "Confirm Password"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewAdminConfirmPassword(!showNewAdminConfirmPassword)}
                  className="absolute end-3.5 p-1 text-[#8c8279] hover:text-[#c29547] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewAdminConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 5. Role Floating Select (دور) */}
              <div className="relative">
                <LuxurySelect<AdminAccount["role"]>
                  value={newRole}
                  onChange={(val) => setNewRole(val)}
                  options={newRoleOptions}
                  className="w-full"
                  minWidth="w-full"
                />
                <label className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] z-10 transition-colors">
                  {isAr ? "الدور / الرتبة الإدارية (Role)" : "Administrative Role"}
                </label>
              </div>

              {/* 6. Status Floating Select (الحالة) */}
              <div className="relative">
                <LuxurySelect<AdminAccount["status"]>
                  value={newStatus}
                  onChange={(val) => setNewStatus(val)}
                  options={adminStatusSelectOptions}
                  className="w-full"
                  minWidth="w-full"
                />
                <label className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] z-10 transition-colors">
                  {isAr ? "الحالة (Status)" : "Account Status"}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ded5c6]/40 dark:border-[#2f2a24]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-[#524b43] dark:text-[#c4bcb1] hover:bg-stone-100 dark:hover:bg-[#25201b] transition-colors cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(194,149,71,0.3)] transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? "إنشاء الحساب" : "Create Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Account Modal */}
      {isEditModalOpen && editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "تعديل بيانات المشرف" : "Edit Admin Profile"}
                  </h2>
                  <p className="text-xs text-[#8c8279] dark:text-[#9e968a]">
                    {editingAccount.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAccount(null);
                }}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 pt-7 space-y-5">
              {/* 1. Full Name Floating Input */}
              <div className="relative">
                <input
                  id="modal-edit-admin-name"
                  type="text"
                  required
                  placeholder=" "
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-4 text-xs font-bold bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-edit-admin-name"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "اسم المشرف بالكامل" : "Full Name"}
                </label>
              </div>

              {/* 2. Official Email Floating Input */}
              <div className="relative">
                <input
                  id="modal-edit-admin-email"
                  type="email"
                  required
                  placeholder=" "
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-4 text-xs font-mono font-medium bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-edit-admin-email"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "البريد الإلكتروني الرسمي" : "Official Email"}
                </label>
              </div>

              {/* 3. Administrative Role Floating Select */}
              <div className="relative">
                <LuxurySelect<AdminAccount["role"]>
                  value={editRole}
                  onChange={(val) => setEditRole(val)}
                  options={newRoleOptions}
                  className="w-full"
                  minWidth="w-full"
                />
                <label className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] z-10 transition-colors">
                  {isAr ? "الرتبة الإدارية (Role)" : "Administrative Role"}
                </label>
              </div>

              {/* 4. Status Floating Select */}
              <div className="relative">
                <LuxurySelect<AdminAccount["status"]>
                  value={editStatus}
                  onChange={(val) => setEditStatus(val)}
                  options={adminStatusSelectOptions}
                  className="w-full"
                  minWidth="w-full"
                  disabled={isCurrentUser(editingAccount.id)}
                />
                <label className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] z-10 transition-colors">
                  {isAr ? "الحالة (Status)" : "Account Status"}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ded5c6]/40 dark:border-[#2f2a24]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAccount(null);
                  }}
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

      {/* Change Password Modal */}
      {isPasswordModalOpen && passwordTargetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "تغيير الرقم السري" : "Change Password"}
                  </h2>
                  <p className="text-xs text-[#8c8279] dark:text-[#9e968a]">
                    {passwordTargetAccount.name} ({passwordTargetAccount.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordTargetAccount(null);
                }}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-6 pt-7 space-y-5">
              {/* New Password Floating Input */}
              <div className="relative flex items-center">
                <input
                  id="modal-new-password"
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-11 text-xs font-mono font-medium bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-new-password"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "كلمة المرور الجديدة" : "New Password"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute end-3.5 p-1 text-[#8c8279] hover:text-[#c29547] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Confirm Password Floating Input */}
              <div className="relative flex items-center">
                <input
                  id="modal-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  value={confirmPasswordVal}
                  onChange={(e) => setConfirmPasswordVal(e.target.value)}
                  className="peer w-full h-12 rounded-2xl ps-4 pe-11 text-xs font-mono font-medium bg-white dark:bg-[#201d1a] text-[#2c2825] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
                />
                <label
                  htmlFor="modal-confirm-password"
                  className="pointer-events-none absolute start-4 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1714] px-1.5 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816]"
                >
                  {isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute end-3.5 p-1 text-[#8c8279] hover:text-[#c29547] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#faf5eb] dark:bg-[#221e1a] border border-[#eeddbb]/80 dark:border-[#4d3a1f] text-xs text-[#8c8279] dark:text-[#aba295]">
                <Lock className="w-4 h-4 text-[#c29547] shrink-0" />
                <span>
                  {isAr
                    ? "يجب ألا تقل كلمة المرور عن 6 خانات لتأمين حساب المشرف."
                    : "Password must be at least 6 characters long."}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ded5c6]/40 dark:border-[#2f2a24]">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordTargetAccount(null);
                  }}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-[#524b43] dark:text-[#c4bcb1] hover:bg-stone-100 dark:hover:bg-[#25201b] transition-colors cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(194,149,71,0.3)] transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isAr ? "تحديث الرقم السري" : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Floating Action Menu Popover (Rendered in fixed viewport coordinates to prevent overflow clipping by table container) */}
      {activeMenuAccount && menuPosition && (
        <div
          style={{
            position: "fixed",
            left: `${menuPosition.left}px`,
            ...(menuPosition.top !== undefined ? { top: `${menuPosition.top}px` } : {}),
            ...(menuPosition.bottom !== undefined ? { bottom: `${menuPosition.bottom}px` } : {}),
          }}
          className={cn(
            "action-menu-popover z-50 w-56 rounded-2xl border border-[#eeddbb] dark:border-[#382b18] bg-white dark:bg-[#1a1714] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.22)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 text-start select-none",
            menuPosition.placement === "up" ? "origin-bottom-left" : "origin-top-left"
          )}
        >
          <button
            type="button"
            onClick={() => {
              const target = activeMenuAccount;
              setActiveMenuAccount(null);
              setMenuPosition(null);
              openEditModal(target);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#2c2825] dark:text-[#f5f4f0] hover:bg-[#faf5eb] dark:hover:bg-[#282218] hover:text-[#c29547] transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#c29547]" />
            <span>{isAr ? "تعديل البيانات" : "Edit Profile"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const target = activeMenuAccount;
              setActiveMenuAccount(null);
              setMenuPosition(null);
              openPasswordModal(target);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#2c2825] dark:text-[#f5f4f0] hover:bg-[#faf5eb] dark:hover:bg-[#282218] hover:text-[#c29547] transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#c29547]" />
            <span>{isAr ? "تغيير الرقم السري" : "Change Password"}</span>
          </button>

          {!isCurrentUser(activeMenuAccount.id) && (
            <>
              <div className="my-1 border-t border-[#ded5c6]/60 dark:border-[#2f2a24]" />

              <button
                type="button"
                onClick={() => {
                  const target = activeMenuAccount;
                  setActiveMenuAccount(null);
                  setMenuPosition(null);
                  requestDeleteAccount(
                    target.id,
                    isAr ? target.name : target.nameEn,
                    target.email
                  );
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? "حذف الحساب نهائياً" : "Delete Account"}</span>
              </button>
            </>
          )}
        </div>
      )}

      <LuxuryAlertDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        cancelLabel={isAr ? "إلغاء التراجع" : "Cancel"}
        variant={confirmDialog.variant}
        itemDetails={confirmDialog.itemDetails}
      />
    </div>
  );
}
