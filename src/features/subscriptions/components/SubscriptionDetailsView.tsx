"use client";

import React, { useState } from "react";
import {
  SubscriptionRecord,
  SubscriptionStatus,
} from "../types/subscription.types";
import {
  mockActiveSubscriptionDetails,
  mockCancelledSubscriptionDetails,
  mockRejectedSubscriptionDetails,
  mockWaitingSubscriptionDetails,
} from "../data/initialSubscriptions";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Ban,
  Scale,
} from "lucide-react";
import { toast } from "sonner";

interface SubscriptionDetailsViewProps {
  initialSubscription?: SubscriptionRecord;
  initialStateVariant?: SubscriptionStatus;
  onBack: () => void;
  onStatusChange?: (id: string, newStatus: SubscriptionStatus) => void;
  onOpenRenew?: (sub: SubscriptionRecord) => void;
  onOpenChangePlan?: (sub: SubscriptionRecord) => void;
  onOpenCancel?: (sub: SubscriptionRecord) => void;
}

export function SubscriptionDetailsView({
  initialSubscription,
  initialStateVariant = "active",
  onBack,
  onStatusChange,
  onOpenRenew,
  onOpenChangePlan,
  onOpenCancel,
}: SubscriptionDetailsViewProps) {
  // Allow toggling between the 4 Figma design states
  const [selectedState, setSelectedState] = useState<SubscriptionStatus>(
    initialSubscription?.status || initialStateVariant
  );

  // Select appropriate mock/active record corresponding to the state
  const currentSub: SubscriptionRecord = React.useMemo(() => {
    switch (selectedState) {
      case "cancelled":
        return mockCancelledSubscriptionDetails;
      case "rejected":
        return mockRejectedSubscriptionDetails;
      case "pending":
        return mockWaitingSubscriptionDetails;
      case "active":
      default:
        return initialSubscription || mockActiveSubscriptionDetails;
    }
  }, [selectedState, initialSubscription]);

  const handleReactivate = () => {
    setSelectedState("active");
    onStatusChange?.(currentSub.id, "active");
    toast.success("تم إرسال طلب إعادة تفعيل الاشتراك بنجاح");
  };

  const handleApprovePending = () => {
    setSelectedState("active");
    onStatusChange?.(currentSub.id, "active");
    toast.success("تمت الموافقة وتفعيل الاشتراك بنجاح");
  };

  const handleRejectPending = () => {
    setSelectedState("rejected");
    onStatusChange?.(currentSub.id, "rejected");
    toast.error("تم رفض طلب الاشتراك وتحويله لحالة الرفض");
  };

  const handleReReview = () => {
    setSelectedState("pending");
    onStatusChange?.(currentSub.id, "pending");
    toast.info("تم فتح طلب إعادة المراجعة ونقله لقيد الانتظار");
  };

  return (
    <div
      className="flex flex-col gap-6 w-full font-['Cairo'] pb-12"
      data-name="Subscription Details Main View"
    >
      {/* Top Header & State Switcher Strip */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#1e1c1a] p-4 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>العودة إلى إدارة الاشتراكات</span>
          </button>
          <div className="h-4 w-px bg-[#e5e2dc] dark:bg-[#38332c]" />
          <div>
            <span className="text-[12px] text-[#837565] dark:text-[#a89f91]">
              رقم الاشتراك:
            </span>
            <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] ms-1.5">
              {currentSub.id}
            </span>
          </div>
        </div>

        {/* State Simulator Pill Switcher (Allows viewing 1:5878, 1:7196, 1:7769, 1:8149) */}
        <div className="flex items-center gap-1 bg-[#f5f3ef] dark:bg-[#2c2621] p-1 rounded-[8px] self-stretch md:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedState("active")}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedState === "active"
                ? "bg-white dark:bg-[#1b1917] text-[#059669] shadow-xs"
                : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a]"
            }`}
          >
            ● نشط (1:5878)
          </button>

          <button
            type="button"
            onClick={() => setSelectedState("pending")}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedState === "pending"
                ? "bg-white dark:bg-[#1b1917] text-[#b45309] shadow-xs"
                : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a]"
            }`}
          >
            ● قيد الانتظار (1:8149)
          </button>

          <button
            type="button"
            onClick={() => setSelectedState("cancelled")}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedState === "cancelled"
                ? "bg-white dark:bg-[#1b1917] text-[#dc2626] shadow-xs"
                : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a]"
            }`}
          >
            ● ملغي (1:7196)
          </button>

          <button
            type="button"
            onClick={() => setSelectedState("rejected")}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedState === "rejected"
                ? "bg-white dark:bg-[#1b1917] text-[#be123c] shadow-xs"
                : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a]"
            }`}
          >
            ● مرفوض (1:7769)
          </button>
        </div>

        {/* Action Commands: Renew, Change Plan, Cancel */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={() => onOpenRenew?.(currentSub)}
            className="bg-[#9c6402] hover:bg-[#825200] text-white px-3.5 py-1.5 rounded-[4px] font-semibold text-[12px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تجديد الاشتراك</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenChangePlan?.(currentSub)}
            className="bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e4e2de] dark:border-[#38332c] px-3.5 py-1.5 rounded-[4px] font-semibold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>تغيير الباقة</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCancel?.(currentSub)}
            className="bg-transparent hover:bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-3.5 py-1.5 rounded-[4px] font-semibold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>إلغاء الاشتراك</span>
          </button>
        </div>
      </div>

      {/* State-Specific Alert Banners */}
      {selectedState === "cancelled" && (
        <div
          className="bg-[#fef2f2] dark:bg-[#311616] border border-[#fecaca] dark:border-[#582121] p-4 rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          data-node-id="1:7196-banner"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[14px] text-[#991b1b] dark:text-[#f87171]">
                تنبيه: تم إلغاء هذا الاشتراك نهائياً بتاريخ 15 أكتوبر 2024 بناءً على طلب العميل
              </h3>
              <p className="text-[12px] text-[#b91c1c] dark:text-[#fca5a5]">
                تم تجميد الوصول لجميع الخدمات السحابية والربط الحكومي. البيانات محفوظة بصيغة القراءة فقط.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReactivate}
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-[6px] font-bold text-[12px] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            إعادة تفعيل الاشتراك
          </button>
        </div>
      )}

      {selectedState === "rejected" && (
        <div
          className="bg-[#fff1f2] dark:bg-[#38141b] border border-[#fecdd3] dark:border-[#5a1b26] p-4 rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          data-node-id="1:7769-banner"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#be123c]/10 text-[#be123c] flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[14px] text-[#9f1239] dark:text-[#fb7185]">
                تنبيه: تم رفض طلب الاشتراك بتاريخ 24 أكتوبر 2024
              </h3>
              <p className="text-[12px] text-[#be123c] dark:text-[#fda4af]">
                السبب: عدم مطابقة السجل التجاري مع ترخيص وزارة العدل المرفق. تم تقييد فتح أي قضايا أو مستخدمين.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReReview}
            className="bg-[#be123c] hover:bg-[#9f1239] text-white px-4 py-2 rounded-[6px] font-bold text-[12px] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            إعادة المراجعة وفتح الطلب
          </button>
        </div>
      )}

      {selectedState === "pending" && (
        <div
          className="bg-[#fffbeb] dark:bg-[#342711] border border-[#fde68a] dark:border-[#5c4217] p-4 rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          data-node-id="1:8149-banner"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#b45309]/10 text-[#b45309] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[14px] text-[#78350f] dark:text-[#fbbf24]">
                إشعار إداري: هذا الاشتراك بانتظار التدقيق الإداري والتراخيص
              </h3>
              <p className="text-[12px] text-[#92400e] dark:text-[#fde68a]">
                تم تفويض الدفعة البنكية عبر مدى، وبانتظار اعتماد التراخيص الرسمية لتفعيل الحساب للمكتب.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApprovePending}
            className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-[6px] font-bold text-[12px] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            مراجعة واعتماد الاشتراك
          </button>
        </div>
      )}

      {/* Top 4 Cards Grid (Matching Section: High Level Banner with Law Firm Info + Key Numbers) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 4: تفاصيل المكتب والترخيص (Rightmost 4 columns in RTL) */}
        <div
          className="lg:col-span-4 bg-white dark:bg-[#1e1c1a] p-5 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between"
          data-node-id="1:5945"
        >
          <div>
            <div className="flex items-start justify-between">
              <span className="font-bold text-[10px] text-[#9c6402] dark:text-[#f59e0b] bg-[#fff8e1] dark:bg-[#342711] px-2 py-0.5 rounded-[4px]">
                {currentSub.firm.licenseNumber}
              </span>
              <div className="size-10 rounded-[8px] bg-[#9c6402]/10 text-[#9c6402] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <h3 className="font-bold text-[16px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-3">
              {currentSub.firm.name}
            </h3>

            <div className="flex items-center gap-1.5 text-[12px] text-[#625d5d] dark:text-[#a89f91] mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentSub.firm.address}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f0eeea] dark:border-[#2f2a24] space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[#625d5d] dark:text-[#a89f91] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>المدير العام:</span>
                </span>
                <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {currentSub.firm.directorName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#625d5d] dark:text-[#a89f91] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>البريد المعتمد:</span>
                </span>
                <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {currentSub.firm.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#625d5d] dark:text-[#a89f91] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>الهاتف الموثق:</span>
                </span>
                <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]" dir="ltr">
                  {currentSub.firm.phone}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-4 py-2 bg-[#f0eeea] dark:bg-[#2c2621] hover:bg-[#eae8e4] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>عرض ملف المكتب الكامل</span>
          </button>
        </div>

        {/* 3 Metric Cards (Remaining 8 cols in RTL) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: الباقة الحالية */}
          <div
            className="bg-white dark:bg-[#1e1c1a] p-4 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            data-node-id="1:5928"
          >
            <div className="flex items-start justify-between">
              <div className="size-8 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] flex items-center justify-center text-[#9c6402]">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#a89f91]">
                {selectedState === "cancelled"
                  ? "الباقة الملغاة"
                  : selectedState === "rejected"
                  ? "الباقة المطلوبة"
                  : selectedState === "pending"
                  ? "الباقة قيد الاعتماد"
                  : "الباقة الحالية"}
              </span>
            </div>

            <div className="my-3">
              <h4 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {currentSub.planName}
              </h4>
              <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                {currentSub.planPrice}
              </p>
              <div className="mt-2 inline-block px-2 py-0.5 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[4px] text-[11px] text-[#514537] dark:text-[#d1c9bd] font-medium">
                {currentSub.billingCycle === "سنوية"
                  ? "الدورة السنوية (توفير 15%)"
                  : "الدورة الشهرية المجدولة"}
              </div>
            </div>

            <div className="pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] text-[11px] text-[#625d5d] dark:text-[#a89f91] flex items-center justify-between">
              <span>وسيلة الدفع:</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {currentSub.paymentMethod.badgeLabel} {currentSub.paymentMethod.cardNumber}
              </span>
            </div>
          </div>

          {/* Card 2: موعد التجديد / حالة الخدمة */}
          <div
            className="bg-white dark:bg-[#1e1c1a] p-4 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            data-node-id="1:5900"
          >
            <div className="flex items-start justify-between">
              <div
                className={`size-8 rounded-[4px] flex items-center justify-center ${
                  selectedState === "cancelled"
                    ? "bg-[#ffebee] text-[#dc2626]"
                    : selectedState === "rejected"
                    ? "bg-[#fff1f2] text-[#be123c]"
                    : selectedState === "pending"
                    ? "bg-[#fffbeb] text-[#b45309]"
                    : "bg-[#fff8e1] text-[#9c6402]"
                }`}
              >
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#a89f91]">
                {selectedState === "cancelled" || selectedState === "rejected" || selectedState === "pending"
                  ? "حالة الاشتراك والخدمة"
                  : "موعد التجديد القادم"}
              </span>
            </div>

            <div className="my-3">
              {selectedState === "cancelled" ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[24px] text-[#dc2626]">الخدمة متوقفة</span>
                    <span className="bg-[#ffebee] text-[#c62828] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      ملغي نهائياً
                    </span>
                  </div>
                  <p className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-1">
                    تاريخ الإيقاف: 15 أكتوبر 2024
                  </p>
                </>
              ) : selectedState === "rejected" ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[24px] text-[#be123c]">الطلب مرفوض</span>
                  </div>
                  <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91] mt-1">
                    تم تقييد الوصول للخدمات السحابية
                  </p>
                </>
              ) : selectedState === "pending" ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[24px] text-[#92400e] dark:text-[#fbbf24]">
                      قيد الانتظار
                    </span>
                  </div>
                  <p className="text-[12px] text-[#78350f] dark:text-[#fde68a] mt-1">
                    مراجعة التراخيص والمطابقة العدلية
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[26px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      21 يوماً
                    </span>
                    <span className="bg-[#fff8e1] dark:bg-[#342711] text-[#b76e00] dark:text-[#f59e0b] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      متبقي على التجديد
                    </span>
                  </div>
                  <p className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-1">
                    15 أكتوبر 2024
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] text-[11px] text-[#625d5d] dark:text-[#a89f91] flex items-center justify-between">
              <span>التجديد التلقائي:</span>
              <span
                className={`font-bold ${
                  selectedState === "active"
                    ? "text-[#059669]"
                    : selectedState === "pending"
                    ? "text-[#b45309]"
                    : "text-[#dc2626]"
                }`}
              >
                {selectedState === "active"
                  ? "مفعل ومجدول"
                  : selectedState === "pending"
                  ? "مجدول (مشروط)"
                  : "معطل"}
              </span>
            </div>
          </div>

          {/* Card 3: حالة الامتثال والفوترة ZATCA */}
          <div
            className="bg-white dark:bg-[#1e1c1a] p-4 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            data-node-id="1:5883"
          >
            <div className="flex items-start justify-between">
              <div className="size-8 rounded-[4px] bg-[#e8f5e9] dark:bg-[#132c21] flex items-center justify-center text-[#1b7340]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#a89f91]">
                حالة الامتثال والفوترة
              </span>
            </div>

            <div className="my-3">
              <div className="inline-block bg-[#e8f5e9] dark:bg-[#132c21] text-[#1b7340] dark:text-[#34d399] font-bold text-[11px] px-2 py-0.5 rounded-[2px]">
                مطابق لهيئة الزكاة والضريبة ZATCA
              </div>
              <p className="text-[11px] text-[#625d5d] dark:text-[#a89f91] mt-1.5 leading-relaxed">
                الفاتورة الإلكترونية - المرحلة الثانية مع رمز الاستجابة السريع المعتمد (QR).
              </p>
            </div>

            <div className="pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] text-[10px] text-[#625d5d] dark:text-[#a89f91] flex items-center justify-between bg-[#f5f3ef] dark:bg-[#2c2621] p-1.5 rounded-[4px]">
              <span>الرقم الضريبي للمكتب:</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                301298457200003
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Detailed Plan Limits & Actual Consumption (6 Grid Cards) */}
      <div
        className="bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        data-node-id="1:5986"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#f0eeea] dark:border-[#2f2a24] gap-2">
          <div>
            <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {selectedState === "rejected"
                ? "تفاصيل الباقة المطلوبة (الباقة الذهبية)"
                : "الميزات وحدود الباقة والاستهلاك الفعلي"}
            </h3>
            <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91]">
              {selectedState === "cancelled"
                ? "تم تجميد استهلاك الموارد وحفظ السجلات في وضع القراءة فقط"
                : selectedState === "rejected"
                ? "الحدود المحددة في طلب الاشتراك قبل الرفض الإداري"
                : selectedState === "pending"
                ? "الحدود المقررة للباقة فور استكمال الاعتماد الإداري"
                : "مراقبة سعة التخزين، والمستخدمين النشطين، ومعدل استخدام العمليات القانونية للباقة الفضية"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#625d5d] dark:text-[#a89f91] bg-[#f5f3ef] dark:bg-[#2c2621] px-2.5 py-1.5 rounded-[4px]">
            <RefreshCw className="w-3 h-3 text-[#9c6402]" />
            <span>تحديث البيانات الفوري: منذ 4 دقائق</span>
          </div>
        </div>

        {/* 6 Consumption Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* Metric 1: فريق العمل والمحامين */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                فريق العمل والمحامين
              </span>
              <span
                className={`font-bold text-[12px] px-2 py-0.5 rounded-[2px] ${
                  selectedState === "cancelled"
                    ? "bg-[#f0eeea] text-[#837565]"
                    : selectedState === "rejected" || selectedState === "pending"
                    ? "bg-[#fffbeb] text-[#92400e]"
                    : "bg-[#fff8e1] text-[#b76e00]"
                }`}
              >
                {selectedState === "cancelled"
                  ? "مجمد"
                  : selectedState === "rejected"
                  ? "غير مفعل"
                  : selectedState === "pending"
                  ? "معلق"
                  : "80%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "cancelled"
                    ? "0 مستخدمين"
                    : selectedState === "rejected" || selectedState === "pending"
                    ? "0 مفعل"
                    : "8 مستخدمين"}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">من أصل 10 مستخدمين</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-[#eae8e4] dark:bg-[#38332c] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedState === "cancelled"
                      ? "bg-[#837565] w-0"
                      : selectedState === "rejected" || selectedState === "pending"
                      ? "bg-[#b45309] w-0"
                      : "bg-[#9c6402] w-[80%]"
                  }`}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
              {selectedState === "active" ? "متبقي مقعدين فقط" : "صلاحيات الوصول معطلة"}
            </div>
          </div>

          {/* Metric 2: القضايا والملفات النشطة */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                القضايا والملفات النشطة
              </span>
              <span
                className={`font-bold text-[12px] px-2 py-0.5 rounded-[2px] ${
                  selectedState === "cancelled"
                    ? "bg-[#f0eeea] text-[#837565]"
                    : selectedState === "rejected" || selectedState === "pending"
                    ? "bg-[#fffbeb] text-[#92400e]"
                    : "bg-[#e8f5e9] text-[#1b7340]"
                }`}
              >
                {selectedState === "cancelled"
                  ? "أرشيف فقط"
                  : selectedState === "rejected"
                  ? "0%"
                  : selectedState === "pending"
                  ? "معلق"
                  : "73.6%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? "184 قضية" : "0 نشطة"}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">من أصل 250 قضية</span>
              </div>
              <div className="w-full h-2 bg-[#eae8e4] dark:bg-[#38332c] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedState === "active" ? "bg-[#1b7340] w-[73.6%]" : "bg-transparent w-0"
                  }`}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
              {selectedState === "active" ? "متبقي 66 قضية متاحة" : "سجل الحركات معلق"}
            </div>
          </div>

          {/* Metric 3: الموكلين والعملاء الموثقين */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                الموكلين والعملاء الموثقين
              </span>
              <span
                className={`font-bold text-[12px] px-2 py-0.5 rounded-[2px] ${
                  selectedState === "cancelled"
                    ? "bg-[#f0eeea] text-[#837565]"
                    : selectedState === "rejected" || selectedState === "pending"
                    ? "bg-[#fffbeb] text-[#92400e]"
                    : "bg-[#e8f5e9] text-[#1b7340]"
                }`}
              >
                {selectedState === "cancelled"
                  ? "مجمد"
                  : selectedState === "rejected"
                  ? "0%"
                  : selectedState === "pending"
                  ? "معلق"
                  : "62%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? "310 عميل" : "0 موكل"}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">من أصل 500 عميل</span>
              </div>
              <div className="w-full h-2 bg-[#eae8e4] dark:bg-[#38332c] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedState === "active" ? "bg-[#059669] w-[62%]" : "bg-transparent w-0"
                  }`}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
              {selectedState === "active" ? "متبقي 190 عميلاً" : "قاعدة البيانات مشفرة"}
            </div>
          </div>

          {/* Metric 4: سعة التخزين السحابي الآمن */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                سعة التخزين السحابي الآمن
              </span>
              <span
                className={`font-bold text-[12px] px-2 py-0.5 rounded-[2px] ${
                  selectedState === "cancelled"
                    ? "bg-[#f0eeea] text-[#837565]"
                    : selectedState === "rejected" || selectedState === "pending"
                    ? "bg-[#fffbeb] text-[#92400e]"
                    : "bg-[#fff8e1] text-[#b76e00]"
                }`}
              >
                {selectedState === "cancelled"
                  ? "محجوز للقراءة"
                  : selectedState === "rejected"
                  ? "غير مخصص"
                  : selectedState === "pending"
                  ? "غير مخصص"
                  : "68%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? "68 جيجابايت" : "0 GB"}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">من أصل 100 GB</span>
              </div>
              <div className="w-full h-2 bg-[#eae8e4] dark:bg-[#38332c] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedState === "active" ? "bg-[#b45309] w-[68%]" : "bg-transparent w-0"
                  }`}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
              {selectedState === "active" ? "متبقي 32 GB مساحة حرة" : "لا توجد ملفات مرفوعة"}
            </div>
          </div>

          {/* Metric 5: الوكلاء والممثلين النظاميين */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                الوكلاء والممثلين النظاميين
              </span>
              <span
                className={`font-bold text-[12px] px-2 py-0.5 rounded-[2px] ${
                  selectedState === "cancelled"
                    ? "bg-[#f0eeea] text-[#837565]"
                    : selectedState === "rejected" || selectedState === "pending"
                    ? "bg-[#fffbeb] text-[#92400e]"
                    : "bg-[#e8f5e9] text-[#1b7340]"
                }`}
              >
                {selectedState === "cancelled"
                  ? "مجمد"
                  : selectedState === "rejected"
                  ? "0%"
                  : selectedState === "pending"
                  ? "معلق"
                  : "60%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? "12 وكيلاً" : "0 وكيل"}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">من أصل 20 وكيلاً</span>
              </div>
              <div className="w-full h-2 bg-[#eae8e4] dark:bg-[#38332c] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedState === "active" ? "bg-[#059669] w-[60%]" : "bg-transparent w-0"
                  }`}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
              {selectedState === "active" ? "متبقي 8 وكلاء متاحين" : "الربط بنظام الوكالات معطل"}
            </div>
          </div>

          {/* Metric 6: الخدمات الإضافية والربط الحكومي */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                الربط الحكومي والإضافات
              </span>
              <span
                className={`font-bold text-[12px] px-2 py-0.5 rounded-[2px] ${
                  selectedState === "cancelled"
                    ? "bg-[#f0eeea] text-[#837565]"
                    : selectedState === "rejected" || selectedState === "pending"
                    ? "bg-[#fffbeb] text-[#92400e]"
                    : "bg-[#e8f5e9] text-[#1b7340]"
                }`}
              >
                {selectedState === "active" ? "3 خدمات مفعلة" : "معلق"}
              </span>
            </div>

            <div className="my-2 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#514537] dark:text-[#d1c9bd]">بوابة ناجز العدلية:</span>
                <span
                  className={`font-bold ${
                    selectedState === "active" ? "text-[#1b7340]" : "text-[#837565]"
                  }`}
                >
                  {selectedState === "active" ? "متصل ومفعل" : "معطل"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#514537] dark:text-[#d1c9bd]">هيئة الزكاة والضريبة:</span>
                <span
                  className={`font-bold ${
                    selectedState === "active" ? "text-[#1b7340]" : "text-[#837565]"
                  }`}
                >
                  {selectedState === "active" ? "ربط فوري" : "معطل"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#514537] dark:text-[#d1c9bd]">الدعم الفني VIP:</span>
                <span
                  className={`font-bold ${
                    selectedState === "active" ? "text-[#1b7340]" : "text-[#837565]"
                  }`}
                >
                  {selectedState === "active" ? "ساري" : "معطل"}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#625d5d] dark:text-[#a89f91] pt-1 border-t border-[#eae8e4] dark:border-[#38332c]">
              {selectedState === "active" ? "جاهزية بنسبة 100%" : "يتطلب اشتراك نشط"}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Two Columns (Adaptive based on State) */}
      {selectedState === "pending" ? (
        /* Variant for Pending (1:8149): Checklist + Pro-Forma Invoice Approval */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-node-id="1:8149-bottom">
          {/* Right Column: سجل المراجعة والتدقيق الإداري (Checklist & Audit) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
              سجل المراجعة والتدقيق الإداري
            </h3>

            {/* Warning Alert */}
            <div className="bg-[#fffbeb] dark:bg-[#342711] border border-[#fde68a] dark:border-[#5c4217] p-3.5 rounded-[6px] text-[12px] text-[#78350f] dark:text-[#fbbf24] mb-4">
              <span className="font-bold">سبب التعليق: </span>
              بانتظار التحقق من ترخيص وزارة العدل رقم 218/41 ومطابقة السجل التجاري التابع للمكتب.
            </div>

            {/* 4-Item Verification Checklist */}
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                قائمة المستندات المطلوبة للاعتماد:
              </h4>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    السجل التجاري الموثق (ساري المفعول)
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    رقم السجل: 1010892019
                  </span>
                </div>
                <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تم التحقق</span>
                </span>
              </div>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    ترخيص وزارة العدل لمزاولة مهنة المحاماة
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    رقم الترخيص: 218/41
                  </span>
                </div>
                <span className="bg-[#fffbeb] text-[#b45309] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>قيد التدقيق</span>
                </span>
              </div>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    العنوان الوطني الموحد للمكتب
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    الرمز البريدي: 12211 - مبنى 401
                  </span>
                </div>
                <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تم التحقق</span>
                </span>
              </div>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    شهادة تسجيل ضريبة القيمة المضافة (ZATCA)
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    الرقم الضريبي: 310928374100003
                  </span>
                </div>
                <span className="bg-[#fffbeb] text-[#b45309] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>قيد التدقيق</span>
                </span>
              </div>
            </div>

            {/* Timeline Events */}
            <div className="border-t border-[#f0eeea] dark:border-[#2f2a24] pt-4">
              <h4 className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
                تسلسل الإجراءات الإدارية:
              </h4>
              <div className="space-y-3 relative pe-4 border-e-2 border-[#eae8e4] dark:border-[#38332c]">
                {currentSub.timeline?.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -right-[21px] top-1 size-2 rounded-full bg-[#9c6402]" />
                    <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                      {event.title}
                    </span>
                    <p className="text-[11px] text-[#625d5d] dark:text-[#a89f91] mt-0.5">
                      {event.description}
                    </p>
                    <span className="text-[10px] text-[#837565] mt-1 block">
                      {event.actor} • {event.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Left Column: العمليات المالية والفوترة (Pro-Forma & Action CTAs) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-4">
                العمليات المالية والفوترة
              </h3>

              {/* Authorized payment box */}
              <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[6px] mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    التفويض البنكي المسبق
                  </span>
                  <span className="bg-[#fff8e1] text-[#b76e00] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                    مفوض بنكياً
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#625d5d] dark:text-[#a89f91]">
                    مدى (•••• 4421)
                  </span>
                  <span className="font-bold text-[16px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    9,200.00 ر.س
                  </span>
                </div>
                <p className="text-[10px] text-[#837565] dark:text-[#a89f91] mt-2">
                  المبلغ محجوز لدى البوابة بانتظار الاعتماد الإداري ليتم إصدار الفاتورة الضريبية النهائية والاستقطاع.
                </p>
              </div>

              {/* Pro-Forma Invoice Draft breakdown */}
              <div className="border border-[#f0eeea] dark:border-[#2f2a24] p-4 rounded-[6px] space-y-2.5 text-[12px]">
                <div className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] pb-2 border-b border-[#f0eeea] dark:border-[#2f2a24]">
                  تفاصيل مسودة الفاتورة الأولية:
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#625d5d] dark:text-[#a89f91]">
                    رسوم الاشتراك الأساسية (الباقة الفضية):
                  </span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    8,000.00 ر.س
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#625d5d] dark:text-[#a89f91]">
                    ضريبة القيمة المضافة (15%):
                  </span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    1,200.00 ر.س
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] font-bold text-[14px]">
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7]">الإجمالي المستحق:</span>
                  <span className="text-[#9c6402] dark:text-[#f59e0b]">9,200.00 ر.س</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 border-t border-[#f0eeea] dark:border-[#2f2a24] flex flex-col gap-2.5 mt-6">
              <button
                type="button"
                onClick={handleApprovePending}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white py-2.5 rounded-[6px] font-bold text-[13px] shadow-xs transition-colors cursor-pointer"
              >
                الموافقة وتفعيل الاشتراك
              </button>
              <button
                type="button"
                onClick={handleRejectPending}
                className="w-full bg-transparent hover:bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] py-2.5 rounded-[6px] font-bold text-[13px] transition-colors cursor-pointer"
              >
                رفض الطلب
              </button>
            </div>
          </div>
        </div>
      ) : selectedState === "rejected" ? (
        /* Variant for Rejected (1:7769): Rejection Audit & Action Details */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-node-id="1:7769-bottom">
          <div className="lg:col-span-8 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
              تقرير الرفض الإداري والتدقيق القانوني
            </h3>
            <div className="bg-[#fff1f2] dark:bg-[#38141b] border border-[#fecdd3] p-4 rounded-[6px] mb-4">
              <div className="font-bold text-[14px] text-[#9f1239] dark:text-[#fb7185] mb-1">
                سبب الرفض المسجل في النظام:
              </div>
              <p className="text-[12px] text-[#be123c] dark:text-[#fda4af] leading-relaxed">
                عدم تطابق اسم المنشأة في ترخيص مزاولة المهنة الصادر من وزارة العدل مع الاسم المسجل بالسجل التجاري المرفق، إضافة إلى انتهاء صلاحية التفويض البنكي قبل اعتماد الطلب.
              </p>
              <div className="mt-3 pt-2 border-t border-[#fecdd3] dark:border-[#5a1b26] text-[11px] text-[#be123c] flex items-center justify-between">
                <span>المشرف المسؤول: د. سلطان بن عبد العزيز العتيبي</span>
                <span>تاريخ القرار: 24 أكتوبر 2024</span>
              </div>
            </div>

            <h4 className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              الإجراءات المقترحة لتمكين المكتب:
            </h4>
            <ul className="list-disc list-inside text-[12px] text-[#514537] dark:text-[#d1c9bd] space-y-1.5">
              <li>رفع نسخة حديثة ومطابقة من ترخيص وزارة العدل المحدث.</li>
              <li>تحديث بيانات الممثل النظامي عبر بوابة الدخول الموحد.</li>
              <li>إعادة تقديم الطلب وتفويض وسيلة دفع صالحة.</li>
            </ul>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
                إجراءات التدقيق
              </h3>
              <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91] mb-4">
                يمكن لمسؤول النظام إعادة فتح الطلب للمراجعة الاستثنائية بعد التواصل المباشر مع ممثل المكتب.
              </p>
              <div className="space-y-2 text-[12px] p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px]">
                <div className="flex justify-between">
                  <span className="text-[#625d5d]">حالة البوابة:</span>
                  <span className="font-bold text-[#be123c]">مقيدة مؤقتاً</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#625d5d]">نوع الطلب:</span>
                  <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">اشتراك سنوي جديد</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReReview}
              className="w-full mt-6 bg-[#be123c] hover:bg-[#9f1239] text-white py-2.5 rounded-[6px] font-bold text-[13px] shadow-xs transition-colors cursor-pointer"
            >
              إعادة فتح الملف للتدقيق
            </button>
          </div>
        </div>
      ) : (
        /* Variant for Active (1:5878) and Cancelled (1:7196): Invoices Table + Timeline */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-node-id="1:6122">
          {/* Right Column (8 cols): سجل الفواتير والعمليات المالية */}
          <div
            className="lg:col-span-8 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            data-node-id="1:6123"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#f0eeea] dark:border-[#2f2a24] mb-4">
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                سجل الفواتير والعمليات المالية
              </h3>
              <span className="text-[12px] text-[#837565]">
                {currentSub.invoices?.length || 0} معاملات مسجلة
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f5f3ef] dark:bg-[#2c2621] text-[#625d5d] dark:text-[#a89f91] font-bold border-b border-[#eae8e4] dark:border-[#38332c]">
                    <th className="p-3">رقم الفاتورة والمرجع</th>
                    <th className="p-3">تاريخ المعاملة</th>
                    <th className="p-3">المبلغ المدفوع</th>
                    <th className="p-3">طريقة الدفع</th>
                    <th className="p-3">حالة العملية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eeea] dark:divide-[#2f2a24]">
                  {currentSub.invoices?.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#faf9f7] dark:hover:bg-[#25221e] transition-colors"
                    >
                      <td className="p-3">
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {inv.id}
                        </span>
                        <span className="text-[10px] text-[#625d5d] dark:text-[#a89f91]">
                          {inv.subDescription}
                        </span>
                      </td>
                      <td className="p-3 text-[#625d5d] dark:text-[#a89f91]">
                        {inv.date}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {inv.amount}
                        </span>
                        {inv.vatNote && (
                          <span className="text-[10px] text-[#625d5d]">
                            {inv.vatNote}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {inv.paymentMethod}
                        </span>
                        <span className="text-[10px] text-[#625d5d]">
                          {inv.paymentMethodDetail}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-[2px] ${
                            inv.status === "success"
                              ? "bg-[#e8f5e9] text-[#1b7340]"
                              : inv.status === "failed"
                              ? "bg-[#ffebee] text-[#c62828]"
                              : "bg-[#f0eeea] text-[#514537]"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              inv.status === "success"
                                ? "bg-[#1b7340]"
                                : inv.status === "failed"
                                ? "bg-[#c62828]"
                                : "bg-[#837565]"
                            }`}
                          />
                          <span>{inv.statusLabel}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Left Column (4 cols): سجل الحركات والتتبع Timeline */}
          <div
            className="lg:col-span-4 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            data-node-id="1:6224"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#f0eeea] dark:border-[#2f2a24] mb-4">
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                سجل الحركات والتتبع
              </h3>
              <Clock className="w-4 h-4 text-[#9c6402]" />
            </div>

            <div className="space-y-4 relative pe-4 border-e-2 border-[#eae8e4] dark:border-[#38332c]">
              {currentSub.timeline?.map((ev) => (
                <div key={ev.id} className="relative">
                  <div
                    className={`absolute -right-[21px] top-1 size-2 rounded-full ${
                      ev.type === "cancellation"
                        ? "bg-[#dc2626]"
                        : ev.type === "renewal"
                        ? "bg-[#059669]"
                        : "bg-[#9c6402]"
                    }`}
                  />
                  <h4 className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] text-[#625d5d] dark:text-[#a89f91] mt-0.5 leading-relaxed">
                    {ev.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#837565] mt-1 font-semibold">
                    <span>{ev.actor}</span>
                    <span>•</span>
                    <span>{ev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
