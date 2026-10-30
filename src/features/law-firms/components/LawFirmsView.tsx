"use client";

import React, { useState } from "react";
import {
  Building2,
  User,
  FileText,
  CreditCard,
  Headphones,
  MessageSquare,
  Plus,
  Search,
  RotateCcw,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Clock,
  Sparkles,
  Send,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { LuxurySelect, SelectOption } from "@/components/shared/LuxurySelect";
import { LuxuryCheckbox } from "@/components/shared/LuxuryCheckbox";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { useUIStore } from "@/stores/use-ui-store";

export interface FirmInvoice {
  id: string;
  invoiceNumber: string;
  amount: string;
  date: string;
  status: "paid" | "pending" | "overdue";
  paymentMethod: string;
}

export interface FirmTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "closed";
  date: string;
}

export interface FirmNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface LawFirm {
  id: string;
  name: string;
  ownerName: string;
  licenseNumber: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  registeredDate: string;
  status: "active" | "inactive";
  planName: string;
  planBilling: "monthly" | "annually" | "trial";
  renewalDate: string;
  usersCount: number;
  maxUsers: number;
  casesCount: number;
  storageUsed: string;
  invoices: FirmInvoice[];
  tickets: FirmTicket[];
  notes: FirmNote[];
}

const initialFirms: LawFirm[] = [
  {
    id: "firm-1",
    name: "شركة العثمان للمحاماة والاستشارات القانونية",
    ownerName: "د. عبد العزيز العثمان",
    licenseNumber: "LIC-441092",
    email: "contact@othman-law.com",
    phone: "+966 50 123 4567",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    registeredDate: "2025-11-10",
    status: "active",
    planName: "باقة النخبة (Enterprise)",
    planBilling: "annually",
    renewalDate: "2026-11-10",
    usersCount: 12,
    maxUsers: 25,
    casesCount: 184,
    storageUsed: "14.2 GB",
    invoices: [
      {
        id: "inv-101",
        invoiceNumber: "INV-2025-089",
        amount: "14,400 ر.س",
        date: "2025-11-10",
        status: "paid",
        paymentMethod: "تحويل بنكي (الأهلي)",
      },
    ],
    tickets: [
      {
        id: "t-1",
        ticketNumber: "TCK-8821",
        subject: "طلب ربط بوابة ناجز عبر API",
        priority: "high",
        status: "in_progress",
        date: "2026-10-14",
      },
      {
        id: "t-2",
        ticketNumber: "TCK-7612",
        subject: "استفسار عن تصدير كشوف حساب الموكلين",
        priority: "low",
        status: "closed",
        date: "2026-09-02",
      },
    ],
    notes: [
      {
        id: "n-1",
        author: "خالد السليمان",
        date: "2026-10-14 11:30 ص",
        text: "عميل مميز جداً. طلب تقديم ورشة عمل لفريق المحامين في مكتبهم بالرياض حول أرشفة القضايا.",
      },
    ],
  },
  {
    id: "firm-2",
    name: "مجموعة السديري القضائية الدولية",
    ownerName: "أ. ماجد السديري",
    licenseNumber: "LIC-339811",
    email: "m.sudairy@sudairy-law.sa",
    phone: "+966 55 987 6543",
    city: "جدة",
    country: "المملكة العربية السعودية",
    registeredDate: "2026-01-15",
    status: "active",
    planName: "الباقة المتقدمة (Professional)",
    planBilling: "monthly",
    renewalDate: "2026-11-15",
    usersCount: 6,
    maxUsers: 10,
    casesCount: 92,
    storageUsed: "6.8 GB",
    invoices: [
      {
        id: "inv-102",
        invoiceNumber: "INV-2026-041",
        amount: "890 ر.س",
        date: "2026-10-15",
        status: "paid",
        paymentMethod: "بطاقة مدى",
      },
      {
        id: "inv-103",
        invoiceNumber: "INV-2026-012",
        amount: "890 ر.س",
        date: "2026-09-15",
        status: "paid",
        paymentMethod: "بطاقة مدى",
      },
    ],
    tickets: [],
    notes: [
      {
        id: "n-2",
        author: "عمر القحطاني",
        date: "2026-09-18",
        text: "تم تفعيل ميزة الإشعارات التلقائية عبر الواتساب للموكلين.",
      },
    ],
  },
  {
    id: "firm-3",
    name: "مكتب العدل والإنصاف للمحاماة",
    ownerName: "أ. ناصر الدوسري",
    licenseNumber: "LIC-551029",
    email: "nasser@adllaw.com",
    phone: "+966 54 321 0987",
    city: "الدمام",
    country: "المملكة العربية السعودية",
    registeredDate: "2026-04-05",
    status: "active",
    planName: "الباقة الأساسية (Starter)",
    planBilling: "annually",
    renewalDate: "2027-04-05",
    usersCount: 3,
    maxUsers: 5,
    casesCount: 45,
    storageUsed: "2.1 GB",
    invoices: [
      {
        id: "inv-104",
        invoiceNumber: "INV-2026-104",
        amount: "4,200 ر.س",
        date: "2026-04-05",
        status: "paid",
        paymentMethod: "فيزا / ماستركارد",
      },
    ],
    tickets: [
      {
        id: "t-3",
        ticketNumber: "TCK-9004",
        subject: "إضافة متدرب قانوني بدون صلاحية حذف",
        priority: "medium",
        status: "closed",
        date: "2026-08-11",
      },
    ],
    notes: [],
  },
  {
    id: "firm-4",
    name: "مؤسسة الحكمة القانونية والتحكيم التجاري",
    ownerName: "د. إبراهيم الزهراني",
    licenseNumber: "LIC-120984",
    email: "info@hekma-legal.sa",
    phone: "+966 56 789 0123",
    city: "مكة المكرمة",
    country: "المملكة العربية السعودية",
    registeredDate: "2026-06-20",
    status: "inactive",
    planName: "تجربة مجانية (Trial)",
    planBilling: "trial",
    renewalDate: "2026-07-04",
    usersCount: 2,
    maxUsers: 5,
    casesCount: 12,
    storageUsed: "0.4 GB",
    invoices: [],
    tickets: [],
    notes: [
      {
        id: "n-3",
        author: "عمر القحطاني",
        date: "2026-07-05",
        text: "انتهت فترة التجربة المجانية ولم يقم بالاشتراك نظراً لتأجيل الميزانية.",
      },
    ],
  },
  {
    id: "firm-5",
    name: "شركة درع القانون الدولية للمحاماة",
    ownerName: "المستشار فهد القاسم",
    licenseNumber: "LIC-882910",
    email: "f.qasim@diraa-law.com",
    phone: "+966 53 456 7890",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    registeredDate: "2025-12-01",
    status: "active",
    planName: "باقة النخبة (Enterprise)",
    planBilling: "annually",
    renewalDate: "2026-12-01",
    usersCount: 18,
    maxUsers: 30,
    casesCount: 310,
    storageUsed: "28.5 GB",
    invoices: [
      {
        id: "inv-105",
        invoiceNumber: "INV-2025-115",
        amount: "16,800 ر.س",
        date: "2025-12-01",
        status: "paid",
        paymentMethod: "تحويل بنكي (الراجحي)",
      },
    ],
    tickets: [
      {
        id: "t-4",
        ticketNumber: "TCK-9442",
        subject: "طلب تخصيص العقود بصيغة الهوية البصرية للمكتب",
        priority: "medium",
        status: "open",
        date: "2026-10-11",
      },
    ],
    notes: [
      {
        id: "n-4",
        author: "خالد السليمان",
        date: "2026-09-30",
        text: "تم تفعيل ميزة مدير الحساب المخصص لمتابعة متطلبات الفرع الجديد في دبي.",
      },
    ],
  },
  {
    id: "firm-6",
    name: "مكتب التميز للمحاماة والتوثيق الشرعي",
    ownerName: "أ. حمزة الحربي",
    licenseNumber: "LIC-662914",
    email: "h.harbi@tamayoz-law.com",
    phone: "+966 59 112 2334",
    city: "المدينة المنورة",
    country: "المملكة العربية السعودية",
    registeredDate: "2026-08-14",
    status: "active",
    planName: "الباقة الأساسية (Starter)",
    planBilling: "monthly",
    renewalDate: "2026-11-14",
    usersCount: 4,
    maxUsers: 5,
    casesCount: 38,
    storageUsed: "1.9 GB",
    invoices: [
      {
        id: "inv-106",
        invoiceNumber: "INV-2026-210",
        amount: "390 ر.س",
        date: "2026-10-14",
        status: "paid",
        paymentMethod: "مدى",
      },
    ],
    tickets: [],
    notes: [],
  },
];

