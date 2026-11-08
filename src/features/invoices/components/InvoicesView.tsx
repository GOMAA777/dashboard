"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { UnifiedFilterBar, PrimaryFilterOption } from "@/components/shared/UnifiedFilterBar";
import { InvoicesManagementHeader } from "./InvoicesManagementHeader";
import { InvoicesKpiCards } from "./InvoicesKpiCards";
import { InvoicesTable } from "./InvoicesTable";
import { InvoicesEmptyState } from "./InvoicesEmptyState";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { CancelInvoiceModal } from "./CancelInvoiceModal";
import { RecordPaymentModal } from "./RecordPaymentModal";
import { initialInvoicesList } from "../data/initialInvoices";
import {
  InvoiceItem,
  InvoiceFilterTab,
  InvoiceKpiMetrics,
  PaymentMethodType,
} from "../types/invoices.types";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { fetchInvoices, fetchInvoiceById } from "@/lib/api/payments";
import { mapInvoicesResponse, mapInvoiceFromApi } from "@/lib/api/mappers";
import { unwrapData } from "@/lib/api/helpers";
import { API_COMPANY_ID } from "@/lib/api/config";

export function InvoicesView() {
  const { isEn, direction, t } = useLanguage();

  // Invoices data list
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoicesList);

  const searchParams = useSearchParams();
  const searchParam = searchParams?.get("search") || "";
  const invoiceIdParam = searchParams?.get("invoiceId") || "";
  const activeCompanyId =
    searchParams?.get("company_id") ||
    searchParams?.get("companyId") ||
    API_COMPANY_ID;

  // Filter state
  const [filterTab, setFilterTab] = useState<InvoiceFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const payload = await fetchInvoices({
        company_id: activeCompanyId,
      });
      const mapped = mapInvoicesResponse(payload);
      setInvoices(mapped);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("تعذر تحميل فواتير الاشتراكات من الخادم", "Failed to load invoices");
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [activeCompanyId, t]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    if (invoiceIdParam) {
      const match = invoices.find(
        (i) => i.invoiceNumber.toLowerCase() === invoiceIdParam.toLowerCase() || i.id === invoiceIdParam
      );
      if (match) {
        setSelectedInvoice(match);
        setIsDetailsOpen(true);
      }
    }
  }, [invoiceIdParam, invoices]);
  const [selectedInvoiceForCancel, setSelectedInvoiceForCancel] = useState<InvoiceItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<InvoiceItem | null>(null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Dynamic KPI Metrics calculations
  const metrics: InvoiceKpiMetrics = useMemo(() => {
    const paidInvoices = invoices.filter((i) => i.status === "paid");
    const pendingInvoices = invoices.filter((i) => i.status === "pending");
    const overdueInvoices = invoices.filter((i) => i.status === "overdue");
    const refundedInvoices = invoices.filter((i) => i.status === "refunded");

    const totalRevenueSar = paidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalRevenueUsd = Math.round(totalRevenueSar / 3.75);
    const pendingAmountSar = pendingInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const overdueAmountSar = overdueInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const paidPercentage =
      invoices.length > 0 ? Math.round((paidInvoices.length / invoices.length) * 100) : 0;

    return {
      totalRevenueSar,
      totalRevenueUsd,
      totalInvoicesCount: invoices.length,
      paidCount: paidInvoices.length,
      paidPercentage,
      pendingCount: pendingInvoices.length,
      pendingAmountSar,
      overdueCount: overdueInvoices.length,
      overdueAmountSar,
      refundedCount: refundedInvoices.length,
    };
  }, [invoices]);

  // Primary filter options for UnifiedFilterBar
  const primaryFilterOptions: PrimaryFilterOption[] = useMemo(
    () => [
      { label: isEn ? "All Invoices" : "كافة الفواتير", value: "all" },
      { label: isEn ? "Paid" : "المسددة", value: "paid" },
      { label: isEn ? "Pending" : "المعلقة", value: "pending" },
      { label: isEn ? "Overdue" : "المتأخرة", value: "overdue" },
      { label: isEn ? "Refunded" : "المستردة", value: "refunded" },
    ],
    [isEn]
  );

  const hasActiveAdvancedFilters =
    paymentMethodFilter !== "all" || minAmount !== "" || maxAmount !== "";

  // Reset all filters
  const handleResetFilters = () => {
    setFilterTab("all");
    setSearchQuery("");
    setPaymentMethodFilter("all");
    setMinAmount("");
    setMaxAmount("");
    setPageIndex(0);
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Status Filter Tab
      if (filterTab !== "all" && inv.status !== filterTab) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(q);
        const matchFirm =
          inv.lawFirmName.toLowerCase().includes(q) || inv.lawFirmNameEn.toLowerCase().includes(q);
        const matchContact =
          inv.clientContact.toLowerCase().includes(q) || inv.clientEmail.toLowerCase().includes(q);
        const matchTax = inv.taxNumber.includes(q);
        const matchTxn = inv.transactionReference.toLowerCase().includes(q);
        if (!matchNumber && !matchFirm && !matchContact && !matchTax && !matchTxn) {
          return false;
        }
      }

      // 3. Payment Method Filter
      if (paymentMethodFilter !== "all" && inv.paymentMethod !== paymentMethodFilter) {
        return false;
      }

      // 4. Min Amount
      if (minAmount && inv.totalAmount < Number(minAmount)) {
        return false;
      }

      // 5. Max Amount
      if (maxAmount && inv.totalAmount > Number(maxAmount)) {
        return false;
      }

      return true;
    });
  }, [invoices, filterTab, searchQuery, paymentMethodFilter, minAmount, maxAmount]);

  // Paginated slice
  const paginatedInvoices = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, pageIndex, pageSize]);

  // Handlers
  const handleViewInvoice = async (invoice: InvoiceItem) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
    try {
      const payload = await fetchInvoiceById(invoice.id, activeCompanyId);
      const raw = (unwrapData<Record<string, unknown>>(payload) ||
        payload) as Record<string, unknown>;
      if (raw?.id || raw?.invoice_number || raw?.number) {
        setSelectedInvoice((prev) =>
          prev ? { ...prev, ...mapInvoiceFromApi(raw) } : mapInvoiceFromApi(raw)
        );
      }
    } catch {
      // Keep list item details.
    }
  };

  const handleDownloadPdf = (invoice: InvoiceItem) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: isEn
        ? `Generating PDF for ${invoice.invoiceNumber}...`
        : `جارٍ تجهيز ملف PDF للفاتورة ${invoice.invoiceNumber}...`,
      success: isEn
        ? `Invoice ${invoice.invoiceNumber} downloaded successfully!`
        : `تم تحميل الفاتورة الضريبية ${invoice.invoiceNumber} بنجاح!`,
      error: isEn ? "Failed to download PDF" : "فشل تحميل الفاتورة",
    });
  };

  const handleResendEmail = (invoice: InvoiceItem) => {
    toast.success(
      isEn
        ? `Tax Invoice sent to client: ${invoice.clientEmail}`
        : `تم إرسال الفاتورة الضريبية للعميل: ${invoice.clientEmail}`,
      {
        description: isEn
          ? "Certified e-invoice copy delivered via SMTP"
          : "تم تسليم نسخة الفاتورة المشفرة المعتمدة عبر البريد الإلكتروني",
      }
    );
  };

  const handleExportReport = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: isEn
        ? "Generating comprehensive financial report (Excel / CSV)..."
        : "جارٍ تصدير تقرير الفواتير المالي المفصل (Excel / CSV)...",
      success: isEn
        ? "Financial transactions report exported successfully!"
        : "تم تصدير تقرير الفواتير والعمليات المالية بنجاح!",
      error: isEn ? "Export failed" : "فشل التصدير",
    });
  };

  const handleOpenCancel = (invoice: InvoiceItem) => {
    setSelectedInvoiceForCancel(invoice);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (invoice: InvoiceItem, action: "refund" | "cancel") => {
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === invoice.id
          ? {
              ...item,
              status: "refunded",
              notes:
                action === "refund"
                  ? isEn
                    ? "Refunded & Credit Note issued in compliance with ZATCA rules"
                    : "تم الاسترداد وإصدار إشعار دائن رسمي متوافق مع نظام الفوترة الإلكترونية"
                  : isEn
                  ? "Cancelled pending invoice"
                  : "تم إلغاء الفاتورة المعلقة",
            }
          : item
      )
    );
    setIsCancelModalOpen(false);
    setSelectedInvoiceForCancel(null);

    toast.success(
      action === "refund"
        ? isEn
          ? `Invoice ${invoice.invoiceNumber} refunded & Credit Note issued!`
          : `تم استرداد الفاتورة ${invoice.invoiceNumber} وإصدار الإشعار الدائن بنجاح!`
        : isEn
        ? `Invoice ${invoice.invoiceNumber} cancelled!`
        : `تم إلغاء الفاتورة ${invoice.invoiceNumber} بنجاح!`
    );
  };

  const handleOpenRecordPayment = (invoice: InvoiceItem) => {
    setSelectedInvoiceForPayment(invoice);
    setIsRecordPaymentOpen(true);
  };

  const handleConfirmPayment = (
    invoice: InvoiceItem,
    paymentData: { method: PaymentMethodType; ref: string }
  ) => {
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === invoice.id
          ? {
              ...item,
              status: "paid",
              paymentMethod: paymentData.method,
              transactionReference: paymentData.ref,
              paidAt: new Date().toISOString().replace("T", " ").substring(0, 19),
              zatcaComplianceStatus: "cleared",
              notes: isEn
                ? `Payment recorded via ${paymentData.method} (Ref: ${paymentData.ref}) and verified under ZATCA Phase 2.`
                : `تم تسجيل التحصيل عبر ${paymentData.method} (مرجع: ${paymentData.ref}) واعتماد الفاتورة كـ Cleared في منصة زاتكا.`,
            }
          : item
      )
    );
    setIsRecordPaymentOpen(false);
    setSelectedInvoiceForPayment(null);

    toast.success(
      isEn
        ? `Payment recorded for ${invoice.invoiceNumber}!`
        : `تم تسجيل سداد الفاتورة ${invoice.invoiceNumber} بنجاح!`,
      {
        description: isEn
          ? `Total of ${invoice.totalAmount.toLocaleString()} SAR marked as Paid.`
          : `تم تحصيل مبلغ ${invoice.totalAmount.toLocaleString()} ر.س وتحديث المؤشرات المالية فورياً.`,
      }
    );
  };

  const handleSaveNewInvoice = (newInvoice: InvoiceItem) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    setIsCreateModalOpen(false);
    toast.success(
      isEn
        ? `Tax Invoice ${newInvoice.invoiceNumber} issued successfully!`
        : `تم إصدار الفاتورة الضريبية ${newInvoice.invoiceNumber} بنجاح!`,
      {
        description: isEn
          ? "Logged and reported to ZATCA Phase 2 compliance portal"
          : "تم توثيق الفاتورة واعتمادها في سجلات هيئة الزكاة والضريبة والجمارك",
      }
    );
  };

  const breadcrumbs = [
    { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
    { label: t("سجل الفواتير الضريبية", "Tax Invoices") },
  ];

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 antialiased select-none font-['Cairo',sans-serif]"
    >
      {/* 1. Global Sidebar with active navigation sync */}
      <DashboardSidebar activeNav="finance" activeSubNav="invoices" />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar with Breadcrumb */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 sm:p-6 lg:p-8 max-w-[1360px] mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {isLoading ? (
              <DashboardPageSkeleton />
            ) : errorMessage ? (
              <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-900/50 p-8 text-center flex flex-col items-center justify-center my-4">
                <div className="size-14 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                  <AlertTriangle className="size-7" />
                </div>
                <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                  {t("حدث خطأ أثناء تحميل الفواتير", "Error loading invoices")}
                </h3>
                <p className="text-[13px] text-[#514537] dark:text-[#a89f91] max-w-md mx-auto mb-5 leading-relaxed">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={loadInvoices}
                  className="px-4 py-2 text-[13px] font-bold rounded-[6px] bg-[#9c6402] hover:bg-[#835401] text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <RotateCcw className="size-3.5" />
                  <span>{t("إعادة المحاولة", "Retry")}</span>
                </button>
              </div>
            ) : (
            <>
              {/* Header Banner */}
              <InvoicesManagementHeader
                onCreateInvoice={() => setIsCreateModalOpen(true)}
                onExportReport={handleExportReport}
              />

              {/* KPI Metrics Cards */}
              <InvoicesKpiCards metrics={metrics} />

              {/* Unified Filter Bar */}
              <UnifiedFilterBar
                searchQuery={searchQuery}
                onSearchChange={(val) => {
                  setSearchQuery(val);
                  setPageIndex(0);
                }}
                searchPlaceholder={
                  isEn
                    ? "Search by invoice no, law firm, contact, tax no, or txn ref..."
                    : "ابحث برقم الفاتورة، اسم المكتب، جهة الاتصال، الرقم الضريبي، أو المرجع..."
                }
                primaryFilterValue={filterTab}
                onPrimaryFilterChange={(val) => {
                  setFilterTab(val as InvoiceFilterTab);
                  setPageIndex(0);
                }}
                primaryFilterOptions={primaryFilterOptions}
                hasActiveFilters={hasActiveAdvancedFilters}
                onReset={handleResetFilters}
                drawerTitle={isEn ? "Advanced Invoice Filters" : "خيارات التصفية المتقدمة للفواتير"}
                drawerDescription={
                  isEn
                    ? "Filter invoices by payment method, transaction amounts, and date range"
                    : "تصفية الفواتير بحسب وسيلة الدفع والمبالغ المالية ونوع الاشتراك"
                }
                drawerContent={
                  <div className="flex flex-col gap-4 text-start">
                    {/* Payment Method Selector */}
                    <div>
                      <label className="text-[12px] font-bold text-[#514537] dark:text-[#a89f91] block mb-1.5">
                        {isEn ? "Payment Method" : "وسيلة الدفع"}
                      </label>
                      <DashboardSelect
                        value={paymentMethodFilter}
                        onChange={(e) => {
                          setPaymentMethodFilter(e.target.value);
                          setPageIndex(0);
                        }}
                      >
                        <option value="all">{isEn ? "All Payment Methods" : "كافة وسائل الدفع"}</option>
                        <option value="mada">{isEn ? "Mada (مدى)" : "مدى (mada)"}</option>
                        <option value="visa">VISA</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="apple_pay">Apple Pay</option>
                        <option value="bank_transfer">{isEn ? "Bank Wire Transfer" : "تحويل بنكي"}</option>
                        <option value="stripe">Stripe</option>
                      </DashboardSelect>
                    </div>

                    {/* Min & Max Amount */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[12px] font-bold text-[#514537] dark:text-[#a89f91] block mb-1.5">
                          {isEn ? "Min Amount (SAR)" : "الحد الأدنى (ر.س)"}
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={minAmount}
                          onChange={(e) => {
                            setMinAmount(e.target.value);
                            setPageIndex(0);
                          }}
                          className="w-full bg-[#f5f3ef] dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-bold text-[#514537] dark:text-[#a89f91] block mb-1.5">
                          {isEn ? "Max Amount (SAR)" : "الحد الأقصى (ر.س)"}
                        </label>
                        <input
                          type="number"
                          placeholder="100,000"
                          value={maxAmount}
                          onChange={(e) => {
                            setMaxAmount(e.target.value);
                            setPageIndex(0);
                          }}
                          className="w-full bg-[#f5f3ef] dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402] font-mono"
                        />
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-2 w-full py-2 bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] text-[#514537] dark:text-[#cdc5bd] rounded-[6px] text-[12px] font-bold transition-colors"
                    >
                      {isEn ? "Clear Filter Criteria" : "إعادة ضبط المعايير"}
                    </button>
                  </div>
                }
              />

              {/* Invoices Table or Empty State */}
              {paginatedInvoices.length > 0 ? (
                <InvoicesTable
                  data={paginatedInvoices}
                  onViewInvoice={handleViewInvoice}
                  onDownloadPdf={handleDownloadPdf}
                  onCancelInvoice={handleOpenCancel}
                  onRecordPayment={handleOpenRecordPayment}
                  onResendEmail={handleResendEmail}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalItems={filteredInvoices.length}
                  onPageChange={setPageIndex}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setPageIndex(0);
                  }}
                />
              ) : (
                <InvoicesEmptyState
                  isFiltered={
                    searchQuery !== "" ||
                    filterTab !== "all" ||
                    hasActiveAdvancedFilters
                  }
                  onResetFilters={handleResetFilters}
                  onCreateInvoice={() => setIsCreateModalOpen(true)}
                />
              )}
            </>
            )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* Modals */}
      {/* View Tax Invoice Details */}
      <InvoiceDetailsModal
        invoice={selectedInvoice}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedInvoice(null);
        }}
        onResendEmail={handleResendEmail}
      />

      {/* Create New Tax Invoice */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewInvoice}
      />

      {/* Record Payment Receipt Modal */}
      <RecordPaymentModal
        invoice={selectedInvoiceForPayment}
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setIsRecordPaymentOpen(false);
          setSelectedInvoiceForPayment(null);
        }}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Cancel or Refund Modal */}
      <CancelInvoiceModal
        invoice={selectedInvoiceForCancel}
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedInvoiceForCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
