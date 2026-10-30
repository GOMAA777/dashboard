"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  Send,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Ban,
  Plus,
  X,
  CreditCard,
  QrCode,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { LuxurySelect, SelectOption } from "@/components/shared/LuxurySelect";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { useUIStore } from "@/stores/use-ui-store";
import { PaymentGatewaysSection } from "./PaymentGatewaysSection";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  firmName: string;
  firmOwner: string;
  firmPhone: string;
  firmEmail: string;
  planName: string;
  billingCycle: "monthly" | "annually";
  amount: number;
  vatAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  daysOverdue?: number;
  paymentMethod: "mada" | "visa" | "sadad" | "bank_transfer" | "tabby" | "unpaid";
  status: "paid" | "pending" | "overdue";
  notes?: string;
}

const initialInvoices: InvoiceItem[] = [
  {
    id: "inv-101",
    invoiceNumber: "INV-2026-0891",
    firmName: "شركة العثمان للمحاماة والاستشارات القانونية",
    firmOwner: "د. عبد العزيز العثمان",
    firmPhone: "+966501234567",
    firmEmail: "contact@alothman-law.com",
    planName: "باقة المكاتب المتقدمة (Professional)",
    billingCycle: "annually",
    amount: 6990,
    vatAmount: 1048.5,
    totalAmount: 8038.5,
    issueDate: "2026-10-01",
    dueDate: "2026-10-08",
    paymentMethod: "mada",
    status: "paid",
  },
  {
    id: "inv-102",
    invoiceNumber: "INV-2026-0892",
    firmName: "مجموعة الراجحي للمحاماة والتحكيم",
    firmOwner: "أ. سليمان الراجحي",
    firmPhone: "+966559876543",
    firmEmail: "info@alrajhi-legal.sa",
    planName: "باقة الشركات والمؤسسات الكبرى (Enterprise)",
    billingCycle: "annually",
    amount: 14990,
    vatAmount: 2248.5,
    totalAmount: 17238.5,
    issueDate: "2026-09-15",
    dueDate: "2026-09-22",
    daysOverdue: 23,
    paymentMethod: "unpaid",
    status: "overdue",
    notes: "تأخر السداد بعد انتهاء مهلة التجديد، تم إرسال إشعار أولي عبر البريد",
  },
  {
    id: "inv-103",
    invoiceNumber: "INV-2026-0893",
    firmName: "مكتب المحامي فهد التميمي",
    firmOwner: "أ. فهد التميمي",
    firmPhone: "+966533344555",
    firmEmail: "fahad@tamimi-law.com",
    planName: "باقة المحامي الفردي",
    billingCycle: "monthly",
    amount: 299,
    vatAmount: 44.85,
    totalAmount: 343.85,
    issueDate: "2026-10-12",
    dueDate: "2026-10-19",
    paymentMethod: "unpaid",
    status: "pending",
  },
  {
    id: "inv-104",
    invoiceNumber: "INV-2026-0894",
    firmName: "دار العدالة للاستشارات الشرعية والقانونية",
    firmOwner: "الشيخ منصور القحطاني",
    firmPhone: "+966544455666",
    firmEmail: "info@adalah-law.com",
    planName: "باقة المكاتب المتقدمة (Professional)",
    billingCycle: "monthly",
    amount: 699,
    vatAmount: 104.85,
    totalAmount: 803.85,
    issueDate: "2026-09-28",
    dueDate: "2026-10-05",
    daysOverdue: 10,
    paymentMethod: "unpaid",
    status: "overdue",
    notes: "فشل الدفع التلقائي عبر بطاقة فيزا المسجلة",
  },
  {
    id: "inv-105",
    invoiceNumber: "INV-2026-0895",
    firmName: "مكتب المحامية نورة السبيعي",
    firmOwner: "أ. نورة السبيعي",
    firmPhone: "+966566677888",
    firmEmail: "noura@subaie-law.sa",
    planName: "باقة المحامي الفردي",
    billingCycle: "annually",
    amount: 2990,
    vatAmount: 448.5,
    totalAmount: 3438.5,
    issueDate: "2026-10-05",
    dueDate: "2026-10-12",
    paymentMethod: "visa",
    status: "paid",
  },
  {
    id: "inv-106",
    invoiceNumber: "INV-2026-0896",
    firmName: "شركة الحصان وشركاؤه للمحاماة",
    firmOwner: "د. طارق الحصان",
    firmPhone: "+966577788999",
    firmEmail: "tariq@alhessan.com",
    planName: "باقة المكاتب المتقدمة (Professional)",
    billingCycle: "monthly",
    amount: 699,
    vatAmount: 104.85,
    totalAmount: 803.85,
    issueDate: "2026-10-10",
    dueDate: "2026-10-17",
    paymentMethod: "sadad",
    status: "paid",
  },
  {
    id: "inv-107",
    invoiceNumber: "INV-2026-0897",
    firmName: "مكتب المحامي خالد الغامدي",
    firmOwner: "أ. خالد الغامدي",
    firmPhone: "+966588899000",
    firmEmail: "khaled@ghamdi-law.com",
    planName: "باقة المحامي الفردي",
    billingCycle: "monthly",
    amount: 299,
    vatAmount: 44.85,
    totalAmount: 343.85,
    issueDate: "2026-09-20",
    dueDate: "2026-09-27",
    daysOverdue: 18,
    paymentMethod: "unpaid",
    status: "overdue",
    notes: "تأخير السداد، يحتاج تواصل هاتفي للتأكيد",
  },
  {
    id: "inv-108",
    invoiceNumber: "INV-2026-0898",
    firmName: "مكتب النور للاستشارات القانونية والتحكيم",
    firmOwner: "أ. ماجد الشمري",
    firmPhone: "+966599900111",
    firmEmail: "majed@alnoor-law.sa",
    planName: "باقة المكاتب المتقدمة (Professional)",
    billingCycle: "annually",
    amount: 6990,
    vatAmount: 1048.5,
    totalAmount: 8038.5,
    issueDate: "2026-10-14",
    dueDate: "2026-10-21",
    paymentMethod: "unpaid",
    status: "pending",
  },
];

