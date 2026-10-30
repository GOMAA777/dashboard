"use client";

import React, { useState } from "react";
import {
  Headphones,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Plus,
  Send,
  X,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { LuxurySelect, SelectOption } from "@/components/shared/LuxurySelect";
import { useUIStore } from "@/stores/use-ui-store";

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: "lawyer" | "support_agent";
  timestamp: string;
  content: string;
  attachmentName?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  firmName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  subject: string;
  category: "technical" | "billing" | "integration" | "feature_request";
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "closed";
  createdAt: string;
  createdHoursAgo: number; // for SLA calculation
  isOverdueSla: boolean; // > 24 hours without closure
  lastReplyBy: "lawyer" | "support";
  messages: TicketMessage[];
}

const initialTickets: SupportTicket[] = [
  {
    id: "tck-1",
    ticketNumber: "TCK-4819",
    firmName: "شركة العثمان للمحاماة والاستشارات",
    contactPerson: "د. عبد العزيز العثمان",
    contactPhone: "+966501234567",
    contactEmail: "contact@alothman-law.com",
    subject: "مشكلة في مزامنة جلسات المحكمة مع بوابة ناجز",
    category: "integration",
    priority: "high",
    status: "open",
    createdAt: "منذ 27 ساعة",
    createdHoursAgo: 27,
    isOverdueSla: true, // Overdue SLA (> 24 hours)
    lastReplyBy: "lawyer",
    messages: [
      {
        id: "m-1",
        senderName: "د. عبد العزيز العثمان",
        senderRole: "lawyer",
        timestamp: "أمس، الساعة 11:30 ص",
        content:
          "السلام عليكم، لاحظنا أن جدول الجلسات للأسبوع القادم لم يتم تحديثه تلقائياً من بوابة ناجز رغم أن الربط مفعل لدينا في الإعدادات. نرجو المساعدة العاجلة لأن لدينا جلسة مهمة غداً.",
        attachmentName: "najiz_sync_error.png",
      },
      {
        id: "m-2",
        senderName: "فريق الدعم الفني - سلطان",
        senderRole: "support_agent",
        timestamp: "أمس، الساعة 01:15 م",
        content:
          "وعليكم السلام دكتور عبد العزيز، مرحباً بك. نقوم حالياً بفحص سجلات الاتصال مع API ناجز للتحقق من استجابة الخادم وسنوافيكم بالحل خلال وقت وجيز.",
      },
      {
        id: "m-3",
        senderName: "د. عبد العزيز العثمان",
        senderRole: "lawyer",
        timestamp: "اليوم، الساعة 09:00 ص",
        content: "ما زالت المشكلة قائمة والمزامنة متوقفة، برجاء سرعة إفادتنا.",
      },
    ],
  },
  {
    id: "tck-2",
    ticketNumber: "TCK-4820",
    firmName: "مجموعة الراجحي للمحاماة والتحكيم",
    contactPerson: "أ. سليمان الراجحي",
    contactPhone: "+966559876543",
    contactEmail: "info@alrajhi-legal.sa",
    subject: "استفسار بخصوص تفعيل الفوترة الإلكترونية المرحلة الثانية (زاتكا)",
    category: "billing",
    priority: "medium",
    status: "in_progress",
    createdAt: "منذ 14 ساعة",
    createdHoursAgo: 14,
    isOverdueSla: false,
    lastReplyBy: "support",
    messages: [
      {
        id: "m-4",
        senderName: "أ. سليمان الراجحي",
        senderRole: "lawyer",
        timestamp: "أمس، الساعة 08:00 م",
        content:
          "نود ربط حسابنا بمنصة فاتورة التابعة لهيئة الزكاة والضريبة والجمارك لإصدار رمز الاستجابة السريع التشفيري (Cryptographic Stamp). ما هي الخطوات المطلوبة من جهتنا؟",
      },
      {
        id: "m-5",
        senderName: "الدعم المالي - أمل",
        senderRole: "support_agent",
        timestamp: "أمس، الساعة 09:30 م",
        content:
          "أهلاً أستاذ سليمان، قمنا بتجهيز ملف الإعدادات وشهادة الـ CSR المطلوبة، وسيقوم أحد مهندسينا بالتواصل معكم لإتمام خطوة الـ Onboarding سوياً.",
      },
    ],
  },
  {
    id: "tck-3",
    ticketNumber: "TCK-4821",
    firmName: "مكتب المحامي فهد التميمي",
    contactPerson: "أ. فهد التميمي",
    contactPhone: "+966533344555",
    contactEmail: "fahad@tamimi-law.com",
    subject: "طلب زيادة حد مساحة التخزين السحابي للمستندات",
    category: "feature_request",
    priority: "low",
    status: "open",
    createdAt: "منذ 4 ساعات",
    createdHoursAgo: 4,
    isOverdueSla: false,
    lastReplyBy: "lawyer",
    messages: [
      {
        id: "m-6",
        senderName: "أ. فهد التميمي",
        senderRole: "lawyer",
        timestamp: "اليوم، الساعة 10:00 ص",
        content:
          "السلام عليكم، وصلنا لنسبة 90% من مساحة التخزين في باقتنا الحالية ونرغب في ترقية السعة السحابية بمقدار 20 جيجابايت إضافية.",
      },
    ],
  },
  {
    id: "tck-4",
    ticketNumber: "TCK-4822",
    firmName: "دار العدالة للاستشارات الشرعية والقانونية",
    contactPerson: "الشيخ منصور القحطاني",
    contactPhone: "+966544455666",
    contactEmail: "info@adalah-law.com",
    subject: "تأخر تحميل ملفات الأحكام القضائية الكبيرة بصيغة PDF",
    category: "technical",
    priority: "high",
    status: "open",
    createdAt: "منذ 31 ساعة",
    createdHoursAgo: 31,
    isOverdueSla: true, // Overdue SLA (> 24 hours)
    lastReplyBy: "lawyer",
    messages: [
      {
        id: "m-7",
        senderName: "الشيخ منصور القحطاني",
        senderRole: "lawyer",
        timestamp: "أول أمس، الساعة 03:00 م",
        content:
          "عند محاولة رفع صكوك أحكام تتجاوز 40 ميجابايت تفشل العملية وتظهر رسالة خطأ بالاتصال.",
      },
    ],
  },
  {
    id: "tck-5",
    ticketNumber: "TCK-4823",
    firmName: "مكتب المحامية نورة السبيعي",
    contactPerson: "أ. نورة السبيعي",
    contactPhone: "+966566677888",
    contactEmail: "noura@subaie-law.sa",
    subject: "تغيير اسم النطاق المخصص لبوابة موكلي المكتب",
    category: "feature_request",
    priority: "medium",
    status: "closed",
    createdAt: "منذ 3 أيام",
    createdHoursAgo: 72,
    isOverdueSla: false,
    lastReplyBy: "support",
    messages: [
      {
        id: "m-8",
        senderName: "أ. نورة السبيعي",
        senderRole: "lawyer",
        timestamp: "منذ 3 أيام",
        content: "نرغب في ربط النطاق portal.subaie-law.sa ببوابة موكلينا.",
      },
      {
        id: "m-9",
        senderName: "فريق الدعم الفني - طارق",
        senderRole: "support_agent",
        timestamp: "منذ يومين",
        content: "تم توجيه سجلات الـ DNS وإصدار شهادة SSL بنجاح. النطاق يعمل الآن.",
      },
    ],
  },
];

