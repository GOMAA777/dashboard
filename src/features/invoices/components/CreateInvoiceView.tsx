"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check, FilePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceItem } from "../types/invoices.types";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";

interface CreateInvoiceViewProps {
  onBack: () => void;
  onSave: (invoice: InvoiceItem) => void;
  /** Prefill firm name when opened from a client office context */
  initialFirmName?: string;
}

export function CreateInvoiceView({
  onBack,
  onSave,
  initialFirmName = "",
}: CreateInvoiceViewProps) {
  const { isEn, direction } = useLanguage();
  const [lawFirmName, setLawFirmName] = useState(initialFirmName);
  const [clientContact, setClientContact] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [planChoice, setPlanChoice] = useState("enterprise");
  const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">("annual");
  const [subtotal, setSubtotal] = useState(48000);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    lawFirmName?: string;
    clientEmail?: string;
  }>({});

  const taxAmount = Math.round(subtotal * 0.15);
  const totalAmount = subtotal + taxAmount;

  const applyPlanSubtotal = (plan: string, period: "annual" | "monthly") => {
    if (period === "annual") {
      if (plan === "enterprise") setSubtotal(48000);
      else if (plan === "gold") setSubtotal(24000);
      else setSubtotal(9600);
      return;
    }
    if (plan === "enterprise") setSubtotal(4500);
    else if (plan === "gold") setSubtotal(2300);
    else setSubtotal(900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { lawFirmName?: string; clientEmail?: string } = {};
    if (!lawFirmName.trim()) {
      nextErrors.lawFirmName = isEn
        ? "Law firm name is required"
        : "اسم المكتب مطلوب";
    }
    if (!clientEmail.trim()) {
      nextErrors.clientEmail = isEn
        ? "Certified email is required"
        : "البريد الإلكتروني المعتمد مطلوب";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(
        isEn
          ? "Please fill in the required firm name and email"
          : "يرجى تعبئة اسم المكتب والبريد الإلكتروني"
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newInvoiceNumber = `INV-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
      const planNameAr =
        planChoice === "enterprise"
          ? "الباقة المؤسسية البلاتينية (Enterprise Platinum)"
          : planChoice === "gold"
            ? "الباقة الاحترافية الذهبية (Professional Gold)"
            : "باقة المحامي الفردي والشركاء (Advocate Pro)";

      const planNameEn =
        planChoice === "enterprise"
          ? "Enterprise Platinum Plan"
          : planChoice === "gold"
            ? "Professional Gold Plan"
            : "Advocate Pro Plan";

      const today = new Date().toISOString().split("T")[0];
      const due = new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0];

      const newInvoice: InvoiceItem = {
        id: `inv-${Date.now()}`,
        invoiceNumber: newInvoiceNumber,
        orderNumber: "09",
        lawFirmId: `firm-${Date.now()}`,
        lawFirmName: lawFirmName.trim(),
        lawFirmNameEn: lawFirmName.trim(),
        clientContact: clientContact.trim() || "المستشار القانوني",
        clientEmail: clientEmail.trim(),
        clientPhone: "+966 50 000 0000",
        taxNumber: taxNumber.trim() || "310000000000003",
        commercialReg: "1010000000",
        city: "الرياض (Riyadh)",
        planName: planNameAr,
        planNameEn: planNameEn,
        billingPeriod,
        description: `اشتراك في ${planNameAr}`,
        issueDate: today,
        dueDate: due,
        subtotal,
        taxRate: 15,
        taxAmount,
        hasTaxBreakdown: true,
        discountAmount: 0,
        totalAmount,
        paidAmount: 0,
        remainingAmount: totalAmount,
        currency: "SAR",
        status: "pending",
        paymentMethod: "mada",
        paymentMethodLabel: "مدى (mada)",
        transactionReference: `REF-${Date.now()}`,
        zatcaComplianceStatus: "reported",
        items: [
          {
            id: `li-${Date.now()}`,
            description: `اشتراك في ${planNameAr}`,
            descriptionEn: `Subscription in ${planNameEn}`,
            quantity: 1,
            unitPrice: subtotal,
            total: subtotal,
          },
        ],
        notes: notes.trim() || "فاتورة ضريبية رسمية مستحقة خلال 15 يوماً.",
      };

      onSave(newInvoice);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div dir={direction} className="flex flex-col gap-6 w-full shrink-0 font-['Cairo',sans-serif]">
      {/* Page header — same stack as notifications send view */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-[8px] bg-[rgba(255,221,182,0.4)] dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
            <FilePlus className="size-5" />
          </div>
          <div>
            <h1 className="text-[22px] sm:text-[26px] leading-[34px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn ? "Issue New Tax Invoice" : "إصدار فاتورة ضريبية جديدة"}
            </h1>
            <p className="text-[#514537] dark:text-[#8e8680] text-[13px] sm:text-[14px] leading-[20px] mt-1 max-w-[640px]">
              {isEn
                ? "Generate ZATCA compliant e-invoice for law practice subscriptions"
                : "إصدار فاتورة إلكترونية معتمدة لاشتراكات مكاتب المحاماة"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="bg-white dark:bg-[#281c15] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e6e2dc] dark:border-[#38271c] px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {isEn ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          <span>{isEn ? "Back to Invoices" : "العودة للفواتير"}</span>
        </button>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
              <span>{isEn ? "Law Firm Name" : "اسم مكتب / شركة المحاماة"}</span>
              <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              value={lawFirmName}
              onChange={(e) => {
                setLawFirmName(e.target.value);
                if (fieldErrors.lawFirmName) {
                  setFieldErrors((prev) => ({ ...prev, lawFirmName: undefined }));
                }
              }}
              placeholder={
                isEn
                  ? "e.g. Al Ajlan Law Firm"
                  : "مثال: شركة العجلان للمحاماة والاستشارات"
              }
              className="w-full h-10 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
            />
            {fieldErrors.lawFirmName ? (
              <p className="text-[12px] text-[#ba1a1a] font-medium">{fieldErrors.lawFirmName}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Responsible Advocate" : "المحامي المسؤول"}
              </label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder={
                  isEn ? "e.g. Advocate Abdullah" : "مثال: الشيخ عبد الله العجلان"
                }
                className="w-full h-10 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                <span>{isEn ? "Client Email" : "البريد الإلكتروني المعتمد"}</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="email"
                dir="ltr"
                value={clientEmail}
                onChange={(e) => {
                  setClientEmail(e.target.value);
                  if (fieldErrors.clientEmail) {
                    setFieldErrors((prev) => ({ ...prev, clientEmail: undefined }));
                  }
                }}
                placeholder="office@alajlan-law.sa"
                className="w-full h-10 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
              {fieldErrors.clientEmail ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">{fieldErrors.clientEmail}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "VAT Number (15 Digits)" : "الرقم الضريبي للمكتب (15 رقماً)"}
              </label>
              <input
                type="text"
                dir="ltr"
                maxLength={15}
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="310492857100003"
                className="w-full h-10 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] font-mono text-[13px] rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Subscription Plan" : "الباقة والخدمة"}
              </label>
              <DashboardSelect
                value={planChoice}
                onChange={(e) => {
                  const plan = e.target.value;
                  setPlanChoice(plan);
                  applyPlanSubtotal(plan, billingPeriod);
                }}
                className="h-10 text-[13px]"
              >
                <option value="enterprise">
                  {isEn
                    ? "Enterprise Platinum (48,000 SAR)"
                    : "الباقة المؤسسية البلاتينية (48,000 ر.س)"}
                </option>
                <option value="gold">
                  {isEn
                    ? "Professional Gold (24,000 SAR)"
                    : "الباقة الاحترافية الذهبية (24,000 ر.س)"}
                </option>
                <option value="basic">
                  {isEn
                    ? "Advocate Pro (9,600 SAR)"
                    : "باقة المحامي الفردي والشركاء (9,600 ر.س)"}
                </option>
              </DashboardSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Billing Cycle" : "دورة الفوترة"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBillingPeriod("annual");
                    applyPlanSubtotal(planChoice, "annual");
                  }}
                  className={`h-10 text-[12px] font-bold rounded-[6px] border transition-colors cursor-pointer ${
                    billingPeriod === "annual"
                      ? "bg-[#9c6402]/10 border-[#9c6402] text-[#9c6402] dark:text-[#e29d38]"
                      : "bg-[#f5f3ef] dark:bg-[#281c15] border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#a89f91]"
                  }`}
                >
                  {isEn ? "Annual (سنوي)" : "سنوي (خصم 20%)"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBillingPeriod("monthly");
                    applyPlanSubtotal(planChoice, "monthly");
                  }}
                  className={`h-10 text-[12px] font-bold rounded-[6px] border transition-colors cursor-pointer ${
                    billingPeriod === "monthly"
                      ? "bg-[#9c6402]/10 border-[#9c6402] text-[#9c6402] dark:text-[#e29d38]"
                      : "bg-[#f5f3ef] dark:bg-[#281c15] border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#a89f91]"
                  }`}
                >
                  {isEn ? "Monthly (شهري)" : "شهري"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Subtotal (SAR)" : "المبلغ قبل الضريبة (ر.س)"}
              </label>
              <input
                type="number"
                value={subtotal}
                onChange={(e) => setSubtotal(Number(e.target.value) || 0)}
                className="w-full h-10 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] font-mono text-[13px] rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
              />
            </div>
          </div>

          <div className="bg-[#faf8f5] dark:bg-[#221812] rounded-[8px] p-4 border border-[#eae8e4] dark:border-[#38271c] space-y-2 text-[12px]">
            <div className="flex items-center justify-between text-[#514537] dark:text-[#a89f91]">
              <span>{isEn ? "Subtotal:" : "المبلغ الأساسي:"}</span>
              <span className="font-mono font-bold">
                {subtotal.toLocaleString()} ر.س
              </span>
            </div>
            <div className="flex items-center justify-between text-[#9c6402] dark:text-[#e29d38] font-bold">
              <span>{isEn ? "15% VAT Amount:" : "ضريبة القيمة المضافة 15%:"}</span>
              <span className="font-mono">+{taxAmount.toLocaleString()} ر.س</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#eae8e4] dark:border-[#38271c] text-[14px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
              <span>{isEn ? "Grand Total Due:" : "الإجمالي المستحق بعد الضريبة:"}</span>
              <span className="font-mono text-[16px] text-[#9c6402] dark:text-[#e29d38]">
                {totalAmount.toLocaleString()} ر.س
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn
                ? "Invoice Notes & Payment Instructions"
                : "ملاحظات الفاتورة وتعليمات السداد"}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isEn
                  ? "e.g. Due within 15 days of issue"
                  : "مثال: مستحقة السداد خلال 15 يوماً من تاريخ الإصدار"
              }
              className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] rounded-[6px] p-3 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] resize-none"
            />
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-[#eae8e4] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#1a120d] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-[6px] bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e4e1dc] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold cursor-pointer transition-colors disabled:opacity-60"
          >
            {isEn ? "Cancel" : "إلغاء"}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#835401] dark:hover:bg-[#d4922f] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4 stroke-[2.5]" />
            )}
            <span>{isEn ? "Issue Tax Invoice" : "إصدار الفاتورة الضريبية"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