export function LawFirmsView() {
  const language = useUIStore((state) => state.language);
  const isAr = language === "ar";

  const [firms, setFirms] = useState<LawFirm[]>(initialFirms);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedFirmIds, setSelectedFirmIds] = useState<string[]>([]);

  // Profile Drawer State
  const [profileFirm, setProfileFirm] = useState<LawFirm | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<
    "overview" | "subscription" | "invoices" | "tickets" | "notes"
  >("overview");
  const [newProfileNote, setNewProfileNote] = useState("");

  // Add Firm Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFirmName, setNewFirmName] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newLicense, setNewLicense] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCountry] = useState("المملكة العربية السعودية");
  const [newCity, setNewCity] = useState("الرياض");
  const [newPassword, setNewPassword] = useState("");
  const [newPlan, setNewPlan] = useState("الباقة المتقدمة (Professional)");

  // Confirmation Alert Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    variant: "danger" | "warning" | "success" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    variant: "danger",
    onConfirm: () => {},
  });

  // KPI Calculations
  const totalCount = firms.length;
  const activeCount = firms.filter((f) => f.status === "active").length;
  const trialCount = firms.filter((f) => f.planBilling === "trial").length;
  const inactiveCount = firms.filter((f) => f.status === "inactive").length;

  // Options
  const planOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل الباقات" : "All Plans" },
    { value: "باقة النخبة (Enterprise)", label: isAr ? "باقة النخبة" : "Enterprise" },
    { value: "الباقة المتقدمة (Professional)", label: isAr ? "الباقة المتقدمة" : "Professional" },
    { value: "الباقة الأساسية (Starter)", label: isAr ? "الباقة الأساسية" : "Starter" },
    { value: "تجربة مجانية (Trial)", label: isAr ? "تجربة مجانية" : "Free Trial" },
  ];

  const statusOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل الحالات" : "All Statuses" },
    { value: "active", label: isAr ? "نشط" : "Active" },
    { value: "inactive", label: isAr ? "معطل" : "Inactive" },
  ];

  const cityOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل المدن" : "All Cities" },
    { value: "الرياض", label: "الرياض" },
    { value: "جدة", label: "جدة" },
    { value: "الدمام", label: "الدمام" },
    { value: "مكة المكرمة", label: "مكة المكرمة" },
    { value: "المدينة المنورة", label: "المدينة المنورة" },
  ];

  const pageSizeOptions: SelectOption<number>[] = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
  ];

  // Filter logic
  const filtered = firms.filter((firm) => {
    const matchesSearch =
      firm.name.toLowerCase().includes(search.toLowerCase()) ||
      firm.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      firm.email.toLowerCase().includes(search.toLowerCase()) ||
      firm.phone.includes(search) ||
      firm.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      firm.city.includes(search);

    const matchesPlan = planFilter === "all" || firm.planName.includes(planFilter);
    const matchesStatus = statusFilter === "all" || firm.status === statusFilter;
    const matchesCity = cityFilter === "all" || firm.city === cityFilter;

    return matchesSearch && matchesPlan && matchesStatus && matchesCity;
  });

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedFirms = filtered.slice(startIndex, startIndex + pageSize);
  const fromIndex = totalFiltered === 0 ? 0 : startIndex + 1;
  const toIndex = Math.min(startIndex + pageSize, totalFiltered);

  const isAllSelected =
    paginatedFirms.length > 0 &&
    paginatedFirms.every((f) => selectedFirmIds.includes(f.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(paginatedFirms.map((f) => f.id));
      setSelectedFirmIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newIds = new Set([...selectedFirmIds, ...paginatedFirms.map((f) => f.id)]);
      setSelectedFirmIds(Array.from(newIds));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedFirmIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = (firmId: string) => {
    setFirms((prev) =>
      prev.map((f) => {
        if (f.id === firmId) {
          const next = f.status === "active" ? "inactive" : "active";
          toast.success(
            next === "active"
              ? isAr
                ? `تم تفعيل حساب مكتب "${f.name}"`
                : `Activated account for "${f.name}"`
              : isAr
              ? `تم تعطيل حساب مكتب "${f.name}" مؤقتاً`
              : `Deactivated account for "${f.name}"`
          );
          return { ...f, status: next };
        }
        return f;
      })
    );
    if (profileFirm?.id === firmId) {
      setProfileFirm((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "active" ? "inactive" : "active",
            }
          : null
      );
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setPlanFilter("all");
    setStatusFilter("all");
    setCityFilter("all");
    setCurrentPage(1);
    toast.info(isAr ? "تمت إعادة ضبط فلاتر المكاتب" : "Filters reset");
  };

  const handleCreateFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName.trim() || !newOwnerName.trim() || !newEmail.trim() || !newPhone.trim()) {
      toast.error(isAr ? "يرجى تعبئة كافة الحقول الإلزامية" : "Please fill all required fields");
      return;
    }

    const created: LawFirm = {
      id: `firm-${Date.now()}`,
      name: newFirmName.trim(),
      ownerName: newOwnerName.trim(),
      licenseNumber: newLicense.trim() || "LIC-PENDING",
      email: newEmail.trim(),
      phone: newPhone.trim(),
      city: newCity,
      country: newCountry,
      registeredDate: new Date().toISOString().split("T")[0],
      status: "active",
      planName: newPlan,
      planBilling: newPlan.includes("تجربة") ? "trial" : "monthly",
      renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      usersCount: 1,
      maxUsers: newPlan.includes("النخبة") ? 25 : newPlan.includes("المتقدمة") ? 10 : 5,
      casesCount: 0,
      storageUsed: "0 GB",
      invoices: [],
      tickets: [],
      notes: [
        {
          id: `note-${Date.now()}`,
          author: "مدير النظام",
          date: isAr ? "الآن" : "Just now",
          text: "تم إنشاء حساب المكتب وإرسال بريد الترحيب وبيانات الدخول الرسمية.",
        },
      ],
    };

    setFirms([created, ...firms]);
    toast.success(
      isAr
        ? `تم إنشاء حساب مكتب "${newFirmName}" بنجاح وإرسال إيميل الترحيب!`
        : `Firm "${newFirmName}" created successfully and welcome email sent!`
    );
    setIsAddModalOpen(false);
    setNewFirmName("");
    setNewOwnerName("");
    setNewLicense("");
    setNewEmail("");
    setNewPhone("");
    setNewPassword("");
  };

  const handleAddProfileNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFirm || !newProfileNote.trim()) return;

    const noteObj: FirmNote = {
      id: `note-${Date.now()}`,
      author: "مدير النظام",
      date: isAr ? "الآن" : "Just now",
      text: newProfileNote.trim(),
    };

    const updatedNotes = [noteObj, ...profileFirm.notes];
    setFirms((prev) =>
      prev.map((f) => (f.id === profileFirm.id ? { ...f, notes: updatedNotes } : f))
    );
    setProfileFirm({ ...profileFirm, notes: updatedNotes });
    setNewProfileNote("");
    toast.success(isAr ? "تم حفظ الملاحظة بنجاح في ملف المكتب" : "Note saved to firm profile");
  };

  const handleUpgradePlan = (firmId: string, targetPlan: string) => {
    setFirms((prev) =>
      prev.map((f) =>
        f.id === firmId
          ? {
              ...f,
              planName: targetPlan,
              planBilling: "annually",
              renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
            }
          : f
      )
    );
    if (profileFirm?.id === firmId) {
      setProfileFirm((prev) =>
        prev
          ? {
              ...prev,
              planName: targetPlan,
              planBilling: "annually",
              renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
            }
          : null
      );
    }
    toast.success(
      isAr
        ? `تمت ترقية باقة المكتب يدوياً إلى "${targetPlan}"`
        : `Plan updated to "${targetPlan}"`
    );
  };

  const handleDeleteFirm = (firm: LawFirm) => {
    setConfirmDialog({
      isOpen: true,
      variant: "danger",
      title: isAr ? "تأكيد حذف حساب المكتب نهائياً" : "Confirm Delete Firm",
      description: isAr
        ? `هل أنت متأكد من رغبتك في حذف حساب "${firm.name}" نهائياً؟ سيتم مسح كافة البيانات والقضايا والوصول نهائياً.`
        : `Are you sure you want to permanently delete "${firm.name}"?`,
      confirmLabel: isAr ? "نعم، حذف المكتب" : "Yes, Delete Firm",
      onConfirm: () => {
        setFirms((prev) => prev.filter((f) => f.id !== firm.id));
        if (profileFirm?.id === firm.id) setProfileFirm(null);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        toast.success(
          isAr ? `تم حذف حساب مكتب "${firm.name}" بنجاح` : `Firm deleted`
        );
      },
    });
  };

  return (
    <div className="flex h-screen h-dvh overflow-hidden bg-[#fcfbfa] dark:bg-[#150f0b] text-[#1c1917] dark:text-[#fdfbf7] transition-colors duration-200 relative">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative scrollbar-thin">
          <DashboardPageTransition>
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

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Hero Header Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#eeddbb]/70 dark:border-[#38271c] bg-gradient-to-br from-[#ffffff] via-[#fbf8f2] to-[#f4ece0] dark:from-[#221812] dark:via-[#1a120d] dark:to-[#150f0b] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c29547]/10 dark:bg-[#c29547]/20 text-[#966e2e] dark:text-[#f3c27e] border border-[#c29547]/30">
                    <Building2 className="w-3.5 h-3.5 text-[#c29547] dark:text-[#e29d38]" />
                    <span>
                      {isAr
                        ? "إدارة المشتركين والعملاء • مكاتب المحاماة"
                        : "Subscribers & Clients • Law Firms Directory"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917] dark:text-[#fdfbf7]">
                    {isAr ? "دليل مكاتب المحاماة المشتركة" : "Law Firms Management"}
                  </h1>

                  <p className="text-sm sm:text-base text-[#6b6357] dark:text-[#cdc5bd] max-w-2xl leading-relaxed">
                    {isAr
                      ? "إدارة ومتابعة كافة مكاتب وشركات المحاماة المسجلة بالنظام، فحص ملف المكتب الشامل، باقات الاشتراك، الفواتير والتذاكر، وتفعيل أو إيقاف الحسابات."
                      : "Manage law firms, inspect comprehensive profiles, renewal dates, invoices, support tickets, and activate or suspend accounts securely."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(
                        isAr
                          ? "تم تصدير دليل مكاتب المحاماة كملف CSV بنجاح"
                          : "Exported law firms as CSV"
                      );
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1c1917] dark:text-[#fdfbf7] bg-white dark:bg-[#281c15] border border-[#e2d5c0] dark:border-[#38271c] shadow-sm hover:border-[#c29547] dark:hover:border-[#e29d38] hover:text-[#c29547] dark:hover:text-[#e29d38] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#c29547] dark:text-[#e29d38]" />
                    <span>{isAr ? "تصدير الدليل" : "Export"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#c29547] via-[#b38538] to-[#996c25] hover:opacity-95 shadow-md shadow-[#c29547]/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? "إضافة مكتب جديد" : "Add Law Firm"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#38271c] bg-white dark:bg-[#221812] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#cdc5bd]">
                    {isAr ? "إجمالي المكاتب" : "Total Law Firms"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf5eb] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#c29547] dark:text-[#e29d38]">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1c1917] dark:text-[#fdfbf7]">
                  {totalCount}
                </div>
                <div className="text-[11px] text-[#8c8279] dark:text-[#8e8680] mt-1">
                  {isAr ? "مسجلة بمنظومة الجودي" : "Registered firms"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#38271c] bg-white dark:bg-[#221812] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#cdc5bd]">
                    {isAr ? "المكاتب النشطة" : "Active Firms"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-emerald-600 dark:text-[#e29d38]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {activeCount}
                </div>
                <div className="text-[11px] text-[#8c8279] dark:text-[#8e8680] mt-1">
                  {isAr ? "اشتراكات مفعلة وجارية" : "Live & operational"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#38271c] bg-white dark:bg-[#221812] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#cdc5bd]">
                    {isAr ? "تجارب مجانية جارية" : "Trial Firms"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-blue-600 dark:text-[#e29d38]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {trialCount}
                </div>
                <div className="text-[11px] text-[#8c8279] dark:text-[#8e8680] mt-1">
                  {isAr ? "تخضع لمتابعة السيلز" : "Under sales follow-up"}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#38271c] bg-white dark:bg-[#221812] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#cdc5bd]">
                    {isAr ? "المكاتب المعطلة" : "Inactive / Suspended"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-rose-600 dark:text-[#e29d38]">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {inactiveCount}
                </div>
                <div className="text-[11px] text-[#8c8279] dark:text-[#8e8680] mt-1">
                  {isAr ? "معلقة وموقوفة مؤقتاً" : "Suspended access"}
                </div>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="p-4 rounded-2xl border border-[#ded5c6]/70 dark:border-[#38271c] bg-white dark:bg-[#221812] shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8279] dark:text-[#8e8680]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={
                      isAr
                        ? "ابحث باسم المكتب، المالك، رقم الترخيص، الجوال..."
                        : "Search firm name, owner, license, phone..."
                    }
                    className="w-full ps-10 pe-4 py-2 text-xs rounded-xl border border-[#ded5c6] dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#1a120d] focus:bg-white dark:focus:bg-[#281c15] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7] transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#8c8279] dark:text-[#8e8680] hover:text-[#c29547] dark:hover:text-[#e29d38]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-48">
                    <LuxurySelect<string>
                      value={planFilter}
                      onChange={(val) => {
                        setPlanFilter(val);
                        setCurrentPage(1);
                      }}
                      options={planOptions}
                      minWidth="w-full"
                    />
                  </div>

                  <div className="w-40">
                    <LuxurySelect<string>
                      value={statusFilter}
                      onChange={(val) => {
                        setStatusFilter(val);
                        setCurrentPage(1);
                      }}
                      options={statusOptions}
                      minWidth="w-full"
                    />
                  </div>

                  <div className="w-40">
                    <LuxurySelect<string>
                      value={cityFilter}
                      onChange={(val) => {
                        setCityFilter(val);
                        setCurrentPage(1);
                      }}
                      options={cityOptions}
                      minWidth="w-full"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    title={isAr ? "إعادة ضبط الفلاتر" : "Reset"}
                    className="p-2 rounded-xl border border-[#ded5c6] dark:border-[#38271c] text-[#7c7366] dark:text-[#cdc5bd] hover:bg-[#faf5eb] dark:hover:bg-[#281c15] hover:text-[#c29547] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Firms Table */}
            <div className="rounded-2xl border border-[#ded5c6] dark:border-[#38271c] bg-white dark:bg-[#221812] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#ded5c6] dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#1a120d] text-[#7c7366] dark:text-[#8e8680]">
                      <th className="py-3.5 px-4 w-11 text-center">
                        <div className="flex items-center justify-center">
                          <LuxuryCheckbox
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            title={isAr ? "تحديد الكل" : "Select all"}
                          />
                        </div>
                      </th>
                      <th className="py-3.5 px-3 w-10 text-center font-bold text-[11px] text-[#7c7366] dark:text-[#8e8680]">
                        #
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "اسم المكتب والترخيص" : "Firm & License"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "المالك وبيانات التواصل" : "Owner & Contact"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "الباقة وتاريخ التجديد" : "Plan & Renewal"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "تاريخ التسجيل" : "Registered Date"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "الحالة (تشغيل/إيقاف)" : "Status"}
                      </th>
                      <th className="py-3.5 px-4 text-center font-bold">
                        {isAr ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ded5c6]/60 dark:divide-[#38271c]/60">
                    {paginatedFirms.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-[#8c8279] dark:text-[#8e8680]">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Building2 className="w-8 h-8 text-[#c29547]/50 dark:text-[#e29d38]/50" />
                            <p className="font-bold text-sm text-[#2c2825] dark:text-[#fdfbf7]">
                              {isAr ? "لم يتم العثور على أي مكاتب" : "No law firms found"}
                            </p>
                            <p className="text-xs">
                              {isAr
                                ? "جرّب تغيير عبارة البحث أو إعادة ضبط الفلاتر"
                                : "Try adjusting your search terms or filters"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedFirms.map((firm, index) => (
                        <tr
                          key={firm.id}
                          className={`transition-colors ${
                            selectedFirmIds.includes(firm.id)
                              ? "bg-[#faf5eb]/90 dark:bg-[#281c15]/50"
                              : "hover:bg-[#faf5eb]/40 dark:hover:bg-[#1a120d]/60"
                          }`}
                        >
                          <td className="py-4 px-4 w-11 text-center">
                            <div className="flex items-center justify-center">
                              <LuxuryCheckbox
                                checked={selectedFirmIds.includes(firm.id)}
                                onChange={() => handleToggleSelect(firm.id)}
                              />
                            </div>
                          </td>

                          <td className="py-4 px-3 text-center">
                            <span className="font-mono text-[12px] font-bold text-[#7c7366] dark:text-[#8e8680]">
                              {(activePage - 1) * pageSize + index + 1}
                            </span>
                          </td>

                          {/* Firm Name - Clickable to open Profile */}
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => {
                                setProfileFirm(firm);
                                setProfileActiveTab("overview");
                              }}
                              className="text-start flex items-center gap-3 group cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#eeddbb] to-[#c29547]/30 dark:from-[#38271c] dark:to-[#4d3627] border border-[#eeddbb] dark:border-[#4d3627] flex items-center justify-center text-[#966e2e] dark:text-[#f3c27e] shrink-0 font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#1c1917] dark:text-[#fdfbf7] text-xs sm:text-sm group-hover:text-[#c29547] dark:group-hover:text-[#e29d38] transition-colors">
                                    {firm.name}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#faf5eb] dark:bg-[#281c15] text-[#966e2e] dark:text-[#f3c27e] border border-[#eeddbb]/80 dark:border-[#4d3627]">
                                    {firm.city}
                                  </span>
                                </div>
                                <div className="text-[11px] text-[#8c8279] dark:text-[#8e8680] flex items-center gap-2 mt-0.5 font-mono">
                                  <span>{firm.licenseNumber}</span>
                                </div>
                              </div>
                            </button>
                          </td>

                          {/* Owner & Contact */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <div className="font-bold text-[#2c2825] dark:text-[#fdfbf7] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#c29547] dark:text-[#e29d38]" />
                                <span>{firm.ownerName}</span>
                              </div>
                              <div className="text-[11px] text-[#8c8279] dark:text-[#8e8680] flex items-center gap-2 font-mono">
                                <span>{firm.phone}</span>
                                <span>•</span>
                                <span>{firm.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Plan & Renewal */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#c29547]/15 dark:bg-[#e29d38]/15 text-[#966e2e] dark:text-[#f3c27e] border border-[#c29547]/30 dark:border-[#e29d38]/30 shadow-2xs">
                                <Sparkles className="w-3 h-3 text-[#c29547] dark:text-[#e29d38]" />
                                <span>{firm.planName}</span>
                              </span>
                              <div className="text-[10px] text-[#8c8279] dark:text-[#8e8680] font-mono flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#c29547] dark:text-[#e29d38]" />
                                <span>تجديد: {firm.renewalDate}</span>
                              </div>
                            </div>
                          </td>

                          {/* Registered Date */}
                          <td className="py-4 px-4 font-mono text-[11px] text-[#7c7366] dark:text-[#cdc5bd]">
                            {firm.registeredDate}
                          </td>

                          {/* Status Toggle Switch (Active/Inactive) */}
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(firm.id)}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                                firm.status === "active"
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                                  : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:bg-rose-100"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  firm.status === "active"
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              <span>
                                {firm.status === "active"
                                  ? isAr
                                    ? "نشط"
                                    : "Active"
                                  : isAr
                                  ? "معطل"
                                  : "Inactive"}
                              </span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setProfileFirm(firm);
                                  setProfileActiveTab("overview");
                                }}
                                title={isAr ? "عرض ملف المكتب الشامل" : "View Full Profile"}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#eeddbb] dark:border-[#4d3627] bg-[#faf5eb] dark:bg-[#1a120d] text-[#966e2e] dark:text-[#f3c27e] text-xs font-bold hover:bg-[#eeddbb]/40 dark:hover:bg-[#281c15] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#c29547] dark:text-[#e29d38]" />
                                <span>{isAr ? "ملف المكتب" : "Profile"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteFirm(firm)}
                                title={isAr ? "حذف المكتب" : "Delete"}
                                className="p-1.5 rounded-xl border border-[#ded5c6] dark:border-[#38271c] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-[#ded5c6]/60 dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#1a120d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 text-[#7c7366] dark:text-[#cdc5bd]">
                  <span>
                    {isAr
                      ? `عرض ${fromIndex} إلى ${toIndex} من أصل ${totalFiltered} مكتب محاماة`
                      : `Showing ${fromIndex} to ${toIndex} of ${totalFiltered} law firms`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{isAr ? "لكل صفحة:" : "Per page:"}</span>
                    <div className="w-16">
                      <LuxurySelect<number>
                        value={pageSize}
                        onChange={(val) => {
                          setPageSize(val);
                          setCurrentPage(1);
                        }}
                        options={pageSizeOptions}
                        minWidth="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={activePage === 1}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#38271c] text-[#7c7366] dark:text-[#cdc5bd] hover:bg-white dark:hover:bg-[#281c15] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    {isAr ? (
                      <ChevronsRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={activePage === 1}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#38271c] text-[#7c7366] dark:text-[#cdc5bd] hover:bg-white dark:hover:bg-[#281c15] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    {isAr ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span className="px-3 py-1 font-mono font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                    {activePage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={activePage === totalPages}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#38271c] text-[#7c7366] dark:text-[#cdc5bd] hover:bg-white dark:hover:bg-[#281c15] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    {isAr ? (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={activePage === totalPages}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#38271c] text-[#7c7366] dark:text-[#cdc5bd] hover:bg-white dark:hover:bg-[#281c15] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    {isAr ? (
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronsRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </DashboardPageTransition>
        </main>
      </div>

      {/* Comprehensive Firm Profile Modal / Drawer */}
      {profileFirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#221812] border border-[#ded5c6] dark:border-[#38271c] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start flex flex-col max-h-[92vh]">
            {/* Profile Header */}
            <div className="p-6 border-b border-[#ded5c6]/60 dark:border-[#38271c] bg-gradient-to-r from-[#faf5eb] via-white to-[#faf5eb] dark:from-[#1a120d] dark:via-[#221812] dark:to-[#1a120d]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#eeddbb] to-[#c29547]/40 dark:from-[#38271c] dark:to-[#4d3627] border border-[#eeddbb] dark:border-[#4d3627] flex items-center justify-center text-[#966e2e] dark:text-[#f3c27e] font-bold text-xl shadow-sm shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-[#1c1917] dark:text-[#fdfbf7]">
                        {profileFirm.name}
                      </h2>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          profileFirm.status === "active"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                            : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                        }`}
                      >
                        {profileFirm.status === "active" ? "حساب نشط" : "حساب معطل"}
                      </span>
                    </div>
                    <div className="text-xs text-[#8c8279] dark:text-[#8e8680] flex flex-wrap items-center gap-3 mt-1 font-mono">
                      <span>الترخيص: {profileFirm.licenseNumber}</span>
                      <span>•</span>
                      <span>{profileFirm.city}، {profileFirm.country}</span>
                      <span>•</span>
                      <span>تسجيل: {profileFirm.registeredDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(profileFirm.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      profileFirm.status === "active"
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                    }`}
                  >
                    {profileFirm.status === "active" ? "إيقاف مؤقت" : "إعادة تنشيط"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileFirm(null)}
                    className="p-2 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none pt-5">
                {[
                  { id: "overview", label: isAr ? "نظرة عامة والبيانات" : "Overview", icon: Building2 },
                  { id: "subscription", label: isAr ? "الباقة والاشتراك" : "Plan & Billing", icon: CreditCard },
                  { id: "invoices", label: isAr ? `الفواتير (${profileFirm.invoices.length})` : "Invoices", icon: FileText },
                  { id: "tickets", label: isAr ? `التذاكر (${profileFirm.tickets.length})` : "Tickets", icon: Headphones },
                  { id: "notes", label: isAr ? `الملاحظات (${profileFirm.notes.length})` : "Notes", icon: MessageSquare },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProfileActiveTab(tab.id as typeof profileActiveTab)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      profileActiveTab === tab.id
                        ? "bg-[#faf5eb] dark:bg-[#281c15] text-[#966e2e] dark:text-[#f3c27e] border border-[#eeddbb] dark:border-[#4d3627] shadow-xs"
                        : "text-[#7c7366] dark:text-[#cdc5bd] hover:bg-stone-50 dark:hover:bg-[#1a120d]"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Tab 1: Overview */}
              {profileActiveTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info Card */}
                    <div className="p-4 rounded-2xl border border-[#ded5c6]/60 dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#1a120d] space-y-3">
                      <h3 className="font-extrabold text-sm text-[#2c2825] dark:text-[#fdfbf7] flex items-center gap-2">
                        <User className="w-4 h-4 text-[#c29547] dark:text-[#e29d38]" />
                        <span>بيانات المالك والتواصل</span>
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-[#ded5c6]/40 dark:border-[#38271c]">
                          <span className="text-[#8c8279] dark:text-[#8e8680]">المحامي المسؤول:</span>
                          <span className="font-bold text-[#1c1917] dark:text-[#fdfbf7]">{profileFirm.ownerName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#ded5c6]/40 dark:border-[#38271c]">
                          <span className="text-[#8c8279] dark:text-[#8e8680]">رقم الجوال:</span>
                          <span className="font-mono font-bold text-[#1c1917] dark:text-[#fdfbf7]">{profileFirm.phone}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#ded5c6]/40 dark:border-[#38271c]">
                          <span className="text-[#8c8279] dark:text-[#8e8680]">البريد الإلكتروني:</span>
                          <span className="font-mono text-[#1c1917] dark:text-[#fdfbf7]">{profileFirm.email}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#8c8279] dark:text-[#8e8680]">رقم الترخيص المهني:</span>
                          <span className="font-mono font-bold text-[#966e2e] dark:text-[#f3c27e]">
                            {profileFirm.licenseNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Usage Card */}
                    <div className="p-4 rounded-2xl border border-[#ded5c6]/60 dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#1a120d] space-y-3">
                      <h3 className="font-extrabold text-sm text-[#2c2825] dark:text-[#fdfbf7] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#c29547] dark:text-[#e29d38]" />
                        <span>معدل الاستهلاك والموارد</span>
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-[#ded5c6]/40 dark:border-[#38271c]">
                          <span className="text-[#8c8279] dark:text-[#8e8680]">عدد المحامين / المستخدمين:</span>
                          <span className="font-mono font-bold text-[#1c1917] dark:text-[#fdfbf7]">
                            {profileFirm.usersCount} / {profileFirm.maxUsers}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#ded5c6]/40 dark:border-[#38271c]">
                          <span className="text-[#8c8279] dark:text-[#8e8680]">القضايا المفتوحة والمؤرشفة:</span>
                          <span className="font-mono font-bold text-[#1c1917] dark:text-[#fdfbf7]">{profileFirm.casesCount} قضية</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#8c8279] dark:text-[#8e8680]">مساحة التخزين السحابي:</span>
                          <span className="font-mono font-bold text-[#1c1917] dark:text-[#fdfbf7]">{profileFirm.storageUsed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Plan Mutation Actions */}
                  <div className="p-4 rounded-2xl border border-[#eeddbb] dark:border-[#4d3627] bg-[#faf5eb]/50 dark:bg-[#1a120d] space-y-3">
                    <h4 className="font-bold text-xs text-[#966e2e] dark:text-[#f3c27e]">
                      إجراءات سريعة على باقة واشتراك المكتب
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpgradePlan(profileFirm.id, "باقة النخبة (Enterprise)")}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-xs"
                      >
                        ترقية إلى باقة النخبة (سنوي)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpgradePlan(profileFirm.id, "الباقة المتقدمة (Professional)")}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#281c15] border border-[#eeddbb] dark:border-[#4d3627] text-[#966e2e] dark:text-[#f3c27e] text-xs font-bold hover:border-[#c29547] dark:hover:border-[#e29d38] cursor-pointer"
                      >
                        تحويل للباقة المتقدمة
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFirm(profileFirm)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 cursor-pointer"
                      >
                        حذف المكتب نهائياً
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Subscription */}
              {profileActiveTab === "subscription" && (
                <div className="p-5 rounded-2xl border border-[#ded5c6]/60 dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#1a120d] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#8c8279] dark:text-[#8e8680]">الباقة النشطة حالياً</span>
                      <h4 className="font-black text-base text-[#1c1917] dark:text-[#fdfbf7] mt-0.5">
                        {profileFirm.planName}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#c29547]/15 dark:bg-[#e29d38]/15 text-[#966e2e] dark:text-[#f3c27e] font-bold text-xs border border-[#c29547]/30 dark:border-[#e29d38]/30">
                      دورة الفوترة: {profileFirm.planBilling === "annually" ? "سنوية" : profileFirm.planBilling === "monthly" ? "شهرية" : "تجريبية"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#ded5c6]/40 dark:border-[#38271c]">
                    <div>
                      <span className="text-[#8c8279] dark:text-[#8e8680]">تاريخ بدء الاشتراك:</span>
                      <p className="font-mono font-bold mt-0.5 text-[#1c1917] dark:text-[#fdfbf7]">{profileFirm.registeredDate}</p>
                    </div>
                    <div>
                      <span className="text-[#8c8279] dark:text-[#8e8680]">موعد التجديد القادم:</span>
                      <p className="font-mono font-bold text-[#c29547] dark:text-[#e29d38] mt-0.5">{profileFirm.renewalDate}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Invoices */}
              {profileActiveTab === "invoices" && (
                <div className="space-y-3">
                  {profileFirm.invoices.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#8c8279] dark:text-[#8e8680] border border-dashed border-[#ded5c6] dark:border-[#38271c] rounded-2xl">
                      لا توجد فواتير صادرة لهذا المكتب حتى الآن
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[#ded5c6]/60 dark:border-[#38271c] overflow-hidden">
                      <table className="w-full text-start text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#faf8f4] dark:bg-[#1a120d] border-b border-[#ded5c6]/60 dark:border-[#38271c] text-[#7c7366] dark:text-[#8e8680]">
                            <th className="py-2.5 px-3 text-start">رقم الفاتورة</th>
                            <th className="py-2.5 px-3 text-start">التاريخ</th>
                            <th className="py-2.5 px-3 text-start">المبلغ</th>
                            <th className="py-2.5 px-3 text-start">طريقة الدفع</th>
                            <th className="py-2.5 px-3 text-start">الحالة</th>
                            <th className="py-2.5 px-3 text-center">تحميل</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ded5c6]/40 dark:divide-[#38271c]/40">
                          {profileFirm.invoices.map((inv) => (
                            <tr key={inv.id}>
                              <td className="py-3 px-3 font-mono font-bold text-[#1c1917] dark:text-[#fdfbf7]">{inv.invoiceNumber}</td>
                              <td className="py-3 px-3 font-mono text-[#7c7366] dark:text-[#cdc5bd]">{inv.date}</td>
                              <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{inv.amount}</td>
                              <td className="py-3 px-3 text-[#1c1917] dark:text-[#fdfbf7]">{inv.paymentMethod}</td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  مدفوعة
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toast.success(
                                      `تم تحميل الفاتورة ${inv.invoiceNumber} بصيغة PDF`
                                    )
                                  }
                                  className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#38271c] hover:text-[#c29547] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Tickets */}
              {profileActiveTab === "tickets" && (
                <div className="space-y-3">
                  {profileFirm.tickets.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#8c8279] dark:text-[#8e8680] border border-dashed border-[#ded5c6] dark:border-[#38271c] rounded-2xl">
                      لا توجد تذاكر دعم فني مسجلة لهذا المكتب
                    </div>
                  ) : (
                    profileFirm.tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-2xl border border-[#ded5c6]/60 dark:border-[#38271c] bg-[#faf8f4] dark:bg-[#1a120d] flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#c29547] dark:text-[#e29d38]">{t.ticketNumber}</span>
                            <span className="font-bold text-[#1c1917] dark:text-[#fdfbf7]">{t.subject}</span>
                          </div>
                          <span className="text-[10px] text-[#8c8279] dark:text-[#8e8680] font-mono">تاريخ: {t.date}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.status === "in_progress"
                              ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                              : "bg-stone-100 text-stone-700 border-stone-300 dark:bg-[#281c15] dark:text-[#cdc5bd] dark:border-[#38271c]"
                          }`}
                        >
                          {t.status === "in_progress" ? "جاري التعامل" : "مغلقة"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 5: Notes */}
              {profileActiveTab === "notes" && (
                <div className="space-y-4">
                  {/* Notes Timeline */}
                  <div className="space-y-2.5">
                    {profileFirm.notes.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#8c8279] dark:text-[#8e8680] border border-dashed border-[#ded5c6] dark:border-[#38271c] rounded-2xl">
                        لا توجد ملاحظات مسجلة على هذا المكتب حتى الآن.
                      </div>
                    ) : (
                      profileFirm.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3.5 rounded-2xl border border-[#eeddbb]/70 dark:border-[#4d3627] bg-[#faf8f4] dark:bg-[#1a120d] space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#1c1917] dark:text-[#fdfbf7]">{note.author}</span>
                            <span className="text-[#8c8279] dark:text-[#8e8680] font-mono">{note.date}</span>
                          </div>
                          <p className="text-xs text-[#524b43] dark:text-[#cdc5bd] leading-relaxed">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddProfileNote} className="space-y-3 pt-3 border-t border-[#ded5c6]/40 dark:border-[#38271c]">
                    <textarea
                      rows={2}
                      required
                      value={newProfileNote}
                      onChange={(e) => setNewProfileNote(e.target.value)}
                      placeholder="اكتب ملاحظة جديدة تظهر في ملف المكتب..."
                      className="w-full p-3 rounded-2xl text-xs bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7] resize-none shadow-2xs"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إضافة الملاحظة</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Law Firm Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#221812] border border-[#ded5c6] dark:border-[#38271c] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#38271c] bg-[#faf5eb] dark:bg-[#1a120d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#281c15] border border-[#eeddbb] dark:border-[#4d3627] flex items-center justify-center text-[#c29547] dark:text-[#e29d38]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#fdfbf7]">
                    {isAr ? "إضافة مكتب محاماة جديد" : "Add Law Firm"}
                  </h2>
                  <p className="text-xs text-[#8c8279] dark:text-[#8e8680]">
                    {isAr ? "تسجيل مكتب وإصدار بيانات الدخول وإرسال إيميل الترحيب" : "Register new law firm"}
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

            <form onSubmit={handleCreateFirm} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                  اسم مكتب أو شركة المحاماة *
                </label>
                <input
                  type="text"
                  required
                  value={newFirmName}
                  onChange={(e) => setNewFirmName(e.target.value)}
                  placeholder="مثال: شركة النور للمحاماة والاستشارات"
                  className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                    اسم صاحب المكتب / المحامي المسؤول *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder="أ. عبد الرحمن المنصور"
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                    رقم الترخيص المهني (اختياري)
                  </label>
                  <input
                    type="text"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    placeholder="LIC-449102"
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                    البريد الإلكتروني الرسمي *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="office@law.com"
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                    رقم الجوال الرسمي *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="الرياض"
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                    كلمة السر الأولية للمكتب *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#38271c] focus:outline-none focus:border-[#c29547] dark:focus:border-[#e29d38] text-[#1c1917] dark:text-[#fdfbf7]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2c2825] dark:text-[#fdfbf7]">
                  الباقة المختارة أو التجربة المجانية *
                </label>
                <LuxurySelect<string>
                  value={newPlan}
                  onChange={(val) => setNewPlan(val)}
                  options={[
                    { value: "الباقة الأساسية (Starter)", label: "الباقة الأساسية (Starter)" },
                    { value: "الباقة المتقدمة (Professional)", label: "الباقة المتقدمة (Professional)" },
                    { value: "باقة النخبة (Enterprise)", label: "باقة النخبة (Enterprise)" },
                    { value: "تجربة مجانية 14 يوماً (Free Trial)", label: "تجربة مجانية 14 يوماً (Free Trial)" },
                  ]}
                  className="w-full"
                  minWidth="w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded5c6]/40 dark:border-[#38271c]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-[#524b43] dark:text-[#cdc5bd] hover:bg-stone-100 dark:hover:bg-[#281c15] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(194,149,71,0.3)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>حفظ المكتب وإرسال الترحيب</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Alert Dialog */}
      <LuxuryAlertDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        cancelLabel={isAr ? "إلغاء" : "Cancel"}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
