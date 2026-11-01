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
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  approveSubscription,
  rejectSubscription,
  fetchSubscriptionById,
} from "@/lib/api/subscriptions";
import { mapSubscriptionFromApi } from "@/lib/api/mappers";
import { unwrapData } from "@/lib/api/helpers";

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
  const { t, direction, isEn } = useLanguage();

  // Allow toggling between the 4 Figma design states
  const [selectedState, setSelectedState] = useState<SubscriptionStatus>(
    initialSubscription?.status || initialStateVariant
  );
  const [liveSubscription, setLiveSubscription] = useState<SubscriptionRecord | null>(
    initialSubscription || null
  );

  React.useEffect(() => {
    const id = initialSubscription?.id;
    if (!id) return;
    let cancelled = false;
    fetchSubscriptionById(id)
      .then((payload) => {
        if (cancelled) return;
        const raw = (unwrapData<Record<string, unknown>>(payload) ||
          payload) as Record<string, unknown>;
        if (raw?.id || raw?.code) {
          const mapped = mapSubscriptionFromApi(raw);
          setLiveSubscription(mapped);
          setSelectedState(mapped.status);
        }
      })
      .catch(() => {
        // Keep initial/mock subscription.
      });
    return () => {
      cancelled = true;
    };
  }, [initialSubscription?.id]);

  // Select appropriate mock/active record corresponding to the state
  const currentSub: SubscriptionRecord = React.useMemo(() => {
    if (liveSubscription && liveSubscription.status === selectedState) {
      return liveSubscription;
    }
    switch (selectedState) {
      case "cancelled":
        return mockCancelledSubscriptionDetails;
      case "rejected":
        return mockRejectedSubscriptionDetails;
      case "pending":
        return mockWaitingSubscriptionDetails;
      case "active":
      default:
        return liveSubscription || initialSubscription || mockActiveSubscriptionDetails;
    }
  }, [selectedState, initialSubscription, liveSubscription]);

  const handleReactivate = () => {
    setSelectedState("active");
    onStatusChange?.(currentSub.id, "active");
    toast.success(t("تم إرسال طلب إعادة تفعيل الاشتراك بنجاح", "Subscription reactivation request submitted successfully"));
  };

  const handleApprovePending = async () => {
    try {
      await approveSubscription(currentSub.id);
    } catch {
      // Keep local approve.
    }
    setSelectedState("active");
    onStatusChange?.(currentSub.id, "active");
    toast.success(t("تمت الموافقة وتفعيل الاشتراك بنجاح", "Subscription approved and activated successfully"));
  };

  const handleRejectPending = async () => {
    try {
      await rejectSubscription(currentSub.id, "رفض إداري من لوحة الإدارة");
    } catch {
      // Keep local reject.
    }
    setSelectedState("rejected");
    onStatusChange?.(currentSub.id, "rejected");
    toast.error(t("تم رفض طلب الاشتراك وتحويله لحالة الرفض", "Subscription request rejected"));
  };

  const handleReReview = () => {
    setSelectedState("pending");
    onStatusChange?.(currentSub.id, "pending");
    toast.info(t("تم فتح طلب إعادة المراجعة ونقله لقيد الانتظار", "Re-review opened and moved to pending"));
  };

  return (
    <div
      dir={direction}
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
            <ArrowLeft className={cn("w-4 h-4", !isEn && "rotate-180")} />
            <span>{t("العودة إلى إدارة الاشتراكات", "Back to Subscriptions")}</span>
          </button>
          <div className="h-4 w-px bg-[#e5e2dc] dark:bg-[#38332c]" />
          <div>
            <span className="text-[12px] text-[#837565] dark:text-[#a89f91]">
              {t("رقم الاشتراك:", "Subscription ID:")}
            </span>
            <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] ms-1.5">
              {currentSub.id}
            </span>
          </div>
        </div>

        {/* State Simulator Pill Switcher */}
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
            ● {t("نشط (1:5878)", "Active (1:5878)")}
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
            ● {t("قيد الانتظار (1:8149)", "Pending (1:8149)")}
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
            ● {t("ملغي (1:7196)", "Cancelled (1:7196)")}
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
            ● {t("مرفوض (1:7769)", "Rejected (1:7769)")}
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
            <span>{t("تجديد الاشتراك", "Renew Subscription")}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenChangePlan?.(currentSub)}
            className="bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e4e2de] dark:border-[#38332c] px-3.5 py-1.5 rounded-[4px] font-semibold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t("تغيير الباقة", "Change Plan")}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCancel?.(currentSub)}
            className="bg-transparent hover:bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-3.5 py-1.5 rounded-[4px] font-semibold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t("إلغاء الاشتراك", "Cancel Subscription")}</span>
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
                {t(
                  "تنبيه: تم إلغاء هذا الاشتراك نهائياً بتاريخ 15 أكتوبر 2024 بناءً على طلب العميل",
                  "Notice: This subscription was permanently cancelled on Oct 15, 2024 per client request"
                )}
              </h3>
              <p className="text-[12px] text-[#b91c1c] dark:text-[#fca5a5]">
                {t(
                  "تم تجميد الوصول لجميع الخدمات السحابية والربط الحكومي. البيانات محفوظة بصيغة القراءة فقط.",
                  "Cloud services & gov integrations frozen. Data preserved in read-only mode."
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReactivate}
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-[6px] font-bold text-[12px] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {t("إعادة تفعيل الاشتراك", "Reactivate Subscription")}
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
                {t(
                  "تنبيه: تم رفض طلب الاشتراك بتاريخ 24 أكتوبر 2024",
                  "Notice: Subscription request was rejected on Oct 24, 2024"
                )}
              </h3>
              <p className="text-[12px] text-[#be123c] dark:text-[#fda4af]">
                {t(
                  "السبب: عدم مطابقة السجل التجاري مع ترخيص وزارة العدل المرفق. تم تقييد فتح أي قضايا أو مستخدمين.",
                  "Reason: CR does not match the attached MOJ license. Opening cases or users is restricted."
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReReview}
            className="bg-[#be123c] hover:bg-[#9f1239] text-white px-4 py-2 rounded-[6px] font-bold text-[12px] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {t("إعادة المراجعة وفتح الطلب", "Re-review & Open Request")}
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
                {t(
                  "إشعار إداري: هذا الاشتراك بانتظار التدقيق الإداري والتراخيص",
                  "Admin Notice: Subscription pending administrative review & licenses"
                )}
              </h3>
              <p className="text-[12px] text-[#92400e] dark:text-[#fde68a]">
                {t(
                  "تم تفويض الدفعة البنكية عبر مدى، وبانتظار اعتماد التراخيص الرسمية لتفعيل الحساب للمكتب.",
                  "Payment authorized via Mada; awaiting license approval to activate office account."
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApprovePending}
            className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-[6px] font-bold text-[12px] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {t("مراجعة واعتماد الاشتراك", "Review & Approve")}
          </button>
        </div>
      )}

      {/* Top 4 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 4: Office info */}
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
                  <span>{t("المدير العام:", "General Manager:")}</span>
                </span>
                <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {currentSub.firm.directorName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#625d5d] dark:text-[#a89f91] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t("البريد المعتمد:", "Official Email:")}</span>
                </span>
                <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {currentSub.firm.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#625d5d] dark:text-[#a89f91] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t("الهاتف الموثق:", "Verified Phone:")}</span>
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
            <span>{t("عرض ملف المكتب الكامل", "View Full Office Profile")}</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
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
                  ? t("الباقة الملغاة", "Cancelled Plan")
                  : selectedState === "rejected"
                  ? t("الباقة المطلوبة", "Requested Plan")
                  : selectedState === "pending"
                  ? t("الباقة قيد الاعتماد", "Pending Plan")
                  : t("الباقة الحالية", "Current Plan")}
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
                  ? t("الدورة السنوية (توفير 15%)", "Annual Cycle (Save 15%)")
                  : t("الدورة الشهرية المجدولة", "Monthly Scheduled Cycle")}
              </div>
            </div>

            <div className="pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] text-[11px] text-[#625d5d] dark:text-[#a89f91] flex items-center justify-between">
              <span>{t("وسيلة الدفع:", "Payment Method:")}</span>
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
                  ? t("حالة الاشتراك والخدمة", "Subscription Status")
                  : t("موعد التجديد القادم", "Next Renewal Date")}
              </span>
            </div>

            <div className="my-3">
              {selectedState === "cancelled" ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[24px] text-[#dc2626]">{t("الخدمة متوقفة", "Suspended")}</span>
                    <span className="bg-[#ffebee] text-[#c62828] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      {t("ملغي نهائياً", "Cancelled")}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-1">
                    {t("تاريخ الإيقاف: 15 أكتوبر 2024", "Suspended on: Oct 15, 2024")}
                  </p>
                </>
              ) : selectedState === "rejected" ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[24px] text-[#be123c]">{t("الطلب مرفوض", "Rejected")}</span>
                  </div>
                  <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91] mt-1">
                    {t("تم تقييد الوصول للخدمات السحابية", "Access to cloud features restricted")}
                  </p>
                </>
              ) : selectedState === "pending" ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[24px] text-[#92400e] dark:text-[#fbbf24]">
                      {t("قيد الانتظار", "Pending")}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#78350f] dark:text-[#fde68a] mt-1">
                    {t("مراجعة التراخيص والمطابقة العدلية", "Verifying legal compliance")}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[26px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("21 يوماً", "21 Days")}
                    </span>
                    <span className="bg-[#fff8e1] dark:bg-[#342711] text-[#b76e00] dark:text-[#f59e0b] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      {t("متبقي على التجديد", "Until Renewal")}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-1">
                    {t("15 أكتوبر 2024", "15 October 2024")}
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] text-[11px] text-[#625d5d] dark:text-[#a89f91] flex items-center justify-between">
              <span>{t("التجديد التلقائي:", "Auto Renewal:")}</span>
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
                  ? t("مفعل ومجدول", "Active & Scheduled")
                  : selectedState === "pending"
                  ? t("مجدول (مشروط)", "Scheduled (Conditional)")
                  : t("معطل", "Disabled")}
              </span>
            </div>
          </div>

          {/* Card 3: ZATCA */}
          <div
            className="bg-white dark:bg-[#1e1c1a] p-4 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            data-node-id="1:5883"
          >
            <div className="flex items-start justify-between">
              <div className="size-8 rounded-[4px] bg-[#e8f5e9] dark:bg-[#132c21] flex items-center justify-center text-[#1b7340]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold text-[#625d5d] dark:text-[#a89f91]">
                {t("حالة الامتثال والفوترة", "Compliance & Billing")}
              </span>
            </div>

            <div className="my-3">
              <div className="inline-block bg-[#e8f5e9] dark:bg-[#132c21] text-[#1b7340] dark:text-[#34d399] font-bold text-[11px] px-2 py-0.5 rounded-[2px]">
                {t("مطابق لهيئة الزكاة والضريبة ZATCA", "ZATCA Compliant")}
              </div>
              <p className="text-[11px] text-[#625d5d] dark:text-[#a89f91] mt-1.5 leading-relaxed">
                {t(
                  "الفاتورة الإلكترونية - المرحلة الثانية مع رمز الاستجابة السريع المعتمد (QR).",
                  "E-invoicing Phase 2 with verified cryptographic QR code."
                )}
              </p>
            </div>

            <div className="pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] text-[10px] text-[#625d5d] dark:text-[#a89f91] flex items-center justify-between bg-[#f5f3ef] dark:bg-[#2c2621] p-1.5 rounded-[4px]">
              <span>{t("الرقم الضريبي للمكتب:", "Office Tax ID:")}</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                301298457200003
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Detailed Plan Limits & Actual Consumption */}
      <div
        className="bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        data-node-id="1:5986"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#f0eeea] dark:border-[#2f2a24] gap-2">
          <div>
            <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {selectedState === "rejected"
                ? t("تفاصيل الباقة المطلوبة (الباقة الذهبية)", "Requested Plan Details (Gold Plan)")
                : t("الميزات وحدود الباقة والاستهلاك الفعلي", "Plan Limits & Actual Usage")}
            </h3>
            <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91]">
              {selectedState === "cancelled"
                ? t("تم تجميد استهلاك الموارد وحفظ السجلات في وضع القراءة فقط", "Resource consumption frozen; records archived read-only")
                : selectedState === "rejected"
                ? t("الحدود المحددة في طلب الاشتراك قبل الرفض الإداري", "Limits in request prior to rejection")
                : selectedState === "pending"
                ? t("الحدود المقررة للباقة فور استكمال الاعتماد الإداري", "Designated limits once admin approval completes")
                : t("مراقبة سعة التخزين، والمستخدمين النشطين، ومعدل استخدام العمليات القانونية للباقة الفضية", "Monitor storage, active users, and legal quota for Silver Plan")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#625d5d] dark:text-[#a89f91] bg-[#f5f3ef] dark:bg-[#2c2621] px-2.5 py-1.5 rounded-[4px]">
            <RefreshCw className="w-3 h-3 text-[#9c6402]" />
            <span>{t("تحديث البيانات الفوري: منذ 4 دقائق", "Live Sync: 4 mins ago")}</span>
          </div>
        </div>

        {/* 6 Consumption Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* Metric 1 */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("فريق العمل والمحامين", "Team & Lawyers")}
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
                  ? t("مجمد", "Frozen")
                  : selectedState === "rejected"
                  ? t("غير مفعل", "Inactive")
                  : selectedState === "pending"
                  ? t("معلق", "Pending")
                  : "80%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "cancelled"
                    ? t("0 مستخدمين", "0 Users")
                    : selectedState === "rejected" || selectedState === "pending"
                    ? t("0 مفعل", "0 Active")
                    : t("8 مستخدمين", "8 Users")}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">
                  {t("من أصل 10 مستخدمين", "out of 10 users")}
                </span>
              </div>
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
              {selectedState === "active" ? t("متبقي مقعدين فقط", "2 seats remaining") : t("صلاحيات الوصول معطلة", "Access suspended")}
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("القضايا والملفات النشطة", "Active Cases & Files")}
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
                  ? t("أرشيف فقط", "Archive Only")
                  : selectedState === "rejected"
                  ? "0%"
                  : selectedState === "pending"
                  ? t("معلق", "Pending")
                  : "73.6%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? t("184 قضية", "184 Cases") : t("0 نشطة", "0 Active")}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">
                  {t("من أصل 250 قضية", "out of 250 cases")}
                </span>
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
              {selectedState === "active" ? t("متبقي 66 قضية متاحة", "66 cases available") : t("سجل الحركات معلق", "Activity log suspended")}
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("الموكلين والعملاء الموثقين", "Verified Clients")}
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
                  ? t("مجمد", "Frozen")
                  : selectedState === "rejected"
                  ? "0%"
                  : selectedState === "pending"
                  ? t("معلق", "Pending")
                  : "62%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? t("310 عميل", "310 Clients") : t("0 موكل", "0 Clients")}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">
                  {t("من أصل 500 عميل", "out of 500 clients")}
                </span>
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
              {selectedState === "active" ? t("متبقي 190 عميلاً", "190 clients left") : t("قاعدة البيانات مشفرة", "Database encrypted")}
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("سعة التخزين السحابي الآمن", "Secure Cloud Storage")}
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
                  ? t("محجوز للقراءة", "Read-only Reserved")
                  : selectedState === "rejected"
                  ? t("غير مخصص", "Unallocated")
                  : selectedState === "pending"
                  ? t("غير مخصص", "Unallocated")
                  : "68%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? t("68 جيجابايت", "68 GB") : "0 GB"}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">
                  {t("من أصل 100 GB", "out of 100 GB")}
                </span>
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
              {selectedState === "active" ? t("متبقي 32 GB مساحة حرة", "32 GB remaining free space") : t("لا توجد ملفات مرفوعة", "No files uploaded")}
            </div>
          </div>

          {/* Metric 5 */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("الوكلاء والممثلين النظاميين", "Agents & Representatives")}
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
                  ? t("مجمد", "Frozen")
                  : selectedState === "rejected"
                  ? "0%"
                  : selectedState === "pending"
                  ? t("معلق", "Pending")
                  : "60%"}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                <span className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {selectedState === "active" ? t("12 وكيلاً", "12 Agents") : t("0 وكيل", "0 Agents")}
                </span>
                <span className="text-[#625d5d] dark:text-[#a89f91]">
                  {t("من أصل 20 وكيلاً", "out of 20 agents")}
                </span>
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
              {selectedState === "active" ? t("متبقي 8 وكلاء متاحين", "8 agents available") : t("الربط بنظام الوكالات معطل", "POAs sync disabled")}
            </div>
          </div>

          {/* Metric 6 */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[8px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("الربط الحكومي والإضافات", "Gov Sync & Add-ons")}
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
                {selectedState === "active" ? t("3 خدمات مفعلة", "3 Active Services") : t("معلق", "Suspended")}
              </span>
            </div>

            <div className="my-2 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#514537] dark:text-[#d1c9bd]">{t("بوابة ناجز العدلية:", "Najiz Judicial Portal:")}</span>
                <span
                  className={`font-bold ${
                    selectedState === "active" ? "text-[#1b7340]" : "text-[#837565]"
                  }`}
                >
                  {selectedState === "active" ? t("متصل ومفعل", "Connected") : t("معطل", "Disabled")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#514537] dark:text-[#d1c9bd]">{t("هيئة الزكاة والضريبة:", "ZATCA Authority:")}</span>
                <span
                  className={`font-bold ${
                    selectedState === "active" ? "text-[#1b7340]" : "text-[#837565]"
                  }`}
                >
                  {selectedState === "active" ? t("ربط فوري", "Instant Sync") : t("معطل", "Disabled")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#514537] dark:text-[#d1c9bd]">{t("الدعم الفني VIP:", "VIP Technical Support:")}</span>
                <span
                  className={`font-bold ${
                    selectedState === "active" ? "text-[#1b7340]" : "text-[#837565]"
                  }`}
                >
                  {selectedState === "active" ? t("ساري", "Active") : t("معطل", "Disabled")}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#625d5d] dark:text-[#a89f91] pt-1 border-t border-[#eae8e4] dark:border-[#38332c]">
              {selectedState === "active" ? t("جاهزية بنسبة 100%", "100% Ready") : t("يتطلب اشتراك نشط", "Requires Active Subscription")}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Two Columns (Adaptive based on State) */}
      {selectedState === "pending" ? (
        /* Variant for Pending (1:8149) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-node-id="1:8149-bottom">
          {/* Right Column: سجل المراجعة والتدقيق الإداري */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
              {t("سجل المراجعة والتدقيق الإداري", "Administrative Review & Audit Log")}
            </h3>

            {/* Warning Alert */}
            <div className="bg-[#fffbeb] dark:bg-[#342711] border border-[#fde68a] dark:border-[#5c4217] p-3.5 rounded-[6px] text-[12px] text-[#78350f] dark:text-[#fbbf24] mb-4">
              <span className="font-bold">{t("سبب التعليق: ", "Suspension Reason: ")}</span>
              {t(
                "بانتظار التحقق من ترخيص وزارة العدل رقم 218/41 ومطابقة السجل التجاري التابع للمكتب.",
                "Awaiting verification of MOJ license #218/41 and matching commercial registration."
              )}
            </div>

            {/* 4-Item Verification Checklist */}
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("قائمة المستندات المطلوبة للاعتماد:", "Required Documents for Approval:")}
              </h4>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    {t("السجل التجاري الموثق (ساري المفعول)", "Commercial Registration (Active)")}
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    {t("رقم السجل: 1010892019", "CR Number: 1010892019")}
                  </span>
                </div>
                <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("تم التحقق", "Verified")}</span>
                </span>
              </div>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    {t("ترخيص وزارة العدل لمزاولة مهنة المحاماة", "MOJ Practice License")}
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    {t("رقم الترخيص: 218/41", "License Number: 218/41")}
                  </span>
                </div>
                <span className="bg-[#fffbeb] text-[#b45309] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t("قيد التدقيق", "Under Review")}</span>
                </span>
              </div>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    {t("العنوان الوطني الموحد للمكتب", "Unified National Address")}
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    {t("الرمز البريدي: 12211 - مبنى 401", "Postal Code: 12211 - Bldg 401")}
                  </span>
                </div>
                <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("تم التحقق", "Verified")}</span>
                </span>
              </div>

              <div className="p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
                    {t("شهادة تسجيل ضريبة القيمة المضافة (ZATCA)", "VAT Registration Certificate (ZATCA)")}
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    {t("الرقم الضريبي: 310928374100003", "Tax ID: 310928374100003")}
                  </span>
                </div>
                <span className="bg-[#fffbeb] text-[#b45309] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t("قيد التدقيق", "Under Review")}</span>
                </span>
              </div>
            </div>

            {/* Timeline Events */}
            <div className="border-t border-[#f0eeea] dark:border-[#2f2a24] pt-4">
              <h4 className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
                {t("تسلسل الإجراءات الإدارية:", "Sequence of Administrative Actions:")}
              </h4>
              <div className={cn("space-y-3 relative", !isEn ? "pe-4 border-e-2" : "ps-4 border-s-2", "border-[#eae8e4] dark:border-[#38332c]")}>
                {currentSub.timeline?.map((event) => (
                  <div key={event.id} className="relative">
                    <div className={cn("absolute top-1 size-2 rounded-full bg-[#9c6402]", !isEn ? "-right-[21px]" : "-left-[21px]")} />
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

          {/* Left Column: العمليات المالية والفوترة */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-4">
                {t("العمليات المالية والفوترة", "Financial Operations & Billing")}
              </h3>

              {/* Authorized payment box */}
              <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-4 rounded-[6px] mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("التفويض البنكي المسبق", "Pre-authorized Bank Payment")}
                  </span>
                  <span className="bg-[#fff8e1] text-[#b76e00] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                    {t("مفوض بنكياً", "Authorized")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#625d5d] dark:text-[#a89f91]">
                    {t("مدى (•••• 4421)", "Mada (•••• 4421)")}
                  </span>
                  <span className="font-bold text-[16px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("9,200.00 ر.س", "9,200.00 SAR")}
                  </span>
                </div>
                <p className="text-[10px] text-[#837565] dark:text-[#a89f91] mt-2">
                  {t(
                    "المبلغ محجوز لدى البوابة بانتظار الاعتماد الإداري ليتم إصدار الفاتورة الضريبية النهائية والاستقطاع.",
                    "The amount is pre-authorized awaiting admin approval before generating final tax invoice and debit."
                  )}
                </p>
              </div>

              {/* Pro-Forma Invoice Draft breakdown */}
              <div className="border border-[#f0eeea] dark:border-[#2f2a24] p-4 rounded-[6px] space-y-2.5 text-[12px]">
                <div className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] pb-2 border-b border-[#f0eeea] dark:border-[#2f2a24]">
                  {t("تفاصيل مسودة الفاتورة الأولية:", "Pro-Forma Invoice Draft Breakdown:")}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#625d5d] dark:text-[#a89f91]">
                    {t("رسوم الاشتراك الأساسية (الباقة الفضية):", "Base Subscription Fee (Silver):")}
                  </span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("8,000.00 ر.س", "8,000.00 SAR")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#625d5d] dark:text-[#a89f91]">
                    {t("ضريبة القيمة المضافة (15%):", "Value Added Tax (15%):")}
                  </span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("1,200.00 ر.س", "1,200.00 SAR")}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#f0eeea] dark:border-[#2f2a24] font-bold text-[14px]">
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الإجمالي المستحق:", "Total Due:")}</span>
                  <span className="text-[#9c6402] dark:text-[#f59e0b]">{t("9,200.00 ر.س", "9,200.00 SAR")}</span>
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
                {t("الموافقة وتفعيل الاشتراك", "Approve & Activate")}
              </button>
              <button
                type="button"
                onClick={handleRejectPending}
                className="w-full bg-transparent hover:bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] py-2.5 rounded-[6px] font-bold text-[13px] transition-colors cursor-pointer"
              >
                {t("رفض الطلب", "Reject Request")}
              </button>
            </div>
          </div>
        </div>
      ) : selectedState === "rejected" ? (
        /* Variant for Rejected (1:7769) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-node-id="1:7769-bottom">
          <div className="lg:col-span-8 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
              {t("تقرير الرفض الإداري والتدقيق القانوني", "Administrative Rejection & Audit Report")}
            </h3>
            <div className="bg-[#fff1f2] dark:bg-[#38141b] border border-[#fecdd3] p-4 rounded-[6px] mb-4">
              <div className="font-bold text-[14px] text-[#9f1239] dark:text-[#fb7185] mb-1">
                {t("سبب الرفض المسجل في النظام:", "Rejection reason recorded in system:")}
              </div>
              <p className="text-[12px] text-[#be123c] dark:text-[#fda4af] leading-relaxed">
                {t(
                  "عدم تطابق اسم المنشأة في ترخيص مزاولة المهنة الصادر من وزارة العدل مع الاسم المسجل بالسجل التجاري المرفق، إضافة إلى انتهاء صلاحية التفويض البنكي قبل اعتماد الطلب.",
                  "Firm name mismatch between MOJ license and attached CR, plus bank authorization expiry prior to approval."
                )}
              </p>
              <div className="mt-3 pt-2 border-t border-[#fecdd3] dark:border-[#5a1b26] text-[11px] text-[#be123c] flex items-center justify-between">
                <span>{t("المشرف المسؤول: د. سلطان بن عبد العزيز العتيبي", "Supervisor: Dr. Sultan Al-Otaibi")}</span>
                <span>{t("تاريخ القرار: 24 أكتوبر 2024", "Decision Date: Oct 24, 2024")}</span>
              </div>
            </div>

            <h4 className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {t("الإجراءات المقترحة لتمكين المكتب:", "Suggested Actions to Enable Office:")}
            </h4>
            <ul className="list-disc list-inside text-[12px] text-[#514537] dark:text-[#d1c9bd] space-y-1.5">
              <li>{t("رفع نسخة حديثة ومطابقة من ترخيص وزارة العدل المحدث.", "Upload a recent, matching copy of updated MOJ license.")}</li>
              <li>{t("تحديث بيانات الممثل النظامي عبر بوابة الدخول الموحد.", "Update legal representative info via SSO portal.")}</li>
              <li>{t("إعادة تقديم الطلب وتفويض وسيلة دفع صالحة.", "Resubmit request and authorize a valid payment method.")}</li>
            </ul>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7] mb-3">
                {t("إجراءات التدقيق", "Audit Actions")}
              </h3>
              <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91] mb-4">
                {t(
                  "يمكن لمسؤول النظام إعادة فتح الطلب للمراجعة الاستثنائية بعد التواصل المباشر مع ممثل المكتب.",
                  "System admin can reopen request for exceptional review after direct contact with firm."
                )}
              </p>
              <div className="space-y-2 text-[12px] p-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px]">
                <div className="flex justify-between">
                  <span className="text-[#625d5d]">{t("حالة البوابة:", "Gateway Status:")}</span>
                  <span className="font-bold text-[#be123c]">{t("مقيدة مؤقتاً", "Temporarily Restricted")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#625d5d]">{t("نوع الطلب:", "Request Type:")}</span>
                  <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{t("اشتراك سنوي جديد", "New Annual Subscription")}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReReview}
              className="w-full mt-6 bg-[#be123c] hover:bg-[#9f1239] text-white py-2.5 rounded-[6px] font-bold text-[13px] shadow-xs transition-colors cursor-pointer"
            >
              {t("إعادة فتح الملف للتدقيق", "Reopen File for Audit")}
            </button>
          </div>
        </div>
      ) : (
        /* Variant for Active (1:5878) and Cancelled (1:7196) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-node-id="1:6122">
          {/* Right Column (8 cols): Invoices */}
          <div
            className="lg:col-span-8 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            data-node-id="1:6123"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#f0eeea] dark:border-[#2f2a24] mb-4">
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("سجل الفواتير والعمليات المالية", "Invoice & Billing History")}
              </h3>
              <span className="text-[12px] text-[#837565]">
                {currentSub.invoices?.length || 0} {t("معاملات مسجلة", "transactions")}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f5f3ef] dark:bg-[#2c2621] text-[#625d5d] dark:text-[#a89f91] font-bold border-b border-[#eae8e4] dark:border-[#38332c]">
                    <th className="p-3 text-start">{t("رقم الفاتورة والمرجع", "Invoice ID & Ref")}</th>
                    <th className="p-3 text-start">{t("تاريخ المعاملة", "Transaction Date")}</th>
                    <th className="p-3 text-start">{t("المبلغ المدفوع", "Paid Amount")}</th>
                    <th className="p-3 text-start">{t("طريقة الدفع", "Payment Method")}</th>
                    <th className="p-3 text-start">{t("حالة العملية", "Status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eeea] dark:divide-[#2f2a24]">
                  {currentSub.invoices?.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#faf9f7] dark:hover:bg-[#25221e] transition-colors"
                    >
                      <td className="p-3 text-start">
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {inv.id}
                        </span>
                        <span className="text-[10px] text-[#625d5d] dark:text-[#a89f91]">
                          {inv.subDescription}
                        </span>
                      </td>
                      <td className="p-3 text-start text-[#625d5d] dark:text-[#a89f91]">
                        {inv.date}
                      </td>
                      <td className="p-3 text-start">
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {inv.amount}
                        </span>
                        {inv.vatNote && (
                          <span className="text-[10px] text-[#625d5d]">
                            {inv.vatNote}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-start">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {inv.paymentMethod}
                        </span>
                        <span className="text-[10px] text-[#625d5d]">
                          {inv.paymentMethodDetail}
                        </span>
                      </td>
                      <td className="p-3 text-start">
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

          {/* Left Column (4 cols): سجل الحركات والتتبع */}
          <div
            className="lg:col-span-4 bg-white dark:bg-[#1e1c1a] p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            data-node-id="1:6224"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#f0eeea] dark:border-[#2f2a24] mb-4">
              <h3 className="font-bold text-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("سجل الحركات والتتبع", "Activity Log & History")}
              </h3>
              <Clock className="w-4 h-4 text-[#9c6402]" />
            </div>

            <div className={cn("space-y-4 relative", !isEn ? "pe-4 border-e-2" : "ps-4 border-s-2", "border-[#eae8e4] dark:border-[#38332c]")}>
              {currentSub.timeline?.map((ev) => (
                <div key={ev.id} className="relative">
                  <div
                    className={cn(
                      "absolute top-1 size-2 rounded-full",
                      !isEn ? "-right-[21px]" : "-left-[21px]",
                      ev.type === "cancellation"
                        ? "bg-[#dc2626]"
                        : ev.type === "renewal"
                        ? "bg-[#059669]"
                        : "bg-[#9c6402]"
                    )}
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