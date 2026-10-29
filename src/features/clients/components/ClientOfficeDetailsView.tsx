"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Scale,
  Calendar,
  Lock,
  Receipt,
  PenSquare,
  Mail,
  Phone,
  Building2,
  Users,
  Eye,
  Download,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice } from "../types/client.types";

interface ClientOfficeDetailsViewProps {
  office: ClientOffice | null;
  onBack: () => void;
  onEdit: () => void;
}

export function ClientOfficeDetailsView({
  office,
  onBack,
  onEdit,
}: ClientOfficeDetailsViewProps) {
  const [internalNote, setInternalNote] = useState("");
  const [isDeactivated, setIsDeactivated] = useState(
    office?.accountStatus.type === "suspended"
  );

  const officeName = office?.name || "مكتب د. خالد بن عبد العزيز";
  const licenseNum = office?.licenseNumber.replace("ترخيص عدلي: ", "") || "38/412";
  const email = office?.email || "khaled@alajlan-law.sa";
  const phone = office?.phone || "+966 50 1239876";

  const handleAddNote = () => {
    if (!internalNote.trim()) {
      toast.error("يرجى كتابة الملاحظة أولاً");
      return;
    }
    toast.success("تم حفظ الملاحظة الإدارية بنجاح");
    setInternalNote("");
  };

  const handleToggleDeactivate = () => {
    const nextState = !isDeactivated;
    setIsDeactivated(nextState);
    toast.success(
      nextState
        ? `تم تعطيل حساب ${officeName} مؤقتاً`
        : `تم تنشيط حساب ${officeName} بنجاح`
    );
  };

  return (
    <div
      className="w-full flex flex-col gap-[24px] font-['Cairo',sans-serif]"
      data-node-id="1:1778"
      dir="rtl"
    >
      {/* 1. TOP PROFILE HEADER & SUMMARY CARD */}
      <div
        className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col lg:flex-row lg:items-center justify-between gap-[20px] relative overflow-hidden"
        data-node-id="1:1781"
      >
        {/* Subtle decorative gold ambient glow */}
        <div className="absolute -top-[48px] -start-[48px] size-[180px] bg-gradient-to-br from-[#ffddb6]/20 to-transparent blur-[25px] rounded-full pointer-events-none" />

        {/* Right: Monogram & Identity Info */}
        <div className="flex items-center gap-[16px] z-10">
          {/* Monogram / Seal Avatar */}
          <div className="size-[80px] rounded-[8px] bg-gradient-to-br from-[#9c6402] to-[#623e00] flex flex-col items-center justify-center text-white shadow-md shrink-0">
            <Scale className="size-[28px] text-[#ffddb6]" />
            <span className="text-[#ffddb6] text-[10px] font-bold tracking-[0.5px] uppercase mt-[2px]">
              العجلان
            </span>
          </div>

          {/* Details & Status Badges */}
          <div className="flex flex-col items-start text-right">
            <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a]">
              {officeName}
            </h1>

            {/* Subtitle Metadata */}
            <div className="flex flex-wrap items-center gap-[8px] text-[12px] text-[#514537] mt-[4px]">
              <div className="flex items-center gap-[4px]">
                <Scale className="size-[13px] text-[#837565]" />
                <span>رقم الترخيص العدلي:</span>
                <span className="font-bold text-[#1b1c1a]">{licenseNum}</span>
                <span className="text-[10px] text-[#837565] font-bold">(وزارة العدل)</span>
              </div>

              <span className="text-[#d6c4b1]">|</span>

              <div className="flex items-center gap-[4px]">
                <Calendar className="size-[13px] text-[#837565]" />
                <span>تاريخ التسجيل:</span>
                <span className="text-[#1b1c1a] font-normal">15 أكتوبر 2023</span>
                <span className="text-[10px] text-[#837565] font-bold">(منذ سنة)</span>
              </div>
            </div>

            {/* Distinct Status Pills (Account vs Subscription) */}
            <div className="flex flex-wrap items-center gap-[8px] mt-[8px]">
              {/* Account Status Badge */}
              <div
                className={`flex items-center gap-[6px] px-[10px] py-[3px] rounded-[2px] text-[11px] font-bold ${
                  isDeactivated
                    ? "bg-[#fef2f2] text-[#dc2626]"
                    : "bg-[#e8f5e9] text-[#1b7340]"
                }`}
              >
                <span
                  className={`size-[7px] rounded-full ${
                    isDeactivated ? "bg-[#dc2626]" : "bg-[#1b7340]"
                  }`}
                />
                <span>حالة الحساب: {isDeactivated ? "معطل" : "نشط"}</span>
              </div>

              {/* Subscription Status Badge */}
              <div className="bg-[#ffddb6]/30 text-[#643f00] flex items-center gap-[8px] px-[10px] py-[3px] rounded-[2px] text-[11px] font-bold">
                <Sparkles className="size-[12px] text-[#7b4e00]" />
                <span>الباقة الحالية: الباقة الاحترافية (Pro)</span>
                <span className="text-[#d6c4b1]">|</span>
                <span className="text-[#7b4e00] text-[10px]">تجديد 15 نوفمبر 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left: Action Toolbar */}
        <div className="flex flex-wrap items-center gap-[8px] z-10 self-start lg:self-center">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="bg-white hover:bg-[#f5f3ef] border border-[#eae8e4] text-[#1b1c1a] px-[12px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
          >
            <ArrowRight className="size-[14px]" />
            <span>العودة للقائمة</span>
          </button>

          {/* Edit Office Button */}
          <button
            type="button"
            onClick={onEdit}
            className="bg-[#9c6402] hover:bg-[#855402] text-white px-[16px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
          >
            <PenSquare className="size-[14px]" />
            <span>تعديل بيانات المكتب</span>
          </button>

          {/* Manage Subscription Button */}
          <button
            type="button"
            onClick={() => toast.info(`إدارة اشتراكات وفواتير ${officeName}`)}
            className="bg-white hover:bg-[#f5f3ef] border border-[#eae8e4] text-[#1b1c1a] px-[14px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
          >
            <Receipt className="size-[14px]" />
            <span>إدارة الاشتراك</span>
          </button>

          {/* Deactivate Account Toggle Button */}
          <button
            type="button"
            onClick={handleToggleDeactivate}
            className={`px-[12px] py-[8px] rounded-[4px] text-[12px] font-semibold flex items-center gap-[6px] transition-colors cursor-pointer ${
              isDeactivated
                ? "bg-[#e8f5e9] text-[#1b7340] hover:bg-[#c8e6c9]"
                : "bg-[#f5f3ef] text-[#514537] hover:bg-[#eae8e4]"
            }`}
          >
            <Lock className="size-[13px]" />
            <span>{isDeactivated ? "تفعيل الحساب" : "تعطيل مؤقت"}</span>
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW CONTENT GRID (2 COLUMNS: 60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] w-full">
        {/* ======================================================== */}
        {/* RIGHT COLUMN (60% - 7 COLS IN RTL) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-[24px]">
          {/* SECTION A: معلومات التواصل */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col gap-[16px]">
            {/* Header */}
            <div className="border-b border-[#f0eeea] pb-[10px] flex items-center justify-between">
              <button
                type="button"
                onClick={onEdit}
                className="text-[#7b4e00] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <PenSquare className="size-[12px]" />
                <span>تحديث البيانات</span>
              </button>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a]">
                  معلومات التواصل
                </h2>
                <div className="w-[6px] h-[16px] bg-[#9c6402] rounded-full" />
              </div>
            </div>

            {/* Mosaic 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              {/* Email */}
              <div className="bg-[#f5f3ef] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-right">
                  <span className="text-[#837565] text-[10px] font-bold">
                    البريد الإلكتروني الرسمي
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-[#1b1c1a] text-[13px] font-semibold hover:underline direction-ltr text-right mt-[2px]"
                  >
                    {email}
                  </a>
                </div>
                <div className="bg-white size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] shrink-0">
                  <Mail className="size-[16px]" />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="bg-[#f5f3ef] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-right">
                  <span className="text-[#837565] text-[10px] font-bold">
                    رقم الجوال
                  </span>
                  <span className="text-[#1b1c1a] text-[13px] font-semibold direction-ltr text-right mt-[2px]">
                    {phone}
                  </span>
                </div>
                <div className="bg-white size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] shrink-0">
                  <Phone className="size-[16px]" />
                </div>
              </div>

              {/* Landline */}
              <div className="bg-[#f5f3ef] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-right">
                  <span className="text-[#837565] text-[10px] font-bold">
                    الهاتف المكتبي المباشر
                  </span>
                  <span className="text-[#1b1c1a] text-[13px] font-semibold direction-ltr text-right mt-[2px]">
                    011 482 9900
                  </span>
                </div>
                <div className="bg-white size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] shrink-0">
                  <Phone className="size-[16px]" />
                </div>
              </div>

              {/* Physical Address */}
              <div className="bg-[#f5f3ef] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-right">
                  <span className="text-[#837565] text-[10px] font-bold">
                    المقر والمكتب الرئيسي
                  </span>
                  <span className="text-[#1b1c1a] text-[12px] font-medium leading-[18px] mt-[2px]">
                    الرياض - طريق الملك فهد، حي الصحافة، برج النخبة - الطابق 14
                  </span>
                </div>
                <div className="bg-white size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] shrink-0">
                  <Building2 className="size-[16px]" />
                </div>
              </div>
            </div>

            {/* Quick Capacity Indicators inside Section A */}
            <div className="bg-[#f0eeea] rounded-[4px] p-[16px] flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <span className="text-[#514537] text-[12px] font-semibold">
                  المحامون والمستشارون النشطون
                </span>
                <Users className="size-[16px] text-[#837565]" />
              </div>

              <div className="flex items-baseline gap-[6px]">
                <span className="text-[#1b1c1a] text-[28px] font-bold leading-[34px]">
                  12
                </span>
                <span className="text-[#837565] text-[12px]">
                  / 15 مقعد مستخدم متاح
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#e4e2de] h-[8px] rounded-full overflow-hidden">
                <div className="h-full bg-[#9c6402] rounded-full w-[80%]" />
              </div>

              <span className="text-[#837565] text-[10px] font-bold text-right">
                متبقي اضافة 3 محامين شاغرة
              </span>
            </div>
          </div>

          {/* SECTION B: أحدث الفواتير */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col gap-[16px]">
            {/* Header */}
            <div className="border-b border-[#f0eeea] pb-[10px] flex items-center justify-between">
              <button
                type="button"
                onClick={() => toast.info("عرض جميع فواتير المكتب")}
                className="text-[#7b4e00] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <ChevronLeft className="size-[12px]" />
                <span>عرض كل الفواتير (4)</span>
              </button>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a]">
                  أحدث الفواتير
                </h2>
                <div className="w-[6px] h-[16px] bg-[#9c6402] rounded-full" />
              </div>
            </div>

            {/* Featured Latest Invoice Card */}
            <div className="bg-[#f5f3ef] rounded-[4px] p-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
              {/* Right: Invoice metadata */}
              <div className="flex items-start gap-[12px]">
                <div className="bg-white size-[44px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] shrink-0">
                  <Receipt className="size-[20px]" />
                </div>

                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[14px] font-bold text-[#1b1c1a]">
                      INV-2024-0891
                    </span>
                    <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] flex items-center gap-[4px]">
                      <span className="size-[5px] bg-[#1b7340] rounded-full" />
                      <span>مدفوعة بالكامل</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-[6px] text-[12px] text-[#514537] mt-[4px]">
                    <span>تاريخ الإصدار: 15 أكتوبر 2024</span>
                    <span className="text-[#d6c4b1]">•</span>
                    <span>طريقة السداد: بطاقة مدى (•••• 4012)</span>
                  </div>
                </div>
              </div>

              {/* Left: Amount & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-[16px]">
                <div className="flex flex-col text-left">
                  <span className="text-[18px] font-bold text-[#1b1c1a]">
                    750 ر.س
                  </span>
                  <span className="text-[10px] text-[#837565] font-bold">
                    شامل ضريبة القيمة المضافة 15%
                  </span>
                </div>

                <div className="flex items-center gap-[6px]">
                  <button
                    type="button"
                    onClick={() => toast.info("فتح معاينة الفاتورة INV-2024-0891")}
                    className="bg-white hover:bg-[#faf9f7] border border-[#eae8e4] text-[#1b1c1a] px-[12px] py-[6px] rounded-[4px] text-[12px] font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    معاينة
                  </button>
                  <button
                    type="button"
                    aria-label="تحميل الفاتورة"
                    onClick={() => toast.success("جاري تحميل الفاتورة...")}
                    className="bg-[#f0eeea] hover:bg-[#eae8e4] size-[28px] rounded-[4px] flex items-center justify-center text-[#514537] cursor-pointer"
                  >
                    <Download className="size-[13px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: أحدث تذاكر الدعم الفني */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col gap-[16px]">
            {/* Header */}
            <div className="border-b border-[#f0eeea] pb-[10px] flex items-center justify-between">
              <button
                type="button"
                onClick={() => toast.info("عرض كافة تذاكر الدعم للمكتب")}
                className="text-[#7b4e00] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <ChevronLeft className="size-[12px]" />
                <span>عرض كل التذاكر (2)</span>
              </button>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a]">
                  أحدث تذاكر الدعم الفني
                </h2>
                <div className="w-[6px] h-[16px] bg-[#9c6402] rounded-full" />
              </div>
            </div>

            {/* Featured Ticket Card */}
            <div className="bg-[#f5f3ef] rounded-[4px] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <span className="bg-[#f0eeea] text-[#837565] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                    #TK-8422
                  </span>
                  <h3 className="text-[14px] font-bold text-[#1b1c1a]">
                    طلب زيادة سعة المستندات
                  </h3>
                </div>

                <span className="bg-[#ffddb6]/30 text-[#643f00] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] flex items-center gap-[4px]">
                  <span className="size-[5px] bg-[#7b4e00] rounded-full" />
                  <span>قيد المعالجة</span>
                </span>
              </div>

              <p className="text-[#514537] text-[12px] leading-[18px] text-right">
                يرغب المكتب بتمكين خيار السحب التلقائي للضبوط والمذكرات القضائية عبر الربط المباشر مع API ناجز، بالإضافة لرفع المساحة لـ 200 GB.
              </p>

              <div className="border-t border-[#f0eeea] pt-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-[8px] text-[12px] text-[#837565]">
                <div className="flex flex-wrap items-center gap-[8px]">
                  <div className="flex items-center gap-[4px]">
                    <span>المسؤول:</span>
                    <strong className="text-[#837565] font-bold">م. عبد العزيز فهد</strong>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-[4px]">
                    <span>الأولوية:</span>
                    <strong className="text-[#837565] font-bold">متوسطة</strong>
                  </div>
                  <span>•</span>
                  <span>منذ يومين (22 أكتوبر 2024)</span>
                </div>

                <button
                  type="button"
                  onClick={() => toast.info("فتح تفاصيل التذكرة #TK-8422")}
                  className="text-[#7b4e00] hover:underline text-[12px] font-semibold flex items-center gap-[2px] cursor-pointer self-start sm:self-auto"
                >
                  <span>عرض تفاصيل التذكرة</span>
                  <ChevronLeft className="size-[12px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LEFT COLUMN (40% - 5 COLS IN RTL) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-[24px]">
          {/* SECTION D: تفاصيل الاشتراك الساري */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col gap-[16px]">
            {/* Header */}
            <div className="border-b border-[#f0eeea] pb-[10px] flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                نشط
              </span>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a]">
                  تفاصيل الاشتراك الساري
                </h2>
                <Sparkles className="size-[16px] text-[#9c6402]" />
              </div>
            </div>

            {/* Subscription Plan Meta Card */}
            <div className="bg-gradient-to-br from-[#1c140f] to-[#2e221b] text-white rounded-[6px] p-[18px] flex flex-col gap-[14px] shadow-sm relative">
              <div className="flex items-start justify-between">
                <span className="bg-[#7b4e00]/40 text-[#ffddb6] text-[10px] font-semibold px-[10px] py-[3px] rounded-full">
                  خصم سنوي 15%
                </span>

                <div className="flex flex-col text-right">
                  <span className="text-[#ffddb6] text-[10px] font-bold tracking-[0.5px] uppercase">
                    الخطة المعتمدة
                  </span>
                  <h3 className="text-[22px] font-bold leading-[28px] mt-[2px]">
                    الباقة الاحترافية (Pro)
                  </h3>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-[6px] text-right">
                <span className="text-[32px] font-bold leading-[34px]">
                  750
                </span>
                <span className="text-[#cdc5bd] text-[13px]">
                  ر.س / شهرياً (تدفع سنوياً)
                </span>
              </div>

              {/* Renewal dates */}
              <div className="border-t border-white/10 pt-[8px] grid grid-cols-2 gap-[8px] text-[10px]">
                <div className="flex flex-col text-right">
                  <span className="text-[#cdc5bd]">موعد التجديد:</span>
                  <span className="text-[#ffddb6] font-bold text-[11px] mt-[1px]">
                    15 نوفمبر 2024 (22 يوماً)
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[#cdc5bd]">تاريخ البدء:</span>
                  <span className="text-white font-bold text-[11px] mt-[1px]">
                    15 أكتوبر 2023
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-renew & Najiz Live Sync Status */}
            <div className="bg-[#f5f3ef] rounded-[4px] p-[10px] flex items-center justify-between">
              <span className="bg-[#d1fae5] text-[#065f46] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                مفعّل (Auto-renew ON)
              </span>

              <div className="flex items-center gap-[6px] text-[12px] text-[#1b1c1a]">
                <span>التجديد التلقائي عبر البطاقة:</span>
                <CheckCircle2 className="size-[14px] text-[#065f46]" />
              </div>
            </div>

            {/* Resource Consumption Progress Rings / Bars */}
            <div className="flex flex-col gap-[10px] pt-[4px]">
              <h4 className="text-[13px] font-semibold text-[#1b1c1a] text-right">
                استهلاك موارد المنشأة الحالية
              </h4>

              {/* Active Users Bar */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1b1c1a]">80%</span>
                  <span className="text-[#514537]">مقاعد المحامين (12 من 15 مستخدم)</span>
                </div>
                <div className="w-full bg-[#f0eeea] h-[7px] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9c6402] rounded-full w-[80%]" />
                </div>
              </div>

              {/* Storage Bar */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1b1c1a]">42%</span>
                  <span className="text-[#514537]">التخزين السحابي (42 GB من 100 GB)</span>
                </div>
                <div className="w-full bg-[#f0eeea] h-[7px] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9c6402] rounded-full w-[42%]" />
                </div>
              </div>

              {/* Active Court Cases */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1b1c1a]">142 قضية مفتوحة</span>
                  <span className="text-[#514537]">القضايا والجلسات النشطة بالنظام</span>
                </div>
                <div className="w-full bg-[#f0eeea] h-[7px] rounded-full overflow-hidden">
                  <div className="h-full bg-[#059669] rounded-full w-[35%]" />
                </div>
              </div>
            </div>

            {/* Upgrade Plan Button */}
            <button
              type="button"
              onClick={() => toast.info("ترقية باقة المكتب")}
              className="w-full bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] py-[8px] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer mt-[4px]"
            >
              ترقية الباقة
            </button>
          </div>

          {/* SECTION E: ملاحظات وسجل نشاط الفريق */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col gap-[16px]">
            {/* Header */}
            <div className="border-b border-[#f0eeea] pb-[10px] flex items-center justify-between">
              <span className="bg-[#f0eeea] text-[#837565] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                خاص بالإدارة
              </span>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a]">
                  ملاحظات وسجل نشاط الفريق
                </h2>
                <PenSquare className="size-[15px] text-[#9c6402]" />
              </div>
            </div>

            {/* Quick Internal Note Box */}
            <div className="flex flex-col gap-[8px]">
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="أضف ملاحظة إدارية داخلية خاصة بفريق الجودي..."
                className="w-full bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] p-[12px] text-[12px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="bg-[#7b4e00] hover:bg-[#623e00] text-white px-[12px] py-[6px] rounded-[4px] text-[10px] font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  إضافة ملاحظة
                </button>

                <div className="flex items-center gap-[4px] text-[10px] text-[#837565] font-bold">
                  <span>مرئية لمشرفي النظام فقط</span>
                  <Eye className="size-[12px]" />
                </div>
              </div>
            </div>

            {/* Activity & Notes Timeline */}
            <div className="flex flex-col gap-[8px] pt-[4px]">
              {/* Item 1: Team Note by Sarah */}
              <div className="bg-[#f5f3ef] rounded-[4px] p-[10px] flex items-start gap-[10px]">
                <div className="size-[32px] rounded-full bg-[#ffddb6] text-[#2a1800] font-bold text-[12px] flex items-center justify-center shrink-0">
                  س
                </div>

                <div className="flex-1 flex flex-col gap-[2px] text-right">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#837565]">أمس 02:15 م</span>
                    <div className="flex items-center gap-[4px]">
                      <span className="font-semibold text-[#1b1c1a]">سارة الشمري</span>
                      <span className="text-[#837565] font-normal">(مشرف الحسابات)</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#514537] leading-[18px]">
                    تم التواصل هاتفياً مع د. خالد بخصوص ترقية الباقة لتشمل 20 محامياً مع بداية الربع القادم، وتم إرسال عرض الأسعار عبر البريد.
                  </p>
                </div>
              </div>

              {/* Item 2: Verification by Abdulaziz */}
              <div className="bg-[#f5f3ef] rounded-[4px] p-[10px] flex items-start gap-[10px]">
                <div className="size-[32px] rounded-full bg-[#e8e1e0] text-[#1e1b1b] font-bold text-[12px] flex items-center justify-center shrink-0">
                  ع
                </div>

                <div className="flex-1 flex flex-col gap-[2px] text-right">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#837565]">18 أكتوبر 2024</span>
                    <div className="flex items-center gap-[4px]">
                      <span className="font-semibold text-[#1b1c1a]">م. عبد العزيز بن فهد</span>
                      <span className="text-[#837565] font-normal">(إشراف النظام)</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#514537] leading-[18px]">
                    تم التحقق من رخصة المحاماة الصادرة من الإدارة العامة للمحاماة، وتجديد شهادة الربط السحابي مع النطاق الفرعي alajlan.aljudy.sa.
                  </p>
                </div>
              </div>

              {/* Item 3: Automated System Event */}
              <div className="bg-[#f0eeea] rounded-[4px] p-[10px] flex items-start gap-[10px]">
                <div className="size-[32px] rounded-full bg-[#e4e2de] text-[#514537] flex items-center justify-center shrink-0">
                  <Check className="size-[14px]" />
                </div>

                <div className="flex-1 flex flex-col gap-[2px] text-right">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#837565]">15 أكتوبر 2024</span>
                    <span className="font-semibold text-[#1b1c1a]">النظام الآلي</span>
                  </div>
                  <p className="text-[12px] text-[#514537] leading-[18px]">
                    تم سداد فاتورة التجديد الشهري رقم <strong className="text-[#1b1c1a]">INV-2024-0891</strong> تلقائياً بنجاح بمبلغ 750 ر.س.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
