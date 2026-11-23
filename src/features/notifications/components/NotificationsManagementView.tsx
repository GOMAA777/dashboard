"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { NotificationsPageSkeleton } from "./NotificationsPageSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAnnouncementsQuery,
  useAnnouncementsStatsQuery,
  invalidateNotificationsQueries,
} from "../hooks/useNotificationsQuery";
import { NotificationItem } from "../types/notifications.types";
import { NotificationsListView } from "./NotificationsListView";
import { SendNotificationView } from "./SendNotificationView";
import { ConfirmSendModal } from "./ConfirmSendModal";
import { SendSuccessModal } from "./SendSuccessModal";
import { SendFailureModal } from "./SendFailureModal";
import { DeleteNotificationModal } from "./DeleteNotificationModal";
import { NotificationDetailsModal } from "./NotificationDetailsModal";
import { SendNotificationFormValues } from "../schemas/notifications.schemas";
import { useLanguage } from "@/lib/i18n";
import {
  fetchAnnouncements,
  fetchAnnouncementById,
  fetchAnnouncementsStats,
  createAnnouncement,
  deleteAnnouncement,
} from "@/lib/api/announcements";
import type { AnnouncementsStats, CreateAnnouncementPayload } from "@/lib/api/types";
import { mapNotificationsResponse, mapNotificationFromApi } from "@/lib/api/mappers";
import { unwrapData } from "@/lib/api/helpers";
import { ApiError } from "@/lib/api/http";
import { useDraftsStore, saveUnifiedDraft } from "@/stores/use-drafts-store";