export function TicketsView() {
  const { language } = useUIStore();
  const isAr = language === "ar";

  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "overdue" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Selected Ticket for Chat Drawer
  const [activeChatTicket, setActiveChatTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // New Ticket Creation Modal
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newFirmName, setNewFirmName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<SupportTicket["category"]>("technical");
  const [newPriority, setNewPriority] = useState<SupportTicket["priority"]>("high");
  const [newInitialMsg, setNewInitialMsg] = useState("");

  // Quick Action: Send Reply in Active Chat
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeChatTicket) return;

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      senderName: "الدعم الفني المباشر (أنت)",
      senderRole: "support_agent",
      timestamp: "الآن",
      content: replyMessage,
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === activeChatTicket.id) {
        return {
          ...t,
          status: t.status === "open" ? ("in_progress" as const) : t.status,
          lastReplyBy: "support" as const,
          isOverdueSla: false, // SLA fulfilled upon reply
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setActiveChatTicket((prev) =>
      prev
        ? {
            ...prev,
            status: prev.status === "open" ? "in_progress" : prev.status,
            lastReplyBy: "support",
            isOverdueSla: false,
            messages: [...prev.messages, newMsg],
          }
        : null
    );

    setReplyMessage("");
    toast.success(isAr ? "تم إرسال الرد إلى المكتب بنجاح" : "Reply dispatched to firm");
  };

  // Change Ticket Status inside Chat Drawer
  const handleChangeStatus = (ticketId: string, nextStatus: SupportTicket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
    setActiveChatTicket((prev) => (prev && prev.id === ticketId ? { ...prev, status: nextStatus } : prev));
    const statusLabels = {
      open: "مفتوحة",
      in_progress: "قيد المعالجة",
      closed: "تم الإغلاق والحل",
    };
    toast.success(`تم تحديث حالة التذكرة إلى: ${statusLabels[nextStatus]}`);
  };

  // Change Ticket Priority inside Chat Drawer
  const handleChangePriority = (ticketId: string, nextPriority: SupportTicket["priority"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, priority: nextPriority } : t))
    );
    setActiveChatTicket((prev) => (prev && prev.id === ticketId ? { ...prev, priority: nextPriority } : prev));
    toast.success("تم تحديث مستوى أولوية التذكرة");
  };

  // Create New Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName.trim() || !newSubject.trim()) {
      toast.error("يرجى ملء الحقول الإلزامية");
      return;
    }

    const newTicketObj: SupportTicket = {
      id: `tck-${Date.now()}`,
      ticketNumber: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      firmName: newFirmName,
      contactPerson: newContact || "محامي المكتب",
      contactPhone: "+966500000000",
      contactEmail: "contact@firm.sa",
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      status: "open",
      createdAt: "الآن",
      createdHoursAgo: 0,
      isOverdueSla: false,
      lastReplyBy: "lawyer",
      messages: [
        {
          id: `m-init-${Date.now()}`,
          senderName: newContact || newFirmName,
          senderRole: "lawyer",
          timestamp: "الآن",
          content: newInitialMsg || newSubject,
        },
      ],
    };

    setTickets((prev) => [newTicketObj, ...prev]);
    setIsNewTicketOpen(false);
    toast.success("تم فتح التذكرة الجديدة بنجاح وإشعار فريق الدعم");
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    if (activeTab === "open" && t.status === "closed") return false;
    if (activeTab === "closed" && t.status !== "closed") return false;
    if (activeTab === "overdue" && !t.isOverdueSla) return false;

    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === "all" ? true : t.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" ? true : t.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesCategory;
  });

  // Sort overdue tickets to the top if tab is "all" or "open"
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (a.isOverdueSla && !b.isOverdueSla) return -1;
    if (!a.isOverdueSla && b.isOverdueSla) return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage) || 1;
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // KPIs
  const totalTicketsCount = tickets.length;
  const openTicketsCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const overdueTicketsList = tickets.filter((t) => t.isOverdueSla && t.status !== "closed");

  const priorityOptions: SelectOption[] = [
    { value: "all", label: isAr ? "جميع الأولويات" : "All Priorities" },
    { value: "high", label: isAr ? "عاجلة جداً (High)" : "High Priority" },
    { value: "medium", label: isAr ? "متوسطة (Medium)" : "Medium Priority" },
    { value: "low", label: isAr ? "عادية / منخفضة" : "Low Priority" },
  ];

  const categoryOptions: SelectOption[] = [
    { value: "all", label: isAr ? "جميع التصنيفات" : "All Categories" },
    { value: "technical", label: isAr ? "خلل تقني في النظام" : "Technical Bug" },
    { value: "integration", label: isAr ? "ربط منصة ناجز ومسار" : "Najiz Integration" },
    { value: "billing", label: isAr ? "الفواتير والاشتراكات" : "Billing & Invoices" },
    { value: "feature_request", label: isAr ? "طلب ميزة أو تطوير" : "Feature Request" },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopNavbar />

        <main className="flex-1 w-full relative p-4 sm:p-6 lg:p-8">
          {/* Ambient Emblems */}
          <div
            className="fixed top-28 -left-28 w-[380px] h-[380px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div
            className="fixed bottom-10 -right-28 w-[420px] h-[420px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div className="relative z-10 w-full space-y-6 text-start">
            {/* Top Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8c8279] dark:text-[#9e968a] mb-1">
                  <span>{isAr ? "الرئيسية" : "Dashboard"}</span>
                  <span>/</span>
                  <span>{isAr ? "الدعم الفني" : "Helpdesk"}</span>
                  <span>/</span>
                  <span className="text-[#c29547] dark:text-[#d4a759]">
                    {isAr ? "تذاكر الدعم ومؤشر التأخير" : "Support Tickets & SLA"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2c2825] dark:text-[#f5f4f0] flex items-center gap-2.5">
                  <Headphones className="w-7 h-7 text-[#c29547] dark:text-[#d4a759]" />
                  <span>{isAr ? "مركز تذاكر الدعم ومؤشر الاستجابة (SLA)" : "Support Tickets & SLA"}</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#736b63] dark:text-[#a8a196] mt-1 max-w-3xl">
                  {isAr
                    ? "متابعة بلاغات مكاتب المحاماة، المحادثة المباشرة، مؤشر التذاكر المتأخرة لأكثر من 24 ساعة، وتغيير حالات البلاغات وأولوياتها."
                    : "Helpdesk tickets management, direct lawyer messaging, overdue 24h SLA alerts, and priority triage."}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(194,149,71,0.35)] hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{isAr ? "فتح تذكرة دعم جديدة" : "Create New Ticket"}</span>
                </button>
              </div>
            </div>

            {/* Top 4 Helpdesk KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Tickets */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "إجمالي التذاكر المسجلة" : "Total Tickets"}
                  </p>
                  <h3 className="text-2xl font-black text-[#2c2825] dark:text-[#f5f4f0] mt-1 font-mono">
                    {totalTicketsCount}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "جميع البلاغات الواردة" : "All customer requests"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>

              {/* Open & In Progress */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "تذاكر مفتوحة وقيد العمل" : "Open & In Progress"}
                  </p>
                  <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
                    {openTicketsCount + inProgressCount}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? `${openTicketsCount} جديدة، ${inProgressCount} قيد المعالجة` : "Active tickets"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Overdue SLA Indicator (> 24h) */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-rose-300 dark:border-rose-900/60 shadow-xs flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 end-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {isAr ? "مؤشر التأخير (> 24 ساعة)" : "Overdue SLA (> 24h)"}
                    </p>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {overdueTicketsList.length}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
                    {overdueTicketsList.length}
                  </h3>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                    {isAr ? "تجاوزت مهلة الرد النظامية" : "Urgent SLA violation"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400 animate-pulse">
                  <Flame className="w-6 h-6" />
                </div>
              </div>

              {/* Avg Response Time */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "متوسط زمن الاستجابة" : "Avg Response Time"}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      1.8
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ساعة</span>
                  </div>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "أسرع بـ 40% من الهدف" : "Within 4h SLA target"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Overdue SLA Notice Banner */}
            {overdueTicketsList.length > 0 && activeTab !== "overdue" && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200">
                      {isAr
                        ? `تنبيه أولوية: يوجد ${overdueTicketsList.length} تذاكر تجاوزت 24 ساعة بدون حل!`
                        : `Attention: ${overdueTicketsList.length} tickets passed the 24-hour SLA window`}
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      {isAr
                        ? "تم ترتيب التذاكر المتأخرة في بداية القائمة بلون مميز لسرعة تدخل فريق الدعم."
                        : "Overdue tickets have been pinned to the top of the table for immediate triage."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("overdue")}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shrink-0"
                >
                  {isAr ? "عرض المتأخرات فقط" : "View Overdue SLA"}
                </button>
              </div>
            )}

            {/* Filter & Tabs Bar */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs space-y-4">
              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-3 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "all"
                      ? "bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white shadow-xs"
                      : "text-[#736b63] dark:text-[#a8a196] hover:bg-[#faf5eb] dark:hover:bg-[#201c17]"
                  }`}
                >
                  {isAr ? "جميع التذاكر" : "All Tickets"} ({tickets.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("overdue");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeTab === "overdue"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isAr ? "المتأخرة (Overdue SLA)" : "Overdue SLA"}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200/40 text-current font-bold">
                    {overdueTicketsList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("open");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "open"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-[#736b63] dark:text-[#a8a196] hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  }`}
                >
                  {isAr ? "المفتوحة والنشطة" : "Active & Open"} ({openTicketsCount + inProgressCount})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("closed");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "closed"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-[#736b63] dark:text-[#a8a196] hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  }`}
                >
                  {isAr ? "المغلقة والمحلولة" : "Resolved"} ({tickets.filter((t) => t.status === "closed").length})
                </button>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-[#8c8279]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={isAr ? "بحث برقم التذكرة، اسم المكتب، الموضوع..." : "Search tickets..."}
                    className="w-full h-10 ps-10 pe-4 rounded-2xl text-xs bg-[#fbf9f5] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-full sm:w-44">
                    <LuxurySelect
                      options={priorityOptions}
                      value={priorityFilter}
                      onChange={(val) => {
                        setPriorityFilter(val);
                        setCurrentPage(1);
                      }}
                      placeholder="الأولوية"
                    />
                  </div>

                  <div className="w-full sm:w-48">
                    <LuxurySelect
                      options={categoryOptions}
                      value={categoryFilter}
                      onChange={(val) => {
                        setCategoryFilter(val);
                        setCurrentPage(1);
                      }}
                      placeholder="التصنيف"
                    />
                  </div>

                  {(searchQuery || priorityFilter !== "all" || categoryFilter !== "all" || activeTab !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setPriorityFilter("all");
                        setCategoryFilter("all");
                        setActiveTab("all");
                        setCurrentPage(1);
                      }}
                      className="p-2.5 rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] text-[#8c8279] hover:text-[#c29547] hover:border-[#c29547] transition-all cursor-pointer"
                      title={isAr ? "إعادة تعيين الفلاتر" : "Reset filters"}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb]/50 dark:bg-[#201c17]/50 text-[#8c8279] dark:text-[#9e968a]">
                      <th className="p-4 text-start font-bold">{isAr ? "رقم التذكرة" : "Ticket #"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "مكتب المحاماة" : "Law Firm"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "موضوع البلاغ" : "Subject"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "الأولوية" : "Priority"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "الحالة" : "Status"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "مؤشر الوقت / SLA" : "Time / SLA"}</th>
                      <th className="p-4 text-end font-bold">{isAr ? "الإجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ded5c6]/40 dark:divide-[#2f2a24]">
                    {paginatedTickets.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#8c8279] dark:text-[#9e968a]">
                          {isAr ? "لا توجد تذاكر مطابقة لمعايير البحث" : "No tickets match your query"}
                        </td>
                      </tr>
                    ) : (
                      paginatedTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className={`transition-colors ${
                            ticket.isOverdueSla && ticket.status !== "closed"
                              ? "bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/70"
                              : "hover:bg-[#faf5eb]/30 dark:hover:bg-[#201c17]/30"
                          }`}
                        >
                          {/* Ticket Number */}
                          <td className="p-4 font-mono font-bold text-[#c29547] dark:text-[#d4a759]">
                            {ticket.ticketNumber}
                          </td>

                          {/* Firm */}
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                                {ticket.firmName}
                              </p>
                              <p className="text-[11px] text-[#8c8279] mt-0.5">
                                {ticket.contactPerson} ({ticket.contactPhone})
                              </p>
                            </div>
                          </td>

                          {/* Subject & Category */}
                          <td className="p-4 max-w-xs">
                            <p className="font-semibold text-[#2c2825] dark:text-[#f5f4f0] truncate">
                              {ticket.subject}
                            </p>
                            <span className="text-[10px] text-[#8c8279] bg-[#faf5eb] dark:bg-[#201c17] px-2 py-0.5 rounded-md border border-[#ded5c6]/60 dark:border-[#2f2a24] mt-1 inline-block">
                              {ticket.category === "technical"
                                ? isAr ? "خلل تقني" : "Technical"
                                : ticket.category === "integration"
                                ? isAr ? "ربط ناجز" : "Najiz API"
                                : ticket.category === "billing"
                                ? isAr ? "مالية واشتراكات" : "Billing"
                                : isAr ? "طلب ميزة" : "Feature Request"}
                            </span>
                          </td>

                          {/* Priority */}
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                ticket.priority === "high"
                                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                                  : ticket.priority === "medium"
                                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                                  : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                              }`}
                            >
                              {ticket.priority === "high"
                                ? isAr ? "عاجلة جداً" : "High"
                                : ticket.priority === "medium"
                                ? isAr ? "متوسطة" : "Medium"
                                : isAr ? "عادية" : "Low"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {ticket.status === "closed" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isAr ? "تم الحل والإغلاق" : "Resolved"}</span>
                              </span>
                            ) : ticket.status === "in_progress" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                                <Clock className="w-3 h-3" />
                                <span>{isAr ? "قيد المعالجة" : "In Progress"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                                <Clock className="w-3 h-3" />
                                <span>{isAr ? "تذكرة مفتوحة" : "Open"}</span>
                              </span>
                            )}
                          </td>

                          {/* SLA & Time Indicator */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <p className="text-[11px] text-[#8c8279]">{ticket.createdAt}</p>
                              {ticket.isOverdueSla && ticket.status !== "closed" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-2xs animate-pulse">
                                  <Flame className="w-3 h-3" />
                                  <span>{isAr ? "متأخرة > 24 ساعة" : "Overdue SLA"}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Action Button */}
                          <td className="p-4 text-end">
                            <button
                              type="button"
                              onClick={() => setActiveChatTicket(ticket)}
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 ms-auto shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{isAr ? "فتح المحادثة" : "Open Chat"}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb]/30 dark:bg-[#201c17]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c8279]">
                <div>
                  {isAr ? "عرض" : "Showing"}{" "}
                  <span className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {paginatedTickets.length}
                  </span>{" "}
                  {isAr ? "من أصل" : "of"}{" "}
                  <span className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {sortedTickets.length}
                  </span>{" "}
                  {isAr ? "تذكرة" : "tickets"}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                  <span className="px-3 py-1 font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="p-1.5 rounded-lg border border-[#ded5c6] dark:border-[#2f2a24] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Ticket Interactive Chat Drawer / Modal */}
      {activeChatTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl h-full bg-white dark:bg-[#1a1714] border-s border-[#ded5c6] dark:border-[#2f2a24] shadow-2xl flex flex-col text-start">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17] flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#c29547]">
                    {activeChatTicket.ticketNumber}
                  </span>
                  {activeChatTicket.isOverdueSla && activeChatTicket.status !== "closed" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                      متأخرة (+24 ساعة)
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-[#2c2825] dark:text-[#f5f4f0] line-clamp-1">
                  {activeChatTicket.subject}
                </h3>
                <p className="text-xs text-[#8c8279]">
                  {activeChatTicket.firmName} - {activeChatTicket.contactPerson}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveChatTicket(null)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status / Priority Toolbar */}
            <div className="p-3 border-b border-[#ded5c6]/50 dark:border-[#2f2a24] bg-[#fbf9f5] dark:bg-[#1e1b18] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#8c8279] font-medium">الحالة:</span>
                <select
                  value={activeChatTicket.status}
                  onChange={(e) =>
                    handleChangeStatus(
                      activeChatTicket.id,
                      e.target.value as SupportTicket["status"]
                    )
                  }
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-[#2c2825] dark:text-[#f5f4f0] focus:outline-none focus:border-[#c29547]"
                >
                  <option value="open">مفتوحة</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="closed">تم الحل والإغلاق</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#8c8279] font-medium">الأولوية:</span>
                <select
                  value={activeChatTicket.priority}
                  onChange={(e) =>
                    handleChangePriority(
                      activeChatTicket.id,
                      e.target.value as SupportTicket["priority"]
                    )
                  }
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-[#2c2825] dark:text-[#f5f4f0] focus:outline-none focus:border-[#c29547]"
                >
                  <option value="high">عاجلة جداً</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">عادية</option>
                </select>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeChatTicket.messages.map((msg) => {
                const isSupport = msg.senderRole === "support_agent";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSupport ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#8c8279]">
                      <span className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                        {msg.senderName}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isSupport
                          ? "bg-gradient-to-tr from-[#faf5eb] to-[#f5ebd9] dark:from-[#2a241c] dark:to-[#332b21] border border-[#eeddbb] dark:border-[#54442e] text-[#2c2825] dark:text-[#f5f4f0] rounded-ts-none"
                          : "bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-[#1c1917] dark:text-[#f5f4f0] rounded-te-none shadow-2xs"
                      }`}
                    >
                      <p>{msg.content}</p>

                      {msg.attachmentName && (
                        <div className="mt-2.5 p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-[#ded5c6]/60 dark:border-[#2f2a24] flex items-center gap-2 text-[11px] font-mono text-[#c29547]">
                          <Paperclip className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{msg.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form
              onSubmit={handleSendReply}
              className="p-4 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb]/50 dark:bg-[#201c17]/50 space-y-2.5"
            >
              <textarea
                rows={3}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="اكتب رد الدعم الفني للمكتب هنا..."
                className="w-full p-3 rounded-2xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0] resize-none shadow-2xs"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#8c8279]">
                  <Paperclip className="w-4 h-4 cursor-pointer hover:text-[#c29547]" />
                  <span>إرفاق ملف أو لقطة شاشة</span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الرد</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    فتح تذكرة دعم فني جديدة
                  </h3>
                  <p className="text-xs text-[#8c8279]">
                    تسجيل بلاغ نيابة عن مكتب محاماة لمتابعته
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">اسم مكتب المحاماة *</label>
                  <input
                    type="text"
                    required
                    value={newFirmName}
                    onChange={(e) => setNewFirmName(e.target.value)}
                    placeholder="مثال: شركة العثمان للمحاماة"
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">اسم المحامي أو المتواصل</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="د. فهد..."
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">موضوع التذكرة / البلاغ *</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="موجز عن المشكلة..."
                  className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">التصنيف</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SupportTicket["category"])}
                    className="w-full h-11 px-3 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  >
                    <option value="technical">خلل تقني</option>
                    <option value="integration">ربط ناجز ومسار</option>
                    <option value="billing">الفواتير والاشتراكات</option>
                    <option value="feature_request">طلب ميزة</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">الأولوية</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as SupportTicket["priority"])}
                    className="w-full h-11 px-3 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  >
                    <option value="high">عاجلة جداً</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">عادية</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">تفاصيل الرسالة الأولية *</label>
                <textarea
                  rows={3}
                  required
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  placeholder="وصف المشكلة بالتفصيل..."
                  className="w-full p-3 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#736b63] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-sm"
                >
                  فتح التذكرة الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
