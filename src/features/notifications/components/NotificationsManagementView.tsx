"use client";

import React, { useState } from "react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
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

export function NotificationsManagementView() {
  // Navigation & View URL State with nuqs
  const [view, setView] = useQueryState("view", { defaultValue: "list" });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotificationsList
  );

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

  // Step 1 of Sending: User clicks "ارسال الاشعار" on form -> open confirmation modal (1:13564)
  const handleStageSend = (values: SendNotificationFormValues) => {
    setPendingFormData(values);
    setIsConfirmOpen(true);
  };

  // Save as Draft
  const handleSaveDraft = (values: SendNotificationFormValues) => {
    const newDraft: NotificationItem = {
      id: `notif-draft-${Date.now()}`,
      code: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: values.title,
      description: values.description,
      status: "draft",
      statusLabel: "مسودة غير مرسلة",
      sentAt: "اليوم • " + new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      audienceType: values.audienceType,
      targetAudienceLabel:
        values.audienceType === "all"
          ? "جميع مكاتب المحاماة المشتركة (842 مكتب)"
          : "مكتب محدد بعينه",
      targetCount: values.audienceType === "all" ? 842 : 1,
      actionUrl: values.actionUrl,
      imageUrl: values.imageUrl,
      imageFileName: values.imageFileName,
      imageFileSize: values.imageFileSize,
      imageDimensions: values.imageDimensions,
      categoryBadge: values.categoryBadge || "مسودة إشعار",
      actionButtonText: values.actionButtonText || "متابعة الإجراء",
    };

    setNotifications((prev) => [newDraft, ...prev]);
    toast.success("تم حفظ الإشعار كمسودة بنجاح");
    setView("list");
  };

  // Step 2 of Sending: User clicks "ارسال الاشعار" in confirmation modal
  const handleExecuteSend = async () => {
    if (!pendingFormData) return;

    setIsSending(true);

    try {
      const result = await sendNotificationAction(pendingFormData);

      if (result?.data?.success) {
        const resData = result.data;
        const newNotification: NotificationItem = {
          id: `notif-${Date.now()}`,
          code: resData.notificationId,
          title: pendingFormData.title,
          description: pendingFormData.description,
          status: "sent",
          statusLabel: "تم الإرسال",
          sentAt: "الآن • " + new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
          audienceType: pendingFormData.audienceType,
          targetAudienceLabel:
            pendingFormData.audienceType === "all"
              ? "جميع مكاتب المحاماة المشتركة"
              : "مكتب محدد بعينه",
          targetCount: resData.dispatchedCount,
          actionUrl: pendingFormData.actionUrl,
          imageUrl: pendingFormData.imageUrl,
          imageFileName: pendingFormData.imageFileName,
          imageFileSize: pendingFormData.imageFileSize,
          imageDimensions: pendingFormData.imageDimensions,
          priority: "high",
          categoryBadge: pendingFormData.categoryBadge || "الأمان والامتثال العدلي",
          actionButtonText: pendingFormData.actionButtonText || "تحديث إعدادات الأمان الآن",
        };

        // Add to active notifications
        setNotifications((prev) => [newNotification, ...prev]);

        setLastDispatchedInfo({
          title: pendingFormData.title,
          actionUrl: pendingFormData.actionUrl,
          verificationCode: resData.verificationCode,
          targetCount: resData.dispatchedCount,
          formattedTimestamp: resData.formattedTimestamp,
        });

        setIsConfirmOpen(false);
        setIsSuccessOpen(true);
        toast.success("تم إرسال الإشعار وتوثيق العملية بسجل التدقيق الأمني بنجاح");
      } else {
        // Show failure modal (1:13732)
        setIsConfirmOpen(false);
        setIsFailureOpen(true);
        toast.error("تعذر إرسال الإشعار. تم تسجيل الخطأ.");
      }
    } catch {
      setIsConfirmOpen(false);
      setIsFailureOpen(true);
      toast.error("تعذر إرسال الإشعار، يرجى إعادة المحاولة.");
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

  // Execute Final Deletion (Figma 1:13810)
  const handleExecuteDelete = async (notificationId: string) => {
    setIsDeleting(true);

    try {
      const res = await deleteNotificationAction({ notificationId });
      if (res?.data?.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setDeleteTarget(null);
        toast.success("تم حذف الإشعار نهائياً من شاشة الإشعارات.");
      } else {
        toast.error("حدث خطأ أثناء محاولة الحذف.");
      }
    } catch {
      toast.error("تعذر إتمام عملية الحذف.");
    } finally {
      setIsDeleting(false);
    }
  };

  const breadcrumbs =
    view === "new"
      ? [
          { label: "الرئيسية", href: "/" },
          { label: "مركز الإشعارات", href: "/notifications" },
          { label: "إرسال إشعار جديد" },
        ]
      : undefined;

  return (
    <div
      className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 font-sans antialiased"
    >
      {/* Dashboard Sidebar with Notifications highlighted */}
      <DashboardSidebar activeNav="notifications" />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full space-y-6 scrollbar-thin">
          <DashboardPageTransition>
          {view === "list" ? (
            <NotificationsListView
              notifications={notifications}
              onOpenCreate={handleOpenCreate}
              onViewDetails={(item) => setViewingDetails(item)}
              onInitiateDelete={(item) => setDeleteTarget(item)}
            />
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

      {/* MODAL 1: Confirm Send (Figma 1:13564) */}
      {pendingFormData && (
        <ConfirmSendModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleExecuteSend}
          formData={pendingFormData}
          isSending={isSending}
        />
      )}

      {/* MODAL 2: Send Success (Figma 1:13647) */}
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

      {/* MODAL 3: Send Failure (Figma 1:13732) */}
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

      {/* MODAL 4: Delete Notification Confirmation (Figma 1:13810) */}
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
