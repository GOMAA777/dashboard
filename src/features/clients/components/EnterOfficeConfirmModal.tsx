"use client";

import React from "react";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { useLanguage } from "@/lib/i18n";
import type { ClientOffice } from "../types/client.types";

interface EnterOfficeConfirmModalProps {
  isOpen: boolean;
  office: ClientOffice | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EnterOfficeConfirmModal({
  isOpen,
  office,
  isLoading = false,
  onClose,
  onConfirm,
}: EnterOfficeConfirmModalProps) {
  const { t } = useLanguage();

  return (
    <LuxuryAlertDialog
      isOpen={isOpen && !!office}
      onClose={isLoading ? () => undefined : onClose}
      onConfirm={isLoading ? () => undefined : onConfirm}
      variant="warning"
      title={t("دخول المكتب كمسؤول؟", "Enter office as admin?")}
      description={t(
        `سيتم فتح لوحة المحامي لمكتب «${office?.name || ""}» في تبويب جديد بصلاحيات الإشراف. هل تريد المتابعة؟`,
        `The lawyer dashboard for «${office?.name || ""}» will open in a new tab with supervisory access. Continue?`
      )}
      confirmLabel={
        isLoading
          ? t("جاري الدخول…", "Entering…")
          : t("تأكيد الدخول", "Confirm entry")
      }
      cancelLabel={t("إلغاء", "Cancel")}
      itemDetails={{
        name: office?.name,
        email: office?.email,
      }}
    />
  );
}
