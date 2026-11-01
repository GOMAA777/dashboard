"use client";

import React, { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { NotificationItem } from "../types/notifications.types";
import { initialNotificationsList } from "../data/initialNotifications";
import { NotificationsListView } from "./NotificationsListView";
import { SendNotificationView } from "./SendNotificationView";
import { ConfirmSendModal } from "./ConfirmSendModal";
import { SendSuccessModal } from "./SendSuccessModal";
import { SendFailureModal } from "./SendFailureModal";
import { DeleteNotificationModal } from "./DeleteNotificationModal";
import { NotificationDetailsModal } from "./NotificationDetailsModal";
import { SendNotificationFormValues } from "../schemas/notifications.schemas";
import {
  sendNotificationAction,
  deleteNotificationAction,
} from "../actions/notifications.actions";
import { useLanguage } from "@/lib/i18n";
import {
  fetchAnnouncements,
  fetchAnnouncementById,
  createAnnouncement,
  deleteAnnouncement,
} from "@/lib/api/announcements";
import { mapNotificationsResponse, mapNotificationFromApi } from "@/lib/api/mappers";
import { unwrapData } from "@/lib/api/helpers";

export function NotificationsManagementView() {
  const { direction, isEn } = useLanguage();

  // Navigation & View URL State with nuqs
  const [view, setView] = useQueryState("view", { defaultValue: "list" });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotificationsList
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchAnnouncements()
      .then((payload) => {
        if (cancelled) return;
        const mapped = mapNotificationsResponse(payload);
        if (mapped.length > 0) setNotifications(mapped);
      })
      .catch(() => {
        // Keep mock notifications if API unavailable.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Modals & Active Items State
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(null);
  const [viewingDetails, setViewingDetails] = useState<NotificationItem | null>(null);
  const [editingDraft, setEditingDraft] = useState<NotificationItem | null>(null);

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
    setView("new");
  };

  // Back to List View
  const handleBackToList = () => {
    setView("list");
    setEditingDraft(null);
  };

  // Step 1 of Sending: User clicks "ارسال الاشعار" on form -> open confirmation modal
  const handleStageSend = (values: SendNotificationFormValues) => {
    setPendingFormData(values);
    setIsConfirmOpen(true);
  };

  // Save as Draft
  const handleSaveDraft = (values: SendNotificationFormValues) => {
    const timeStr = new Date().toLocaleTimeString(isEn ? "en-US" : "ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newDraft: NotificationItem = {
      id: `notif-draft-${Date.now()}`,
      code: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: values.title,
      description: values.description,
      status: "draft",
      statusLabel: isEn ? "Unsent Draft" : "مسودة غير مرسلة",
      sentAt: (isEn ? "Today • " : "اليوم • ") + timeStr,
      audienceType: values.audienceType,
      targetAudienceLabel:
        values.audienceType === "all"
          ? isEn
            ? "All Subscribed Law Firms (842 Firms)"
            : "جميع مكاتب المحاماة المشتركة (842 مكتب)"
          : isEn
          ? "Specific Law Firm"
          : "مكتب محدد بعينه",
      targetCount: values.audienceType === "all" ? 842 : 1,
      actionUrl: values.actionUrl,
      imageUrl: values.imageUrl,
      imageFileName: values.imageFileName,
      imageFileSize: values.imageFileSize,
      imageDimensions: values.imageDimensions,
      categoryBadge:
        values.categoryBadge || (isEn ? "Draft Notification" : "مسودة إشعار"),
      actionButtonText:
        values.actionButtonText || (isEn ? "Follow Up Action" : "متابعة الإجراء"),
    };

    setNotifications((prev) => [newDraft, ...prev]);
    toast.success(
      isEn
        ? "Notification saved as draft successfully"
        : "تم حفظ الإشعار كمسودة بنجاح"
    );
    setView("list");
  };

  // Step 2 of Sending: User clicks confirm in confirmation modal
  const handleExecuteSend = async () => {
    if (!pendingFormData) return;

    setIsSending(true);

    try {
      let apiOk = false;
      try {
        await createAnnouncement({
          title: pendingFormData.title,
          description: pendingFormData.description,
          body: pendingFormData.description,
          audience_type: pendingFormData.audienceType,
          action_url: pendingFormData.actionUrl,
          status: "sent",
        });
        apiOk = true;
      } catch {
        const result = await sendNotificationAction(pendingFormData);
        apiOk = Boolean(result?.data?.success);
      }

      if (apiOk) {
        const timeStr = new Date().toLocaleTimeString(isEn ? "en-US" : "ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const notificationId = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
        const verificationCode = `${notificationId}-OK`;
        const dispatchedCount = pendingFormData.audienceType === "all" ? 842 : 1;

        const newNotification: NotificationItem = {
          id: `notif-${Date.now()}`,
          code: notificationId,
          title: pendingFormData.title,
          description: pendingFormData.description,
          status: "sent",
          statusLabel: isEn ? "Sent" : "تم الإرسال",
          sentAt: (isEn ? "Now • " : "الآن • ") + timeStr,
          audienceType: pendingFormData.audienceType,
          targetAudienceLabel:
            pendingFormData.audienceType === "all"
              ? isEn
                ? "All Subscribed Law Firms"
                : "جميع مكاتب المحاماة المشتركة"
              : isEn
              ? "Specific Law Firm"
              : "مكتب محدد بعينه",
          targetCount: dispatchedCount,
          actionUrl: pendingFormData.actionUrl,
          imageUrl: pendingFormData.imageUrl,
          imageFileName: pendingFormData.imageFileName,
          imageFileSize: pendingFormData.imageFileSize,
          imageDimensions: pendingFormData.imageDimensions,
          priority: "high",
          categoryBadge:
            pendingFormData.categoryBadge ||
            (isEn ? "Security & Regulatory Compliance" : "الأمان والامتثال العدلي"),
          actionButtonText:
            pendingFormData.actionButtonText ||
            (isEn ? "Update Security Settings Now" : "تحديث إعدادات الأمان الآن"),
        };

        setNotifications((prev) => [newNotification, ...prev]);

        setLastDispatchedInfo({
          title: pendingFormData.title,
          actionUrl: pendingFormData.actionUrl,
          verificationCode,
          targetCount: dispatchedCount,
          formattedTimestamp: new Intl.DateTimeFormat(isEn ? "en-US" : "ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        });

        setIsConfirmOpen(false);
        setIsSuccessOpen(true);
        toast.success(
          isEn
            ? "Notification dispatched and logged to audit trail successfully"
            : "تم إرسال الإشعار وتوثيق العملية بسجل التدقيق الأمني بنجاح"
        );
      } else {
        setIsConfirmOpen(false);
        setIsFailureOpen(true);
        toast.error(
          isEn
            ? "Failed to send notification. Error logged."
            : "تعذر إرسال الإشعار. تم تسجيل الخطأ."
        );
      }
    } catch {
      setIsConfirmOpen(false);
      setIsFailureOpen(true);
      toast.error(
        isEn
          ? "Failed to send notification, please retry."
          : "تعذر إرسال الإشعار، يرجى إعادة المحاولة."
      );
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
      try {
        await deleteAnnouncement(notificationId);
      } catch {
        const res = await deleteNotificationAction({ notificationId });
        if (!res?.data?.success) throw new Error("delete failed");
      }
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setDeleteTarget(null);
      toast.success(
        isEn
          ? "Notification permanently deleted from dashboard."
          : "تم حذف الإشعار نهائياً من شاشة الإشعارات."
      );
    } catch {
      toast.error(
        isEn
          ? "Could not complete deletion."
          : "تعذر إتمام عملية الحذف."
      );
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
      <DashboardSidebar activeNav="notifications" />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {view === "list" ? (
              isLoading && notifications.length === 0 ? (
                <DashboardPageSkeleton />
              ) : (
                <NotificationsListView
                  notifications={notifications}
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
                      // Keep list item.
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
