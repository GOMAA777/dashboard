"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Bell,
  Search,
  Trash2,
  Eye,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";

interface NotificationsListViewProps {
  notifications: NotificationItem[];
  onOpenCreate: () => void;
  onViewDetails: (notification: NotificationItem) => void;
  onInitiateDelete: (notification: NotificationItem) => void;
}

export function NotificationsListView({
  notifications,
  onOpenCreate,
  onViewDetails,
  onInitiateDelete,
}: NotificationsListViewProps) {
  const { direction, isEn, t } = useLanguage();

  // Filters & State
  const [activeTab, setActiveTab] = useState<"all" | "active" | "scheduled" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState<"all" | "all_firms" | "specific">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Tab counters based on entire dataset
  const tabCounts = useMemo(() => {
    const all = notifications.length;
    const activeAndReceived = notifications.filter(
      (n) => n.status === "sent" || n.status === "active"
    ).length;
    const scheduled = notifications.filter((n) => n.status === "scheduled").length;
    const drafts = notifications.filter((n) => n.status === "draft").length;

    return { all, activeAndReceived, scheduled, drafts };
  }, [notifications]);

  // Filtered dataset
  const filteredNotifications = useMemo(() => {
    const list = notifications.filter((item) => {
      // Tab filter
      if (activeTab === "active" && item.status !== "sent" && item.status !== "active") {
        return false;
      }
      if (activeTab === "scheduled" && item.status !== "scheduled") {
        return false;
      }
      if (activeTab === "draft" && item.status !== "draft") {
        return false;
      }

      // Audience filter
      if (audienceFilter === "all_firms" && item.audienceType !== "all") {
        return false;
      }
      if (audienceFilter === "specific" && item.audienceType !== "specific") {
        return false;
      }

      // Search filter
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
      {/* 1. حالة الإشعار */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("حالة الإشعار", "Notification Status")}
        </label>
        <DashboardSelect
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="all">{t("كافة الإشعارات", "All Notifications")}</option>
          <option value="active">{t("نشطة ومستلمة", "Active & Received")}</option>
          <option value="scheduled">{t("مجدولة", "Scheduled")}</option>
          <option value="draft">{t("مسودة", "Drafts")}</option>
        </DashboardSelect>
      </div>

      {/* 2. الجمهور المستهدف */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("الجمهور المستهدف", "Target Audience")}
        </label>
        <DashboardSelect
          value={audienceFilter}
          onChange={(e) => {
            setAudienceFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="all">{t("جميع الفئات والجمهور", "All Audiences")}</option>
          <option value="all_firms">{t("كافة المكاتب المسجلة (بث عام)", "Broadcast to All Firms")}</option>
          <option value="specific">{t("مكاتب محددة مخصصة", "Specific Firms Only")}</option>
        </DashboardSelect>
      </div>

      {/* 3. ترتيب الإشعارات */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("ترتيب العرض", "Sort Order")}
        </label>
        <DashboardSelect
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="newest">{t("الأحدث أولاً (تاريخ الإرسال)", "Newest First")}</option>
          <option value="oldest">{t("الأقدم أولاً", "Oldest First")}</option>
        </DashboardSelect>
      </div>
    </div>
  );

  // Pagination calculation
  const totalItems = filteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredNotifications.slice(startIndex, startIndex + pageSize);
  }, [filteredNotifications, validCurrentPage, pageSize]);

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
            <span className="size-1.5 rounded-full bg-[#837565] dark:text-[#a89f91]" />
            <span>{isEn ? "Draft" : "مسودة"}</span>
          </span>
        );
    }
  };

  return (
    <div dir={direction} className="space-y-6">
      {/* Main Identity & Command Banner */}
      <div
        className="bg-white dark:bg-[#1a120d] rounded-[8px] p-5 sm:p-6 border border-[#e6e2dc] dark:border-[#2e231b] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
            {isEn ? "Notifications List" : "قائمة الإشعارات"}
          </h1>
          <p className="text-[14px] text-[#514537] dark:text-[#a89f91] mt-1 max-w-[650px] leading-[22.75px]">
            {isEn
              ? "Central notifications management for law firms, broadcast system updates and track reach metrics"
              : "إدارة الإشعارات المركزية المرسلة إلى مكاتب المحاماة، إنشاء تحديثات المنظومة وتتبع معدلات الوصول"}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="bg-[#9c6402] hover:bg-[#855402] text-white px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer"
        >
          <Bell className="size-4" />
          <span>{isEn ? "Send New Notification" : "إرسال إشعار جديد"}</span>
        </button>
      </div>

      {/* Unified Table Card: Filter Bar + Table + Pagination Footer */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] overflow-hidden w-full shrink-0 font-['Cairo',sans-serif]"
      >
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
            setActiveTab(v as any);
            setCurrentPage(1);
          }}
          primaryFilterMode="pills"
          primaryFilterOptions={[
            { label: `${isEn ? "All" : "الكل"} (${tabCounts.all})`, value: "all" },
            { label: `${isEn ? "Active & Received" : "نشطة ومستلمة"} (${tabCounts.activeAndReceived})`, value: "active" },
            { label: `${isEn ? "Scheduled" : "مجدولة"} (${tabCounts.scheduled})`, value: "scheduled" },
            { label: `${isEn ? "Drafts" : "مسودة"} (${tabCounts.drafts})`, value: "draft" },
          ]}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          drawerTitle={t("تصفية الإشعارات", "Filter Notifications")}
          drawerDescription={t(
            "خيارات تصفية وفلترة متقدمة للوصول الدقيق للإشعارات",
            "Advanced filter options for broadcast notifications"
          )}
          drawerContent={drawerContent}
          className="rounded-b-none border-0 border-b border-[#f0eeea] dark:border-[#38271c]"
        />

        {/* Main Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            {/* Table Header Row */}
            <thead>
              <tr
                className="bg-[#fcfaf7] dark:bg-[#1a120d] h-[52px] text-[#514537] dark:text-[#cdc5bd] font-bold text-[12px] border-b border-[#f0eeea] dark:border-[#38271c]"
              >
                <th className="px-4 py-3 text-start font-bold w-[540px]">
                  {isEn ? "Notification Title" : "عنوان الإشعار"}
                </th>
                <th className="px-2 py-3 text-center font-bold w-[90px]">
                  {isEn ? "Image" : "صورة الإشعار"}
                </th>
                <th className="px-4 py-3 text-start font-bold w-[260px]">
                  {isEn ? "Action Destination Link" : "رابط الإجراء الوارد"}
                </th>
                <th className="px-4 py-3 text-center font-bold w-[110px]">
                  {isEn ? "Actions" : "الإجراءات"}
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
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
                  <tr
                    key={item.id}
                    className="hover:bg-[#faf9f7] dark:hover:bg-[#281c15] transition-colors"
                  >
                    {/* Column 1: Notification Title & Meta */}
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1.5">
                        {/* Status + Schedule / Sent Meta */}
                        <div className="flex flex-wrap items-center gap-2">
                          {renderStatusBadge(item.status, item.statusLabel)}
                          {item.status === "scheduled" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] dark:bg-[#172554] text-[#1d4ed8] dark:text-[#93c5fd] border border-blue-200 dark:border-blue-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-[4px]">
                              <Calendar className="size-3" />
                              <span>{isEn ? "Schedule:" : "جدول الإرسال:"}</span>
                              <span className="font-mono">
                                {item.scheduledFor || item.sentAt}
                              </span>
                            </span>
                          ) : (
                            <span className="text-[#837565] dark:text-[#a89f91] text-[11px] font-medium">
                              {item.sentAt}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[15px] sm:text-[16px] font-semibold leading-[24px]">
                          {item.title}
                        </h3>

                        {/* Audience */}
                        <div className="text-[12px] flex items-center gap-1 text-start">
                          <span className="text-[#514537] dark:text-[#cdc5bd]">
                            {isEn ? "Target Audience:" : "الجمهور المستهدف:"}
                          </span>
                          <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {item.targetAudienceLabel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Notification Image Preview */}
                    <td className="px-2 py-4 align-middle text-center">
                      <div className="flex items-center justify-center">
                        <div className="bg-[#f0eeea] size-[48px] rounded-[4px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#e4e2de]/60 overflow-hidden shrink-0 relative flex items-center justify-center">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="object-cover size-full"
                            />
                          ) : (
                            <ImageIcon className="size-5 text-[#837565]" />
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Action Link Capsule */}
                    <td className="px-4 py-4 align-middle">
                      <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[4px] px-2.5 py-1.5 flex items-center justify-between gap-1.5 border border-[#eae8e4] dark:border-[#38271c] max-w-[250px]">
                        {/* Action buttons (Copy + Open) */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(item.actionUrl, item.id)}
                            className="p-1 text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] rounded transition-colors cursor-pointer"
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
                            className="p-1 text-[#514537] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f59e0b] rounded transition-colors"
                            title={isEn ? "Open link" : "فتح الرابط"}
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        </div>

                        {/* Truncated clean URL */}
                        <span
                          className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-normal dir-ltr text-left truncate flex-1"
                          title={item.actionUrl}
                        >
                          {getCleanUrlText(item.actionUrl)}
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Row Actions (Trash & View) */}
                    <td className="px-4 py-4 align-middle text-center">
                      <div className="flex items-center justify-center">
                        <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[4px] p-1 flex items-center gap-1 border border-[#eae8e4] dark:border-[#38271c]">
                          {/* Trash button */}
                          <button
                            type="button"
                            onClick={() => onInitiateDelete(item)}
                            className="p-1.5 text-[#514537] dark:text-[#a89f91] hover:text-[#ba1a1a] dark:hover:text-[#f87171] hover:bg-[#ffdad6]/50 dark:hover:bg-[rgba(186,26,26,0.2)] rounded-[2px] transition-colors cursor-pointer"
                            title={isEn ? "Delete notification" : "حذف الإشعار"}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                          {/* View details button */}
                          <button
                            type="button"
                            onClick={() => onViewDetails(item)}
                            className="p-1.5 text-[#514537] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f59e0b] hover:bg-white dark:hover:bg-[#1a120d] rounded-[2px] transition-colors cursor-pointer"
                            title={isEn ? "View details" : "معاينة تفاصيل الإشعار"}
                          >
                            <Eye className="size-3.5" />
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

        {/* Pagination Footer */}
        <div className="bg-[#fcfaf7] dark:bg-[#1a120d] p-[16px] border-t border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[12px] text-[#514537] dark:text-[#cdc5bd] font-['Cairo']">
          {/* Right in RTL: Count Summary & Rows per page */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span>{isEn ? "Showing " : "عرض "}</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1}
              </span>
              <span> {isEn ? "to " : "إلى "}</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {Math.min(validCurrentPage * pageSize, totalItems)}
              </span>
              <span> {isEn ? "of " : "من أصل "}</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
              <span> {isEn ? " notifications" : " إشعاراً مسجلاً"}</span>
            </div>

            <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
              <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">
                {isEn ? "Rows per page:" : "صفوف بالصفحة:"}
              </span>
              <PageSizeDropdown
                value={pageSize}
                onChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
                options={[5, 10, 20, 50]}
                dropdownPlacement="top"
              />
            </div>
          </div>

          {/* Left in RTL: Page Controls */}
          <div className="flex items-center gap-[4px]">
            <button
              type="button"
              disabled={validCurrentPage <= 1 || totalItems === 0}
              onClick={() => setCurrentPage(1)}
              title={isEn ? "First page" : "الصفحة الأولى"}
              className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
            >
              <ChevronsRight className="size-[14px] rtl:rotate-0 rotate-180" />
            </button>

            <button
              type="button"
              disabled={validCurrentPage <= 1 || totalItems === 0}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              title={isEn ? "Previous page" : "الصفحة السابقة"}
              className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
            >
              <ChevronRight className="size-[13px] rtl:rotate-0 rotate-180" />
              <span>{isEn ? "Previous" : "السابق"}</span>
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              if (
                totalPages > 5 &&
                pageNumber > 3 &&
                pageNumber < totalPages - 1 &&
                Math.abs(pageNumber - validCurrentPage) > 1
              ) {
                if (pageNumber === 4) {
                  return (
                    <span
                      key={pageNumber}
                      className="px-1 text-[#837565] dark:text-[#8e8680] text-[12px]"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`size-[30px] rounded-[4px] text-[12px] font-bold transition-colors cursor-pointer flex items-center justify-center ${
                    validCurrentPage === pageNumber
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-xs"
                      : "border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              disabled={validCurrentPage >= totalPages || totalItems === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              title={isEn ? "Next page" : "الصفحة التالية"}
              className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
            >
              <span>{isEn ? "Next" : "التالي"}</span>
              <ChevronLeft className="size-[13px] rtl:rotate-0 rotate-180" />
            </button>

            <button
              type="button"
              disabled={validCurrentPage >= totalPages || totalItems === 0}
              onClick={() => setCurrentPage(totalPages)}
              title={isEn ? "Last page" : "الصفحة الأخيرة"}
              className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
            >
              <ChevronsLeft className="size-[14px] rtl:rotate-0 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
