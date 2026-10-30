"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertCircle,
  TrendingUp,
  Search,
  Phone,
  MessageSquare,
  Mail,
  Plus,
  RotateCcw,
  Download,
  Calendar,
  Building2,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Send,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { LuxurySelect, SelectOption } from "@/components/shared/LuxurySelect";
import { LuxuryCheckbox } from "@/components/shared/LuxuryCheckbox";
import { useUIStore } from "@/stores/use-ui-store";

export type FollowUpStatus =
  | "not_contacted"
  | "contacted"
  | "interested"
  | "did_not_subscribe";

export interface TrialNote {
  id: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  content: string;
  statusSnapshot: FollowUpStatus;
}

export interface LawFirmTrial {
  id: string;
  firmName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  followUpStatus: FollowUpStatus;
  assignedSalesRep: string;
  assignedSalesRepAvatar: string;
  planName: string;
  notes: TrialNote[];
}

const initialTrials: LawFirmTrial[] = [
  {
    id: "trial-1",
    firmName: "شركة العثمان للمحاماة والاستشارات",
    ownerName: "د. عبد العزيز العثمان",
    phone: "+966 50 123 4567",
    email: "contact@othman-law.com",
    city: "الرياض",
    startDate: "2026-10-01",
    endDate: "2026-10-17",
    daysRemaining: 2,
    followUpStatus: "interested",
    assignedSalesRep: "خالد السليمان",
    assignedSalesRepAvatar: "from-[#d4a759] to-[#b38032]",
    planName: "الباقة المتقدمة (تجربة)",
    notes: [
      {
        id: "note-1",
        authorName: "خالد السليمان",
        authorRole: "سيلز المكاتب",
        createdAt: "2026-10-14 11:30 ص",
        content:
          "تحدثنا هاتفياً مع د. عبد العزيز، أبدى إعجابه الكبير بنظام إدارة القضايا وتوزيع المهام على المتدربين، ووعد بتحويل الدفعة السنوية الأحد القادم.",
        statusSnapshot: "interested",
      },
    ],
  },
  {
    id: "trial-2",
    firmName: "مجموعة السديري القضائية",
    ownerName: "أ. ماجد السديري",
    phone: "+966 55 987 6543",
    email: "m.sudairy@sudairy-law.sa",
    city: "جدة",
    startDate: "2026-10-10",
    endDate: "2026-10-24",
    daysRemaining: 9,
    followUpStatus: "not_contacted",
    assignedSalesRep: "عمر القحطاني",
    assignedSalesRepAvatar: "from-[#2563eb] to-[#1d4ed8]",
    planName: "باقة النخبة (تجربة)",
    notes: [],
  },
  {
    id: "trial-3",
    firmName: "مكتب العدل والإنصاف للمحاماة",
    ownerName: "أ. ناصر الدوسري",
    phone: "+966 54 321 0987",
    email: "nasser@adllaw.com",
    city: "الدمام",
    startDate: "2026-10-02",
    endDate: "2026-10-16",
    daysRemaining: 1,
    followUpStatus: "contacted",
    assignedSalesRep: "خالد السليمان",
    assignedSalesRepAvatar: "from-[#d4a759] to-[#b38032]",
    planName: "الباقة الأساسية (تجربة)",
    notes: [
      {
        id: "note-2",
        authorName: "خالد السليمان",
        authorRole: "سيلز المكاتب",
        createdAt: "2026-10-13 03:15 م",
        content:
          "تم إرسال بروشور باقات الاشتراك وعرض الخصم السنوي (15%) عبر الواتساب، وأكد أنه سيناقش الشركاء اليوم.",
        statusSnapshot: "contacted",
      },
    ],
  },
  {
    id: "trial-4",
    firmName: "مؤسسة الحكمة القانونية والتحكيم",
    ownerName: "د. إبراهيم الزهراني",
    phone: "+966 56 789 0123",
    email: "info@hekma-legal.sa",
    city: "مكة المكرمة",
    startDate: "2026-09-28",
    endDate: "2026-10-12",
    daysRemaining: -3,
    followUpStatus: "did_not_subscribe",
    assignedSalesRep: "عمر القحطاني",
    assignedSalesRepAvatar: "from-[#2563eb] to-[#1d4ed8]",
    planName: "الباقة المتقدمة (تجربة)",
    notes: [
      {
        id: "note-3",
        authorName: "عمر القحطاني",
        authorRole: "سيلز المكاتب",
        createdAt: "2026-10-12 01:00 م",
        content:
          "أفاد المحامي بأن ميزانية البرمجيات مؤجلة للشهر القادم. تم الاتفاق على إعادة التواصل بداية الشهر القادم مع تقديم كود خصم خاص.",
        statusSnapshot: "did_not_subscribe",
      },
    ],
  },
  {
    id: "trial-5",
    firmName: "شركة درع القانون الدولية",
    ownerName: "المستشار فهد القاسم",
    phone: "+966 53 456 7890",
    email: "f.qasim@diraa-law.com",
    city: "الرياض",
    startDate: "2026-10-06",
    endDate: "2026-10-21",
    daysRemaining: 6,
    followUpStatus: "interested",
    assignedSalesRep: "خالد السليمان",
    assignedSalesRepAvatar: "from-[#d4a759] to-[#b38032]",
    planName: "باقة النخبة (تجربة)",
    notes: [
      {
        id: "note-4",
        authorName: "خالد السليمان",
        authorRole: "سيلز المكاتب",
        createdAt: "2026-10-14 05:20 م",
        content:
          "طلب إضافة صلاحية لـ 3 محامين إضافيين لاختبار المنظومة، وتم تمديد عدد المستخدمين التجريبي لهم.",
        statusSnapshot: "interested",
      },
    ],
  },
  {
    id: "trial-6",
    firmName: "مكتب التميز للمحاماة والتوثيق",
    ownerName: "أ. حمزة الحربي",
    phone: "+966 59 112 2334",
    email: "h.harbi@tamayoz-law.com",
    city: "المدينة المنورة",
    startDate: "2026-10-12",
    endDate: "2026-10-26",
    daysRemaining: 11,
    followUpStatus: "not_contacted",
    assignedSalesRep: "عمر القحطاني",
    assignedSalesRepAvatar: "from-[#2563eb] to-[#1d4ed8]",
    planName: "الباقة الأساسية (تجربة)",
    notes: [],
  },
  {
    id: "trial-7",
    firmName: "مكتب الراية للمحاماة والوساطة",
    ownerName: "أ. ريان الشمري",
    phone: "+966 51 998 8776",
    email: "r.shammari@alrayah-law.sa",
    city: "الخبر",
    startDate: "2026-10-04",
    endDate: "2026-10-18",
    daysRemaining: 3,
    followUpStatus: "contacted",
    assignedSalesRep: "خالد السليمان",
    assignedSalesRepAvatar: "from-[#d4a759] to-[#b38032]",
    planName: "الباقة المتقدمة (تجربة)",
    notes: [
      {
        id: "note-5",
        authorName: "خالد السليمان",
        authorRole: "سيلز المكاتب",
        createdAt: "2026-10-14 02:40 م",
        content:
          "تم شرح بوابة العملاء وميزة الذكاء الاصطناعي في تلخيص الأحكام عبر مكالمة Google Meet، وأبدى اهتماماً كبيراً.",
        statusSnapshot: "contacted",
      },
    ],
  },
  {
    id: "trial-8",
    firmName: "مكتب الأفق القانوني للاستشارات",
    ownerName: "أ. صالح الشهري",
    phone: "+966 58 443 3221",
    email: "s.shehri@ofok-law.com",
    city: "أبها",
    startDate: "2026-09-24",
    endDate: "2026-10-08",
    daysRemaining: -7,
    followUpStatus: "did_not_subscribe",
    assignedSalesRep: "عمر القحطاني",
    assignedSalesRepAvatar: "from-[#2563eb] to-[#1d4ed8]",
    planName: "الباقة الأساسية (تجربة)",
    notes: [
      {
        id: "note-6",
        authorName: "عمر القحطاني",
        authorRole: "سيلز المكاتب",
        createdAt: "2026-10-09 10:00 ص",
        content:
          "لم يتم الرد على الاتصال الهاتفي الأول. تم إرسال رسالة تذكيرية عبر الواتساب للاستفسار عن تجربتهم.",
        statusSnapshot: "did_not_subscribe",
      },
    ],
  },
];