export function InvoicesView() {
  const { language } = useUIStore();
  const isAr = language === "ar";
  const [activeSection, setActiveSection] = useQueryState("section", { defaultValue: "invoices" });

  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState<"all" | "overdue" | "paid" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Invoice for ZATCA Modal Preview
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceItem | null>(null);

  // Manual Invoice Creation Modal
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [newFirmName, setNewFirmName] = useState("");
  const [newFirmOwner, setNewFirmOwner] = useState("");
  const [newFirmEmail, setNewFirmEmail] = useState("");
  const [newFirmPhone, setNewFirmPhone] = useState("");
  const [newPlanName, setNewPlanName] = useState("باقة المكاتب المتقدمة (Professional)");
  const [newBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [newAmount, setNewAmount] = useState<number>(699);
  const [newDueDate, setNewDueDate] = useState<string>("2026-10-25");

  // WhatsApp Reminder Modal
  const [whatsappModal, setWhatsappModal] = useState<{
    isOpen: boolean;
    invoice: InvoiceItem | null;
  }>({
    isOpen: false,
    invoice: null,
  });

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

  // Quick Action: Send Email Reminder
  const handleSendEmailReminder = (invoice: InvoiceItem) => {
    toast.success(
      isAr ? `تم إرسال إشعار تذكيري للمكتب عبر البريد` : `Reminder email dispatched`,
      {
        description: `${invoice.firmName} (${invoice.firmEmail}) - فاتورة #${invoice.invoiceNumber}`,
      }
    );
  };

  // Quick Action: Suspend Firm Account
  const handleSuspendFirm = (invoice: InvoiceItem) => {
    setConfirmDialog({
      isOpen: true,
      title: isAr
        ? `تعليق حساب (${invoice.firmName}) بسبب تأخر السداد؟`
        : `Suspend account for ${invoice.firmName}?`,
      description: isAr
        ? `تأخرت الفاتورة رقم ${invoice.invoiceNumber} بمبلغ ${invoice.totalAmount.toLocaleString()} ر.س لأكثر من ${invoice.daysOverdue || 0} يوم. سيتم إيقاف دخول المحامين للنظام مؤقتاً لحين تسوية الفاتورة.`
        : `Invoice ${invoice.invoiceNumber} is overdue by ${invoice.daysOverdue || 0} days. Suspending will disable firm access until paid.`,
      confirmLabel: isAr ? "نعم، تعليق الحساب مؤقتاً" : "Yes, Suspend Account",
      variant: "danger",
      onConfirm: () => {
        toast.warning(
          isAr
            ? `تم تعليق حساب المكتب مؤقتاً وإشعار الإدارة المالية`
            : `Firm account has been temporarily suspended`,
          {
            description: `${invoice.firmName} - فاتورة #${invoice.invoiceNumber}`,
          }
        );
      },
    });
  };

  // Quick Action: Download Invoice PDF
  const handleDownloadInvoice = (invoice: InvoiceItem) => {
    toast.success(
      isAr ? `جاري تحميل الفاتورة الضريبية #${invoice.invoiceNumber}` : `Downloading invoice PDF`,
      {
        description: `النسخة المعتمدة بختم هيئة الزكاة والضريبة والجمارك (ZATCA)`,
      }
    );
  };

  // Quick Action: Mark Invoice as Paid
  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: "paid",
              paymentMethod: "mada",
              daysOverdue: undefined,
            }
          : inv
      )
    );
    toast.success(isAr ? "تم تحديث حالة الفاتورة إلى مدفوعة بنجاح" : "Invoice marked as paid");
  };

  // Create Manual Invoice Submit
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName.trim()) {
      toast.error("يرجى إدخال اسم مكتب المحاماة");
      return;
    }

    const baseAmount = Number(newAmount) || 0;
    const vat = baseAmount * 0.15;
    const total = baseAmount + vat;
    const newInvoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoiceObj: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: newInvoiceNumber,
      firmName: newFirmName,
      firmOwner: newFirmOwner || "صاحب المكتب",
      firmPhone: newFirmPhone || "+966500000000",
      firmEmail: newFirmEmail || "firm@legal.sa",
      planName: newPlanName,
      billingCycle: newBillingCycle,
      amount: baseAmount,
      vatAmount: vat,
      totalAmount: total,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: newDueDate || "2026-10-30",
      paymentMethod: "unpaid",
      status: "pending",
    };

    setInvoices((prev) => [newInvoiceObj, ...prev]);
    setIsAddInvoiceOpen(false);
    toast.success(
      isAr ? `تم إصدار الفاتورة الضريبية ${newInvoiceNumber} بنجاح` : `Invoice issued successfully`,
      {
        description: `المبلغ: ${total.toLocaleString()} ر.س شامل ضريبة القيمة المضافة 15%`,
      }
    );
  };

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    // Tab filter
    if (activeTab === "overdue" && inv.status !== "overdue") return false;
    if (activeTab === "paid" && inv.status !== "paid") return false;
    if (activeTab === "pending" && inv.status !== "pending") return false;

    // Search query
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.firmOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.firmEmail.toLowerCase().includes(searchQuery.toLowerCase());

    // Payment method filter
    const matchesMethod =
      paymentMethodFilter === "all" ? true : inv.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesMethod;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Financial KPIs
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const overdueInvoicesList = invoices.filter((inv) => inv.status === "overdue");
  const overdueAmount = overdueInvoicesList.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const paymentOptions: SelectOption[] = [
    { value: "all", label: isAr ? "جميع طرق الدفع" : "All Methods" },
    { value: "mada", label: isAr ? "مدى (Mada)" : "Mada" },
    { value: "visa", label: isAr ? "فيزا / ماستركارد" : "Visa / Mastercard" },
    { value: "sadad", label: isAr ? "سداد (SADAD)" : "SADAD" },
    { value: "bank_transfer", label: isAr ? "تحويل بنكي" : "Bank Transfer" },
    { value: "unpaid", label: isAr ? "غير مدفوع بعد" : "Unpaid" },
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
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8c8279] dark:text-[#9e968a] mb-1">
                  <span>{isAr ? "الرئيسية" : "Dashboard"}</span>
                  <span>/</span>
                  <span>{isAr ? "المالية" : "Finance"}</span>
                  <span>/</span>
                  <span className="text-[#c29547] dark:text-[#d4a759]">
                    {activeSection === "gateways"
                      ? (isAr ? "طرق الدفع وبوابات التحصيل" : "Payment Gateways & Methods")
                      : (isAr ? "الفواتير والمعاملات المالية" : "Invoices & Financials")}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2c2825] dark:text-[#f5f4f0] flex items-center gap-2.5">
                  {activeSection === "gateways" ? (
                    <>
                      <CreditCard className="w-7 h-7 text-[#c29547] dark:text-[#d4a759]" />
                      <span>{isAr ? "طرق الدفع وبوابات التحصيل" : "Payment Gateways & Methods"}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-7 h-7 text-[#c29547] dark:text-[#d4a759]" />
                      <span>{isAr ? "الفواتير والتحصيلات والمتأخرات" : "Invoices & Revenue"}</span>
                    </>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-[#736b63] dark:text-[#a8a196] mt-1 max-w-3xl">
                  {activeSection === "gateways"
                    ? (isAr
                        ? "إدارة وتكوين بوابات الدفع الإلكتروني المعتمدة لتحصيل رسوم اشتراكات مكاتب المحاماة وفواتير منصة الجودي."
                        : "Configure and manage active payment gateways and direct bank transfer rails.")
                    : (isAr
                        ? "سجل الفواتير الضريبية المعتمدة (ZATCA)، متابعة المتأخرات، إرسال تنبيهات السداد بالواتساب والإيميل، وإجراءات تعليق الحسابات المتأخرة."
                        : "ZATCA compliant e-invoicing directory, overdue invoices tracker, WhatsApp and Email payment reminders, and suspension triggers.")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {activeSection !== "gateways" && (
                  <button
                    type="button"
                    onClick={() => setIsAddInvoiceOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(194,149,71,0.35)] hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>{isAr ? "إصدار فاتورة جديدة" : "Issue New Invoice"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Navigation Switcher Tabs (Invoices vs Gateways) */}
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] rounded-2xl w-full sm:w-fit shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveSection("invoices")}
                className={cn(
                  "flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                  activeSection !== "gateways"
                    ? "bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white shadow-xs"
                    : "text-[#736b63] dark:text-[#a8a196] hover:text-[#1c1917] dark:hover:text-white hover:bg-[#faf5eb] dark:hover:bg-[#201c17]"
                )}
              >
                <FileText className="size-4" />
                <span>{isAr ? "الفواتير وسجل التحصيلات" : "Invoices & Revenue"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("gateways")}
                className={cn(
                  "flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                  activeSection === "gateways"
                    ? "bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white shadow-xs"
                    : "text-[#736b63] dark:text-[#a8a196] hover:text-[#1c1917] dark:hover:text-white hover:bg-[#faf5eb] dark:hover:bg-[#201c17]"
                )}
              >
                <CreditCard className="size-4" />
                <span>{isAr ? "طرق الدفع وبوابات التحصيل" : "Payment Gateways & Methods"}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  activeSection === "gateways"
                    ? "bg-white/20 text-white"
                    : "bg-[#c29547]/10 text-[#c29547] dark:text-[#d4a759]"
                )}>
                  3 نشطة
                </span>
              </button>
            </div>

            {activeSection === "gateways" ? (
              <PaymentGatewaysSection />
            ) : (
              <>
                {/* Top 4 Financial KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KPI 1: Total Collected Revenue */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "إجمالي التحصيلات (المحصل)" : "Total Collections"}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {totalRevenue.toLocaleString()}
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ر.س</span>
                  </div>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "فواتير مدفوعة ومحصلة بنجاح" : "Settled invoices"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* KPI 2: Overdue Invoices Alert */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-rose-300 dark:border-rose-900/60 shadow-xs flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 end-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {isAr ? "فواتير متأخرة السداد" : "Overdue Invoices"}
                    </p>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {overdueInvoicesList.length}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                      {overdueAmount.toLocaleString()}
                    </h3>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">ر.س</span>
                  </div>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                    {isAr ? "تجاوزت تاريخ الاستحقاق المحدد" : "Passed due date"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              {/* KPI 3: Pending Invoices */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "فواتير معلقة بانتظار السداد" : "Pending Invoices"}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                      {pendingAmount.toLocaleString()}
                    </h3>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">ر.س</span>
                  </div>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "ضمن فترة الاستحقاق النظامية" : "Within valid due date"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* KPI 4: Total Invoices Count */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "إجمالي الفواتير الصادرة" : "Issued Invoices"}
                  </p>
                  <h3 className="text-2xl font-black text-[#2c2825] dark:text-[#f5f4f0] mt-1 font-mono">
                    {invoices.length}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "فواتير إلكترونية معتمدة" : "Registered ZATCA invoices"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Special Alert Banner for Overdue Invoices if any exist */}
            {overdueInvoicesList.length > 0 && activeTab !== "overdue" && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200">
                      {isAr
                        ? `تنبيه مالي: يوجد ${overdueInvoicesList.length} فواتير متأخرة السداد بإجمالي ${overdueAmount.toLocaleString()} ر.س`
                        : `Attention: ${overdueInvoicesList.length} overdue invoices totaling ${overdueAmount.toLocaleString()} SAR`}
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      {isAr
                        ? "يمكنك الانتقال لتاب المتأخرات لإرسال تذكيرات بالواتساب أو تعليق الحسابات."
                        : "Switch to overdue tab to dispatch reminders or suspend accounts."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("overdue")}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shrink-0"
                >
                  {isAr ? "عرض المتأخرات فقط" : "View Overdue Only"}
                </button>
              </div>
            )}

            {/* Invoices Tabs & Filter Bar */}
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
                  {isAr ? "جميع الفواتير" : "All Invoices"} ({invoices.length})
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
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isAr ? "فواتير متأخرة السداد" : "Overdue"}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200/40 text-current">
                    {overdueInvoicesList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("paid");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "paid"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-[#736b63] dark:text-[#a8a196] hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  }`}
                >
                  {isAr ? "المدفوعة" : "Paid"} ({invoices.filter((i) => i.status === "paid").length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("pending");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "pending"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-[#736b63] dark:text-[#a8a196] hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  }`}
                >
                  {isAr ? "المعلقة" : "Pending"} ({invoices.filter((i) => i.status === "pending").length})
                </button>
              </div>

              {/* Search & Method Filters */}
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
                    placeholder={isAr ? "بحث برقم الفاتورة أو اسم المكتب..." : "Search invoice # or firm..."}
                    className="w-full h-10 ps-10 pe-4 rounded-2xl text-xs bg-[#fbf9f5] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-full sm:w-48">
                    <LuxurySelect
                      options={paymentOptions}
                      value={paymentMethodFilter}
                      onChange={(val) => {
                        setPaymentMethodFilter(val);
                        setCurrentPage(1);
                      }}
                      placeholder="طريقة الدفع"
                    />
                  </div>

                  {(searchQuery || paymentMethodFilter !== "all" || activeTab !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setPaymentMethodFilter("all");
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

            {/* Invoices Table */}
            <div className="rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb]/50 dark:bg-[#201c17]/50 text-[#8c8279] dark:text-[#9e968a]">
                      <th className="p-4 text-start font-bold">{isAr ? "رقم الفاتورة" : "Invoice #"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "مكتب المحاماة" : "Law Firm"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "الباقة والاشتراك" : "Plan"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "المبلغ الإجمالي" : "Total Amount"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "تاريخ الإصدار / الاستحقاق" : "Dates"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "طريقة الدفع" : "Method"}</th>
                      <th className="p-4 text-start font-bold">{isAr ? "الحالة" : "Status"}</th>
                      <th className="p-4 text-end font-bold">{isAr ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ded5c6]/40 dark:divide-[#2f2a24]">
                    {paginatedInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#8c8279] dark:text-[#9e968a]">
                          {isAr ? "لا توجد فواتير مطابقة لخيارات البحث" : "No invoices match the selected criteria"}
                        </td>
                      </tr>
                    ) : (
                      paginatedInvoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-[#faf5eb]/30 dark:hover:bg-[#201c17]/30 transition-colors"
                        >
                          {/* Invoice Number */}
                          <td className="p-4 font-mono font-bold text-[#c29547] dark:text-[#d4a759]">
                            {inv.invoiceNumber}
                          </td>

                          {/* Firm */}
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                                {inv.firmName}
                              </p>
                              <p className="text-[11px] text-[#8c8279] mt-0.5">
                                {inv.firmOwner}
                              </p>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-[#2c2825] dark:text-[#f5f4f0]">
                                {inv.planName}
                              </p>
                              <p className="text-[10px] text-[#8c8279]">
                                {inv.billingCycle === "annually" ? (isAr ? "سنوي (وفر شهرين)" : "Annual") : (isAr ? "شهري" : "Monthly")}
                              </p>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-4">
                            <div className="font-mono font-black text-sm text-[#2c2825] dark:text-[#f5f4f0]">
                              {inv.totalAmount.toLocaleString()} <span className="text-[11px] font-bold text-[#c29547]">ر.س</span>
                            </div>
                            <span className="text-[10px] text-[#8c8279]">
                              {isAr ? `شامل الضريبة ${inv.vatAmount.toFixed(1)} ر.س` : `incl. VAT`}
                            </span>
                          </td>

                          {/* Dates */}
                          <td className="p-4 font-mono text-[11px]">
                            <div>
                              <span className="text-[#8c8279]">{isAr ? "إصدار:" : "Issued:"} </span>
                              <span className="text-[#2c2825] dark:text-[#f5f4f0]">{inv.issueDate}</span>
                            </div>
                            <div className="mt-0.5">
                              <span className="text-[#8c8279]">{isAr ? "استحقاق:" : "Due:"} </span>
                              <span
                                className={
                                  inv.status === "overdue"
                                    ? "font-bold text-rose-600 dark:text-rose-400"
                                    : "text-[#2c2825] dark:text-[#f5f4f0]"
                                }
                              >
                                {inv.dueDate}
                              </span>
                            </div>
                          </td>

                          {/* Payment Method */}
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#faf5eb] dark:bg-[#201c17] border border-[#ded5c6]/60 dark:border-[#2f2a24] text-[#2c2825] dark:text-[#f5f4f0]">
                              {inv.paymentMethod === "mada"
                                ? isAr ? "مدى (Mada)" : "Mada"
                                : inv.paymentMethod === "visa"
                                ? "Visa / Mastercard"
                                : inv.paymentMethod === "sadad"
                                ? "سداد (SADAD)"
                                : inv.paymentMethod === "bank_transfer"
                                ? isAr ? "تحويل بنكي" : "Bank Transfer"
                                : isAr ? "بانتظار الدفع" : "Unpaid"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {inv.status === "paid" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isAr ? "مدفوعة" : "Paid"}</span>
                              </span>
                            ) : inv.status === "overdue" ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 animate-pulse">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>{isAr ? "متأخرة السداد" : "Overdue"}</span>
                                </span>
                                {inv.daysOverdue && (
                                  <p className="text-[10px] font-bold text-rose-600 font-mono">
                                    {isAr ? `متأخر ${inv.daysOverdue} يوم` : `${inv.daysOverdue}d overdue`}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                                <Clock className="w-3 h-3" />
                                <span>{isAr ? "معلقة" : "Pending"}</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview ZATCA Invoice */}
                              <button
                                type="button"
                                onClick={() => setPreviewInvoice(inv)}
                                className="p-2 rounded-xl bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-[#8c8279] hover:text-[#c29547] hover:border-[#c29547] transition-all cursor-pointer"
                                title={isAr ? "معاينة الفاتورة الضريبية ZATCA" : "Preview Invoice"}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Download PDF */}
                              <button
                                type="button"
                                onClick={() => handleDownloadInvoice(inv)}
                                className="p-2 rounded-xl bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-[#8c8279] hover:text-[#c29547] hover:border-[#c29547] transition-all cursor-pointer"
                                title={isAr ? "تحميل PDF" : "Download PDF"}
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              {/* Overdue/Pending specific actions */}
                              {inv.status !== "paid" && (
                                <>
                                  {/* WhatsApp Reminder */}
                                  <button
                                    type="button"
                                    onClick={() => setWhatsappModal({ isOpen: true, invoice: inv })}
                                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all cursor-pointer"
                                    title={isAr ? "تذكير عبر الواتساب" : "WhatsApp Reminder"}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Email Reminder */}
                                  <button
                                    type="button"
                                    onClick={() => handleSendEmailReminder(inv)}
                                    className="p-2 rounded-xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] text-[#c29547] hover:opacity-90 transition-all cursor-pointer"
                                    title={isAr ? "إرسال تذكير بالإيميل" : "Email Reminder"}
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Mark Paid Quick */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkAsPaid(inv.id)}
                                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all cursor-pointer"
                                    title={isAr ? "تسجيل كمدفوعة يدوياً" : "Mark as Paid"}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Suspend account if overdue */}
                                  {inv.status === "overdue" && (
                                    <button
                                      type="button"
                                      onClick={() => handleSuspendFirm(inv)}
                                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                                      title={isAr ? "تعليق حساب المكتب" : "Suspend Firm"}
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-4 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb]/30 dark:bg-[#201c17]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c8279]">
                <div>
                  {isAr ? "عرض" : "Showing"}{" "}
                  <span className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {paginatedInvoices.length}
                  </span>{" "}
                  {isAr ? "من أصل" : "of"}{" "}
                  <span className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {filteredInvoices.length}
                  </span>{" "}
                  {isAr ? "فاتورة" : "invoices"}
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
              </>
            )}
          </div>
        </main>
      </div>

      {/* ZATCA Tax Invoice Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start max-h-[92vh] flex flex-col">
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    فاتورة ضريبية مبسطة (ZATCA e-Invoice)
                  </h3>
                  <p className="text-xs font-mono text-[#8c8279]">
                    {previewInvoice.invoiceNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(previewInvoice)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewInvoice(null)}
                  className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Sheet Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Header Details */}
              <div className="flex items-start justify-between border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-5">
                <div>
                  <h2 className="text-lg font-black text-[#c29547]">منصة الجودي للحلول القانونية</h2>
                  <p className="text-[11px] text-[#8c8279]">شركة تقنية المعلومات والأنظمة السحابية</p>
                  <p className="font-mono text-[11px] text-[#2c2825] dark:text-[#f5f4f0] mt-1">
                    الرقم الضريبي: 310948572600003
                  </p>
                  <p className="text-[11px] text-[#8c8279]">الرياض، المملكة العربية السعودية</p>
                </div>

                {/* QR Code Placeholder for ZATCA */}
                <div className="p-3 rounded-2xl bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] flex flex-col items-center justify-center text-center">
                  <QrCode className="w-16 h-16 text-[#2c2825] dark:text-[#f5f4f0]" />
                  <span className="text-[9px] font-bold text-[#8c8279] mt-1">رمز ZATCA المعتمد</span>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#faf5eb]/50 dark:bg-[#201c17]/50 border border-[#ded5c6]/60 dark:border-[#2f2a24]">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#8c8279]">فاتورة إلى (العميل):</p>
                  <p className="font-extrabold text-[#2c2825] dark:text-[#f5f4f0] mt-0.5 text-sm">
                    {previewInvoice.firmName}
                  </p>
                  <p className="text-[#8c8279] mt-0.5">{previewInvoice.firmOwner}</p>
                  <p className="font-mono text-[#8c8279]">{previewInvoice.firmPhone}</p>
                  <p className="font-mono text-[#8c8279]">{previewInvoice.firmEmail}</p>
                </div>

                <div className="text-end space-y-1">
                  <div>
                    <span className="text-[#8c8279]">تاريخ الإصدار: </span>
                    <span className="font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                      {previewInvoice.issueDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8c8279]">تاريخ الاستحقاق: </span>
                    <span className="font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                      {previewInvoice.dueDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8c8279]">حالة السداد: </span>
                    <span className="font-bold text-[#c29547]">
                      {previewInvoice.status === "paid"
                        ? "مدفوعة بالكامل"
                        : previewInvoice.status === "overdue"
                        ? "متأخرة السداد"
                        : "بانتظار السداد"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-[#ded5c6]/60 dark:border-[#2f2a24] rounded-2xl overflow-hidden">
                <table className="w-full text-start border-collapse">
                  <thead>
                    <tr className="bg-[#faf5eb] dark:bg-[#201c17] text-[#8c8279] border-b border-[#ded5c6]/60 dark:border-[#2f2a24]">
                      <th className="p-3 text-start font-bold">الوصف والخدمة</th>
                      <th className="p-3 text-center font-bold">المدة</th>
                      <th className="p-3 text-end font-bold">المبلغ الأساسي</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#ded5c6]/30 dark:border-[#2f2a24]">
                      <td className="p-3 font-semibold text-[#2c2825] dark:text-[#f5f4f0]">
                        اشتراك في {previewInvoice.planName}
                      </td>
                      <td className="p-3 text-center text-[#8c8279]">
                        {previewInvoice.billingCycle === "annually" ? "12 شهراً" : "شهر واحد"}
                      </td>
                      <td className="p-3 text-end font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                        {previewInvoice.amount.toLocaleString()} ر.س
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 p-4 rounded-2xl bg-[#faf5eb]/50 dark:bg-[#201c17]/50 border border-[#ded5c6]/60 dark:border-[#2f2a24]">
                  <div className="flex justify-between text-[#8c8279]">
                    <span>المبلغ غير شامل الضريبة:</span>
                    <span className="font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                      {previewInvoice.amount.toLocaleString()} ر.س
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8c8279]">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span className="font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                      {previewInvoice.vatAmount.toFixed(1)} ر.س
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] flex justify-between font-black text-sm text-[#2c2825] dark:text-[#f5f4f0]">
                    <span>المجموع الإجمالي:</span>
                    <span className="font-mono text-[#c29547]">
                      {previewInvoice.totalAmount.toLocaleString()} ر.س
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Direct Reminder Modal */}
      {whatsappModal.isOpen && whatsappModal.invoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] p-6 shadow-2xl text-start space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded5c6]/60 dark:border-[#2f2a24]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    إرسال تذكير سداد عبر الواتساب
                  </h3>
                  <p className="text-[11px] font-mono text-[#8c8279]">
                    {whatsappModal.invoice.firmPhone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappModal({ isOpen: false, invoice: null })}
                className="p-1 rounded-full text-[#8c8279] hover:text-[#2c2825] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                نص رسالة التذكير الرسمية:
              </label>
              <div className="p-3.5 rounded-2xl bg-[#faf5eb] dark:bg-[#201c17] border border-[#ded5c6]/60 dark:border-[#2f2a24] text-[#2c2825] dark:text-[#f5f4f0] leading-relaxed whitespace-pre-line text-xs font-sans">
                {`سعادة ${whatsappModal.invoice.firmOwner} المحترم،
تحية طيبة من إدارة منصة الجودي لإدارة مكاتب المحاماة،

نود تذكيركم بصدور الفاتورة رقم (${whatsappModal.invoice.invoiceNumber}) المستحقة عن اشتراككم في (${whatsappModal.invoice.planName}) بمبلغ إجمالي (${whatsappModal.invoice.totalAmount.toLocaleString()} ر.س).

يمكنكم السداد مباشرة عبر بوابة الدفع الآمنة على الرابط التالي:
https://aljoody-law.sa/pay/${whatsappModal.invoice.invoiceNumber}

شاكرين لكم تعاونكم الدائم،
فريق الإدارة المالية - منصة الجودي`}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setWhatsappModal({ isOpen: false, invoice: null })}
                className="px-4 py-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#736b63] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("تم إرسال رسالة التذكير عبر واتساب بنجاح");
                  setWhatsappModal({ isOpen: false, invoice: null });
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Invoice Creation Modal */}
      {isAddInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    إصدار فاتورة ضريبية جديدة
                  </h3>
                  <p className="text-xs text-[#8c8279]">
                    إصدار فاتورة يدوية لمكتب محاماة مع احتساب الضريبة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddInvoiceOpen(false)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">اسم مكتب المحاماة *</label>
                <input
                  type="text"
                  required
                  value={newFirmName}
                  onChange={(e) => setNewFirmName(e.target.value)}
                  placeholder="مثال: شركة النخبة للمحاماة"
                  className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">اسم صاحب المكتب</label>
                  <input
                    type="text"
                    value={newFirmOwner}
                    onChange={(e) => setNewFirmOwner(e.target.value)}
                    placeholder="د. فهد..."
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">رقم الجوال الرسمي</label>
                  <input
                    type="text"
                    value={newFirmPhone}
                    onChange={(e) => setNewFirmPhone(e.target.value)}
                    placeholder="+966 50..."
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newFirmEmail}
                    onChange={(e) => setNewFirmEmail(e.target.value)}
                    placeholder="firm@legal.sa"
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">نوع الباقة</label>
                  <input
                    type="text"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl text-xs bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">المبلغ غير شامل الضريبة (ر.س) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono font-bold bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">تاريخ الاستحقاق *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf5eb]/60 dark:bg-[#201c17]/60 border border-[#ded5c6]/60 dark:border-[#2f2a24] space-y-1.5 font-mono">
                <div className="flex justify-between text-[#8c8279]">
                  <span>ضريبة القيمة المضافة 15%:</span>
                  <span>{(newAmount * 0.15).toFixed(1)} ر.س</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#2c2825] dark:text-[#f5f4f0] pt-1 border-t border-[#ded5c6]/40">
                  <span>الإجمالي شامل الضريبة:</span>
                  <span className="text-[#c29547]">{(newAmount * 1.15).toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddInvoiceOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#736b63] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-sm"
                >
                  إصدار الفاتورة الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <LuxuryAlertDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
