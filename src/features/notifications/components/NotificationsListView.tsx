"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Bell,
  Trash2,
  Eye,
  Copy,
  ExternalLink,
  CheckCheck,
  ImageIcon,
  Clock,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  NotificationItem,
  NotificationStatus,
} from "../types/notifications.types";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { UnifiedPagination } from "@/components/shared/UnifiedPagination";
import { DataTableCard } from "@/components/shared/DataTableCard";
import { ManagementListLayout } from "@/components/shared/ManagementListLayout";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import {
  TABLE_HEAD_ROW,
  TABLE_HEAD_CELL,
  TABLE_BODY,
  TABLE_ROW,
} from "@/components/shared/list-layout.styles";
import { useLanguage } from "@/lib/i18n";

interface NotificationsListViewProps {
  notifications: NotificationItem[];
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  activeTab?: "all" | "active" | "scheduled" | "draft";
  onTabChange?: (tab: "all" | "active" | "scheduled" | "draft") => void;
  tabCounts?: {
    all: number;
    activeAndReceived: number;
    scheduled: number;
    drafts: number;
  };
  onOpenCreate: () => void;
  onViewDetails: (notification: NotificationItem) => void;
  onInitiateDelete: (notification: NotificationItem) => void;
}

export function NotificationsListView({
  notifications,
  totalItems: propTotalItems,
  currentPage: propCurrentPage,
  pageSize: propPageSize,
  onPageChange: propOnPageChange,
  onPageSizeChange: propOnPageSizeChange,
  searchQuery: propSearchQuery,
  onSearchChange: propOnSearchChange,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
  tabCounts: propTabCounts,
  onOpenCreate,
  onViewDetails,
  onInitiateDelete,
}: NotificationsListViewProps) {
  const { direction, isEn, t } = useLanguage();

  const [internalActiveTab, setInternalActiveTab] = useState<
    "all" | "active" | "scheduled" | "draft"
  >("all");
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState<"all" | "all_firms" | "specific">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [internalPageSize, setInternalPageSize] = useState<number>(5);
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTab = propActiveTab ?? internalActiveTab;
  const setActiveTab = (next: "all" | "active" | "scheduled" | "draft") => {
    setInternalActiveTab(next);
    propOnTabChange?.(next);
  };

  const searchQuery = propSearchQuery ?? internalSearchQuery;
  const setSearchQuery = (q: string) => {
    setInternalSearchQuery(q);
    propOnSearchChange?.(q);
  };

  const pageSize = propPageSize ?? internalPageSize;
  const setPageSize = (s: number) => {
    setInternalPageSize(s);
    propOnPageSizeChange?.(s);
  };

  const currentPage = propCurrentPage ?? internalCurrentPage;
  const setCurrentPage = (p: number) => {
    setInternalCurrentPage(p);
    propOnPageChange?.(p);
  };

  const localTabCounts = useMemo(() => {
    const all = notifications.length;
    const activeAndReceived = notifications.filter(
      (n) => n.status === "sent" || n.status === "active"
    ).length;
    const scheduled = notifications.filter((n) => n.status === "scheduled").length;
    const drafts = notifications.filter((n) => n.status === "draft").length;

    return { all, activeAndReceived, scheduled, drafts };
  }, [notifications]);

  const tabCounts = propTabCounts ?? localTabCounts;

  const filteredNotifications = useMemo(() => {
    const list = notifications.filter((item) => {
      if (activeTab === "active" && item.status !== "sent" && item.status !== "active") {
        return false;
      }
      if (activeTab === "scheduled" && item.status !== "scheduled") {
        return false;
      }
      if (activeTab === "draft" && item.status !== "draft") {
        return false;
      }

      if (audienceFilter === "all_firms" && item.audienceType !== "all") {
        return false;
      }
      if (audienceFilter === "specific" && item.audienceType !== "specific") {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesUrl = item.actionUrl.toLowerCase().includes(q);
        const matchesAudience = item.targetAudienceLabel.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        if (!matchesTitle && !matchesUrl && !matchesAudience && !matchesCode) {
          return false;
        }
      }

      return true;
    });

    if (sortOrder === "oldest") {
      return [...list].reverse();
    }
    return list;
  }, [notifications, activeTab, audienceFilter, sortOrder, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setAudienceFilter("all");
    setSortOrder("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    activeTab !== "all" ||
    audienceFilter !== "all" ||
    sortOrder !== "newest" ||
    Boolean(searchQuery.trim());

  const drawerContent = (
    <div className="space-y-6 text-start font-['Cairo',sans-serif]">
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("حالة الإشعار", "Notification Status")}
        </label>
        <DashboardSelect
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value as "all" | "active" | "scheduled" | "draft");
            setCurrentPage(1);
          }}
        >
          <option value="all">{t("كافة الإشعارات", "All Notifications")}</option>
          <option value="active">{t("نشطة ومستلمة", "Active & Received")}</option>
          <option value="scheduled">{t("مجدولة", "Scheduled")}</option>
          <option value="draft">{t("مسودة", "Drafts")}</option>
        </DashboardSelect>
      </div>

      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("الجمهور المستهدف", "Target Audience")}
        </label>
        <DashboardSelect
          value={audienceFilter}
          onChange={(e) => {
            setAudienceFilter(e.target.value as "all" | "all_firms" | "specific");
            setCurrentPage(1);
          }}
        >
          <option value="all">{t("جميع الفئات والجمهور", "All Audiences")}</option>
          <option value="all_firms">
            {t("كافة المكاتب المسجلة (بث عام)", "Broadcast to All Firms")}
          </option>
          <option value="specific">
            {t("مكاتب محددة مخصصة", "Specific Firms Only")}
          </option>
        </DashboardSelect>
      </div>

      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("ترتيب العرض", "Sort Order")}
        </label>
        <DashboardSelect
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as "newest" | "oldest");
            setCurrentPage(1);
          }}
        >
          <option value="newest">
            {t("الأحدث أولاً (تاريخ الإرسال)", "Newest First")}
          </option>
          <option value="oldest">{t("الأقدم أولاً", "Oldest First")}</option>
        </DashboardSelect>
      </div>
    </div>
  );

  const isServerPaginated = propTotalItems !== undefined;
  const totalItems = isServerPaginated ? propTotalItems : filteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const pageIndex = Math.max(0, validCurrentPage - 1);

  const paginatedNotifications = useMemo(() => {
    if (isServerPaginated) {
      return notifications;
    }
    const startIndex = pageIndex * pageSize;
    return filteredNotifications.slice(startIndex, startIndex + pageSize);
  }, [
    isServerPaginated,
    notifications,
    filteredNotifications,
    pageIndex,
    pageSize,
  ]);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success(
      isEn ? "Action link copied successfully" : "تم نسخ رابط الإجراء بنجاح"
    );
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCleanUrlText = (url: string) => {
    return url.replace(/^https?:\/\//, "");
  };

  const formatNotificationDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "—") return "—";
    if (
      dateStr.includes("اليوم") ||
      dateStr.includes("الآن") ||
      dateStr.includes("Today") ||
      dateStr.includes("Now")
    ) {
      return dateStr;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    try {
      return new Intl.DateTimeFormat(isEn ? "en-US" : "ar-SA-u-nu-latn", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: NotificationStatus, label: string) => {
    switch (status) {
      case "sent":
        return (
          <span className="bg-[#ecfdf5] dark:bg-[#132c21] text-[#065f46] dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1.5 shrink-0 shadow-2xs">
            <span className="size-1.5 rounded-full bg-[#059669] dark:bg-[#10b981]" />
            <span>{isEn ? "Sent" : label}</span>
          </span>
        );
      case "active":
        return (
          <span className="bg-[#fffbeb] dark:bg-[#2d1f14] text-[#b45309] dark:text-[#f59e0b] border border-amber-200 dark:border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1.5 shrink-0 shadow-2xs">
            <span className="size-1.5 rounded-full bg-[#d97706] dark:bg-[#f59e0b] animate-pulse" />
            <span>{isEn ? "Currently Active" : "نشط حالياً"}</span>
          </span>
        );
      case "scheduled":
        return (
          <span className="bg-[#eff6ff] dark:bg-[#172554] text-[#1d4ed8] dark:text-[#93c5fd] border border-blue-200 dark:border-blue-500/30 text-[11px] font-bold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1.5 shrink-0 shadow-2xs">
            <Clock className="size-3 text-[#1d4ed8] dark:text-[#93c5fd]" />
            <span>{isEn ? "Scheduled for broadcast" : "مجدول للإرسال"}</span>
          </span>
        );
      case "draft":
        return (
          <span className="bg-[#f5f3ef] dark:bg-[#281c15] text-[#78716c] dark:text-[#d6cfc7] border border-[#e7e5e4] dark:border-[#44372e] text-[11px] font-medium px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1.5 shrink-0">
            <span className="size-1.5 rounded-full bg-[#837565]" />
            <span>{isEn ? "Draft" : "مسودة"}</span>
          </span>
        );
    }
  };

  return (
    <div dir={direction}>
      <ManagementListLayout
        header={
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full shrink-0">
            <div className="flex flex-col items-start text-start">
              <h1 className="text-[26px] sm:text-[28px] leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Notifications List" : "قائمة الإشعارات"}
              </h1>
              <p className="text-[#514537] dark:text-[#8e8680] text-[13px] sm:text-[14px] leading-[20px] font-normal mt-[4px] max-w-[650px]">
                {isEn
                  ? "Central notifications management for law firms, broadcast system updates and track reach metrics"
                  : "إدارة الإشعارات المركزية المرسلة إلى مكاتب المحاماة، إنشاء تحديثات المنظومة وتتبع معدلات الوصول"}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenCreate}
              className="bg-[#9c6402] hover:bg-[#855402] text-white px-[20px] py-[10px] rounded-[4px] text-[14px] font-semibold leading-[20px] flex items-center justify-center gap-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Bell className="size-[16px] shrink-0" />
              <span>{isEn ? "Send New Notification" : "إرسال إشعار جديد"}</span>
            </button>
          </div>
        }
        filter={
          <UnifiedFilterBar
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            searchPlaceholder={
              isEn
                ? "Search by notification title or action URL..."
                : "ابحث بعنوان الإشعار أو نص الرابط..."
            }
            primaryFilterValue={activeTab}
            onPrimaryFilterChange={(v) => {
              setActiveTab(v as "all" | "active" | "scheduled" | "draft");
              setCurrentPage(1);
            }}
            primaryFilterMode="pills"
            primaryFilterOptions={[
              {
                label: `${isEn ? "All" : "الكل"} (${tabCounts.all})`,
                value: "all",
              },
              {
                label: `${isEn ? "Active & Received" : "نشطة ومستلمة"} (${tabCounts.activeAndReceived})`,
                value: "active",
              },
              {
                label: `${isEn ? "Scheduled" : "مجدولة"} (${tabCounts.scheduled})`,
                value: "scheduled",
              },
              {
                label: `${isEn ? "Drafts" : "مسودة"} (${tabCounts.drafts})`,
                value: "draft",
              },
            ]}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilters}
            drawerTitle={t("تصفية الإشعارات", "Filter Notifications")}
            drawerDescription={t(
              "خيارات تصفية وفلترة متقدمة للوصول الدقيق للإشعارات",
              "Advanced filter options for broadcast notifications"
            )}
            drawerContent={drawerContent}
          />
        }
        table={
          <DataTableCard>
            <div className="overflow-x-auto overflow-y-hidden scrollbar-none w-full">
              <table className="w-full text-start border-collapse min-w-[900px]">
                <thead>
                  <tr className={TABLE_HEAD_ROW}>
                    <th className={TABLE_HEAD_CELL}>
                      {isEn ? "Notification Title" : "عنوان الإشعار"}
                    </th>
                    <th className={`${TABLE_HEAD_CELL} text-center w-[100px]`}>
                      {isEn ? "Image" : "صورة الإشعار"}
                    </th>
                    <th className={`${TABLE_HEAD_CELL} w-[260px]`}>
                      {isEn ? "Action Destination Link" : "رابط الإجراء الوارد"}
                    </th>
                    <th className={`${TABLE_HEAD_CELL} text-center w-[110px]`}>
                      {isEn ? "Actions" : "الإجراءات"}
                    </th>
                  </tr>
                </thead>

                <tbody className={TABLE_BODY}>
                  {paginatedNotifications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-[#837565] dark:text-[#a89f91] text-[14px]"
                      >
                        {isEn
                          ? "No notifications match the search criteria"
                          : "لا توجد إشعارات مطابقة لمعايير البحث المحددة"}
                      </td>
                    </tr>
                  ) : (
                    paginatedNotifications.map((item) => (
                      <tr key={item.id} className={TABLE_ROW}>
                        <td className="px-5 py-4 align-middle">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              {renderStatusBadge(item.status, item.statusLabel)}
                              {item.status === "scheduled" ? (
                                <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] dark:bg-[#172554] text-[#1d4ed8] dark:text-[#93c5fd] border border-blue-200 dark:border-blue-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-[4px]">
                                  <Calendar className="size-3" />
                                  <span>{isEn ? "Schedule:" : "جدول الإرسال:"}</span>
                                  <span className="font-mono">
                                    {formatNotificationDate(
                                      item.scheduledFor || item.sentAt
                                    )}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-[#837565] dark:text-[#a89f91] text-[11px] font-medium inline-flex items-center gap-1.5">
                                  <Calendar className="size-3.5 opacity-70" />
                                  <span>{formatNotificationDate(item.sentAt)}</span>
                                </span>
                              )}
                            </div>

                            <h3 className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[15px] font-bold leading-[22px]">
                              {item.title}
                            </h3>

                            <div className="text-[12px] flex items-center gap-1.5 text-start">
                              <span className="text-[#514537] dark:text-[#cdc5bd]">
                                {isEn ? "Target Audience:" : "الجمهور المستهدف:"}
                              </span>
                              <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] bg-[#f5f3ef] dark:bg-[#281c15] px-2 py-0.5 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[11px]">
                                {item.targetAudienceLabel}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-4 align-middle text-center">
                          <div className="flex items-center justify-center">
                            <div className="bg-[#f5f3ef] dark:bg-[#1a120d] size-[48px] rounded-[6px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#e4e2de] dark:border-[#38271c] overflow-hidden shrink-0 relative flex items-center justify-center">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.title}
                                  width={48}
                                  height={48}
                                  className="object-cover size-full"
                                />
                              ) : (
                                <ImageIcon className="size-5 text-[#837565] dark:text-[#a89f91]" />
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          {item.actionUrl ? (
                            <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] px-2.5 py-1.5 flex items-center justify-between gap-2 border border-[#eae8e4] dark:border-[#38271c] max-w-[260px]">
                              <span
                                dir="ltr"
                                className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-mono truncate flex-1 text-left"
                                title={item.actionUrl}
                              >
                                {getCleanUrlText(item.actionUrl)}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleCopyLink(item.actionUrl, item.id)}
                                  className="p-1 text-[#514537] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#e29d38] hover:bg-white dark:hover:bg-[#1a120d] rounded transition-colors cursor-pointer"
                                  title={isEn ? "Copy link" : "نسخ الرابط"}
                                >
                                  {copiedId === item.id ? (
                                    <CheckCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Copy className="size-3.5" />
                                  )}
                                </button>
                                <a
                                  href={item.actionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-[#514537] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#e29d38] hover:bg-white dark:hover:bg-[#1a120d] rounded transition-colors"
                                  title={isEn ? "Open link" : "فتح الرابط"}
                                >
                                  <ExternalLink className="size-3.5" />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[#837565] dark:text-[#a89f91] text-[13px]">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 align-middle text-center">
                          <div className="flex items-center justify-center">
                            <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] p-1 flex items-center gap-1 border border-[#eae8e4] dark:border-[#38271c]">
                              <button
                                type="button"
                                onClick={() => onInitiateDelete(item)}
                                className="p-1.5 text-[#514537] dark:text-[#a89f91] hover:text-[#ba1a1a] dark:hover:text-[#f87171] hover:bg-[#ffdad6]/50 dark:hover:bg-[rgba(186,26,26,0.2)] rounded-[4px] transition-colors cursor-pointer"
                                title={isEn ? "Delete notification" : "حذف الإشعار"}
                              >
                                <Trash2 className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onViewDetails(item)}
                                className="p-1.5 text-[#514537] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f59e0b] hover:bg-white dark:hover:bg-[#1a120d] rounded-[4px] transition-colors cursor-pointer"
                                title={
                                  isEn ? "View details" : "معاينة تفاصيل الإشعار"
                                }
                              >
                                <Eye className="size-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <UnifiedPagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={(idx) => setCurrentPage(idx + 1)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              itemLabel={t("إشعاراً", "notifications")}
            />
          </DataTableCard>
        }
      />
    </div>
  );
}