export function NotificationsManagementView() {
  const { direction, isEn, t } = useLanguage();

  // Navigation & View URL State with nuqs
  const [view, setView] = useQueryState("view", { defaultValue: "list" });
  const [draftIdQuery] = useQueryState("draftId");

  // Notifications State & Server-side Query State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [activeTab, setActiveTab] = useState<"all" | "active" | "scheduled" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [tabCounts, setTabCounts] = useState<AnnouncementsStats>({
    all: 0,
    activeAndReceived: 0,
    scheduled: 0,
    drafts: 0,
  });

  const queryClient = useQueryClient();
  let statusParam: string | undefined = undefined;
  if (activeTab === "active") statusParam = "sent";
  else if (activeTab === "scheduled") statusParam = "scheduled";
  else if (activeTab === "draft") statusParam = "draft";

  const announcementsQueryParams = React.useMemo(
    () => ({
      page: currentPage,
      per_page: pageSize,
      search: searchQuery.trim() || undefined,
      status: statusParam,
    }),
    [currentPage, pageSize, searchQuery, statusParam]
  );

  const announcementsQuery = useAnnouncementsQuery(announcementsQueryParams);
  const announcementsStatsQuery = useAnnouncementsStatsQuery();

  useEffect(() => {
    if (announcementsQuery.data) {
      const mapped = mapNotificationsResponse(announcementsQuery.data);
      setNotifications(mapped);
      const serverTotal =
        (announcementsQuery.data as { data?: { total?: number } })?.data?.total ?? mapped.length;
      setTotalItems(serverTotal);
    }
  }, [announcementsQuery.data]);

  useEffect(() => {
    if (announcementsStatsQuery.data) {
      setTabCounts(announcementsStatsQuery.data);
    }
  }, [announcementsStatsQuery.data]);

  const effectiveNotifications = useMemo(() => {
    if (notifications.length > 0) return notifications;
    if (announcementsQuery.data) {
      return mapNotificationsResponse(announcementsQuery.data);
    }
    return [];
  }, [notifications, announcementsQuery.data]);

  const isLoading = announcementsQuery.isLoading && effectiveNotifications.length === 0;
  const listError = announcementsQuery.error instanceof Error ? announcementsQuery.error.message : null;

  const loadNotificationsData = useCallback(async () => {
    await Promise.all([
      announcementsQuery.refetch(),
      announcementsStatsQuery.refetch(),
    ]);
  }, [announcementsQuery, announcementsStatsQuery]);

  // Modals & Active Items State
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(null);
  const [viewingDetails, setViewingDetails] = useState<NotificationItem | null>(null);
  const [editingDraft, setEditingDraft] = useState<NotificationItem | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string[] | string> | null>(null);

  // Restore draft if draftId is in query
  useEffect(() => {
    if (draftIdQuery) {
      useDraftsStore.getState().init();
      const found = useDraftsStore.getState().getDraft(draftIdQuery);
      if (found && found.data) {
        const d = found.data as Record<string, unknown>;
        setEditingDraft({
          id: found.id,
          code: `NTF-DRAFT`,
          title: String(d.title || found.title || ""),
          description: String(d.description || found.summary || ""),
          status: "draft",
          statusLabel: isEn ? "Draft" : "مسودة",
          sentAt: isEn ? "Saved Draft" : "مسودة محفوظة",
          audienceType: (d.audienceType as "all" | "specific") || "all",
          targetAudienceLabel: isEn ? "Draft Target" : "المستهدف",
          targetCount: 842,
          actionUrl: String(d.actionUrl || ""),
          imageUrl: d.imageUrl as string | undefined,
          imageFileName: d.imageFileName as string | undefined,
          imageFileSize: d.imageFileSize as string | undefined,
          imageDimensions: d.imageDimensions as string | undefined,
          categoryBadge: d.categoryBadge as string | undefined,
          actionButtonText: d.actionButtonText as string | undefined,
        });
        setView("new");
      }
    }
  }, [draftIdQuery, isEn, setView]);

  // Send Flow State
  const [pendingFormData, setPendingFormData] =
    useState<SendNotificationFormValues | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isFailureOpen, setIsFailureOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastDispatchedInfo, setLastDispatchedInfo] = useState<{
    title: string;
    actionUrl: string;
    verificationCode?: string;
    targetCount?: number;
    formattedTimestamp?: string;
  }>({
    title: "",
    actionUrl: "",
  });

  // Open Create View
  const handleOpenCreate = () => {
    setEditingDraft(null);
    setServerErrors(null);
    setView("new");
  };

  // Back to List View
  const handleBackToList = () => {
    setView("list");
    setEditingDraft(null);
    setServerErrors(null);
  };

  // Step 1 of Sending: User clicks "ارسال الاشعار" on form -> open confirmation modal
  const handleStageSend = (values: SendNotificationFormValues) => {
    setPendingFormData(values);
    setIsConfirmOpen(true);
  };

  // Save as Draft
  const handleSaveDraft = async (values: SendNotificationFormValues) => {
    setIsSending(true);
    setServerErrors(null);

    try {
      const audience = values.audienceType === "specific" ? "selected_firms" : "all";
      const companyIds =
        values.audienceType === "specific" && values.specificFirmId
          ? [Number(values.specificFirmId)]
          : undefined;

      let payload: CreateAnnouncementPayload | FormData;
      if (values.imageFile instanceof File) {
        const formData = new FormData();
        formData.append("title", values.title || (isEn ? "Draft Notification" : "مسودة إشعار جديد"));
        formData.append("content", values.description || (isEn ? "Draft Content" : "محتوى مسودة الإشعار"));
        formData.append("target_audience", audience);
        if (companyIds && companyIds.length > 0) {
          companyIds.forEach((id) => formData.append("target_company_ids[]", String(id)));
        }
        if (values.actionUrl) formData.append("action_url", values.actionUrl);
        if (values.actionButtonText) formData.append("action_label", values.actionButtonText);
        formData.append("status", "draft");
        formData.append("image", values.imageFile);
        payload = formData;
      } else {
        payload = {
          title: values.title || (isEn ? "Draft Notification" : "مسودة إشعار جديد"),
          content: values.description || (isEn ? "Draft Content" : "محتوى مسودة الإشعار"),
          target_audience: audience,
          target_company_ids: companyIds,
          action_url: values.actionUrl || "https://aljudy.sa",
          action_label: values.actionButtonText || (isEn ? "Action Link" : "طريقة التفعيل"),
          status: "draft",
        };
      }

      const res = await createAnnouncement(payload);
      const newId = String(res?.data?.id || `notif-draft-${Date.now()}`);

      // Save to unified central drafts store
      saveUnifiedDraft({
        id: newId,
        type: "notifications",
        typeLabelAr: "إشعار وتنبيه",
        typeLabelEn: "Notification",
        title: values.title || (isEn ? "Draft Notification" : "مسودة إشعار جديد"),
        summary: values.description || (isEn ? "Target: All Law Firms" : "المستهدف: جميع مكاتب المحاماة"),
        targetUrl: `/notifications?view=new&draftId=${newId}`,
        badge: isEn ? "Draft" : "مسودة",
        data: values as Record<string, unknown>,
      });

      void invalidateNotificationsQueries(queryClient);
      await loadNotificationsData();

      toast.success(
        isEn
          ? "Notification saved to Drafts successfully"
          : "تم حفظ الإشعار كمسودة بنجاح وإضافته إلى قسم المسودات"
      );
      setView("list");
    } catch (err: unknown) {
      let errorMsg = isEn ? "Failed to save draft" : "تعذر حفظ المسودة";
      if (err instanceof ApiError) {
        if (err.body && typeof err.body === "object") {
          const body = err.body as { errors?: Record<string, string[]>; message?: string };
          if (body.errors) {
            setServerErrors(body.errors);
          }
          if (body.message) {
            errorMsg = body.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }
      }
      toast.error(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Step 2 of Sending: User clicks confirm in confirmation modal
  const handleExecuteSend = async () => {
    if (!pendingFormData) return;

    setIsSending(true);
    setServerErrors(null);

    try {
      const audience =
        pendingFormData.audienceType === "specific" ? "selected_firms" : "all";
      const companyIds =
        pendingFormData.audienceType === "specific" && pendingFormData.specificFirmId
          ? [Number(pendingFormData.specificFirmId)]
          : undefined;

      let payload: CreateAnnouncementPayload | FormData;
      if (pendingFormData.imageFile instanceof File) {
        const formData = new FormData();
        formData.append("title", pendingFormData.title);
        formData.append("content", pendingFormData.description);
        formData.append("target_audience", audience);
        if (companyIds && companyIds.length > 0) {
          companyIds.forEach((id) => formData.append("target_company_ids[]", String(id)));
        }
        if (pendingFormData.actionUrl) {
          formData.append("action_url", pendingFormData.actionUrl);
        }
        if (pendingFormData.actionButtonText) {
          formData.append("action_label", pendingFormData.actionButtonText);
        }
        formData.append("status", "sent");
        formData.append("image", pendingFormData.imageFile);
        payload = formData;
      } else {
        payload = {
          title: pendingFormData.title,
          content: pendingFormData.description,
          target_audience: audience,
          target_company_ids: companyIds,
          action_url: pendingFormData.actionUrl,
          action_label: pendingFormData.actionButtonText || (isEn ? "Action Link" : "طريقة التفعيل"),
          status: "sent",
        };
      }

      const res = await createAnnouncement(payload);

      const data = res?.data;
      const notificationId = data?.id ? `NTF-${data.id}` : `NTF-${Date.now()}`;
      const verificationCode = `${notificationId}-OK`;
      const dispatchedCount = pendingFormData.audienceType === "all" ? 842 : 1;

      void invalidateNotificationsQueries(queryClient);
      await loadNotificationsData();

      setLastDispatchedInfo({
        title: pendingFormData.title,
        actionUrl: pendingFormData.actionUrl,
        verificationCode,
        targetCount: dispatchedCount,
        formattedTimestamp: new Intl.DateTimeFormat(isEn ? "en-US" : "ar-SA-u-nu-latn", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(data?.sent_at || data?.created_at || Date.now())),
      });

      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
      toast.success(
        isEn
          ? "Notification dispatched and broadcast successfully"
          : "تم إرسال الإشعار وبثه للمكاتب بنجاح"
      );
    } catch (err: unknown) {
      setIsConfirmOpen(false);
      setIsFailureOpen(true);

      let errorMsg = isEn ? "Failed to send notification" : "تعذر إرسال الإشعار";
      if (err instanceof ApiError) {
        if (err.body && typeof err.body === "object") {
          const body = err.body as { errors?: Record<string, string[]>; message?: string };
          if (body.errors) {
            setServerErrors(body.errors);
          }
          if (body.message) {
            errorMsg = body.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }
      }
      toast.error(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Retry Send from Failure Modal
  const handleRetrySend = async () => {
    setIsFailureOpen(false);
    setIsConfirmOpen(true);
    await handleExecuteSend();
  };

  // Execute Final Deletion
  const handleExecuteDelete = async (notificationId: string) => {
    setIsDeleting(true);

    try {
      await deleteAnnouncement(notificationId);
      void invalidateNotificationsQueries(queryClient);
      await loadNotificationsData();
      setDeleteTarget(null);
      toast.success(
        isEn
          ? "Notification permanently deleted from dashboard."
          : "تم حذف الإشعار نهائياً من شاشة الإشعارات."
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isEn
          ? "Could not complete deletion."
          : "تعذر إتمام عملية الحذف.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const breadcrumbs =
    view === "new"
      ? [
          {
            label: isEn ? "Notification Center" : "مركز الإشعارات",
            href: "/notifications",
          },
          { label: isEn ? "Send New Notification" : "إرسال إشعار جديد" },
        ]
      : undefined;

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 font-sans antialiased"
    >
      {/* Dashboard Sidebar with Notifications highlighted */}
      <DashboardSidebar activeNav="clients" activeSubNav="notifications" />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {view === "list" ? (
              isLoading && effectiveNotifications.length === 0 ? (
                <NotificationsPageSkeleton />
              ) : listError ? (
                <div className="rounded-[8px] border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-[#2c1313] p-6 text-center space-y-3">
                  <p className="text-[14px] font-semibold text-red-700 dark:text-red-300">
                    {listError}
                  </p>
                  <button
                    type="button"
                    onClick={() => void loadNotificationsData()}
                    className="px-4 py-2 rounded-[6px] bg-[#9c6402] text-white text-[13px] font-bold cursor-pointer"
                  >
                    {t("إعادة المحاولة", "Retry")}
                  </button>
                </div>
              ) : (
                <NotificationsListView
                  notifications={notifications}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={(q) => {
                    setSearchQuery(q);
                    setCurrentPage(1);
                  }}
                  activeTab={activeTab}
                  onTabChange={(t) => {
                    setActiveTab(t);
                    setCurrentPage(1);
                  }}
                  tabCounts={tabCounts}
                  onOpenCreate={handleOpenCreate}
                  onViewDetails={async (item) => {
                    setViewingDetails(item);
                    try {
                      const payload = await fetchAnnouncementById(item.id);
                      const raw = (unwrapData<Record<string, unknown>>(payload) ||
                        payload) as Record<string, unknown>;
                      if (raw?.id || raw?.title) {
                        setViewingDetails(mapNotificationFromApi(raw));
                      }
                    } catch {
                      // Keep list item
                    }
                  }}
                  onInitiateDelete={(item) => setDeleteTarget(item)}
                />
              )
            ) : (
              <SendNotificationView
                onBack={handleBackToList}
                onSubmitSend={handleStageSend}
                onSaveDraft={handleSaveDraft}
                initialData={editingDraft}
                serverErrors={serverErrors}
                isSubmitting={isSending}
              />
            )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* MODAL 1: Confirm Send */}
      {pendingFormData && (
        <ConfirmSendModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleExecuteSend}
          formData={pendingFormData}
          isSending={isSending}
        />
      )}

      {/* MODAL 2: Send Success */}
      <SendSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onBackToList={() => {
          setIsSuccessOpen(false);
          setView("list");
        }}
        onSendAnother={() => {
          setIsSuccessOpen(false);
          setEditingDraft(null);
          setView("new");
        }}
        notificationData={lastDispatchedInfo}
      />

      {/* MODAL 3: Send Failure */}
      {pendingFormData && (
        <SendFailureModal
          isOpen={isFailureOpen}
          onClose={() => setIsFailureOpen(false)}
          onRetry={handleRetrySend}
          onBackToEdit={() => {
            setIsFailureOpen(false);
            setView("new");
          }}
          formData={pendingFormData}
          isRetrying={isSending}
        />
      )}

      {/* MODAL 4: Delete Notification Confirmation */}
      <DeleteNotificationModal
        notification={deleteTarget}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirmDelete={handleExecuteDelete}
        isDeleting={isDeleting}
      />

      {/* MODAL 5: Notification Details Inspector */}
      <NotificationDetailsModal
        notification={viewingDetails}
        isOpen={Boolean(viewingDetails)}
        onClose={() => setViewingDetails(null)}
        onEdit={(draftItem) => {
          setEditingDraft(draftItem);
          setView("new");
        }}
      />
    </div>
  );
}