export function TrialsView() {
  const language = useUIStore((state) => state.language);
  const isAr = language === "ar";

  const [trials, setTrials] = useState<LawFirmTrial[]>(initialTrials);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [repFilter, setRepFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedTrialIds, setSelectedTrialIds] = useState<string[]>([]);

  // Notes Modal state
  const [notesTargetTrial, setNotesTargetTrial] = useState<LawFirmTrial | null>(
    null
  );
  const [newNoteText, setNewNoteText] = useState("");
  const [modalNewStatus, setModalNewStatus] = useState<FollowUpStatus>("contacted");

  // Quick Contact Modal state
  const [contactTargetTrial, setContactTargetTrial] = useState<LawFirmTrial | null>(
    null
  );

  // Add Trial Modal state
  const [isAddTrialModalOpen, setIsAddTrialModalOpen] = useState(false);
  const [newFirmName, setNewFirmName] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("الرياض");
  const [newRep, setNewRep] = useState("خالد السليمان");
  const [newPlan, setNewPlan] = useState("الباقة المتقدمة (تجربة)");

  // KPI Calculations
  const activeTrialsCount = trials.filter((t) => t.daysRemaining >= 0).length;
  const expiringSoonCount = trials.filter(
    (t) => t.daysRemaining >= 0 && t.daysRemaining <= 3
  ).length;
  const expiredNotSubscribedCount = trials.filter(
    (t) => t.daysRemaining < 0 && t.followUpStatus === "did_not_subscribe"
  ).length;
  const convertedInterestedCount = trials.filter(
    (t) => t.followUpStatus === "interested"
  ).length;
  const totalCount = trials.length;
  const conversionRate = Math.round(
    (convertedInterestedCount / (totalCount || 1)) * 100
  );

  // Filter Combobox options
  const statusOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل حالات المتابعة" : "All Follow-up Statuses" },
    { value: "not_contacted", label: isAr ? "لسه ما كلمناهوش" : "Not Contacted" },
    { value: "contacted", label: isAr ? "اتكلمنا" : "Contacted" },
    { value: "interested", label: isAr ? "مهتم" : "Interested" },
    { value: "did_not_subscribe", label: isAr ? "مشتركش" : "Did Not Subscribe" },
  ];

  const repOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل موظفي السيلز" : "All Sales Reps" },
    { value: "خالد السليمان", label: "خالد السليمان" },
    { value: "عمر القحطاني", label: "عمر القحطاني" },
  ];

  const urgencyOptions: SelectOption<string>[] = [
    { value: "all", label: isAr ? "كل الفترات" : "All Durations" },
    { value: "expiring", label: isAr ? "تخلص خلال ٣ أيام (عاجل)" : "Expiring in 3 Days" },
    { value: "active", label: isAr ? "تجارب جارية" : "Active Trials" },
    { value: "expired", label: isAr ? "تجارب منتهية" : "Expired Trials" },
  ];

  const pageSizeOptions: SelectOption<number>[] = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
  ];

  // Filtering logic
  const filtered = trials.filter((t) => {
    const matchesSearch =
      t.firmName.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search) ||
      t.city.includes(search);

    const matchesStatus =
      statusFilter === "all" || t.followUpStatus === statusFilter;

    const matchesRep = repFilter === "all" || t.assignedSalesRep === repFilter;

    let matchesUrgency = true;
    if (urgencyFilter === "expiring") {
      matchesUrgency = t.daysRemaining >= 0 && t.daysRemaining <= 3;
    } else if (urgencyFilter === "active") {
      matchesUrgency = t.daysRemaining > 3;
    } else if (urgencyFilter === "expired") {
      matchesUrgency = t.daysRemaining < 0;
    }

    return matchesSearch && matchesStatus && matchesRep && matchesUrgency;
  });

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedTrials = filtered.slice(startIndex, startIndex + pageSize);
  const fromIndex = totalFiltered === 0 ? 0 : startIndex + 1;
  const toIndex = Math.min(startIndex + pageSize, totalFiltered);

  const isAllSelected =
    paginatedTrials.length > 0 &&
    paginatedTrials.every((t) => selectedTrialIds.includes(t.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(paginatedTrials.map((t) => t.id));
      setSelectedTrialIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newIds = new Set([
        ...selectedTrialIds,
        ...paginatedTrials.map((t) => t.id),
      ]);
      setSelectedTrialIds(Array.from(newIds));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedTrialIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRepFilter("all");
    setUrgencyFilter("all");
    setCurrentPage(1);
    toast.info(isAr ? "تمت إعادة ضبط فلاتر التجارب المجانية" : "Filters reset");
  };

  // Helper for status badge styling
  const getStatusBadge = (status: FollowUpStatus) => {
    switch (status) {
      case "not_contacted":
        return {
          label: isAr ? "لسه ما كلمناهوش" : "Not Contacted",
          className:
            "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700",
          dotColor: "bg-stone-400",
        };
      case "contacted":
        return {
          label: isAr ? "اتكلمنا" : "Contacted",
          className:
            "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
          dotColor: "bg-blue-500",
        };
      case "interested":
        return {
          label: isAr ? "مهتم ومتحمس" : "Interested",
          className:
            "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
          dotColor: "bg-emerald-500",
        };
      case "did_not_subscribe":
        return {
          label: isAr ? "مشتركش (فرصة متابعة)" : "Did Not Subscribe",
          className:
            "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
          dotColor: "bg-amber-500",
        };
    }
  };

  // Dynamic button config per status
  const getDynamicActionConfig = (trial: LawFirmTrial) => {
    switch (trial.followUpStatus) {
      case "not_contacted":
        return {
          label: isAr ? "تواصل الآن" : "Contact Now",
          icon: Phone,
          className:
            "bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white hover:opacity-95 shadow-sm shadow-[#c29547]/20 border border-[#b38032]",
          action: () => setContactTargetTrial(trial),
        };
      case "contacted":
        return {
          label: isAr ? "أضف ملاحظة" : "Add Note",
          icon: MessageSquare,
          className:
            "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 border border-blue-700",
          action: () => openNotesModal(trial),
        };
      case "interested":
        return {
          label: isAr ? "تابع الاشتراك" : "Follow-up Sub",
          icon: Sparkles,
          className:
            "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 border border-emerald-700",
          action: () => {
            toast.success(
              isAr
                ? `تم فتح نموذج إصدار الفاتورة وتأكيد اشتراك مكتب "${trial.firmName}"`
                : `Opening subscription confirmation for "${trial.firmName}"`
            );
          },
        };
      case "did_not_subscribe":
        return {
          label: isAr ? "حاول تاني (عرض)" : "Try Again",
          icon: RotateCcw,
          className:
            "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 border border-amber-600",
          action: () => {
            setNotesTargetTrial(trial);
            setModalNewStatus("interested");
            setNewNoteText("تم تقديم كود خصم خاص 20% لتشجيع المكتب على تفعيل الاشتراك.");
          },
        };
    }
  };

  const openNotesModal = (trial: LawFirmTrial) => {
    setNotesTargetTrial(trial);
    setModalNewStatus(trial.followUpStatus);
    setNewNoteText("");
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesTargetTrial) return;
    if (!newNoteText.trim()) {
      toast.error(isAr ? "يرجى كتابة نص الملاحظة" : "Please write a note");
      return;
    }

    const newNoteObj: TrialNote = {
      id: `note-${Date.now()}`,
      authorName: "خالد السليمان",
      authorRole: "سيلز المكاتب",
      createdAt: isAr ? "الآن" : "Just now",
      content: newNoteText.trim(),
      statusSnapshot: modalNewStatus,
    };

    setTrials((prev) =>
      prev.map((t) =>
        t.id === notesTargetTrial.id
          ? {
              ...t,
              followUpStatus: modalNewStatus,
              notes: [newNoteObj, ...t.notes],
            }
          : t
      )
    );

    toast.success(
      isAr
        ? `تم حفظ الملاحظة وتحديث حالة متابعة مكتب "${notesTargetTrial.firmName}" بنجاح!`
        : "Note added and status updated successfully!"
    );
    setNotesTargetTrial(null);
    setNewNoteText("");
  };

  const handleExtendTrial = (trialId: string, days: number) => {
    setTrials((prev) =>
      prev.map((t) =>
        t.id === trialId
          ? {
              ...t,
              daysRemaining: t.daysRemaining + days,
              notes: [
                {
                  id: `note-${Date.now()}`,
                  authorName: "خالد السليمان",
                  authorRole: "سيلز المكاتب",
                  createdAt: isAr ? "الآن" : "Just now",
                  content: `تم تمديد التجربة المجانية لمدة +${days} أيام إضافية استجابة لطلب العميل.`,
                  statusSnapshot: t.followUpStatus,
                },
                ...t.notes,
              ],
            }
          : t
      )
    );
    toast.success(
      isAr
        ? `تم تمديد التجربة المجانية +${days} أيام للمكتب بنجاح`
        : `Extended trial by +${days} days`
    );
    if (notesTargetTrial?.id === trialId) {
      setNotesTargetTrial(null);
    }
  };

  const handleCreateTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName.trim() || !newPhone.trim() || !newEmail.trim()) {
      toast.error(isAr ? "يرجى تعبئة كافة الحقول المطلوبة" : "Please fill all fields");
      return;
    }

    const created: LawFirmTrial = {
      id: `trial-${Date.now()}`,
      firmName: newFirmName.trim(),
      ownerName: newOwnerName.trim() || (isAr ? "صاحب المكتب" : "Firm Owner"),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      city: newCity,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      daysRemaining: 14,
      followUpStatus: "not_contacted",
      assignedSalesRep: newRep,
      assignedSalesRepAvatar: "from-[#d4a759] to-[#b38032]",
      planName: newPlan,
      notes: [
        {
          id: `note-${Date.now()}`,
          authorName: newRep,
          authorRole: "سيلز المكاتب",
          createdAt: isAr ? "الآن" : "Just now",
          content: "بدأ المكتب تجربة مجانية لمدة 14 يوماً عبر نموذج السيلز.",
          statusSnapshot: "not_contacted",
        },
      ],
    };

    setTrials([created, ...trials]);
    toast.success(
      isAr
        ? `تم تسجيل التجربة المجانية لمكتب "${newFirmName}" بنجاح!`
        : `Trial created for "${newFirmName}"`
    );
    setIsAddTrialModalOpen(false);
    setNewFirmName("");
    setNewOwnerName("");
    setNewPhone("");
    setNewEmail("");
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      {/* 1. Sidebar */}
      <DashboardSidebar />

      {/* 2. Main Body */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopNavbar />

        {/* Workspace */}
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

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#eeddbb]/70 dark:border-[#383126] bg-gradient-to-br from-[#ffffff] via-[#fbf8f2] to-[#f4ece0] dark:from-[#1e1b18] dark:via-[#191715] dark:to-[#141210] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c29547]/10 dark:bg-[#c29547]/20 text-[#966e2e] dark:text-[#eeddbb] border border-[#c29547]/30">
                    <Flame className="w-3.5 h-3.5 text-[#c29547]" />
                    <span>
                      {isAr
                        ? "فريق المبيعات والسيلز • متابعة التجارب المجانية والتحويل"
                        : "Sales Pipeline • Free Trials & Conversion Tracking"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917] dark:text-[#f5f4f0]">
                    {isAr
                      ? "متابعة التجارب المجانية (Free Trials Pipeline)"
                      : "Free Trials Pipeline & Follow-up"}
                  </h1>

                  <p className="text-sm sm:text-base text-[#6b6357] dark:text-[#a8a196] max-w-2xl leading-relaxed">
                    {isAr
                      ? "لوحة مخصصة لفريق السيلز لمتابعة المكاتب التي بدأت تجربة مجانية، معرفة ميعاد الانتهاء، تسجيل محاضر التواصل والملاحظات، وتحويلهم لاشتراكات مدفوعة."
                      : "Track law firms on free trials, monitor expiration countdowns, record follow-up notes, and convert leads into paid subscribers."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(
                        isAr
                          ? "تم تصدير تقرير التجارب المجانية كملف CSV بنجاح"
                          : "Exported free trials pipeline as CSV"
                      );
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1c1917] dark:text-[#f5f4f0] bg-white dark:bg-[#25221d] border border-[#e2d5c0] dark:border-[#3d372e] shadow-sm hover:border-[#c29547] hover:text-[#c29547] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#c29547]" />
                    <span>{isAr ? "تصدير التقرير" : "Export"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddTrialModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#c29547] via-[#b38538] to-[#996c25] hover:opacity-95 shadow-md shadow-[#c29547]/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? "إضافة تجربة مجانية" : "Add Trial"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top 4 Quick KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. التجارب الشغالة دلوقتي */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196]">
                    {isAr ? "تجارب شغالة دلوقتي" : "Active Trials"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf5eb] dark:bg-[#282218] flex items-center justify-center text-[#c29547]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1c1917] dark:text-[#f5f4f0]">
                  {activeTrialsCount}
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1 flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">+14%</span>
                  <span>{isAr ? "مقارنة بالشهر الماضي" : "vs last month"}</span>
                </div>
              </div>

              {/* 2. تجارب هتخلص خلال ٣ أيام */}
              <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                    {isAr ? "تخلص خلال ٣ أيام" : "Expiring in 3 Days"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {expiringSoonCount}
                </div>
                <div className="text-[11px] text-rose-600/80 font-bold mt-1">
                  {isAr ? "تحتاج تواصل ومتابعة سريعة جداً!" : "Requires immediate follow-up!"}
                </div>
              </div>

              {/* 3. نسبة اللي كملوا واشتركوا */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196]">
                    {isAr ? "نسبة التحويل للاشتراك" : "Conversion Rate"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {conversionRate}%
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr
                    ? `${convertedInterestedCount} مكاتب أبدت الرغبة والاشتراك`
                    : `${convertedInterestedCount} converted or interested`}
                </div>
              </div>

              {/* 4. اللي خلصت ومشتركوش */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a196]">
                    {isAr ? "خلصت ومشتركوش" : "Expired (No Sub)"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {expiredNotSubscribedCount}
                </div>
                <div className="text-[11px] text-[#8c8279] mt-1">
                  {isAr
                    ? "جاهزون لإعادة الاتصال مع كود خصم"
                    : "Ready for re-pitch & discount"}
                </div>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="p-4 rounded-2xl border border-[#ded5c6]/70 dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8279]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={
                      isAr
                        ? "ابحث باسم المكتب، المالك، الجوال، المدينة..."
                        : "Search by firm, owner, phone, city..."
                    }
                    className="w-full ps-10 pe-4 py-2 text-xs rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] focus:bg-white dark:focus:bg-[#1a1714] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0] transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#8c8279] hover:text-[#c29547]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-48">
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

                  <div className="w-44">
                    <LuxurySelect<string>
                      value={repFilter}
                      onChange={(val) => {
                        setRepFilter(val);
                        setCurrentPage(1);
                      }}
                      options={repOptions}
                      minWidth="w-full"
                    />
                  </div>

                  <div className="w-48">
                    <LuxurySelect<string>
                      value={urgencyFilter}
                      onChange={(val) => {
                        setUrgencyFilter(val);
                        setCurrentPage(1);
                      }}
                      options={urgencyOptions}
                      minWidth="w-full"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    title={isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                    className="p-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-[#7c7366] dark:text-[#a8a196] hover:bg-[#faf5eb] dark:hover:bg-[#282218] hover:text-[#c29547] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trials Table */}
            <div className="rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1714] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#ded5c6] dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] text-[#7c7366] dark:text-[#a8a196]">
                      <th className="py-3.5 px-4 w-11 text-center">
                        <div className="flex items-center justify-center">
                          <LuxuryCheckbox
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            title={isAr ? "تحديد الكل" : "Select all"}
                          />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "مكتب المحاماة والمالك" : "Law Firm & Owner"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "تاريخ الانتهاء" : "End Date"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "باقي كام يوم" : "Remaining Days"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "حالة المتابعة" : "Follow-up Status"}
                      </th>
                      <th className="py-3.5 px-4 text-start font-bold">
                        {isAr ? "المسؤول (السيلز)" : "Sales Representative"}
                      </th>
                      <th className="py-3.5 px-4 text-center font-bold">
                        {isAr ? "الإجراء والملاحظات" : "Action & Notes"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ded5c6]/60 dark:divide-[#2f2a24]/60">
                    {paginatedTrials.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#8c8279]">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Clock className="w-8 h-8 text-[#c29547]/50" />
                            <p className="font-bold text-sm text-[#2c2825] dark:text-[#eeddbb]">
                              {isAr
                                ? "لم يتم العثور على أي مكاتب تجربة مطابقة"
                                : "No matching free trials found"}
                            </p>
                            <p className="text-xs">
                              {isAr
                                ? "جرّب تغيير عبارة البحث أو إعادة ضبط الفلاتر المحددة"
                                : "Try adjusting your search terms or clearing filters"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedTrials.map((trial) => {
                        const statusBadge = getStatusBadge(trial.followUpStatus);
                        const dynamicAction = getDynamicActionConfig(trial);
                        const isExpiringSoon =
                          trial.daysRemaining >= 0 && trial.daysRemaining <= 3;
                        const isExpired = trial.daysRemaining < 0;

                        return (
                          <tr
                            key={trial.id}
                            className={`transition-colors ${
                              selectedTrialIds.includes(trial.id)
                                ? "bg-[#faf5eb]/90 dark:bg-[#282218]/50"
                                : "hover:bg-[#faf5eb]/40 dark:hover:bg-[#201d1a]/40"
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-4 w-11 text-center">
                              <div className="flex items-center justify-center">
                                <LuxuryCheckbox
                                  checked={selectedTrialIds.includes(trial.id)}
                                  onChange={() => handleToggleSelect(trial.id)}
                                />
                              </div>
                            </td>

                            {/* Firm Name & Owner Details */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#eeddbb] to-[#c29547]/30 dark:from-[#382b18] dark:to-[#5c4623] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#966e2e] dark:text-[#eeddbb] shrink-0 font-bold text-xs shadow-2xs">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#1c1917] dark:text-[#f5f4f0] text-xs sm:text-sm">
                                      {trial.firmName}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#faf5eb] dark:bg-[#282218] text-[#966e2e] dark:text-[#eeddbb] border border-[#eeddbb]/80 dark:border-[#4d3a1f]">
                                      {trial.city}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#8c8279] flex items-center gap-2 mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3 text-[#c29547]" />
                                      {trial.ownerName}
                                    </span>
                                    <span>•</span>
                                    <span className="font-mono">{trial.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* End Date */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#524b43] dark:text-[#c4bcb1]">
                                <Calendar className="w-3.5 h-3.5 text-[#8c8279]" />
                                <span>{trial.endDate}</span>
                              </div>
                            </td>

                            {/* Remaining Days (Highlighted in red if <= 3 days) */}
                            <td className="py-4 px-4">
                              {isExpired ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>
                                    {isAr
                                      ? `منتهية منذ ${Math.abs(trial.daysRemaining)} يوم`
                                      : `Expired ${Math.abs(trial.daysRemaining)}d ago`}
                                  </span>
                                </span>
                              ) : isExpiringSoon ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-rose-600 text-white animate-pulse shadow-sm shadow-rose-600/30">
                                  <Flame className="w-3 h-3" />
                                  <span>
                                    {trial.daysRemaining === 0
                                      ? isAr
                                        ? "تنتهي اليوم!"
                                        : "Ends Today!"
                                      : isAr
                                      ? `باقي ${trial.daysRemaining} أيام فقط!`
                                      : `Only ${trial.daysRemaining} days left!`}
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {isAr
                                      ? `باقي ${trial.daysRemaining} يوم`
                                      : `${trial.daysRemaining} days left`}
                                  </span>
                                </span>
                              )}
                            </td>

                            {/* Follow-up Status */}
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${statusBadge.className}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`}
                                />
                                <span>{statusBadge.label}</span>
                              </span>
                            </td>

                            {/* Assigned Sales Rep */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full bg-gradient-to-tr ${trial.assignedSalesRepAvatar} text-white font-bold flex items-center justify-center text-[10px] shadow-2xs shrink-0`}
                                >
                                  {trial.assignedSalesRep.charAt(0)}
                                </div>
                                <span className="font-semibold text-[#1c1917] dark:text-[#f5f4f0] text-xs">
                                  {trial.assignedSalesRep}
                                </span>
                              </div>
                            </td>

                            {/* Actions & Notes Button */}
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {/* Dynamic Action Button */}
                                <button
                                  type="button"
                                  onClick={dynamicAction.action}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dynamicAction.className}`}
                                >
                                  <dynamicAction.icon className="w-3.5 h-3.5" />
                                  <span>{dynamicAction.label}</span>
                                </button>

                                {/* Notes Timeline Button */}
                                <button
                                  type="button"
                                  onClick={() => openNotesModal(trial)}
                                  title={
                                    isAr
                                      ? `عرض وإضافة ملاحظات (${trial.notes.length})`
                                      : "View/Add Notes"
                                  }
                                  className="relative p-1.5 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-[#7c7366] dark:text-[#a8a196] hover:bg-[#faf5eb] dark:hover:bg-[#282218] hover:text-[#c29547] transition-colors cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-[#c29547]" />
                                  {trial.notes.length > 0 && (
                                    <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-[#c29547] text-white text-[9px] font-black flex items-center justify-center">
                                      {trial.notes.length}
                                    </span>
                                  )}
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

              {/* Table Footer with Pagination */}
              <div className="p-4 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 text-[#7c7366] dark:text-[#a8a196]">
                  <span>
                    {isAr
                      ? `عرض ${fromIndex} إلى ${toIndex} من أصل ${totalFiltered} تجربة مجانية`
                      : `Showing ${fromIndex} to ${toIndex} of ${totalFiltered} trials`}
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
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] text-[#7c7366] dark:text-[#a8a196] hover:bg-white dark:hover:bg-[#282218] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
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
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] text-[#7c7366] dark:text-[#a8a196] hover:bg-white dark:hover:bg-[#282218] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    {isAr ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span className="px-3 py-1 font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {activePage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={activePage === totalPages}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] text-[#7c7366] dark:text-[#a8a196] hover:bg-white dark:hover:bg-[#282218] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
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
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] text-[#7c7366] dark:text-[#a8a196] hover:bg-white dark:hover:bg-[#282218] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
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
        </main>
      </div>

      {/* Notes & Follow-up History Modal */}
      {notesTargetTrial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "سجل متابعة وملاحظات المكتب" : "Follow-up & Notes Log"}
                  </h2>
                  <p className="text-xs text-[#8c8279] dark:text-[#9e968a]">
                    {notesTargetTrial.firmName} ({notesTargetTrial.ownerName})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Extend Trial Quick Button */}
                <button
                  type="button"
                  onClick={() => handleExtendTrial(notesTargetTrial.id, 7)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? "تمديد +7 أيام" : "Extend +7 Days"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNotesTargetTrial(null)}
                  className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Notes History & New Note Form */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Previous Notes Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-[#7c7366] dark:text-[#a8a196] uppercase tracking-wider">
                  {isAr ? "الملاحظات ومحاضر الاتصال السابقة" : "Previous Notes"}
                </h3>

                {notesTargetTrial.notes.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-[#ded5c6] dark:border-[#2f2a24] text-center text-xs text-[#8c8279]">
                    {isAr
                      ? "لا توجد ملاحظات مسجلة بعد لهذا المكتب. اكتب أول ملاحظة بالأسفل!"
                      : "No notes recorded yet. Write the first note below!"}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notesTargetTrial.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 rounded-2xl border border-[#eeddbb]/70 dark:border-[#382b18] bg-[#faf8f4] dark:bg-[#201d1a] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1c1917] dark:text-[#f5f4f0]">
                              {note.authorName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c29547]/10 text-[#966e2e] dark:text-[#eeddbb]">
                              {note.authorRole}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#8c8279]">
                            {note.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-[#524b43] dark:text-[#c4bcb1] leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Note Form */}
              <form onSubmit={handleSaveNote} className="space-y-4 pt-4 border-t border-[#ded5c6]/60 dark:border-[#2f2a24]">
                <h3 className="text-xs font-extrabold text-[#7c7366] dark:text-[#a8a196] uppercase tracking-wider">
                  {isAr ? "إضافة ملاحظة جديدة وتحديث الحالة" : "Add Note & Update Status"}
                </h3>

                {/* Follow-up Status Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "تحديث حالة المتابعة:" : "Update Follow-up Status:"}
                  </label>
                  <LuxurySelect<FollowUpStatus>
                    value={modalNewStatus}
                    onChange={(val) => setModalNewStatus(val)}
                    options={[
                      { value: "not_contacted", label: isAr ? "لسه ما كلمناهوش" : "Not Contacted" },
                      { value: "contacted", label: isAr ? "اتكلمنا" : "Contacted" },
                      { value: "interested", label: isAr ? "مهتم ومتحمس" : "Interested" },
                      { value: "did_not_subscribe", label: isAr ? "مشتركش (محاولة أخرى)" : "Did Not Subscribe" },
                    ]}
                    className="w-full"
                    minWidth="w-full"
                  />
                </div>

                {/* Note Content Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "تفاصيل المحادثة والملاحظات:" : "Call Details & Notes:"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={
                      isAr
                        ? "اكتب ملخص المكالمة أو استفسارات العميل أو كود الخصم المتفق عليه..."
                        : "Write meeting summary, objections, or agreed discount code..."
                    }
                    className="w-full p-3 rounded-2xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0] shadow-2xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNotesTargetTrial(null)}
                    className="px-4 py-2.5 rounded-full text-xs font-bold text-[#524b43] dark:text-[#c4bcb1] hover:bg-stone-100 dark:hover:bg-[#25201b] transition-colors cursor-pointer"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(194,149,71,0.3)] transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? "حفظ الملاحظة وتحديث الحالة" : "Save Note & Status"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick Contact Modal */}
      {contactTargetTrial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "التواصل المباشر مع المكتب" : "Direct Contact"}
                  </h2>
                  <p className="text-xs text-[#8c8279] dark:text-[#9e968a]">
                    {contactTargetTrial.firmName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactTargetTrial(null)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl border border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] space-y-1.5">
                <span className="text-[11px] text-[#8c8279]">
                  {isAr ? "المالك / المسؤول القانوني:" : "Owner / Contact Person:"}
                </span>
                <p className="font-bold text-sm text-[#1c1917] dark:text-[#f5f4f0]">
                  {contactTargetTrial.ownerName}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* WhatsApp Direct */}
                <a
                  href={`https://wa.me/${contactTargetTrial.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    isAr
                      ? `السلام عليكم ورحمة الله، أ. ${contactTargetTrial.ownerName}، معك ${contactTargetTrial.assignedSalesRep} من منصة الجودي لإدارة مكاتب المحاماة. نتمنى تكون تجربتك ممتازة وحابين نساعدك في أي استفسار.`
                      : `Hello ${contactTargetTrial.ownerName}, this is ${contactTargetTrial.assignedSalesRep} from El-Judy Law Platform.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    // Update status to contacted
                    setTrials((prev) =>
                      prev.map((t) =>
                        t.id === contactTargetTrial.id
                          ? { ...t, followUpStatus: "contacted" }
                          : t
                      )
                    );
                    setContactTargetTrial(null);
                    toast.success(
                      isAr
                        ? "تم فتح محادثة الواتساب وتحديث الحالة إلى 'اتكلمنا'"
                        : "Opened WhatsApp and marked as contacted"
                    );
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isAr ? "محادثة واتساب" : "WhatsApp"}</span>
                </a>

                {/* Direct Phone Call */}
                <a
                  href={`tel:${contactTargetTrial.phone}`}
                  onClick={() => {
                    setTrials((prev) =>
                      prev.map((t) =>
                        t.id === contactTargetTrial.id
                          ? { ...t, followUpStatus: "contacted" }
                          : t
                      )
                    );
                    setContactTargetTrial(null);
                    toast.success(
                      isAr
                        ? "تم بدء الاتصال وتحديث الحالة إلى 'اتكلمنا'"
                        : "Calling and marked as contacted"
                    );
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#c29547] hover:bg-[#b38032] text-white font-bold text-xs shadow-md shadow-[#c29547]/20 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isAr ? "اتصال هاتفي" : "Call Phone"}</span>
                </a>
              </div>

              {/* Email Option */}
              <a
                href={`mailto:${contactTargetTrial.email}?subject=${encodeURIComponent(
                  isAr ? "متابعة تجربتك المجانية في منصة الجودي للمحاماة" : "El-Judy Platform Free Trial Follow-up"
                )}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#524b43] dark:text-[#c4bcb1] hover:bg-[#faf5eb] dark:hover:bg-[#282218] transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#c29547]" />
                <span>{isAr ? "إرسال بريد إلكتروني رسمي" : "Send Official Email"}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Trial Modal */}
      {isAddTrialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "إضافة تجربة مجانية جديدة" : "Add Free Trial"}
                  </h2>
                  <p className="text-xs text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "تسجيل مكتب لبدء تجربة 14 يوماً" : "Register firm for 14-day trial"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTrialModalOpen(false)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrial} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                  {isAr ? "اسم مكتب المحاماة:" : "Law Firm Name:"}
                </label>
                <input
                  type="text"
                  required
                  value={newFirmName}
                  onChange={(e) => setNewFirmName(e.target.value)}
                  placeholder={isAr ? "مثال: شركة النور للمحاماة" : "e.g. Al-Noor Law Firm"}
                  className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "اسم صاحب المكتب / المحامي:" : "Owner Name:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder={isAr ? "أ. فهد المنصور" : "Lawyer Name"}
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "المدينة:" : "City:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder={isAr ? "الرياض، جدة..." : "Riyadh, Jeddah..."}
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "رقم الجوال:" : "Phone:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "البريد الإلكتروني:" : "Email:"}
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="firm@example.com"
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "الباقة التجريبية:" : "Trial Plan:"}
                  </label>
                  <LuxurySelect<string>
                    value={newPlan}
                    onChange={(val) => setNewPlan(val)}
                    options={[
                      { value: "الباقة الأساسية (تجربة)", label: "الباقة الأساسية (تجربة)" },
                      { value: "الباقة المتقدمة (تجربة)", label: "الباقة المتقدمة (تجربة)" },
                      { value: "باقة النخبة (تجربة)", label: "باقة النخبة (تجربة)" },
                    ]}
                    className="w-full"
                    minWidth="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "السيلز المسؤول:" : "Assigned Sales Rep:"}
                  </label>
                  <LuxurySelect<string>
                    value={newRep}
                    onChange={(val) => setNewRep(val)}
                    options={[
                      { value: "خالد السليمان", label: "خالد السليمان" },
                      { value: "عمر القحطاني", label: "عمر القحطاني" },
                    ]}
                    className="w-full"
                    minWidth="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ded5c6]/60 dark:border-[#2f2a24]">
                <button
                  type="button"
                  onClick={() => setIsAddTrialModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-[#524b43] dark:text-[#c4bcb1] hover:bg-stone-100 dark:hover:bg-[#25201b] transition-colors cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(194,149,71,0.3)] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? "بدء التجربة المجانية" : "Start Free Trial"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
