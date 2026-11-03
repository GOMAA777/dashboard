"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Scale,
  Calendar,
  Receipt,
  Download,
  Eye,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CreditCard,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Copy,
  Check,
  Send,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatters";
import { ClientOffice } from "../types/client.types";
import { InvoiceItem, PaymentMethodType } from "@/features/invoices/types/invoices.types";
import { initialInvoicesList } from "@/features/invoices/data/initialInvoices";
import { InvoiceDetailsModal } from "@/features/invoices/components/InvoiceDetailsModal";
import { CreateInvoiceModal } from "@/features/invoices/components/CreateInvoiceModal";
import { RecordPaymentModal } from "@/features/invoices/components/RecordPaymentModal";
import { UpgradeClientOfficePlanModal } from "./UpgradeClientOfficePlanModal";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ClientSubscriptionsInvoicesViewProps {
  office: ClientOffice | null;
  onBack: () => void;
}

export function ClientSubscriptionsInvoicesView({
  office,
  onBack,
}: ClientSubscriptionsInvoicesViewProps) {
  const { isEn, direction, t } = useLanguage();

  const officeName = office?.name || "—";
  const licenseNum = office?.licenseNumber && office.licenseNumber !== "—" ? office.licenseNumber.replace("ترخيص عدلي: ", "") : "—";
  const email = office?.email || "—";
  const phone = office?.phone || "—";
  const city = office?.city || "—";
  const [currentPlan, setCurrentPlan] = useState(office?.plan || "—");

  const isMonthly = (() => {
    const rawCycle = (office?.billingCycle || office?.activeSubscriptionDetails?.billingCycle || "").toLowerCase().trim();
    if (rawCycle.includes("سنو") || rawCycle.includes("year") || rawCycle.includes("annu")) return false;
    if (rawCycle.includes("month") || rawCycle.includes("شهري")) return true;
    const s = office?.subscriptionStart || office?.activeSubscriptionDetails?.startDate;
    const e = office?.subscriptionEnd || office?.activeSubscriptionDetails?.renewalDate;
    if (s && e) {
      const sTime = new Date(s).getTime();
      const eTime = new Date(e).getTime();
      if (!isNaN(sTime) && !isNaN(eTime) && eTime > sTime) {
        const diffDays = Math.round((eTime - sTime) / (1000 * 60 * 60 * 24));
        if (diffDays <= 45) return true;
        if (diffDays > 100) return false;
      }
    }
    const subAmt = Number(office?.activeSubscriptionDetails?.amount || 0);
    const mPrice = Number(office?.planDetails?.monthlyPrice || 0);
    const yPrice = Number(office?.planDetails?.yearlyPrice || 0);
    if (subAmt > 0 && mPrice > 0 && Math.abs(subAmt - mPrice) < 5) return true;
    if (subAmt > 0 && yPrice > 0 && Math.abs(subAmt - yPrice) < 5) return false;
    return false;
  })();

  // Filter invoices for this client or provide realistic invoices matching this law firm
  const [clientInvoices, setClientInvoices] = useState<InvoiceItem[]>([]);

  // Filter state for this client's invoices
  const [invoiceTab, setInvoiceTab] = useState<"all" | "paid" | "pending">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<InvoiceItem | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  // Calculated totals for this client
  const totalPaid = clientInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPending = clientInvoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const filteredInvoices = useMemo(() => {
    if (invoiceTab === "all") return clientInvoices;
    return clientInvoices.filter((i) => i.status === invoiceTab);
  }, [clientInvoices, invoiceTab]);

  const handleCopy = (num: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    toast.success(isEn ? "Invoice number copied!" : "تم نسخ رقم الفاتورة بنجاح!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPdf = (inv: InvoiceItem) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: isEn ? `Generating PDF for ${inv.invoiceNumber}...` : `جارٍ تحميل الفاتورة ${inv.invoiceNumber}...`,
      success: isEn ? `Invoice ${inv.invoiceNumber} downloaded!` : `تم تحميل الفاتورة ${inv.invoiceNumber} بنجاح!`,
      error: isEn ? "Failed to download" : "فشل التحميل",
    });
  };

  const handleConfirmPayment = (
    invoice: InvoiceItem,
    data: { method: PaymentMethodType; ref: string }
  ) => {
    setClientInvoices((prev) =>
      prev.map((i) =>
        i.id === invoice.id
          ? {
              ...i,
              status: "paid",
              paymentMethod: data.method,
              transactionReference: data.ref,
              paidAt: new Date().toISOString().replace("T", " ").substring(0, 19),
              zatcaComplianceStatus: "cleared",
            }
          : i
      )
    );
    setIsPaymentOpen(false);
    setSelectedInvoiceForPayment(null);
    toast.success(isEn ? "Payment recorded successfully!" : "تم تسجيل سداد الفاتورة بنجاح!");
  };

  const handleCreateNewInvoice = (newInv: InvoiceItem) => {
    setClientInvoices((prev) => [newInv, ...prev]);
    setIsCreateInvoiceOpen(false);
    toast.success(
      isEn
        ? `New Invoice ${newInv.invoiceNumber} issued for ${officeName}!`
        : `تم إصدار الفاتورة ${newInv.invoiceNumber} لمكتب ${officeName} بنجاح!`
    );
  };

  if (!office) {
    return (
      <div className="bg-white dark:bg-[#221812] p-8 rounded-[8px] text-center border border-[#eae8e4] dark:border-[#38271c]">
        <p>{isEn ? "Office not found" : "لم يتم العثور على بيانات المكتب"}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#9c6402] text-white rounded-[6px] text-[13px] font-bold"
        >
          {isEn ? "Back to Clients" : "العودة لقائمة العملاء"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 font-['Cairo',sans-serif] text-start select-none">
      {/* 1. TOP BAR: Back Button & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#221812] p-5 sm:p-6 rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="size-9 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] flex items-center justify-center transition-colors cursor-pointer"
            title={isEn ? "Back to Clients List" : "العودة لقائمة العملاء"}
          >
            {direction === "rtl" ? (
              <ArrowRight className="size-4" />
            ) : (
              <ArrowLeft className="size-4" />
            )}
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Subscriptions & Invoices" : "إدارة الاشتراكات والفواتير"}
              </h1>
              <span className="bg-[#fffbeb] text-[#92400e] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] border border-[#fde68a] dark:border-[#e29d38]/50 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {officeName}
              </span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#514537] dark:text-[#a89f91] mt-0.5">
              {isEn
                ? "Manage billing cycles, plan quotas, and official ZATCA tax invoices for this client only."
                : "إدارة تفاصيل الباقة، دورات الفوترة، وحدود الموارد وسجل الفواتير الضريبية لهذا المكتب فقط."}
            </p>
          </div>
        </div>

        {/* Action: Issue New Invoice for this firm */}
        <button
          type="button"
          onClick={() => setIsCreateInvoiceOpen(true)}
          className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-4 py-2 rounded-[6px] font-bold text-[13px] flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>{isEn ? "Issue Invoice for this Client" : "إصدار فاتورة جديدة لهذا المكتب"}</span>
        </button>
      </div>

      {/* 2. CLIENT IDENTITY & CURRENT SUBSCRIPTION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Client Profile & Current Plan */}
        <div className="lg:col-span-2 bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-5 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-[48px] -start-[48px] size-[180px] bg-gradient-to-br from-[#ffddb6]/20 to-transparent blur-[25px] rounded-full pointer-events-none" />

          {/* Office Header */}
          <div className="flex items-start justify-between gap-4 z-10">
            <div className="flex items-center gap-3.5">
              {/* Firm Seal / Avatar */}
              <div className="size-14 rounded-[8px] bg-gradient-to-br from-[#9c6402] to-[#623e00] flex flex-col items-center justify-center text-white shadow-sm shrink-0">
                <Scale className="size-6 text-[#ffddb6]" />
                <span className="text-[#ffddb6] text-[8px] font-bold uppercase mt-0.5">
                  {office.initial}
                </span>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {officeName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#514537] dark:text-[#a89f91] mt-1">
                  <span>{t("ترخيص عدلي:", "Justice License:")} {licenseNum}</span>
                  <span>•</span>
                  <span>{t("المدينة:", "City:")} {city}</span>
                  <span>•</span>
                  <span>{t("الرقم الضريبي:", "Tax VAT:")} 310492857100003</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40 dark:text-[#6ee7b7] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
              <span className="size-2 bg-[#1b7340] dark:bg-[#10b981] rounded-full" />
              <span>{isEn ? "Active Subscription" : "اشتراك نشط وساري"}</span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#f5f3ef] dark:border-[#38271c] text-[12px]">
            <div className="flex items-center gap-2 text-[#514537] dark:text-[#a89f91]">
              <Building2 className="size-4 text-[#837565] shrink-0" />
              <span className="truncate">{office.owner}</span>
            </div>
            <div className="flex items-center gap-2 text-[#514537] dark:text-[#a89f91]">
              <Mail className="size-4 text-[#837565] shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-[#514537] dark:text-[#a89f91]">
              <Phone className="size-4 text-[#837565] shrink-0" />
              <span className="truncate font-mono">{phone}</span>
            </div>
          </div>

          {/* Subscription Limits / Consumption Progress */}
          <div className="bg-[#faf8f5] dark:bg-[#1c140f] p-4 rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#9c6402] dark:text-[#e29d38]" />
                <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {currentPlan}
                </span>
                <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                  {isMonthly
                    ? `(${t("سداد شهري", "Monthly Billing")}${office?.subscriptionEnd ? ` - ${t("يتجدد في", "renews on")} ${formatDate(office.subscriptionEnd, "dd MMMM yyyy")}` : ""})`
                    : `(${t("سداد سنوي", "Annual Billing")}${office?.subscriptionEnd ? ` - ${t("يتجدد في", "renews on")} ${formatDate(office.subscriptionEnd, "dd MMMM yyyy")}` : ""})`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38] hover:underline cursor-pointer"
              >
                {isEn ? "Change Plan" : "ترقية / تعديل الباقة"}
              </button>
            </div>

            {/* Quota bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
              {/* Lawyer seats */}
              <div>
                <div className="flex justify-between font-bold text-[#514537] dark:text-[#cdc5bd] mb-1">
                  <span>مقاعد المحامين</span>
                  <span>12 / 15</span>
                </div>
                <div className="w-full bg-[#eae8e4] dark:bg-[#38271c] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#9c6402] dark:bg-[#e29d38] h-full w-[80%]" />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex justify-between font-bold text-[#514537] dark:text-[#cdc5bd] mb-1">
                  <span>المساحة السحابية</span>
                  <span>68 GB / 100 GB</span>
                </div>
                <div className="w-full bg-[#eae8e4] dark:bg-[#38271c] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#059669] h-full w-[68%]" />
                </div>
              </div>

              {/* Active Cases */}
              <div>
                <div className="flex justify-between font-bold text-[#514537] dark:text-[#cdc5bd] mb-1">
                  <span>القضايا النشطة</span>
                  <span>180 / 250</span>
                </div>
                <div className="w-full bg-[#eae8e4] dark:bg-[#38271c] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563eb] h-full w-[72%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Financial Summary for this Client */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
              {isEn ? "Billing Summary" : "الملخص المالي للمكتب"}
            </h3>
            <p className="text-[12px] text-[#514537] dark:text-[#a89f91]">
              {isEn
                ? "Aggregated tax invoices & settlement metrics"
                : "إجمالي الفواتير والمبالغ المسددة والمستحقة"}
            </p>
          </div>

          <div className="space-y-3">
            {/* Total Paid */}
            <div className="bg-[#ecfdf5] dark:bg-[#132c21] p-3.5 rounded-[8px] border border-emerald-200 dark:border-emerald-500/40">
              <span className="text-[11px] font-bold text-[#065f46] dark:text-[#6ee7b7] block">
                {isEn ? "Total Paid Revenue" : "إجمالي المسدد والمحصل"}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[22px] font-black font-mono text-[#065f46] dark:text-[#6ee7b7]">
                  {totalPaid.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-[#065f46] dark:text-[#6ee7b7]">
                  {isEn ? "SAR" : "ر.س"}
                </span>
              </div>
            </div>

            {/* Total Pending */}
            <div className="bg-[#fffbeb] dark:bg-[#342711] p-3.5 rounded-[8px] border border-amber-200 dark:border-amber-500/40">
              <span className="text-[11px] font-bold text-[#78350f] dark:text-[#fbbf24] block">
                {isEn ? "Pending / Due Amount" : "المبالغ المعلقة قيد التحصيل"}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[22px] font-black font-mono text-[#78350f] dark:text-[#fbbf24]">
                  {totalPending.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-[#78350f] dark:text-[#fbbf24]">
                  {isEn ? "SAR" : "ر.س"}
                </span>
              </div>
            </div>
          </div>

          {/* ZATCA Phase 2 Indicator */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#f5f3ef] dark:border-[#38271c] text-[11px] text-[#059669] dark:text-[#10b981] font-bold">
            <ShieldCheck className="size-4 shrink-0" />
            <span>{isEn ? "ZATCA E-Invoicing Phase 2 Enabled" : "نظام الفوترة الإلكترونية زاتكا معتمد"}</span>
          </div>
        </div>
      </div>

      {/* 3. INVOICES TABLE FOR THIS CLIENT */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Table Header toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn ? `Tax Invoices History (${clientInvoices.length})` : `سجل الفواتير الضريبية للمكتب (${clientInvoices.length})`}
            </h3>
            <p className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-0.5">
              {isEn
                ? "Official e-invoices with 15% VAT and QR verification codes."
                : "الفواتير الضريبية المعتمدة لاشتراكات هذا المكتب مع كود الاستجابة السريع وضريبة 15%."}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#1a120d] p-1 rounded-[6px] border border-[#eae8e4] dark:border-[#38271c]">
            {[
              { id: "all", label: isEn ? "All" : "الكل" },
              { id: "paid", label: isEn ? "Paid" : "المسددة" },
              { id: "pending", label: isEn ? "Pending" : "المعلقة" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setInvoiceTab(tab.id as any)}
                className={`px-3 py-1 text-[12px] font-bold rounded-[4px] transition-all cursor-pointer ${
                  invoiceTab === tab.id
                    ? "bg-white dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                    : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-start border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#faf8f5] dark:bg-[#1c140f] border-b border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#a89f91] text-[12px] font-bold">
                <th className="py-3 px-4 text-start">{isEn ? "Invoice Number" : "رقم الفاتورة"}</th>
                <th className="py-3 px-4 text-start">{isEn ? "Plan & Period" : "الباقة والاشتراك"}</th>
                <th className="py-3 px-4 text-start">{isEn ? "Issue & Due Date" : "تاريخ الإصدار والاستحقاق"}</th>
                <th className="py-3 px-4 text-start">{isEn ? "Total (15% VAT)" : "المبلغ (شامل الضريبة)"}</th>
                <th className="py-3 px-4 text-start">{isEn ? "Payment Method" : "وسيلة الدفع"}</th>
                <th className="py-3 px-4 text-start">{isEn ? "Status" : "الحالة"}</th>
                <th className="py-3 px-4 text-center">{isEn ? "Actions" : "الإجراءات"}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f5f3ef] dark:divide-[#2f2219]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                    {isEn ? "No invoices found for this office" : "لا توجد فواتير مسجلة لهذا المكتب"}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                const isPaid = inv.status === "paid";
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-[#faf8f5]/80 dark:hover:bg-[#281c15]/60 transition-colors"
                  >
                    {/* Invoice Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {inv.invoiceNumber}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopy(inv.invoiceNumber, inv.id, e)}
                          className="text-[#837565] hover:text-[#9c6402] p-1 rounded"
                          title="نسخ"
                        >
                          {copiedId === inv.id ? (
                            <Check className="size-3 text-emerald-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#059669] dark:text-[#10b981] mt-0.5">
                        <ShieldCheck className="size-3" />
                        <span>{inv.zatcaComplianceStatus === "cleared" ? "ZATCA معتمد" : "مبلّغ"}</span>
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                        {inv.planName}
                      </span>
                      <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                        {inv.billingPeriod === "annual" ? "سداد سنوي" : "سداد شهري"}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[12px] font-mono text-[#1b1c1a] dark:text-[#fdfbf7]">
                        <Calendar className="size-3.5 text-[#837565]" />
                        <span>{inv.issueDate}</span>
                      </div>
                      <span className="text-[10px] text-[#837565] font-mono mt-0.5 block">
                        استحقاق: {inv.dueDate}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[15px] font-black font-mono text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {inv.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-[#9c6402] dark:text-[#e29d38]">
                          ر.س
                        </span>
                      </div>
                      <span className="text-[10px] text-[#837565] font-mono">
                        ضريبة 15%: {inv.taxAmount.toLocaleString()} ر.س
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#f0fdf4] dark:bg-[#142d1f] text-[#166534] dark:text-[#86efac] border border-emerald-200 dark:border-emerald-700/40 px-2 py-0.5 rounded-[4px] text-[11px] font-bold">
                        {inv.paymentMethod === "mada" ? "مدى (mada)" : inv.paymentMethod === "apple_pay" ? "Apple Pay" : "تحويل بنكي"}
                      </span>
                      <span className="block text-[10px] font-mono text-[#837565] mt-0.5">
                        {inv.transactionReference}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isPaid ? (
                        <div className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c21] dark:border-emerald-500/40 flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
                          <span className="font-bold text-[11px] text-[#065f46] dark:text-[#6ee7b7]">
                            {isEn ? "Paid" : "مسددة"}
                          </span>
                          <div className="bg-[#10b981] rounded-full size-[7px]" />
                        </div>
                      ) : (
                        <div className="bg-[#fffbeb] border border-amber-200 dark:bg-[#342711] dark:border-amber-500/40 flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
                          <span className="font-bold text-[11px] text-[#78350f] dark:text-[#fbbf24]">
                            {isEn ? "Pending" : "معلقة"}
                          </span>
                          <div className="bg-[#f59e0b] rounded-full size-[7px]" />
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Primary Button */}
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsDetailsOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-[5px] bg-[#faf8f5] hover:bg-[#f0ece1] dark:bg-[#281c15] dark:hover:bg-[#332219] text-[#9c6402] dark:text-[#e29d38] border border-[#eeddbb] dark:border-[#4d3627] text-[12px] font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                            <span>{isEn ? "View Invoice" : "عرض الفاتورة"}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoiceForPayment(inv);
                              setIsPaymentOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-[5px] bg-[#059669] hover:bg-[#047857] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>{isEn ? "Record Payment" : "تسجيل سداد"}</span>
                          </button>
                        )}

                        {/* Download PDF */}
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(inv)}
                          title="تحميل PDF"
                          className="p-1.5 rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#059669] cursor-pointer"
                        >
                          <Download className="size-3.5" />
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
      </div>

      {/* MODALS */}
      {/* 1. Tax Invoice Details Modal */}
      <InvoiceDetailsModal
        invoice={selectedInvoice}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedInvoice(null);
        }}
      />

      {/* 2. Record Payment Modal */}
      <RecordPaymentModal
        invoice={selectedInvoiceForPayment}
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setSelectedInvoiceForPayment(null);
        }}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* 3. Upgrade Plan Modal */}
      <UpgradeClientOfficePlanModal
        isOpen={isUpgradeModalOpen}
        office={office}
        initialBillingCycle={isMonthly ? "monthly" : "annual"}
        onClose={() => setIsUpgradeModalOpen(false)}
        onConfirmUpgrade={(officeId: string, newPlanName: string) => {
          setCurrentPlan(newPlanName);
          setIsUpgradeModalOpen(false);
          toast.success(isEn ? `Plan upgraded to ${newPlanName}` : `تمت ترقية الباقة إلى ${newPlanName} بنجاح`);
        }}
      />

      {/* 4. Create New Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onSave={handleCreateNewInvoice}
      />
    </div>
  );
}
